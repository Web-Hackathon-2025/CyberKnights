import Service from '../models/Service.model.js';
import ServiceProvider from '../models/ServiceProvider.model.js';
import { AppError } from '../utils/AppError.js';

// Create service
export const createService = async (userId, serviceData) => {
  // Get provider profile
  const provider = await ServiceProvider.findOne({ userId });
  
  if (!provider) {
    throw new AppError('Provider profile not found', 404);
  }

  if (!provider.isApproved) {
    throw new AppError('Provider must be approved to create services', 403);
  }

  const service = await Service.create({
    ...serviceData,
    providerId: provider._id,
  });

  return service.populate('category', 'name icon');
};

// Get provider's services
export const getProviderServices = async (userId) => {
  const provider = await ServiceProvider.findOne({ userId });
  
  if (!provider) {
    throw new AppError('Provider profile not found', 404);
  }

  const services = await Service.find({ providerId: provider._id })
    .populate('category', 'name icon')
    .sort({ createdAt: -1 });

  return services;
};

// Update service
export const updateService = async (serviceId, userId, updates) => {
  const provider = await ServiceProvider.findOne({ userId });
  
  if (!provider) {
    throw new AppError('Provider profile not found', 404);
  }

  const service = await Service.findOne({ 
    _id: serviceId, 
    providerId: provider._id 
  });

  if (!service) {
    throw new AppError('Service not found', 404);
  }

  Object.assign(service, updates);
  await service.save();

  return service.populate('category', 'name icon');
};

// Delete service
export const deleteService = async (serviceId, userId) => {
  const provider = await ServiceProvider.findOne({ userId });
  
  if (!provider) {
    throw new AppError('Provider profile not found', 404);
  }

  const service = await Service.findOneAndDelete({ 
    _id: serviceId, 
    providerId: provider._id 
  });

  if (!service) {
    throw new AppError('Service not found', 404);
  }

  return service;
};

// Get services by provider ID (public)
export const getServicesByProviderId = async (providerId) => {
  const services = await Service.find({ 
    providerId, 
    isActive: true 
  }).populate('category', 'name icon');

  return services;
};

// Get all services (for customers)
export const getAllServices = async (filters = {}) => {
  const query = { isActive: true };

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.providerId) {
    query.providerId = filters.providerId;
  }

  if (filters.maxPrice) {
    query.price = { $lte: parseFloat(filters.maxPrice) };
  }

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 12;
  const skip = (page - 1) * limit;

  const services = await Service.find(query)
    .populate('category', 'name icon')
    .populate({
      path: 'providerId',
      populate: { path: 'userId', select: 'name avatar' }
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Service.countDocuments(query);

  return {
    services,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};
