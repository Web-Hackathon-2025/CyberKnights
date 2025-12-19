import { Channel, MessageInput, MessageList, Window, Thread } from 'stream-chat-react';
import { Loader2 } from 'lucide-react';

const ChatWindow = ({ channel }) => {
  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">
            No conversation selected
          </h3>
          <p className="text-sm text-neutral-500">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <Channel channel={channel}>
      <Window>
        <MessageList />
        <MessageInput grow />
      </Window>
      <Thread />
    </Channel>
  );
};

export default ChatWindow;

