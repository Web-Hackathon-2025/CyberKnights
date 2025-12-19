import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function checkUser() {
  try {
    await connectDB();
    console.log('✅ MongoDB connected\n');

    const email = 'ahmed.khan@gmail.com';
    const password = '12345678';

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🎭 Role:', user.role);
    console.log('✅ Email Verified:', user.isEmailVerified);
    console.log('🔐 Password Hash:', user.password.substring(0, 20) + '...');
    console.log('🔐 Hash Length:', user.password.length);
    
    // Test password comparison
    console.log('\n🧪 Testing password comparison...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password "${password}" matches:`, isMatch ? '✅ YES' : '❌ NO');
    
    // Also test the method on the model if it exists
    if (typeof user.comparePassword === 'function') {
      console.log('\n🧪 Testing user.comparePassword method...');
      const isMatchMethod = await user.comparePassword(password);
      console.log(`Using comparePassword method:`, isMatchMethod ? '✅ YES' : '❌ NO');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUser();

