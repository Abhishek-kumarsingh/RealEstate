'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/lib/contexts/ChatContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical,
  ArrowLeft,
  Circle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatWindowProps {
  onClose?: () => void;
  className?: string;
}

export default function ChatWindow({ onClose, className }: ChatWindowProps) {
  const { activeChat, sendMessage, markAsRead, isTyping } = useChat();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeChat) {
      markAsRead(activeChat.id);
    }
  }, [activeChat, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const handleSendMessage = () => {
    if (!activeChat || !message.trim()) return;
    
    sendMessage(activeChat.id, message);
    setMessage('');
    setIsUserTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    
    if (value.trim() && !isUserTyping) {
      setIsUserTyping(true);
      // Simulate typing indicator
      setTimeout(() => setIsUserTyping(false), 3000);
    }
  };

  if (!activeChat) {
    return (
      <Card className={`h-full flex items-center justify-center ${className}`}>
        <CardContent className="text-center">
          <div className="text-muted-foreground">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold mb-2">No chat selected</h3>
            <p>Choose a conversation to start messaging</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const otherParticipant = activeChat.participants.find(p => p.id !== user?.email && p.name !== user?.name);
  const typingUsers = isTyping[activeChat.id] || [];

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      {/* Chat Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <div className="flex items-center space-x-3">
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} />
                <AvatarFallback>{otherParticipant?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              {otherParticipant?.online && (
                <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
              )}
            </div>
            
            <div>
              <CardTitle className="text-base">{otherParticipant?.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {otherParticipant?.role}
                </Badge>
                {otherParticipant?.online && (
                  <span className="text-xs text-green-600">Online</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Property Info (if applicable) */}
      {activeChat.propertyTitle && (
        <div className="px-6 py-3 bg-muted/30 border-b">
          <div className="text-sm">
            <span className="text-muted-foreground">Property: </span>
            <span className="font-medium">{activeChat.propertyTitle}</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6 py-4">
          <div className="space-y-4">
            {activeChat.messages.map((msg) => {
              const isOwn = msg.senderId === user?.email || msg.senderName === user?.name;
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[70%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!isOwn && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={msg.senderAvatar} alt={msg.senderName} />
                        <AvatarFallback className="text-xs">{msg.senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`rounded-lg px-3 py-2 ${
                      isOwn 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2 max-w-[70%]">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} />
                    <AvatarFallback className="text-xs">{otherParticipant?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <Input
              ref={inputRef}
              placeholder="Type a message..."
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
