import { streamService } from '../services/stream.service.js';
import Booking from '../models/Booking.model.js';
import User from '../models/User.model.js';
import ServiceProvider from '../models/ServiceProvider.model.js';

/**
 * Get Stream authentication token and API key
 * GET /api/v1/chat/token
 */
export const getStreamToken = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const user = req.user;

    // Upsert user in Stream to ensure they exist
    await streamService.upsertUser(userId, {
      name: user.name,
      avatar: user.avatar,
      role: user.role
    });

    // Generate token
    const token = streamService.createUserToken(userId);

    res.json({
      success: true,
      data: {
        token,
        apiKey: process.env.STREAM_API_KEY,
        userId
      }
    });
  } catch (error) {
    console.error('Error getting Stream token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate chat token',
      error: error.message
    });
  }
};

/**
 * Create or get a channel for a booking
 * POST /api/v1/chat/channel
 * Body: { bookingId }
 */
export const createBookingChannel = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user._id.toString();

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
    }

    // Find the booking and populate details
    const booking = await Booking.findById(bookingId)
      .populate('customerId', 'name email avatar')
      .populate({
        path: 'providerId',
        select: 'userId businessName',
        populate: {
          path: 'userId',
          select: 'name email avatar'
        }
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user is part of this booking
    const isCustomer = booking.customerId._id.toString() === userId;
    const isProvider = booking.providerId.userId._id.toString() === userId;

    if (!isCustomer && !isProvider) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this conversation'
      });
    }

    // Get customer and provider IDs
    const customerId = booking.customerId._id.toString();
    const providerUserId = booking.providerId.userId._id.toString();

    // Ensure both users exist in Stream
    await streamService.upsertUser(customerId, {
      name: booking.customerId.name,
      avatar: booking.customerId.avatar,
      email: booking.customerId.email,
      role: 'user' // This is the user type (customer)
    });

    await streamService.upsertUser(providerUserId, {
      name: booking.providerId.businessName || booking.providerId.userId.name,
      avatar: booking.providerId.userId.avatar,
      email: booking.providerId.userId.email,
      role: 'provider', // This is the user type (provider)
      businessName: booking.providerId.businessName
    });

    // Create or get the channel
    const channelData = await streamService.createBookingChannel(
      bookingId,
      customerId,
      providerUserId,
      {
        bookingNumber: booking.bookingNumber,
        serviceName: booking.serviceName,
        status: booking.status
      }
    );

    res.json({
      success: true,
      data: {
        channelId: channelData.channelId,
        channelType: channelData.channelType,
        booking: {
          id: booking._id,
          bookingNumber: booking.bookingNumber,
          serviceName: booking.serviceName,
          status: booking.status
        }
      }
    });
  } catch (error) {
    console.error('Error creating booking channel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat channel',
      error: error.message
    });
  }
};

/**
 * Get all channels for the authenticated user
 * GET /api/v1/chat/channels
 */
export const getUserChannels = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const channels = await streamService.getUserChannels(userId);

    // Format channel data
    const formattedChannels = channels.map(channel => ({
      id: channel.id,
      type: channel.type,
      memberCount: Object.keys(channel.state.members).length,
      lastMessageAt: channel.state.last_message_at,
      unreadCount: channel.countUnread(),
      booking: channel.data.booking || null
    }));

    res.json({
      success: true,
      data: {
        channels: formattedChannels,
        total: formattedChannels.length
      }
    });
  } catch (error) {
    console.error('Error getting user channels:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch channels',
      error: error.message
    });
  }
};

/**
 * Send a system message to a channel (admin use)
 * POST /api/v1/chat/channel/:channelId/system-message
 * Body: { message, metadata }
 */
export const sendSystemMessage = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { message, metadata } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required'
      });
    }

    await streamService.sendSystemMessage(channelId, message, metadata);

    res.json({
      success: true,
      message: 'System message sent successfully'
    });
  } catch (error) {
    console.error('Error sending system message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send system message',
      error: error.message
    });
  }
};

/**
 * Delete a channel
 * DELETE /api/v1/chat/channel/:channelId
 */
export const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    await streamService.deleteChannel(channelId);

    res.json({
      success: true,
      message: 'Channel deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting channel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete channel',
      error: error.message
    });
  }
};

/**
 * Handle Stream webhooks
 * POST /api/v1/chat/webhook
 */
export const handleWebhook = async (req, res) => {
  try {
    const event = req.body;

    // Log the event
    console.log('Stream webhook event:', event.type);

    switch (event.type) {
      case 'message.new':
        // Handle new message (e.g., send push notification to offline users)
        console.log('New message from:', event.user.id);
        break;

      case 'channel.created':
        // Log channel creation
        console.log('Channel created:', event.channel.id);
        break;

      case 'channel.deleted':
        // Handle channel deletion
        console.log('Channel deleted:', event.channel.id);
        break;

      default:
        console.log('Unhandled webhook event:', event.type);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

