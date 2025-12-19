import api from '../lib/api';

export const adminService = {
  // ==================
  // Users Management
  // ==================
  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  async getUserById(userId) {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  async createUser(userData) {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  async updateUser(userId, updates) {
    const response = await api.put(`/admin/users/${userId}`, updates);
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // ==================
  // Provider Management
  // ==================
  async getPendingProviders() {
    const response = await api.get('/admin/providers/pending');
    return response.data;
  },

  async getAllProviders(params = {}) {
    const response = await api.get('/admin/providers', { params });
    return response.data;
  },

  async approveProvider(providerId) {
    const response = await api.put(`/admin/providers/${providerId}/approve`);
    return response.data;
  },

  async rejectProvider(providerId, reason) {
    const response = await api.put(`/admin/providers/${providerId}/reject`, { reason });
    return response.data;
  },

  // ==================
  // Category Management
  // ==================
  async getCategories() {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  async createCategory(data) {
    const response = await api.post('/admin/categories', data);
    return response.data;
  },

  async updateCategory(categoryId, data) {
    const response = await api.put(`/admin/categories/${categoryId}`, data);
    return response.data;
  },

  async deleteCategory(categoryId) {
    const response = await api.delete(`/admin/categories/${categoryId}`);
    return response.data;
  },

  async seedCategories() {
    const response = await api.post('/admin/categories/seed');
    return response.data;
  },

  // ==================
  // Bookings
  // ==================
  async getBookings(params = {}) {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },

  // ==================
  // Dashboard Stats
  // ==================
  async getDashboardStats() {
    const response = await api.get('/admin/stats/dashboard');
    return response.data;
  },
};
