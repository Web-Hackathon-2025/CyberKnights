import * as bookingService from '../services/booking.service.js';
import { streamService } from '../services/stream.service.js';

// Create booking (customer)
export const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.user._id, req.body);
    
    // Create chat channel and send welcome message
    try {
      const customerId = booking.customerId._id.toString();
      const providerUserId = booking.providerId.userId._id.toString();
      
      // Ensure both users exist in Stream
      await streamService.upsertUser(customerId, {
        name: booking.customerId.name,
        email: booking.customerId.email,
        role: 'user' // This is the user type (customer)
      });

      const providerUserData = booking.providerId.userId;
      await streamService.upsertUser(providerUserId, {
        name: booking.providerId.businessName || providerUserData.name,
        email: providerUserData.email,
        role: 'provider', // This is the user type (provider)
        businessName: booking.providerId.businessName
      });

      // Create the channel first
      await streamService.createBookingChannel(
        booking._id.toString(),
        customerId,
        providerUserId,
        {
          bookingNumber: booking.bookingNumber,
          serviceName: booking.serviceName,
          status: 'pending'
        }
      );

      // Now send the welcome message
      const channelId = `booking-${booking._id}`;
      await streamService.sendSystemMessage(
        channelId,
        `📝 New booking request created! Booking #${booking.bookingNumber} for ${booking.serviceName}. Scheduled for ${new Date(booking.scheduledDate).toLocaleDateString()} at ${booking.scheduledTime}. Awaiting provider confirmation.`,
        {
          booking: {
            id: booking._id,
            bookingNumber: booking.bookingNumber,
            status: 'pending',
            serviceName: booking.serviceName
          }
        }
      );
    } catch (chatError) {
      console.error('Failed to send chat notification:', chatError);
      // Don't fail the request if chat fails
    }
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

// Get my bookings (customer)
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getCustomerBookings(
      req.user._id,
      req.query.status
    );
    
    res.json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
};

// Get provider bookings
export const getProviderBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getProviderBookings(
      req.user._id,
      req.query.status
    );
    
    res.json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(
      req.params.id,
      req.user._id
    );
    
    res.json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

// Confirm booking (provider)
export const confirmBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.confirmBooking(
      req.params.id,
      req.user._id,
      req.body.providerNotes
    );
    
    // Send system message to chat
    try {
      const channelId = `booking-${booking._id}`;
      await streamService.sendSystemMessage(
        channelId,
        `✅ Booking confirmed! Your service is scheduled for ${new Date(booking.scheduledDate).toLocaleDateString()}.`,
        {
          booking: {
            id: booking._id,
            bookingNumber: booking.bookingNumber,
            status: 'confirmed'
          }
        }
      );
    } catch (chatError) {
      console.error('Failed to send chat notification:', chatError);
      // Don't fail the request if chat fails
    }
    
    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

// Start booking (provider)
export const startBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.startBooking(
      req.params.id,
      req.user._id
    );
    
    // Send system message to chat
    try {
      const channelId = `booking-${booking._id}`;
      await streamService.sendSystemMessage(
        channelId,
        `🚀 Service has started! The provider is now working on your booking.`,
        {
          booking: {
            id: booking._id,
            bookingNumber: booking.bookingNumber,
            status: 'in-progress'
          }
        }
      );
    } catch (chatError) {
      console.error('Failed to send chat notification:', chatError);
    }
    
    res.json({
      success: true,
      message: 'Booking started',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

// Complete booking (provider)
export const completeBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.completeBooking(
      req.params.id,
      req.user._id
    );
    
    // Send system message to chat
    try {
      const channelId = `booking-${booking._id}`;
      await streamService.sendSystemMessage(
        channelId,
        `🎉 Service completed! Thank you for choosing our platform. Please leave a review to help others.`,
        {
          booking: {
            id: booking._id,
            bookingNumber: booking.bookingNumber,
            status: 'completed'
          }
        }
      );
    } catch (chatError) {
      console.error('Failed to send chat notification:', chatError);
    }
    
    res.json({
      success: true,
      message: 'Booking completed successfully',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking
export const cancelBooking = async (req, res, next) => {
  try {
    const cancelledByRole = req.user.role === 'provider' ? 'provider' : 'customer';
    
    const booking = await bookingService.cancelBooking(
      req.params.id,
      req.user._id,
      req.body.reason,
      cancelledByRole
    );
    
    // Send system message to chat
    try {
      const channelId = `booking-${booking._id}`;
      const cancelledBy = cancelledByRole === 'provider' ? 'provider' : 'customer';
      await streamService.sendSystemMessage(
        channelId,
        `❌ Booking cancelled by ${cancelledBy}. ${req.body.reason ? `Reason: ${req.body.reason}` : ''}`,
        {
          booking: {
            id: booking._id,
            bookingNumber: booking.bookingNumber,
            status: 'cancelled',
            cancelledBy
          }
        }
      );
    } catch (chatError) {
      console.error('Failed to send chat notification:', chatError);
    }
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};
