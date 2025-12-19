import { useNavigate } from 'react-router-dom';
import { Chat } from 'stream-chat-react';
import { useStreamChat } from '../contexts/StreamChatContext';
import ChannelList from '../components/chat/ChannelList';
import { Loader2, MessageSquare } from 'lucide-react';

const InboxPage = () => {
  const navigate = useNavigate();
  const { client, isReady } = useStreamChat();

  const handleSelectChannel = (channel) => {
    navigate(`/chat/${channel.id}`);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 pt-16">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading your messages...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 pt-16">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 mb-4">Unable to connect to chat</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">Messages</h1>
            <p className="text-neutral-600">
              Communicate with service providers about your bookings
            </p>
          </div>

          {/* Channel List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 300px)' }}>
            <Chat client={client} theme="messaging light">
              <ChannelList onSelectChannel={handleSelectChannel} />
            </Chat>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InboxPage;

