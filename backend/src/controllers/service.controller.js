import * as serviceService from '../services/service.service.js';
import { AppError } from '../utils/AppError.js';

// Public: Search and filter services
export const searchServices = async (req, res, next) => {
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

// Public: Get service by ID
export const getServiceById = async (req, res, next) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    
    res.json({
      success: true,
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

// Provider: Get my services
export const getMyServices = async (req, res, next) => {
  try {
    const services = await serviceService.getProviderServices(req.user.providerId);
    
    res.json({
      success: true,
      data: { services },
    });
  } catch (error) {
    next(error);
  }
};

// Provider: Create service
export const createService = async (req, res, next) => {
  try {
    const serviceData = {
      ...req.body,
      providerId: req.user.providerId,
    };
    
    const service = await serviceService.createService(serviceData);
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

// Provider: Update service
export const updateService = async (req, res, next) => {
  try {
    const service = await serviceService.updateService(
      req.params.id,
      req.user.providerId,
      req.body
    );
    
    res.json({
      success: true,
      message: 'Service updated successfully',
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

// Provider: Delete service
export const deleteService = async (req, res, next) => {
  try {
    await serviceService.deleteService(req.params.id, req.user.providerId);
    
    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Provider: Toggle service status
export const toggleServiceStatus = async (req, res, next) => {
  try {
    const service = await serviceService.toggleServiceStatus(
      req.params.id,
      req.user.providerId
    );
    
    res.json({
      success: true,
      message: 'Service status updated successfully',
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

