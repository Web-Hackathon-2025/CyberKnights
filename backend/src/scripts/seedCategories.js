import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Category from '../models/Category.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const categories = [
      { name: 'Plumbing', icon: '🔧', description: 'Plumbing and water related services', order: 1 },
      { name: 'Electrical', icon: '⚡', description: 'Electrical work and repairs', order: 2 },
      { name: 'Carpentry', icon: '🪚', description: 'Wood work and furniture', order: 3 },
      { name: 'Painting', icon: '🎨', description: 'Painting and decoration', order: 4 },
      { name: 'Cleaning', icon: '🧹', description: 'Home and office cleaning', order: 5 },
      { name: 'AC Repair', icon: '❄️', description: 'AC installation and repair', order: 6 },
      { name: 'Appliance Repair', icon: '🔨', description: 'Home appliance repair', order: 7 },
      { name: 'Pest Control', icon: '🐛', description: 'Pest control services', order: 8 },
      { name: 'Gardening', icon: '🌱', description: 'Gardening and landscaping', order: 9 },
      { name: 'Moving & Packing', icon: '📦', description: 'Moving and packing services', order: 10 },
    ];

    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log(`✅ Created category: ${cat.name}`);
      } else {
        console.log(`ℹ️  Category already exists: ${cat.name}`);
      }
    }

    console.log('✅ Categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error.message);
    process.exit(1);
  }
};

seedCategories();
