import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const DEMO_PASSWORD = '12345678';

const providerEmails = [
  'ahmed.khan@gmail.com',
  'fatima.noor@gmail.com',
  'hassan.ali@gmail.com',
  'ayesha.malik@gmail.com',
  'bilal.ahmed@gmail.com',
  'zainab.hassan@gmail.com',
  'usman.farooq@gmail.com',
  'sara.khan@gmail.com',
  'ali.raza@gmail.com',
  'hina.aslam@gmail.com',
  'imran.sheikh@gmail.com',
  'nadia.iqbal@gmail.com',
  'kamran.hussain@gmail.com',
  'sana.malik@gmail.com',
  'tariq.mehmood@gmail.com',
  'rabia.khan@gmail.com'
];

async function resetPasswords() {
  try {
    await connectDB();
    console.log('✅ MongoDB connected');
    console.log('🔄 Resetting provider passwords...\n');

    // DON'T pre-hash! Let the model's pre-save hook do it
    let updatedCount = 0;
    let notFoundCount = 0;

    for (const email of providerEmails) {
      const user = await User.findOne({ email }).select('+password'); // SELECT PASSWORD!
      
      if (user) {
        user.password = DEMO_PASSWORD; // Set PLAIN password, model will hash it
        await user.save();
        console.log(`✅ Updated password for: ${email}`);
        updatedCount++;
      } else {
        console.log(`❌ User not found: ${email}`);
        notFoundCount++;
      }
    }

    console.log(`\n🎉 Password reset complete!`);
    console.log(`   Updated: ${updatedCount} providers`);
    console.log(`   Not found: ${notFoundCount} providers`);
    console.log(`   New password for all: ${DEMO_PASSWORD}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetPasswords();

