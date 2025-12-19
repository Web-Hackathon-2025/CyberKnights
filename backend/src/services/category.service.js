import Category from '../models/Category.model.js';
import { AppError } from '../utils/AppError.js';

// Get all categories
export const getAllCategories = async (activeOnly = true) => {
  const query = activeOnly ? { isActive: true } : {};
  
  const categories = await Category.find(query).sort({ order: 1, name: 1 });
  
  return categories;
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  
  return category;
};

// Get category by slug
export const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug });
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  
  return category;
};

// Admin: Create category
export const createCategory = async (categoryData) => {
  const category = await Category.create(categoryData);
  
  return category;
};

// Admin: Update category
export const updateCategory = async (categoryId, updates) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    updates,
    { new: true, runValidators: true }
  );
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  
  return category;
};

// Admin: Delete category
export const deleteCategory = async (categoryId) => {
  const category = await Category.findByIdAndDelete(categoryId);
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  
  return category;
};

// Admin: Seed default categories
export const seedCategories = async () => {
  const defaultCategories = [
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

  for (const cat of defaultCategories) {
    const exists = await Category.findOne({ name: cat.name });
    if (!exists) {
      await Category.create(cat);
    }
  }

  return await getAllCategories(false);
};
