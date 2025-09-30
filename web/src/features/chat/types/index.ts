export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: User;
  type: 'user' | 'assistant';
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  currentChat: Chat | null;
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
}

// Component Props Types
export interface ChatWindowProps {
  chat: Chat | null;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export interface ChatBubbleProps {
  message: Message;
}

export interface ChatHeaderProps {
  title: string;
  onNewChat?: () => void;
}

export interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}