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

// Get category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    
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
