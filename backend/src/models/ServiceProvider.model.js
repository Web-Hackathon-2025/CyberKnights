import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  // Verification status
  isApproved: {
    type: Boolean,
    default: false,
  },
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectedAt: Date,
  rejectionReason: String,
  
  // Profile completion status
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  
  // Basic information
  businessName: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  
  // Service details
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  experience: {
    type: Number, // years
    min: 0,
  },
  
  // Contact information
  phone: {
    type: String,
    trim: true,
  },
  whatsapp: {
    type: String,
    trim: true,
  },
  
  // Location
  location: {
    address: String,
    city: String,
    area: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  
  // Availability
  availability: {
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: true },
    sunday: { type: Boolean, default: false },
  },
  workingHours: {
    start: {
      type: String,
      default: '09:00',
    },
    end: {
      type: String,
      default: '18:00',
    },
  },
  
  // Media
  profileImage: String,
  photos: [String],
  
  // Ratings
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  totalBookings: {
    type: Number,
    default: 0,
  },
  completedBookings: {
    type: Number,
    default: 0,
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Index for searching
serviceProviderSchema.index({ category: 1, isApproved: 1, isActive: 1 });
serviceProviderSchema.index({ 'location.city': 1, 'location.area': 1 });
serviceProviderSchema.index({ rating: -1 });

// Virtual for user details
serviceProviderSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Ensure virtuals are included in JSON
serviceProviderSchema.set('toJSON', { virtuals: true });
serviceProviderSchema.set('toObject', { virtuals: true });

export default mongoose.model('ServiceProvider', serviceProviderSchema);
