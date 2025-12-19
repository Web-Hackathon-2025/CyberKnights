import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { createBookingChannel } from '../../services/chatService';
import { useStreamChat } from '../../contexts/StreamChatContext';
import toast from 'react-hot-toast';

const ChatButton = ({ 
  bookingId, 
  recipientName, 
  className = '',
  variant = 'primary', // 'primary' | 'secondary' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  fullWidth = false 
}) => {
  const navigate = useNavigate();
  const { isReady } = useStreamChat();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChat = async () => {
    if (!isReady) {
      toast.error('Chat is initializing, please wait...');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create or get the channel for this booking
      const { channelId } = await createBookingChannel(bookingId);
      
      // Navigate to the chat page
      navigate(`/chat/${channelId}`);
    } catch (error) {
      console.error('Error opening chat:', error);
      toast.error('Failed to open chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-700 shadow-sm',
    secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
    outline: 'border-2 border-primary text-primary hover:bg-primary-50'
  };

  return (
    <button
      onClick={handleOpenChat}
      disabled={isLoading || !isReady}
      className={`
        flex items-center justify-center gap-2 
        rounded-lg font-medium 
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      <MessageCircle className="w-5 h-5" />
      <span>
        {isLoading ? 'Opening...' : `Message ${recipientName}`}
      </span>
    </button>
  );
};

export default ChatButton;

