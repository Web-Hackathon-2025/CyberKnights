import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.model.js';
import ServiceProvider from '../models/ServiceProvider.model.js';
import Service from '../models/Service.model.js';
import Category from '../models/Category.model.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const DEMO_PASSWORD = '12345678';

const pakistaniCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];

// Demo providers data
const providerData = [
  {
    name: 'Ahmed Khan',
    email: 'ahmed.khan@gmail.com',
    businessName: "Ahmed's Plumbing Services",
    category: 'Plumbing',
    city: 'Karachi',
    area: 'DHA Phase 5',
    bio: 'Expert plumber with 8 years of experience in residential and commercial plumbing. Available 24/7 for emergency services.',
    phone: '0321-1234567',
    experience: 8,
    rating: 4.8,
    totalReviews: 45,
    completedBookings: 120,
    services: [
      { name: 'Pipe Leak Repair', description: 'Quick and reliable pipe leak detection and repair', price: 1500, priceType: 'fixed', duration: 60 },
      { name: 'Water Tank Installation', description: 'Professional water tank installation and setup', price: 3500, priceType: 'fixed', duration: 180 },
      { name: 'Drain Cleaning', description: 'Complete drain cleaning and unclogging service', price: 1200, priceType: 'fixed', duration: 45 },
    ],
  },
  {
    name: 'Fatima Noor',
    email: 'fatima.noor@gmail.com',
    businessName: 'Bright Spark Electricals',
    category: 'Electrical',
    city: 'Lahore',
    area: 'Gulberg',
    bio: 'Licensed electrician specializing in home and office electrical work. Safety is my priority.',
    phone: '0322-2345678',
    experience: 5,
    rating: 4.9,
    totalReviews: 67,
    completedBookings: 150,
    services: [
      { name: 'House Wiring', description: 'Complete house wiring and rewiring services', price: 800, priceType: 'hourly', duration: 240 },
      { name: 'Fan Installation', description: 'Ceiling and wall fan installation', price: 800, priceType: 'fixed', duration: 30 },
      { name: 'Circuit Breaker Repair', description: 'Circuit breaker troubleshooting and repair', price: 1200, priceType: 'fixed', duration: 60 },
    ],
  },
  {
    name: 'Hassan Ali',
    email: 'hassan.ali@gmail.com',
    businessName: 'Master Carpenter Hassan',
    category: 'Carpentry',
    city: 'Islamabad',
    area: 'F-10',
    bio: 'Custom furniture and woodwork specialist. Quality craftsmanship guaranteed.',
    phone: '0333-3456789',
    experience: 12,
    rating: 4.7,
    totalReviews: 38,
    completedBookings: 95,
    services: [
      { name: 'Custom Furniture Making', description: 'Custom-made furniture according to your design', price: 1500, priceType: 'hourly', duration: 480 },
      { name: 'Door and Window Repair', description: 'Repair and maintenance of doors and windows', price: 2000, priceType: 'negotiable', duration: 120 },
      { name: 'Cabinet Installation', description: 'Kitchen and bathroom cabinet installation', price: 3500, priceType: 'fixed', duration: 240 },
    ],
  },
  {
    name: 'Ayesha Malik',
    email: 'ayesha.malik@gmail.com',
    businessName: 'Perfect Paint Solutions',
    category: 'Painting',
    city: 'Karachi',
    area: 'Clifton',
    bio: 'Professional painter with an eye for detail. Interior and exterior painting services.',
    phone: '0321-4567890',
    experience: 6,
    rating: 4.6,
    totalReviews: 52,
    completedBookings: 110,
    services: [
      { name: 'Interior Wall Painting', description: 'Professional interior wall painting service', price: 700, priceType: 'hourly', duration: 360 },
      { name: 'Exterior Painting', description: 'Weather-resistant exterior painting', price: 900, priceType: 'hourly', duration: 480 },
      { name: 'Texture Painting', description: 'Decorative texture and design painting', price: 1200, priceType: 'hourly', duration: 300 },
    ],
  },
  {
    name: 'Bilal Ahmed',
    email: 'bilal.ahmed@gmail.com',
    businessName: 'SparkleClean Services',
    category: 'Cleaning',
    city: 'Rawalpindi',
    area: 'Saddar',
    bio: 'Professional cleaning services for homes and offices. Eco-friendly products used.',
    phone: '0345-5678901',
    experience: 4,
    rating: 4.5,
    totalReviews: 89,
    completedBookings: 200,
    services: [
      { name: 'Deep House Cleaning', description: 'Thorough deep cleaning of entire house', price: 3000, priceType: 'fixed', duration: 240 },
      { name: 'Office Cleaning', description: 'Complete office cleaning and sanitization', price: 2500, priceType: 'fixed', duration: 180 },
      { name: 'Carpet Cleaning', description: 'Professional carpet shampooing and stain removal', price: 1500, priceType: 'fixed', duration: 90 },
    ],
  },
  {
    name: 'Zainab Hassan',
    email: 'zainab.hassan@gmail.com',
    businessName: 'CoolTech AC Services',
    category: 'AC Repair',
    city: 'Lahore',
    area: 'DHA',
    bio: 'AC installation, repair and maintenance expert. All brands serviced.',
    phone: '0322-6789012',
    experience: 7,
    rating: 4.8,
    totalReviews: 72,
    completedBookings: 165,
    services: [
      { name: 'AC Installation', description: 'Professional AC installation service', price: 2500, priceType: 'fixed', duration: 120 },
      { name: 'AC Repair & Maintenance', description: 'AC troubleshooting and repair', price: 1500, priceType: 'fixed', duration: 90 },
      { name: 'AC Gas Refilling', description: 'AC gas checking and refilling', price: 2000, priceType: 'fixed', duration: 60 },
    ],
  },
  {
    name: 'Usman Farooq',
    email: 'usman.farooq@gmail.com',
    businessName: 'FixIt Appliance Repair',
    category: 'Appliance Repair',
    city: 'Faisalabad',
    area: 'Peoples Colony',
    bio: 'Experienced in repairing all home appliances. Quick and reliable service.',
    phone: '0333-7890123',
    experience: 9,
    rating: 4.7,
    totalReviews: 61,
    completedBookings: 140,
    services: [
      { name: 'Washing Machine Repair', description: 'All washing machine brands repaired', price: 1500, priceType: 'fixed', duration: 90 },
      { name: 'Refrigerator Repair', description: 'Fridge cooling and other issues fixed', price: 2000, priceType: 'fixed', duration: 120 },
      { name: 'Microwave Repair', description: 'Microwave troubleshooting and repair', price: 1200, priceType: 'fixed', duration: 60 },
    ],
  },
  {
    name: 'Sara Khan',
    email: 'sara.khan@gmail.com',
    businessName: 'PestControl Pro',
    category: 'Pest Control',
    city: 'Karachi',
    area: 'Gulshan-e-Iqbal',
    bio: 'Safe and effective pest control solutions. Licensed and insured.',
    phone: '0321-8901234',
    experience: 5,
    rating: 4.6,
    totalReviews: 44,
    completedBookings: 98,
    services: [
      { name: 'Fumigation Service', description: 'Complete house fumigation service', price: 3500, priceType: 'fixed', duration: 180 },
      { name: 'Termite Treatment', description: 'Termite inspection and treatment', price: 4500, priceType: 'negotiable', duration: 240 },
      { name: 'Rodent Control', description: 'Rat and mice control service', price: 2500, priceType: 'fixed', duration: 120 },
    ],
  },
  {
    name: 'Ali Raza',
    email: 'ali.raza@gmail.com',
    businessName: 'Green Garden Services',
    category: 'Gardening',
    city: 'Islamabad',
    area: 'G-11',
    bio: 'Professional gardening and landscaping services. Make your garden beautiful.',
    phone: '0345-9012345',
    experience: 10,
    rating: 4.9,
    totalReviews: 56,
    completedBookings: 130,
    services: [
      { name: 'Lawn Maintenance', description: 'Regular lawn mowing and maintenance', price: 1000, priceType: 'fixed', duration: 120 },
      { name: 'Garden Design', description: 'Professional garden landscaping design', price: 1500, priceType: 'hourly', duration: 240 },
      { name: 'Tree Trimming', description: 'Tree and hedge trimming service', price: 1200, priceType: 'fixed', duration: 90 },
    ],
  },
  {
    name: 'Hina Aslam',
    email: 'hina.aslam@gmail.com',
    businessName: 'Swift Movers & Packers',
    category: 'Moving & Packing',
    city: 'Lahore',
    area: 'Johar Town',
    bio: 'Reliable moving and packing services. Your belongings in safe hands.',
    phone: '0322-0123456',
    experience: 6,
    rating: 4.7,
    totalReviews: 78,
    completedBookings: 155,
    services: [
      { name: 'House Shifting', description: 'Complete house shifting service', price: 10000, priceType: 'negotiable', duration: 480 },
      { name: 'Office Relocation', description: 'Professional office moving service', price: 15000, priceType: 'negotiable', duration: 600 },
      { name: 'Packing Services', description: 'Professional packing service', price: 3000, priceType: 'fixed', duration: 180 },
    ],
  },
  {
    name: 'Imran Sheikh',
    email: 'imran.sheikh@gmail.com',
    businessName: 'Expert Plumbing Solutions',
    category: 'Plumbing',
    city: 'Multan',
    area: 'Cantonment',
    bio: 'Trusted plumber for all your plumbing needs. Quality work guaranteed.',
    phone: '0333-1234567',
    experience: 7,
    rating: 4.6,
    totalReviews: 39,
    completedBookings: 105,
    services: [
      { name: 'Bathroom Fitting', description: 'Complete bathroom fitting and fixtures', price: 2500, priceType: 'fixed', duration: 180 },
      { name: 'Water Pump Installation', description: 'Water pump installation and repair', price: 2000, priceType: 'fixed', duration: 120 },
      { name: 'Geyser Installation', description: 'Water heater installation service', price: 1500, priceType: 'fixed', duration: 90 },
    ],
  },
  {
    name: 'Nadia Iqbal',
    email: 'nadia.iqbal@gmail.com',
    businessName: 'PowerFix Electrical',
    category: 'Electrical',
    city: 'Karachi',
    area: 'North Nazimabad',
    bio: 'Certified electrician with expertise in modern electrical systems.',
    phone: '0321-2345678',
    experience: 6,
    rating: 4.8,
    totalReviews: 51,
    completedBookings: 125,
    services: [
      { name: 'Light Fixture Installation', description: 'All types of light fixtures installed', price: 600, priceType: 'fixed', duration: 45 },
      { name: 'Electrical Panel Upgrade', description: 'Upgrade old electrical panels', price: 3500, priceType: 'fixed', duration: 240 },
      { name: 'Generator Installation', description: 'Backup generator installation', price: 5000, priceType: 'negotiable', duration: 300 },
    ],
  },
  {
    name: 'Kamran Hussain',
    email: 'kamran.hussain@gmail.com',
    businessName: 'Wood Craft Carpentry',
    category: 'Carpentry',
    city: 'Rawalpindi',
    area: 'Bahria Town',
    bio: 'Skilled carpenter for custom woodwork and repairs. Excellence in every project.',
    phone: '0345-3456789',
    experience: 8,
    rating: 4.7,
    totalReviews: 42,
    completedBookings: 100,
    services: [
      { name: 'Kitchen Cabinets', description: 'Custom kitchen cabinet design and installation', price: 2000, priceType: 'hourly', duration: 360 },
      { name: 'Wooden Flooring', description: 'Wooden floor installation and polishing', price: 1800, priceType: 'hourly', duration: 480 },
      { name: 'Furniture Repair', description: 'Repair and restoration of old furniture', price: 1000, priceType: 'fixed', duration: 120 },
    ],
  },
  {
    name: 'Sana Malik',
    email: 'sana.malik@gmail.com',
    businessName: 'ColorPro Painting',
    category: 'Painting',
    city: 'Islamabad',
    area: 'I-8',
    bio: 'Creative painter with modern techniques. Transform your space with colors.',
    phone: '0322-4567890',
    experience: 5,
    rating: 4.5,
    totalReviews: 36,
    completedBookings: 87,
    services: [
      { name: 'Room Painting', description: 'Single room painting service', price: 3000, priceType: 'fixed', duration: 240 },
      { name: 'Wall Paper Installation', description: 'Wallpaper selection and installation', price: 1500, priceType: 'hourly', duration: 180 },
      { name: 'Spray Painting', description: 'Professional spray painting service', price: 1000, priceType: 'hourly', duration: 120 },
    ],
  },
  {
    name: 'Tariq Mehmood',
    email: 'tariq.mehmood@gmail.com',
    businessName: 'ProClean Solutions',
    category: 'Cleaning',
    city: 'Lahore',
    area: 'Model Town',
    bio: 'Professional cleaning with attention to detail. Your satisfaction is our goal.',
    phone: '0333-5678901',
    experience: 4,
    rating: 4.6,
    totalReviews: 65,
    completedBookings: 145,
    services: [
      { name: 'Kitchen Deep Clean', description: 'Complete kitchen deep cleaning', price: 2000, priceType: 'fixed', duration: 150 },
      { name: 'Bathroom Sanitization', description: 'Professional bathroom cleaning', price: 1200, priceType: 'fixed', duration: 90 },
      { name: 'Window Cleaning', description: 'All windows cleaned inside and out', price: 1500, priceType: 'fixed', duration: 120 },
    ],
  },
  {
    name: 'Rabia Khan',
    email: 'rabia.khan@gmail.com',
    businessName: 'Cool Breeze AC Services',
    category: 'AC Repair',
    city: 'Faisalabad',
    area: 'Satyana Road',
    bio: 'Expert AC technician. Fast and reliable AC services at affordable rates.',
    phone: '0321-6789012',
    experience: 5,
    rating: 4.7,
    totalReviews: 48,
    completedBookings: 115,
    services: [
      { name: 'Split AC Installation', description: 'Split AC unit installation', price: 2800, priceType: 'fixed', duration: 150 },
      { name: 'AC Deep Cleaning', description: 'Complete AC deep cleaning service', price: 1800, priceType: 'fixed', duration: 90 },
      { name: 'AC Filter Replacement', description: 'AC filter replacement and cleaning', price: 800, priceType: 'fixed', duration: 30 },
    ],
  },
];

const seedProviders = async () => {
  try {
    console.log('🌱 Starting provider seeding...');

    // Hash password once
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

    // Get all categories
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    console.log(`📦 Found ${categories.length} categories`);

    let createdCount = 0;
    let skippedCount = 0;

    for (const providerInfo of providerData) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: providerInfo.email });
      
      if (existingUser) {
        console.log(`⏭️  Skipping ${providerInfo.name} - already exists`);
        skippedCount++;
        continue;
      }

      // Create user account
      const user = await User.create({
        name: providerInfo.name,
        email: providerInfo.email,
        password: hashedPassword,
        role: 'provider',
        isEmailVerified: true,
      });

      // Create provider profile
      const provider = await ServiceProvider.create({
        userId: user._id,
        businessName: providerInfo.businessName,
        category: categoryMap[providerInfo.category],
        bio: providerInfo.bio,
        phone: providerInfo.phone,
        experience: providerInfo.experience,
        location: {
          city: providerInfo.city,
          area: providerInfo.area,
        },
        rating: providerInfo.rating,
        totalReviews: providerInfo.totalReviews,
        completedBookings: providerInfo.completedBookings,
        isApproved: true,
        isProfileComplete: true,
        approvedAt: new Date(),
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false,
        },
        workingHours: {
          start: '09:00',
          end: '18:00',
        },
      });

      // Create services
      for (const serviceInfo of providerInfo.services) {
        await Service.create({
          providerId: provider._id,
          name: serviceInfo.name,
          description: serviceInfo.description,
          category: categoryMap[providerInfo.category],
          price: serviceInfo.price,
          priceType: serviceInfo.priceType,
          duration: serviceInfo.duration,
          isActive: true,
        });
      }

      createdCount++;
      console.log(`✅ Created: ${providerInfo.name} (${providerInfo.businessName}) with ${providerInfo.services.length} services`);
    }

    console.log(`\n🎉 Seeding complete!`);
    console.log(`   Created: ${createdCount} providers`);
    console.log(`   Skipped: ${skippedCount} existing providers`);
    console.log(`   Password for all accounts: ${DEMO_PASSWORD}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding providers:', error);
    process.exit(1);
  }
};

// Connect to database and run seeding
connectDB().then(() => {
  seedProviders();
});

