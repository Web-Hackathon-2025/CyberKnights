import ServiceProvider from '../models/ServiceProvider.model.js';
import User from '../models/User.model.js';
import Service from '../models/Service.model.js';
import { AppError } from '../utils/AppError.js';

// Register as service provider (creates pending profile)
export const registerAsProvider = async (userId) => {
  // Check if already registered
  const existingProvider = await ServiceProvider.findOne({ userId });
  if (existingProvider) {
    throw new AppError('Already registered as service provider', 400);
  }

  // Create provider profile
  const provider = await ServiceProvider.create({
    userId,
    isApproved: false,
    isProfileComplete: false,
  });

  return provider;
};

// Complete provider profile
export const completeProviderProfile = async (userId, profileData) => {
  const provider = await ServiceProvider.findOne({ userId });
  
  if (!provider) {
    throw new AppError('Provider profile not found', 404);
  }

  if (provider.isProfileComplete) {
    throw new AppError('Profile is already completed', 400);
  }

  // Update profile
  Object.assign(provider, profileData);
  provider.isProfileComplete = true;
  await provider.save();

  return provider.populate('userId', 'name email');
};

// Get provider profile
export const getProviderProfile = async (userId) => {
  const provider = await ServiceProvider.findOne({ userId })
    .populate('userId', 'name email avatar')
    .populate('category', 'name slug icon');

  if (!provider) {
    throw new AppError('Provider profile not found', 404);
  }

  return provider;
};

// Update provider profile
export const updateProviderProfile = async (userId, updates) => {
  const provider = await ServiceProvider.findOne({ userId });
  
  if (!provider) {
    throw new AppError('Provider profile not found', 404);
  }

  // Prevent updating approval status
  delete updates.isApproved;
  delete updates.approvedAt;
  delete updates.approvedBy;

  Object.assign(provider, updates);
  await provider.save();

  return provider.populate('userId', 'name email').populate('category');
};

// Get all providers (for customers)
export const getAllProviders = async (filters = {}) => {
  const query = { isApproved: true, isActive: true, isProfileComplete: true };

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.city) {
    query['location.city'] = new RegExp(filters.city, 'i');
  }

  if (filters.area) {
    query['location.area'] = new RegExp(filters.area, 'i');
  }

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 12;
  const skip = (page - 1) * limit;

  let sort = {};
  if (filters.sort === 'rating') {
    sort = { rating: -1 };
  } else if (filters.sort === 'reviews') {
    sort = { totalReviews: -1 };
  } else if (filters.sort === 'experience') {
    sort = { experience: -1 };
  } else {
    sort = { rating: -1, totalReviews: -1 };
  }

  // Apply rating filter
  if (filters.minRating) {
    query.rating = { $gte: parseFloat(filters.minRating) };
  }

  // Apply search filter
  if (filters.search) {
    query.$or = [
      { businessName: new RegExp(filters.search, 'i') },
      { bio: new RegExp(filters.search, 'i') },
    ];
  }

  const providers = await ServiceProvider.find(query)
    .populate('userId', 'name email avatar')
    .populate('category', 'name slug icon')
    .sort(sort)
    .limit(limit)
    .skip(skip);

  // Add services count to each provider
  const providersWithCount = await Promise.all(
    providers.map(async (provider) => {
      const servicesCount = await Service.countDocuments({
        providerId: provider._id,
        isActive: true,
      });
      const providerObj = provider.toObject();
      providerObj.servicesCount = servicesCount;
      return providerObj;
    })
  );

  const total = await ServiceProvider.countDocuments(query);

  return {
    providers: providersWithCount,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

// Get provider by ID (public)
export const getProviderById = async (providerId) => {
  const provider = await ServiceProvider.findById(providerId)
    .populate('userId', 'name email avatar createdAt')
    .populate('category', 'name slug icon description');

  if (!provider) {
    throw new AppError('Provider not found', 404);
  }

  if (!provider.isApproved || !provider.isActive) {
    throw new AppError('Provider is not available', 403);
  }

  // Get provider's services
  const services = await Service.find({ 
    providerId: provider._id, 
    isActive: true 
  }).populate('category', 'name');

  return { provider, services };
};

// Get provider public profile (for customer view)
export const getProviderPublicProfile = async (providerId) => {
  const provider = await ServiceProvider.findById(providerId)
    .populate('userId', 'name email avatar')
    .populate('category', 'name slug icon description');

  if (!provider) {
    throw new AppError('Provider not found', 404);
  }

  if (!provider.isApproved || !provider.isActive || !provider.isProfileComplete) {
    throw new AppError('Provider is not available', 403);
  }

  // Count services
  const servicesCount = await Service.countDocuments({ 
    providerId: provider._id, 
    isActive: true 
  });

  // Add services count to provider object
  const providerObj = provider.toObject();
  providerObj.servicesCount = servicesCount;

  return providerObj;
};

// Admin: Get pending providers
export const getPendingProviders = async () => {
  const providers = await ServiceProvider.find({ 
    isApproved: false,
    rejectedAt: { $exists: false }
  })
    .populate('userId', 'name email createdAt')
    .sort({ createdAt: -1 });

  return providers;
};

// Admin: Approve provider
export const approveProvider = async (providerId, adminId) => {
  const provider = await ServiceProvider.findById(providerId).populate('userId', 'name email');
  
  if (!provider) {
    throw new AppError('Provider not found', 404);
  }

  if (provider.isApproved) {
    throw new AppError('Provider already approved', 400);
  }

  provider.isApproved = true;
  provider.approvedAt = new Date();
  provider.approvedBy = adminId;
  await provider.save();

  // Send approval email to provider
  const { sendProviderApprovalEmail } = await import('./email.service.js');
  try {
    await sendProviderApprovalEmail(provider.userId.email, provider.userId.name);
  } catch (emailError) {
    console.error('Failed to send approval email:', emailError);
    // Don't fail the approval if email fails
  }

  return provider;
};

// Admin: Reject provider
export const rejectProvider = async (providerId, adminId, reason) => {
  const provider = await ServiceProvider.findById(providerId).populate('userId', 'name email');
  
  if (!provider) {
    throw new AppError('Provider not found', 404);
  }

  provider.rejectedAt = new Date();
  provider.rejectionReason = reason;
  await provider.save();

  // Send rejection email to provider
  const { sendProviderRejectionEmail } = await import('./email.service.js');
  try {
    await sendProviderRejectionEmail(provider.userId.email, provider.userId.name, reason);
  } catch (emailError) {
    console.error('Failed to send rejection email:', emailError);
    // Don't fail the rejection if email fails
  }

  return provider;
};

// Admin: Get all providers (including unapproved)
export const getAllProvidersForAdmin = async (filters = {}) => {
  const query = {};

  if (filters.status === 'pending') {
    query.isApproved = false;
    query.rejectedAt = { $exists: false };
  } else if (filters.status === 'approved') {
    query.isApproved = true;
  } else if (filters.status === 'rejected') {
    query.rejectedAt = { $exists: true };
  }

  if (filters.category) {
    query.category = filters.category;
  }

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 20;
  const skip = (page - 1) * limit;

  const providers = await ServiceProvider.find(query)
    .populate('userId', 'name email createdAt')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await ServiceProvider.countDocuments(query);

  // Add computed status field for frontend
  const providersWithStatus = providers.map(provider => {
    const providerObj = provider.toObject();
    if (providerObj.rejectedAt) {
      providerObj.status = 'rejected';
    } else if (providerObj.isApproved) {
      providerObj.status = 'approved';
    } else {
      providerObj.status = 'pending';
    }
    return providerObj;
  });

  return {
    providers: providersWithStatus,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};
