import api from '../lib/api';

// Register as provider (creates pending profile)
export const registerAsProvider = async () => {
  const response = await api.post('/providers/register');
  return response.data;
};

// Get provider profile status
export const getProviderProfile = async () => {
  const response = await api.get('/providers/profile');
  return response.data;
};

// Complete provider profile
export const completeProviderProfile = async (profileData) => {
  const response = await api.post('/providers/complete-profile', profileData);
  return response.data;
};

// Update provider profile
export const updateProviderProfile = async (updates) => {
  const response = await api.put('/providers/profile', updates);
  return response.data;
};

// Get all providers (browse)
export const getAllProviders = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.city) params.append('city', filters.city);
  if (filters.area) params.append('area', filters.area);
  if (filters.search) params.append('search', filters.search);
  if (filters.minRating) params.append('minRating', filters.minRating);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  
  const response = await api.get(`/providers/browse?${params.toString()}`);
  return response.data;
};

// Get provider by ID
export const getProviderById = async (providerId) => {
  const response = await api.get(`/providers/${providerId}`);
  return response.data;
};

// Provider's services
export const getMyServices = async () => {
  const response = await api.get('/providers/services');
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await api.post('/providers/services', serviceData);
  return response.data;
};

export const updateService = async (serviceId, updates) => {
  const response = await api.put(`/providers/services/${serviceId}`, updates);
  return response.data;
};

export const deleteService = async (serviceId) => {
  const response = await api.delete(`/providers/services/${serviceId}`);
  return response.data;
};

export default {
  registerAsProvider,
  getProviderProfile,
  completeProviderProfile,
  updateProviderProfile,
  getAllProviders,
  getProviderById,
  getMyServices,
  createService,
  updateService,
  deleteService,
};
