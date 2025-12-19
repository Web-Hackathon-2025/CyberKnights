import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate, restrictTo, restrictPlatform } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

router.use(authenticate);
router.use(restrictTo('admin'));
router.use(restrictPlatform('web'));

// ===================
// USER MANAGEMENT
// ===================

// Get all users (with filters, search, pagination)
router.get('/users', adminController.getAllUsers);

// Get single user
router.get('/users/:id', adminController.getUserById);

// Create new user
router.post(
  '/users',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
  ],
  adminController.createUser
);

// Update user
router.put('/users/:id', adminController.updateUser);

// Delete user
router.delete('/users/:id', adminController.deleteUser);

// ===================
// PROVIDER MANAGEMENT
// ===================

// Get pending providers
router.get('/providers/pending', adminController.getPendingProviders);

// Get all providers
router.get('/providers', adminController.getAllProviders);

// Approve provider
router.put('/providers/:id/approve', adminController.approveProvider);

// Reject provider
router.put(
  '/providers/:id/reject',
  [body('reason').notEmpty().withMessage('Rejection reason is required')],
  adminController.rejectProvider
);

// ===================
// CATEGORY MANAGEMENT
// ===================

// Get all categories
router.get('/categories', adminController.getAllCategories);

// Create category
router.post(
  '/categories',
  [
    body('name').notEmpty().withMessage('Category name is required'),
    body('icon').optional(),
    body('description').optional(),
  ],
  adminController.createCategory
);

// Update category
router.put('/categories/:id', adminController.updateCategory);

// Delete category
router.delete('/categories/:id', adminController.deleteCategory);

// Seed categories
router.post('/categories/seed', adminController.seedCategories);

// ===================
// BOOKING MANAGEMENT
// ===================

// Get all bookings
router.get('/bookings', adminController.getAllBookings);

// ===================
// SERVICE MANAGEMENT
// ===================

// Get all services
router.get('/services', adminController.getAllServices);

// Delete service
router.delete('/services/:id', adminController.deleteService);

// Toggle service status (activate/deactivate)
router.put('/services/:id/toggle-status', adminController.toggleServiceStatus);

// ===================
// STATISTICS
// ===================

router.get('/stats/dashboard', adminController.getDashboardStats);

export default router;
