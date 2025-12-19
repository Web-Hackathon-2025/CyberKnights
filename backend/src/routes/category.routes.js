import express from 'express';
import * as categoryController from '../controllers/category.controller.js';

const router = express.Router();

// Public routes - no authentication required

// Get all services (must come before /:id)
router.get('/services', categoryController.getAllServices);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get services by category
router.get('/:id/services', categoryController.getServicesByCategory);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

export default router;
