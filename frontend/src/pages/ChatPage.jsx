import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Chat } from 'stream-chat-react';
import { useStreamChat } from '../contexts/StreamChatContext';
import ChannelList from '../components/chat/ChannelList';
import ChatWindow from '../components/chat/ChatWindow';
import { Loader2, ArrowLeft } from 'lucide-react';

const ChatPage = () => {
  const { channelId } = useParams();
  const { client, isReady } = useStreamChat();
  const [activeChannel, setActiveChannel] = useState(null);
  const [showChannelList, setShowChannelList] = useState(!channelId);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load the channel when channelId changes
  useEffect(() => {
    if (!client || !channelId || !isReady) return;

    const loadChannel = async () => {
      try {
        const channel = client.channel('messaging', channelId);
        await channel.watch();
        setActiveChannel(channel);
        
        // On mobile, hide channel list when a channel is opened
        if (isMobile) {
          setShowChannelList(false);
        }
      } catch (error) {
        console.error('Error loading channel:', error);
      }
    };

    loadChannel();
  }, [client, channelId, isReady, isMobile]);

  const handleSelectChannel = (channel) => {
    setActiveChannel(channel);
    
    // On mobile, hide channel list when a channel is selected
    if (isMobile) {
      setShowChannelList(false);
    }
  };

  const handleBackToList = () => {
    setShowChannelList(true);
    setActiveChannel(null);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Initializing chat...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Unable to connect to chat</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      <Chat client={client} theme="messaging light">
        <div className="container mx-auto h-[calc(100vh-4rem)]">
          <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden flex">
            {/* Channel List - Desktop: Always visible, Mobile: Toggle */}
            {(!isMobile || showChannelList) && (
              <div className={`${isMobile ? 'w-full' : 'w-80'} border-r border-neutral-200`}>
                <ChannelList onSelectChannel={handleSelectChannel} />
              </div>
            )}

            {/* Chat Window - Desktop: Always visible, Mobile: Show when channel selected */}
            {(!isMobile || !showChannelList) && (
              <div className="flex-1 flex flex-col">
                {/* Mobile back button */}
                {isMobile && activeChannel && (
                  <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
                    <button
                      onClick={handleBackToList}
                      className="p-2 hover:bg-neutral-100 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="font-semibold">Back to Messages</span>
                  </div>
                )}

                <ChatWindow channel={activeChannel} />
              </div>
            )}
          </div>
        </div>
      </Chat>
    </div>
  );
};

export default ChatPage;

