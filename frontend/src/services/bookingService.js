import api from '../lib/api';

export const bookingService = {
  // Customer methods
  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async getMyBookings(status = null) {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/bookings/my-bookings${params}`);
    return response.data;
  },

  async getBookingById(bookingId) {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  async cancelBooking(bookingId, reason) {
    const response = await api.put(`/bookings/${bookingId}/cancel`, { reason });
    return response.data;
  },

  // Provider methods
  async getProviderBookings(status = null) {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/bookings/provider-bookings${params}`);
    return response.data;
  },

  async confirmBooking(bookingId, providerNotes = '') {
    const response = await api.put(`/bookings/${bookingId}/confirm`, { providerNotes });
    return response.data;
  },

  async startBooking(bookingId) {
    const response = await api.put(`/bookings/${bookingId}/start`);
    return response.data;
  },

  async completeBooking(bookingId) {
    const response = await api.put(`/bookings/${bookingId}/complete`);
    return response.data;
  },
};

export default bookingService;

