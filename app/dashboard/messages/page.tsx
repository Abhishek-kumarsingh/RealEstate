'use client';

import { useState } from 'react';
import { useChat } from '@/lib/contexts/ChatContext';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';

export default function MessagesPage() {
  const { activeChat } = useChat();
  const [showChatWindow, setShowChatWindow] = useState(false);

  const handleChatSelect = () => {
    setShowChatWindow(true);
  };

  const handleBackToList = () => {
    setShowChatWindow(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with agents and clients
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Chat List - Hidden on mobile when chat is active */}
        <div className={`lg:col-span-1 ${showChatWindow && activeChat ? 'hidden lg:block' : ''}`}>
          <ChatList onChatSelect={handleChatSelect} className="h-full" />
        </div>

        {/* Chat Window */}
        <div className={`lg:col-span-2 ${!showChatWindow || !activeChat ? 'hidden lg:block' : ''}`}>
          <ChatWindow onClose={handleBackToList} className="h-full" />
        </div>
      </div>
    </div>
  );
}
