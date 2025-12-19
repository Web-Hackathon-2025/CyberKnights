import api from '../lib/api';

export const profileService = {
  // Get complete profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data) => {
    const response = await api.put('/profile', data);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (data) => {
    const response = await api.post('/profile/avatar', data);
    return response.data;
  },

  // Delete avatar
  deleteAvatar: async () => {
    const response = await api.delete('/profile/avatar');
    return response.data;
  },
};
