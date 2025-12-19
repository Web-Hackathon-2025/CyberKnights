import express from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { authenticate, restrictTo } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ================
// CUSTOMER ROUTES
// ================

// Create booking (customer only)
router.post(
  '/',
  restrictTo('user'),
  [
    body('serviceId').notEmpty().withMessage('Service is required'),
    body('scheduledDate').isISO8601().withMessage('Valid date is required'),
    body('scheduledTime').notEmpty().withMessage('Time is required'),
    body('customerName').notEmpty().withMessage('Name is required'),
    body('customerPhone').notEmpty().withMessage('Phone is required'),
    body('customerAddress').notEmpty().withMessage('Address is required'),
  ],
  bookingController.createBooking
);

// Get my bookings (customer)
router.get('/my-bookings', restrictTo('user'), bookingController.getMyBookings);

// ================
// PROVIDER ROUTES
// ================

// Get provider bookings
router.get(
  '/provider-bookings',
  restrictTo('provider'),
  bookingController.getProviderBookings
);

// Confirm booking
router.put(
  '/:id/confirm',
  restrictTo('provider'),
  bookingController.confirmBooking
);

// Start booking
router.put(
  '/:id/start',
  restrictTo('provider'),
  bookingController.startBooking
);

// Complete booking
router.put(
  '/:id/complete',
  restrictTo('provider'),
  bookingController.completeBooking
);

// ================
// SHARED ROUTES
// ================

// Get booking details
router.get('/:id', bookingController.getBookingById);

// Cancel booking
router.put('/:id/cancel', bookingController.cancelBooking);

export default router;
