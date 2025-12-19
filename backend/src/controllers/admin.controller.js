import * as adminService from '../services/admin.service.js';
import * as providerService from '../services/provider.service.js';
import * as categoryService from '../services/category.service.js';
import * as bookingService from '../services/booking.service.js';
import * as serviceService from '../services/service.service.js';

// ===================
// USER MANAGEMENT
// ===================

export const getAllUsers = async (req, res, next) => {
  try {
    const { users, total, page, pages } = await adminService.getAllUsers(req.query);
    res.json({ 
      success: true, 
      data: { 
        users, 
        pagination: { total, page, pages } 
      } 
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await adminService.createUser(req.body);
    res.status(201).json({ 
      success: true, 
      data: { user }, 
      message: 'User created successfully' 
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.body);
    res.json({ 
      success: true, 
      data: { user }, 
      message: 'User updated successfully' 
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ===================
// PROVIDER MANAGEMENT
// ===================

export const getPendingProviders = async (req, res, next) => {
  try {
    const providers = await providerService.getPendingProviders();
    res.json({ success: true, data: { providers } });
  } catch (error) {
    next(error);
  }
};

export const getAllProviders = async (req, res, next) => {
  try {
    const result = await providerService.getAllProvidersForAdmin(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const approveProvider = async (req, res, next) => {
  try {
    const provider = await providerService.approveProvider(
      req.params.id,
      req.user._id
    );
    res.json({ 
      success: true, 
      message: 'Provider approved successfully',
      data: { provider } 
    });
  } catch (error) {
    next(error);
  }
};

export const rejectProvider = async (req, res, next) => {
  try {
    const provider = await providerService.rejectProvider(
      req.params.id,
      req.user._id,
      req.body.reason
    );
    res.json({ 
      success: true, 
      message: 'Provider rejected',
      data: { provider } 
    });
  } catch (error) {
    next(error);
  }
};

// ===================
// CATEGORY MANAGEMENT
// ===================

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories(false);
    res.json({ success: true, data: { categories } });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Category created successfully',
      data: { category } 
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json({ 
      success: true, 
      message: 'Category updated successfully',
      data: { category } 
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const seedCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.seedCategories();
    res.json({ 
      success: true, 
      message: 'Categories seeded successfully',
      data: { categories } 
    });
  } catch (error) {
    next(error);
  }
};

// ===================
// BOOKING MANAGEMENT
// ===================

export const getAllBookings = async (req, res, next) => {
  try {
    const result = await bookingService.getAllBookingsForAdmin(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// ===================
// SERVICE MANAGEMENT
// ===================

export const getAllServices = async (req, res, next) => {
  try {
    const result = await serviceService.getAllServicesForAdmin(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    await serviceService.deleteServiceByAdmin(req.params.id);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const toggleServiceStatus = async (req, res, next) => {
  try {
    const service = await serviceService.toggleServiceStatusByAdmin(req.params.id);
    res.json({ 
      success: true, 
      data: { service },
      message: 'Service status updated successfully' 
    });
  } catch (error) {
    next(error);
  }
};

// ===================
// STATISTICS
// ===================

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
