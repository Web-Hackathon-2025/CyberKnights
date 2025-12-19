import { ChannelList as StreamChannelList } from 'stream-chat-react';
import { useAuth } from '../../contexts/AuthContext';
import CustomChannelPreview from './CustomChannelPreview';

const ChannelList = ({ onSelectChannel }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Filter channels where the user is a member
  const filters = {
    type: 'messaging',
    members: { $in: [user.id] }
  };

  // Sort by last message time (most recent first)
  const sort = { last_message_at: -1 };

  // Options for the channel list
  const options = {
    state: true,
    watch: true,
    presence: true,
    limit: 20
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-neutral-200">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-800">Messages</h2>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto">
        <StreamChannelList
          filters={filters}
          sort={sort}
          options={options}
          Preview={CustomChannelPreview}
          onSelect={onSelectChannel}
          setActiveChannelOnMount={false}
        />
      </div>
    </div>
  );
};

export default ChannelList;

