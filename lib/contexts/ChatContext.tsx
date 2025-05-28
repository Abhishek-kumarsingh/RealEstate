'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'document';
  read: boolean;
}

interface Chat {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    online: boolean;
  }[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  propertyId?: string;
  propertyTitle?: string;
}

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (chatId: string, content: string, type?: 'text' | 'image' | 'document') => void;
  markAsRead: (chatId: string) => void;
  createChat: (participantId: string, propertyId?: string) => Chat;
  isTyping: { [chatId: string]: string[] };
  setTyping: (chatId: string, userId: string, typing: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock data for demonstration
const mockChats: Chat[] = [
  {
    id: 'chat-1',
    participants: [
      {
        id: 'user-1',
        name: 'John Doe',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
        role: 'user',
        online: true
      },
      {
        id: 'agent-1',
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/5325840/pexels-photo-5325840.jpeg',
        role: 'agent',
        online: true
      }
    ],
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-1',
        senderName: 'John Doe',
        content: 'Hi, I\'m interested in the luxury villa property. Can we schedule a viewing?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        read: true
      },
      {
        id: 'msg-2',
        senderId: 'agent-1',
        senderName: 'Sarah Johnson',
        content: 'Hello John! I\'d be happy to help you with that. The villa is available for viewing this weekend. What time works best for you?',
        timestamp: new Date(Date.now() - 3000000),
        type: 'text',
        read: true
      },
      {
        id: 'msg-3',
        senderId: 'user-1',
        senderName: 'John Doe',
        content: 'Saturday afternoon would be perfect. Around 2 PM?',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text',
        read: false
      }
    ],
    unreadCount: 1,
    propertyId: 'prop-1',
    propertyTitle: 'Modern Luxury Villa with Ocean View'
  },
  {
    id: 'chat-2',
    participants: [
      {
        id: 'user-2',
        name: 'Emma Wilson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        role: 'user',
        online: false
      },
      {
        id: 'agent-2',
        name: 'Michael Chen',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        role: 'agent',
        online: true
      }
    ],
    messages: [
      {
        id: 'msg-4',
        senderId: 'user-2',
        senderName: 'Emma Wilson',
        content: 'What\'s the monthly rent for the downtown apartment?',
        timestamp: new Date(Date.now() - 7200000),
        type: 'text',
        read: true
      },
      {
        id: 'msg-5',
        senderId: 'agent-2',
        senderName: 'Michael Chen',
        content: 'The monthly rent is $4,500. This includes utilities and access to all building amenities.',
        timestamp: new Date(Date.now() - 6600000),
        type: 'text',
        read: true
      }
    ],
    unreadCount: 0,
    propertyId: 'prop-2',
    propertyTitle: 'Downtown Luxury Apartment'
  }
];

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isTyping, setIsTypingState] = useState<{ [chatId: string]: string[] }>({});

  // Filter chats based on current user
  const userChats = chats.filter(chat =>
    chat.participants.some(p => p.id === user?.email || p.name === user?.name)
  );

  const sendMessage = (chatId: string, content: string, type: 'text' | 'image' | 'document' = 'text') => {
    if (!user || !content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.email,
      senderName: user.name,
      senderAvatar: user.avatar,
      content: content.trim(),
      timestamp: new Date(),
      type,
      read: false
    };

    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === chatId) {
          const updatedChat = {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: newMessage
          };

          // Simulate agent auto-response after 2 seconds
          if (user.role === 'USER') {
            setTimeout(() => {
              const agentResponse: Message = {
                id: `msg-${Date.now()}-agent`,
                senderId: chat.participants.find(p => p.role === 'agent')?.id || 'agent',
                senderName: chat.participants.find(p => p.role === 'agent')?.name || 'Agent',
                content: getAgentAutoResponse(content),
                timestamp: new Date(),
                type: 'text',
                read: false
              };

              setChats(prevChats =>
                prevChats.map(c =>
                  c.id === chatId
                    ? { ...c, messages: [...c.messages, agentResponse], lastMessage: agentResponse }
                    : c
                )
              );
            }, 2000);
          }

          return updatedChat;
        }
        return chat;
      })
    );

    // Update active chat if it's the current one
    if (activeChat?.id === chatId) {
      setActiveChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessage: newMessage
      } : null);
    }
  };

  const markAsRead = (chatId: string) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              unreadCount: 0,
              messages: chat.messages.map(msg => ({ ...msg, read: true }))
            }
          : chat
      )
    );
  };

  const createChat = (participantId: string, propertyId?: string): Chat => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      participants: [
        {
          id: user?.email || 'user',
          name: user?.name || 'User',
          avatar: user?.avatar,
          role: user?.role || 'user',
          online: true
        },
        {
          id: participantId,
          name: 'Agent',
          role: 'agent',
          online: true
        }
      ],
      messages: [],
      unreadCount: 0,
      propertyId,
      propertyTitle: propertyId ? 'Property Inquiry' : undefined
    };

    setChats(prev => [...prev, newChat]);
    return newChat;
  };

  const setTyping = (chatId: string, userId: string, typing: boolean) => {
    setIsTypingState(prev => ({
      ...prev,
      [chatId]: typing
        ? [...(prev[chatId] || []), userId].filter((id, index, arr) => arr.indexOf(id) === index)
        : (prev[chatId] || []).filter(id => id !== userId)
    }));
  };

  const value = {
    chats: userChats,
    activeChat,
    setActiveChat,
    sendMessage,
    markAsRead,
    createChat,
    isTyping,
    setTyping
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

// Helper function for agent auto-responses
function getAgentAutoResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  if (message.includes('viewing') || message.includes('visit') || message.includes('see')) {
    return "I'd be happy to schedule a viewing for you! I have availability this week. What day and time works best for you?";
  }

  if (message.includes('price') || message.includes('cost') || message.includes('rent')) {
    return "Let me get you the detailed pricing information. The property offers great value for its location and amenities. Would you like to discuss financing options?";
  }

  if (message.includes('amenities') || message.includes('features')) {
    return "This property has excellent amenities! It includes modern appliances, parking, and access to community facilities. Would you like me to send you the complete amenities list?";
  }

  if (message.includes('location') || message.includes('neighborhood')) {
    return "The location is fantastic! It's close to schools, shopping centers, and public transportation. The neighborhood is very safe and family-friendly.";
  }

  return "Thank you for your message! I'll get back to you with more details shortly. Is there anything specific you'd like to know about this property?";
}
