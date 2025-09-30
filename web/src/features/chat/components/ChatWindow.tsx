import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import type { ChatWindowProps } from '../types';
import './ChatWindow.css';

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  chat, 
  onSendMessage, 
  isLoading = false 
}) => {
  return (
    <div className="chat-window">
      <ChatHeader 
        title={chat?.title || 'New Chat'} 
      />
      
      <MessageList 
        messages={chat?.messages || []} 
        isLoading={isLoading}
      />
      
      <MessageInput 
        onSendMessage={onSendMessage}
        disabled={isLoading}
      />
    </div>
  );
};

export default ChatWindow;