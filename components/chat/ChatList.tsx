'use client';

import { useChat } from '@/lib/contexts/ChatContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  MessageCircle, 
  Circle,
  Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface ChatListProps {
  onChatSelect?: () => void;
  className?: string;
}

export default function ChatList({ onChatSelect, className }: ChatListProps) {
  const { chats, activeChat, setActiveChat } = useChat();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    
    const otherParticipant = chat.participants.find(p => p.id !== user?.email && p.name !== user?.name);
    return (
      otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleChatSelect = (chat: any) => {
    setActiveChat(chat);
    onChatSelect?.();
  };

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
          </CardTitle>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          {filteredChats.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">No conversations</h3>
                <p className="text-sm">Start a conversation by contacting an agent</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredChats.map((chat) => {
                const otherParticipant = chat.participants.find(p => p.id !== user?.email && p.name !== user?.name);
                const isActive = activeChat?.id === chat.id;
                
                return (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelect(chat)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      isActive ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} />
                          <AvatarFallback>{otherParticipant?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {otherParticipant?.online && (
                          <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {otherParticipant?.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {chat.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(chat.lastMessage.timestamp, { addSuffix: true })}
                              </span>
                            )}
                            {chat.unreadCount > 0 && (
                              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {otherParticipant?.role}
                          </Badge>
                          {otherParticipant?.online && (
                            <span className="text-xs text-green-600">Online</span>
                          )}
                        </div>
                        
                        {chat.propertyTitle && (
                          <div className="mt-1">
                            <span className="text-xs text-muted-foreground">
                              📍 {chat.propertyTitle}
                            </span>
                          </div>
                        )}
                        
                        {chat.lastMessage && (
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {chat.lastMessage.senderId === user?.email || chat.lastMessage.senderName === user?.name 
                              ? 'You: ' 
                              : ''
                            }
                            {chat.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
