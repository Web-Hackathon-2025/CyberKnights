import express from 'express';
import * as providerController from '../controllers/provider.controller.js';
import { authenticate, restrictTo } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ================
// PROVIDER PROFILE
// ================

// Register as provider (user or existing provider)
router.post('/register', providerController.registerAsProvider);

// Complete profile (after admin approval)
router.post(
  '/complete-profile',
  restrictTo('provider'),
  [
    body('businessName').optional().trim(),
    body('category').notEmpty().withMessage('Category is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('location.address').notEmpty().withMessage('Address is required'),
    body('location.city').notEmpty().withMessage('City is required'),
  ],
  providerController.completeProfile
);

// Get my provider profile
router.get('/profile', restrictTo('provider'), providerController.getMyProfile);

// Update my profile
router.put('/profile', restrictTo('provider'), providerController.updateMyProfile);

// ================
// SERVICES
// ================

// Get my services
router.get('/services', restrictTo('provider'), providerController.getMyServices);

// Create service
router.post(
  '/services',
  restrictTo('provider'),
  [
    body('name').notEmpty().withMessage('Service name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('priceType').optional().isIn(['fixed', 'hourly', 'negotiable']),
  ],
  providerController.createService
);

// Update service
router.put('/services/:id', restrictTo('provider'), providerController.updateService);

// Delete service
router.delete('/services/:id', restrictTo('provider'), providerController.deleteService);

// ================
// PUBLIC ROUTES (No auth required)
// ================

// Browse providers
router.get('/browse', providerController.getAllProviders);

// Get provider details
router.get('/:id', providerController.getProviderById);

export default router;
