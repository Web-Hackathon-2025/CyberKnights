import api from '../lib/api';

export const serviceService = {
  // Search and filter services
  async searchServices(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.city) queryParams.append('city', params.city);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.priceType) queryParams.append('priceType', params.priceType);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const response = await api.get(`/services?${queryParams.toString()}`);
    return response.data;
  },

  // Get service by ID
  async getServiceById(serviceId) {
    const response = await api.get(`/services/${serviceId}`);
    return response.data;
  },
};

export default serviceService;

