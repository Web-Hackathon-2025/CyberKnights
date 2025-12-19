import Booking from '../models/Booking.model.js';
import ServiceProvider from '../models/ServiceProvider.model.js';
import Service from '../models/Service.model.js';
import User from '../models/User.model.js';
import { AppError } from '../utils/AppError.js';

// Create booking (customer)
export const createBooking = async (userId, bookingData) => {
  const { serviceId, scheduledDate, scheduledTime, customerName, customerPhone, customerAddress, notes } = bookingData;

  // Get service and provider
  const service = await Service.findById(serviceId).populate('providerId');
  
  if (!service || !service.isActive) {
    throw new AppError('Service not found or inactive', 404);
  }

  const provider = service.providerId;
  
  if (!provider.isApproved || !provider.isActive) {
    throw new AppError('Provider is not available', 403);
  }

  // Create booking
  const booking = await Booking.create({
    customerId: userId,
    providerId: provider._id,
    serviceId: service._id,
    scheduledDate,
    scheduledTime,
    customerName,
    customerPhone,
    customerAddress,
    notes,
    serviceName: service.name,
    servicePrice: service.price,
    status: 'pending',
  });

  // Populate booking details
  const populatedBooking = await Booking.findById(booking._id)
    .populate('customerId', 'name email')
    .populate({
      path: 'providerId',
      populate: { path: 'userId', select: 'name email phone' }
    })
    .populate('serviceId', 'name price priceType');

  // TODO: Send notification to provider

  return populatedBooking;
};

// Get customer's bookings
export const getCustomerBookings = async (userId, status = null) => {
  const query = { customerId: userId };
  
  if (status) {
    query.status = status;
  }

  const bookings = await Booking.find(query)
    .populate({
      path: 'providerId',
      populate: { path: 'userId', select: 'name email phone' }
    })
    .populate('serviceId', 'name price')
    .sort({ scheduledDate: -1, createdAt: -1 });

  return bookings;
};

// Get provider's bookings
export const getProviderBookings = async (userId, status = null) => {
  // Get provider profile
  const provider = await ServiceProvider.findOne({ userId });
  
  if (!provider) {
    throw new AppError('Provider profile not found', 404);
  }

  const query = { providerId: provider._id };
  
  if (status) {
    query.status = status;
  }

  const bookings = await Booking.find(query)
    .populate('customerId', 'name email')
    .populate('serviceId', 'name price')
    .sort({ scheduledDate: -1, createdAt: -1 });

  return bookings;
};

// Get booking by ID
export const getBookingById = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId)
    .populate('customerId', 'name email phone')
    .populate({
      path: 'providerId',
      populate: [
        { path: 'userId', select: 'name email phone' },
        { path: 'category', select: 'name icon' }
      ]
    })
    .populate('serviceId', 'name price priceType description');

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check authorization
  const provider = await ServiceProvider.findOne({ userId });
  const isCustomer = booking.customerId._id.toString() === userId.toString();
  const isProvider = provider && booking.providerId._id.toString() === provider._id.toString();

  if (!isCustomer && !isProvider) {
    throw new AppError('Unauthorized to view this booking', 403);
  }

  return booking;
};

// Provider: Confirm booking
export const confirmBooking = async (bookingId, userId, providerNotes = '') => {
  const provider = await ServiceProvider.findOne({ userId });
  
  if (!provider) {
    throw new AppError('Provider profile not found', 404);
  }

  const booking = await Booking.findOne({ 
    _id: bookingId, 
    providerId: provider._id 
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  if (booking.status !== 'pending') {
    throw new AppError('Can only confirm pending bookings', 400);
  }

  booking.status = 'confirmed';
  booking.confirmedAt = new Date();
  booking.providerNotes = providerNotes;
  await booking.save();

  // Update provider stats
  provider.totalBookings += 1;
  await provider.save();

  // TODO: Send confirmation notification to customer

  return booking.populate('customerId', 'name email');
};

// Provider: Mark booking as in-progress
export const startBooking = async (bookingId, userId) => {
  const provider = await ServiceProvider.findOne({ userId });
  
  if (!provider) {
    throw new AppError('Provider profile not found', 404);
  }

  const booking = await Booking.findOne({ 
    _id: bookingId, 
    providerId: provider._id 
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  if (booking.status !== 'confirmed') {
    throw new AppError('Can only start confirmed bookings', 400);
  }

  booking.status = 'in-progress';
  await booking.save();

  return booking;
};

// Provider: Complete booking
export const completeBooking = async (bookingId, userId) => {
  const provider = await ServiceProvider.findOne({ userId });
  
  if (!provider) {
    throw new AppError('Provider profile not found', 404);
  }

  const booking = await Booking.findOne({ 
    _id: bookingId, 
    providerId: provider._id 
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  if (booking.status !== 'in-progress' && booking.status !== 'confirmed') {
    throw new AppError('Can only complete in-progress or confirmed bookings', 400);
  }

  booking.status = 'completed';
  booking.completedAt = new Date();
  await booking.save();

  // Update provider stats
  provider.completedBookings += 1;
  await provider.save();

  // TODO: Send completion notification to customer

  return booking;
};

// Cancel booking
export const cancelBooking = async (bookingId, userId, reason, cancelledByRole) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check authorization
  const provider = await ServiceProvider.findOne({ userId });
  const isCustomer = booking.customerId.toString() === userId.toString();
  const isProvider = provider && booking.providerId.toString() === provider._id.toString();

  if (!isCustomer && !isProvider) {
    throw new AppError('Unauthorized to cancel this booking', 403);
  }

  if (booking.status === 'completed' || booking.status === 'cancelled') {
    throw new AppError('Cannot cancel completed or already cancelled booking', 400);
  }

  booking.status = 'cancelled';
  booking.cancelledAt = new Date();
  booking.cancellationReason = reason;
  booking.cancelledBy = cancelledByRole;
  await booking.save();

  // TODO: Send cancellation notification

  return booking;
};

// Admin: Get all bookings
export const getAllBookingsForAdmin = async (filters = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.customerId) {
    query.customerId = filters.customerId;
  }

  if (filters.providerId) {
    query.providerId = filters.providerId;
  }

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 20;
  const skip = (page - 1) * limit;

  const bookings = await Booking.find(query)
    .populate('customerId', 'name email')
    .populate({
      path: 'providerId',
      populate: { path: 'userId', select: 'name email' }
    })
    .populate('serviceId', 'name price')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Booking.countDocuments(query);

  return {
    bookings,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};
