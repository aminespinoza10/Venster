import { useState, useCallback } from 'react';
import type { Chat, Message, User, ChatState } from '../types';
import { ollamaService } from '../services/ollamaService';

const mockUser: User = {
  id: 'user-1',
  name: 'You',
};

const mockAssistant: User = {
  id: 'assistant-1',
  name: 'AI Assistant',
};

export const useChat = () => {
  const [chatState, setChatState] = useState<ChatState>({
    currentChat: null,
    chats: [],
    isLoading: false,
    error: null,
  });

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      currentChat: newChat,
      chats: [newChat, ...prev.chats],
    }));

    return newChat;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    let currentChat = chatState.currentChat;
    
    // Create new chat if none exists
    if (!currentChat) {
      currentChat = createNewChat();
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: content.trim(),
      timestamp: new Date(),
      sender: mockUser,
      type: 'user',
    };

    // Add user message
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      title: currentChat.messages.length === 0 ? content.substring(0, 30) + '...' : currentChat.title,
      updatedAt: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      currentChat: updatedChat,
      chats: prev.chats.map(chat => 
        chat.id === updatedChat.id ? updatedChat : chat
      ),
      isLoading: true,
    }));

    // Get AI response from Ollama
    try {
      // Convert chat messages to Ollama format
      const ollamaMessages = updatedChat.messages.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      }));

      const responseContent = await ollamaService.chat(ollamaMessages);
      
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        content: responseContent,
        timestamp: new Date(),
        sender: mockAssistant,
        type: 'assistant',
      };

      setChatState(prev => {
        const chatWithResponse = {
          ...prev.currentChat!,
          messages: [...prev.currentChat!.messages, assistantMessage],
          updatedAt: new Date(),
        };

        return {
          ...prev,
          currentChat: chatWithResponse,
          chats: prev.chats.map(chat => 
            chat.id === chatWithResponse.id ? chatWithResponse : chat
          ),
          isLoading: false,
        };
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response';
      
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [chatState.currentChat, createNewChat]);

  const selectChat = useCallback((chatId: string) => {
    const chat = chatState.chats.find(c => c.id === chatId);
    if (chat) {
      setChatState(prev => ({
        ...prev,
        currentChat: chat,
      }));
    }
  }, [chatState.chats]);

  const clearError = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    ...chatState,
    sendMessage,
    createNewChat,
    selectChat,
    clearError,
  };
};