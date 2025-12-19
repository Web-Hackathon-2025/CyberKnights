import mongoose from 'mongoose';
import dns from 'dns';

// Use Google DNS to resolve MongoDB SRV records (helps with mobile hotspots)
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('💡 Tip: If on mobile hotspot, try changing DNS to 8.8.8.8 or use standard connection string');
    process.exit(1);
  }
};
