import api from '../lib/api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
      platform: 'web',
    });
    return response.data;
  },

  async logout(refreshToken) {
    const response = await api.post('/auth/logout', {
      refreshToken,
    });
    return response.data;
  },

  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh-token', {
      refreshToken,
    });
    return response.data;
  },
};
