'use client';

import { useState } from 'react';
import { useChat } from '@/lib/contexts/ChatContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X,
  Minimize2
} from 'lucide-react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const { chats, activeChat } = useChat();
  const { user } = useAuth();

  if (!user) return null;

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
      setShowChatList(true);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const handleChatSelect = () => {
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setShowChatList(true);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={toggleChat}
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 relative"
          >
            <MessageCircle className="h-6 w-6" />
            {totalUnread > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-6 w-6 p-0 text-xs flex items-center justify-center"
              >
                {totalUnread > 99 ? '99+' : totalUnread}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'h-14' : 'h-[600px]'
        } w-96 max-w-[calc(100vw-3rem)]`}>
          <div className="h-full bg-background border rounded-lg shadow-2xl overflow-hidden">
            {isMinimized ? (
              // Minimized Header
              <div className="h-14 flex items-center justify-between px-4 border-b bg-muted/30">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-medium text-sm">Messages</span>
                  {totalUnread > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                      {totalUnread}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setIsMinimized(false)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={toggleChat}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              // Full Chat Interface
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      {showChatList ? 'Messages' : 'Chat'}
                    </span>
                    {totalUnread > 0 && showChatList && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                        {totalUnread}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={minimizeChat}
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={toggleChat}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                  {showChatList || !activeChat ? (
                    <ChatList onChatSelect={handleChatSelect} className="h-full border-0" />
                  ) : (
                    <ChatWindow onClose={handleBackToList} className="h-full border-0" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isOpen && !isMinimized && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={toggleChat} />
      )}
    </>
  );
}
