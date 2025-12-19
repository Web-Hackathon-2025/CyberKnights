import express from 'express';
import * as chatController from '../controllers/chat.controller.js';
import { authenticate, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get Stream authentication token
router.get('/token', chatController.getStreamToken);

// Create or get channel for a booking
router.post('/channel', chatController.createBookingChannel);

// Get all user's channels
router.get('/channels', chatController.getUserChannels);

// Send system message (admin/internal use)
router.post(
  '/channel/:channelId/system-message',
  restrictTo('admin'),
  chatController.sendSystemMessage
);

// Delete channel (admin only)
router.delete(
  '/channel/:channelId',
  restrictTo('admin'),
  chatController.deleteChannel
);

// Webhook endpoint (public, but should be verified in production)
router.post('/webhook', chatController.handleWebhook);

export default router;

