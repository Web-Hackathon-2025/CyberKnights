import * as bookingService from '../services/booking.service.js';

// Create booking (customer)
export const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.user._id, req.body);
    
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
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};
