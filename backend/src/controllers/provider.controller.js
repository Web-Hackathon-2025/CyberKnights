import * as providerService from '../services/provider.service.js';
import * as serviceService from '../services/service.service.js';
import { AppError } from '../utils/AppError.js';

// Register as provider
export const registerAsProvider = async (req, res, next) => {
  try {
    const provider = await providerService.registerAsProvider(req.user._id);
    
    res.status(201).json({
      success: true,
      message: 'Provider registration successful. Waiting for admin approval.',
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

// Complete profile
export const completeProfile = async (req, res, next) => {
  try {
    const provider = await providerService.completeProviderProfile(
      req.user._id,
      req.body
    );
    
    res.json({
      success: true,
      message: 'Profile completed successfully',
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

// Get my provider profile
export const getMyProfile = async (req, res, next) => {
  try {
    const provider = await providerService.getProviderProfile(req.user._id);
    
    res.json({
      success: true,
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

// Update my profile
export const updateMyProfile = async (req, res, next) => {
  try {
    const provider = await providerService.updateProviderProfile(
      req.user._id,
      req.body
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { provider },
    });
  } catch (error) {
    next(error);
  }
};

// Get all providers (public)
export const getAllProviders = async (req, res, next) => {
  try {
    const result = await providerService.getAllProviders(req.query);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get provider by ID (public)
export const getProviderById = async (req, res, next) => {
  try {
    const result = await providerService.getProviderById(req.params.id);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Create service
export const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.user._id, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

// Get my services
export const getMyServices = async (req, res, next) => {
  try {
    const services = await serviceService.getProviderServices(req.user._id);
    
    res.json({
      success: true,
      data: { services },
    });
  } catch (error) {
    next(error);
  }
};

// Update service
export const updateService = async (req, res, next) => {
  try {
    const service = await serviceService.updateService(
      req.params.id,
      req.user._id,
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

// Delete service
export const deleteService = async (req, res, next) => {
  try {
    await serviceService.deleteService(req.params.id, req.user._id);
    
    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
