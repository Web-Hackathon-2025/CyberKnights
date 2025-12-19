import * as categoryService from '../services/category.service.js';
import * as serviceService from '../services/service.service.js';

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    
    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

// Get category by ID or slug
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let category;
    
    // Check if it's a MongoDB ObjectId or a slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await categoryService.getCategoryById(id);
    } else {
      category = await categoryService.getCategoryBySlug(id);
    }
    
    res.json({
      success: true,
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

// Get services by category
export const getServicesByCategory = async (req, res, next) => {
  try {
    const result = await serviceService.getAllServices({
      ...req.query,
      category: req.params.id,
    });
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get all services
export const getAllServices = async (req, res, next) => {
  try {
    const result = await serviceService.getAllServices(req.query);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
