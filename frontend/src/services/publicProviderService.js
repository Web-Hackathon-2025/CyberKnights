import api from '../lib/api';

export const publicProviderService = {
  // Browse and search providers (public, no auth required)
  async searchProviders(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.city) queryParams.append('city', params.city);
    if (params.area) queryParams.append('area', params.area);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.minRating) queryParams.append('minRating', params.minRating);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const response = await api.get(`/providers/browse?${queryParams.toString()}`);
    return response.data;
  },

  // Get public provider profile
  async getProviderProfile(providerId) {
    const response = await api.get(`/providers/${providerId}/public`);
    return response.data;
  },

  // Get provider's services
  async getProviderServices(providerId) {
    const response = await api.get(`/providers/${providerId}/services`);
    return response.data;
  },

  // Get provider reviews (future implementation)
  async getProviderReviews(providerId, params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const response = await api.get(`/providers/${providerId}/reviews?${queryParams.toString()}`);
    return response.data;
  },
};

export default publicProviderService;

