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
  const [
    totalUsers,
    totalAdmins,
    verifiedEmails,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ isEmailVerified: true }),
  ]);

  // Get recent users
  const recentUsers = await User.find()
    .select('-password -sessions')
    .sort({ createdAt: -1 })
    .limit(10);

  return {
    totalUsers,
    totalAdmins,
    verifiedEmails,
    recentUsers,
  };
};
