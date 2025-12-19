import User from '../models/User.model.js';
import { AppError } from '../utils/AppError.js';

// ===================
// USER MANAGEMENT
// ===================

export const getAllUsers = async (filters) => {
  const { role, isEmailVerified, search, page = 1, limit = 20 } = filters;
  const query = {};

  if (role) query.role = role;
  if (isEmailVerified !== undefined) query.isEmailVerified = isEmailVerified === 'true';
  
  // Add search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password -sessions')
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .sort({ createdAt: -1 });

  return {
    users,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
  };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password -sessions');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const createUser = async (userData) => {
  const { email, password, name, role = 'user', ...additionalData } = userData;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Create user
  const user = await User.create({
    email,
    password,
    name,
    role,
    isEmailVerified: true, // Admin-created users are auto-verified
    ...additionalData,
  });

  return getUserById(user._id);
};

export const updateUser = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  // Don't allow updating password through this endpoint
  if (updates.password) {
    delete updates.password;
  }

  // Don't allow changing role
  if (updates.role && updates.role !== user.role) {
    throw new AppError('Cannot change user role', 400);
  }

  // Update basic user fields
  const allowedUserFields = ['name', 'email', 'isEmailVerified', 'avatar'];
  allowedUserFields.forEach(field => {
    if (updates[field] !== undefined) {
      user[field] = updates[field];
    }
  });

  await user.save();
  return getUserById(userId);
};

export const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  
  if (user.role === 'admin') {
    throw new AppError('Cannot delete admin user', 403);
  }

  await User.findByIdAndDelete(userId);
};

// ===================
// STATISTICS
// ===================

export const getDashboardStats = async () => {
  const ServiceProvider = (await import('../models/ServiceProvider.model.js')).default;
  const Service = (await import('../models/Service.model.js')).default;
  const Booking = (await import('../models/Booking.model.js')).default;
  const Category = (await import('../models/Category.model.js')).default;

  const [
    totalUsers,
    totalCustomers,
    totalProviders,
    totalAdmins,
    verifiedEmails,
    pendingProviders,
    approvedProviders,
    totalServices,
    activeServices,
    totalBookings,
    pendingBookings,
    completedBookings,
    totalCategories,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'provider' }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ isEmailVerified: true }),
    ServiceProvider.countDocuments({ isApproved: false }),
    ServiceProvider.countDocuments({ isApproved: true }),
    Service.countDocuments(),
    Service.countDocuments({ isActive: true }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Booking.countDocuments({ status: 'completed' }),
    Category.countDocuments(),
  ]);

  // Get recent users (last 10)
  const recentUsers = await User.find()
    .select('-password -sessions')
    .sort({ createdAt: -1 })
    .limit(10);

  // Get recent bookings (last 5)
  const recentBookings = await Booking.find()
    .populate('customerId', 'name email')
    .populate('providerId', 'userId')
    .populate('serviceId', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  // Calculate revenue (if you have payment tracking)
  // For now, we'll estimate based on bookings
  const completedBookingsWithServices = await Booking.find({ status: 'completed' })
    .populate('serviceId', 'price');
  
  const totalRevenue = completedBookingsWithServices.reduce((sum, booking) => {
    return sum + (booking.serviceId?.price || 0);
  }, 0);

  return {
    // User stats
    totalUsers,
    totalCustomers,
    totalProviders,
    totalAdmins,
    verifiedEmails,
    
    // Provider stats
    pendingProviders,
    approvedProviders,
    
    // Service stats
    totalServices,
    activeServices,
    inactiveServices: totalServices - activeServices,
    
    // Booking stats
    totalBookings,
    pendingBookings,
    completedBookings,
    
    // Category stats
    totalCategories,
    
    // Revenue
    totalRevenue,
    
    // Recent activity
    recentUsers,
    recentBookings,
  };
};
