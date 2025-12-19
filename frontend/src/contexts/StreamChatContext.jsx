import { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useAuth } from './AuthContext';
import { getStreamToken } from '../services/chatService';

const StreamChatContext = createContext();

export const StreamChatProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only initialize if user is authenticated
    if (!isAuthenticated || !user) {
      setIsReady(false);
      setClient(null);
      return;
    }

    const initStream = async () => {
      try {
        setIsLoading(true);

        // Get Stream token from backend
        const { token, apiKey, userId } = await getStreamToken();

        // Initialize Stream client
        const streamClient = StreamChat.getInstance(apiKey);

        // Connect user with token
        await streamClient.connectUser(
          {
            id: userId,
            name: user.name || 'User',
            image: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`,
            role: user.role || 'user',
          },
          token
        );

        setClient(streamClient);
        setIsReady(true);
        console.log('✅ Stream Chat connected');
      } catch (error) {
        console.error('Failed to initialize Stream Chat:', error);
        setIsReady(false);
      } finally {
        setIsLoading(false);
      }
    };

    initStream();

    // Cleanup on unmount or when user changes
    return () => {
      if (client) {
        client.disconnectUser()
          .then(() => console.log('Stream Chat disconnected'))
          .catch(err => console.error('Error disconnecting Stream:', err));
        setClient(null);
        setIsReady(false);
      }
    };
  }, [isAuthenticated, user?.id]); // Only depend on auth status and user ID

  const value = {
    client,
    isReady,
    isLoading,
  };

  return (
    <StreamChatContext.Provider value={value}>
      {children}
    </StreamChatContext.Provider>
  );
};

export const useStreamChat = () => {
  const context = useContext(StreamChatContext);
  if (context === undefined) {
    throw new Error('useStreamChat must be used within a StreamChatProvider');
  }
  return context;
};

export default StreamChatProvider;

