import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  priceType: {
    type: String,
    enum: ['fixed', 'hourly', 'negotiable'],
    default: 'fixed',
  },
  duration: {
    type: Number, // in minutes
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Index for searching
serviceSchema.index({ providerId: 1, isActive: 1 });
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ price: 1 });

export default mongoose.model('Service', serviceSchema);
