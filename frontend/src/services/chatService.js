import api from '../lib/api';

/**
 * Get Stream authentication token and API key
 * @returns {Promise<{token: string, apiKey: string, userId: string}>}
 */
export const getStreamToken = async () => {
  try {
    const response = await api.get('/chat/token');
    return response.data.data;
  } catch (error) {
    console.error('Error getting Stream token:', error);
    throw error;
  }
};

/**
 * Create or get a channel for a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<{channelId: string, channelType: string, booking: object}>}
 */
export const createBookingChannel = async (bookingId) => {
  try {
    const response = await api.post('/chat/channel', { bookingId });
    return response.data.data;
  } catch (error) {
    console.error('Error creating booking channel:', error);
    throw error;
  }
};

/**
 * Get all user's channels
 * @returns {Promise<{channels: array, total: number}>}
 */
export const getUserChannels = async () => {
  try {
    const response = await api.get('/chat/channels');
    return response.data.data;
  } catch (error) {
    console.error('Error getting user channels:', error);
    throw error;
  }
};

/**
 * Send a system message to a channel (admin only)
 * @param {string} channelId - Channel ID
 * @param {string} message - Message text
 * @param {object} metadata - Additional metadata
 * @returns {Promise<object>}
 */
export const sendSystemMessage = async (channelId, message, metadata = {}) => {
  try {
    const response = await api.post(`/chat/channel/${channelId}/system-message`, {
      message,
      metadata
    });
    return response.data;
  } catch (error) {
    console.error('Error sending system message:', error);
    throw error;
  }
};

/**
 * Delete a channel (admin only)
 * @param {string} channelId - Channel ID
 * @returns {Promise<object>}
 */
export const deleteChannel = async (channelId) => {
  try {
    const response = await api.delete(`/chat/channel/${channelId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting channel:', error);
    throw error;
  }
};

export default {
  getStreamToken,
  createBookingChannel,
  getUserChannels,
  sendSystemMessage,
  deleteChannel
};

