import React from 'react';
import ChatWindow from './components/ChatWindow';
import { useChat } from './hooks/useChat';
import './ChatPage.css';

const ChatPage: React.FC = () => {
  const { currentChat, isLoading, sendMessage, createNewChat } = useChat();

  // Create a new chat if none exists
  React.useEffect(() => {
    if (!currentChat) {
      createNewChat();
    }
  }, [currentChat, createNewChat]);

  return (
    <div className="chat-page">
      <ChatWindow
        chat={currentChat}
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatPage;