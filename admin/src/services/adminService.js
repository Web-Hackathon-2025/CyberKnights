import api from '../lib/api';

export const adminService = {
  // Users Management
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

  // Dashboard Stats
  async getDashboardStats() {
    const response = await api.get('/admin/stats/dashboard');
    return response.data;
  },
};
