import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import ServiceProvider from './src/models/ServiceProvider.model.js';

dotenv.config();

async function checkProviders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get all providers with their user data
    const providers = await ServiceProvider.find({}).lean();
    const userIds = providers.map(p => p.userId);
    const users = await User.find({ _id: { $in: userIds } }).lean();

    console.log('=== ALL SERVICE PROVIDERS ===\n');
    
    if (providers.length === 0) {
      console.log('No providers found');
    } else {
      providers.forEach((provider, index) => {
        const user = users.find(u => u._id.toString() === provider.userId.toString());
        console.log(`Provider ${index + 1}:`);
        console.log('  User ID:', provider.userId);
        console.log('  User Email:', user?.email);
        console.log('  User Name:', user?.name);
        console.log('  User Role:', user?.role);
        console.log('  Is Profile Complete:', provider.isProfileComplete);
        console.log('  Is Approved:', provider.isApproved);
        console.log('  Approved At:', provider.approvedAt);
        console.log('  Rejected At:', provider.rejectedAt);
        console.log('  Business Name:', provider.businessName);
        console.log('  Category:', provider.category);
        console.log('---');
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProviders();
