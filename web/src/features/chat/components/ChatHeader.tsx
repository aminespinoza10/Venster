import React from 'react';
import type { ChatHeaderProps } from '../types';
import './ChatHeader.css';

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, onNewChat }) => {
  return (
    <div className="chat-header">
      <h2 className="chat-title">{title}</h2>
      {onNewChat && (
        <button 
          className="new-chat-btn" 
          onClick={onNewChat}
          aria-label="Start new chat"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Chat
        </button>
      )}
    </div>
  );
};

export default ChatHeader;