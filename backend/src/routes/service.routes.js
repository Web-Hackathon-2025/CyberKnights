import express from 'express';
import * as serviceController from '../controllers/service.controller.js';
import { authenticate, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', serviceController.searchServices);
router.get('/:id', serviceController.getServiceById);

// Provider routes (authenticated)
router.use(authenticate);
router.use(restrictTo('provider'));

router.get('/my-services', serviceController.getMyServices);
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);
router.patch('/:id/toggle', serviceController.toggleServiceStatus);

export default router;

