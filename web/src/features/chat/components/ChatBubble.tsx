import React from 'react';
import type { ChatBubbleProps } from '../types';
import './ChatBubble.css';

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`chat-bubble ${message.type === 'user' ? 'user' : 'assistant'}`}>
      <div className="chat-bubble-header">
        <span className="chat-bubble-sender">{message.sender.name}</span>
        <span className="chat-bubble-time">{formatTime(message.timestamp)}</span>
      </div>
      <div className="chat-bubble-content">
        {message.content}
      </div>
    </div>
  );
};

export default ChatBubble;