import { useChatContext } from 'stream-chat-react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, MessageCircle } from 'lucide-react';

const CustomChannelPreview = ({ 
  channel, 
  setActiveChannel, 
  activeChannel 
}) => {
  const { user } = useAuth();
  const { client } = useChatContext();

  if (!channel || !user) return null;

  const isActive = activeChannel?.id === channel.id;
  const unreadCount = channel.countUnread();
  const lastMessage = channel.state.messages[channel.state.messages.length - 1];
  const booking = channel.data?.booking;

  // Get the other member in the conversation
  const members = Object.values(channel.state.members);
  const otherMember = members.find(member => member.user.id !== user.id);
  const otherUser = otherMember?.user;

  // Format time
  const formatTime = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Truncate message
  const truncateMessage = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleClick = () => {
    setActiveChannel(channel);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        p-4 cursor-pointer transition-all duration-200
        border-l-4 hover:bg-primary-50
        ${isActive 
          ? 'bg-primary-50 border-primary' 
          : 'bg-white border-transparent hover:border-primary-200'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={otherUser?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'User')}`}
            alt={otherUser?.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-neutral-200"
          />
          {otherMember?.user?.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-neutral-800 truncate">
              {otherUser?.name || 'Unknown User'}
            </h3>
            {lastMessage && (
              <span className="text-xs text-neutral-500 ml-2 flex-shrink-0">
                {formatTime(lastMessage.created_at)}
              </span>
            )}
          </div>

          {/* Booking info if available */}
          {booking && (
            <div className="flex items-center gap-1 text-xs text-primary mb-1">
              <Calendar className="w-3 h-3" />
              <span className="font-medium">Booking #{booking.bookingNumber}</span>
            </div>
          )}

          {/* Last message */}
          <div className="flex items-center justify-between">
            <p className={`text-sm truncate ${unreadCount > 0 ? 'font-semibold text-neutral-900' : 'text-neutral-600'}`}>
              {lastMessage?.text 
                ? truncateMessage(lastMessage.text) 
                : <span className="italic text-neutral-400">No messages yet</span>
              }
            </p>

            {/* Unread badge */}
            {unreadCount > 0 && (
              <div className="flex-shrink-0 ml-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomChannelPreview;

