import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    unique: true,
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  
  // Booking details
  scheduledDate: {
    type: Date,
    required: true,
  },
  scheduledTime: {
    type: String,
    required: true,
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  
  // Customer details
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
  
  // Service details
  serviceName: String,
  servicePrice: Number,
  
  // Additional information
  notes: {
    type: String,
    maxlength: 500,
  },
  
  // Provider response
  providerNotes: {
    type: String,
    maxlength: 500,
  },
  confirmedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['customer', 'provider', 'admin'],
  },
}, { timestamps: true });

// Generate booking number before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingNumber = `BK${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Indexes (bookingNumber index is already created by unique: true)
bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ providerId: 1, status: 1 });
bookingSchema.index({ scheduledDate: 1 });

export default mongoose.model('Booking', bookingSchema);
