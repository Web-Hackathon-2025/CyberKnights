import { StreamChat } from 'stream-chat';

class StreamService {
  constructor() {
    this.client = null;
    this.initializeClient();
  }

  initializeClient() {
    try {
      const apiKey = process.env.STREAM_API_KEY;
      const apiSecret = process.env.STREAM_API_SECRET;

      if (!apiKey || !apiSecret) {
        console.warn('Stream API credentials not found. Chat features will be disabled.');
        return;
      }

      this.client = StreamChat.getInstance(apiKey, apiSecret);
      console.log('✅ Stream Chat client initialized');
    } catch (error) {
      console.error('Failed to initialize Stream Chat:', error.message);
    }
  }

  /**
   * Generate authentication token for a user
   * @param {string} userId - User's ID
   * @returns {string} JWT token for Stream authentication
   */
  createUserToken(userId) {
    if (!this.client) {
      throw new Error('Stream client not initialized');
    }
    return this.client.createToken(userId);
  }

  /**
   * Create or update a user in Stream
   * @param {string} userId - User's ID
   * @param {object} userData - User data (name, image, role, etc.)
   */
  async upsertUser(userId, userData) {
    if (!this.client) {
      throw new Error('Stream client not initialized');
    }

    await this.client.upsertUser({
      id: userId,
      name: userData.name || 'Unknown',
      image: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}`,
      role: 'user', // Use standard Stream role
      userType: userData.role || 'user', // Custom field to distinguish customer/provider
      ...userData
    });
  }

  /**
   * Create a channel for booking communication
   * @param {string} bookingId - Booking ID
   * @param {string} customerId - Customer user ID
   * @param {string} providerId - Provider user ID
   * @param {object} bookingData - Additional booking metadata
   * @returns {object} Channel information
   */
  async createBookingChannel(bookingId, customerId, providerId, bookingData = {}) {
    if (!this.client) {
      throw new Error('Stream client not initialized');
    }

    const channelId = `booking-${bookingId}`;
    
    // Create a messaging channel with the two participants
    const channel = this.client.channel('messaging', channelId, {
      members: [customerId, providerId],
      created_by_id: customerId,
      booking: {
        id: bookingId,
        bookingNumber: bookingData.bookingNumber,
        serviceName: bookingData.serviceName,
        status: bookingData.status
      }
    });

    await channel.create();

    return {
      channelId: channel.id,
      channelType: channel.type
    };
  }

  /**
   * Get or create a channel
   * @param {string} channelId - Channel ID
   * @param {array} memberIds - Array of member user IDs
   * @returns {object} Channel object
   */
  async getOrCreateChannel(channelId, memberIds) {
    if (!this.client) {
      throw new Error('Stream client not initialized');
    }

    const channel = this.client.channel('messaging', channelId, {
      members: memberIds
    });

    await channel.watch();
    return channel;
  }

  /**
   * Send a system message to a channel
   * @param {string} channelId - Channel ID
   * @param {string} text - Message text
   * @param {object} metadata - Additional message metadata
   */
  async sendSystemMessage(channelId, text, metadata = {}) {
    if (!this.client) {
      throw new Error('Stream client not initialized');
    }

    try {
      const channel = this.client.channel('messaging', channelId);
      await channel.sendMessage({
        text,
        type: 'system',
        ...metadata
      });
    } catch (error) {
      console.error('Failed to send system message:', error.message);
    }
  }

  /**
   * Delete a channel
   * @param {string} channelId - Channel ID
   */
  async deleteChannel(channelId) {
    if (!this.client) {
      throw new Error('Stream client not initialized');
    }

    const channel = this.client.channel('messaging', channelId);
    await channel.delete();
  }

  /**
   * Get user's channels
   * @param {string} userId - User ID
   * @returns {array} List of channels
   */
  async getUserChannels(userId) {
    if (!this.client) {
      throw new Error('Stream client not initialized');
    }

    const filter = { type: 'messaging', members: { $in: [userId] } };
    const sort = [{ last_message_at: -1 }];
    
    const channels = await this.client.queryChannels(filter, sort, {
      watch: false,
      state: true
    });

    return channels;
  }
}

// Export singleton instance
export const streamService = new StreamService();
export default streamService;

