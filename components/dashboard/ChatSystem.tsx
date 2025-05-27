'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, Send, Phone, Video, Paperclip, 
  MoreVertical, Search, Users, Clock, CheckCheck
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
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
    role: 'agent' | 'buyer' | 'seller';
    online: boolean;
  }[];
  lastMessage: Message;
  unreadCount: number;
  propertyId?: string;
  propertyTitle?: string;
}

const mockChats: Chat[] = [
  {
    id: '1',
    participants: [
      { id: '1', name: 'Sarah Johnson', role: 'buyer', online: true },
      { id: '2', name: 'Mike Chen', avatar: '/avatars/mike.jpg', role: 'agent', online: true }
    ],
    lastMessage: {
      id: '1',
      senderId: '1',
      senderName: 'Sarah Johnson',
      content: 'Is the property still available for viewing this weekend?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text',
      read: false
    },
    unreadCount: 2,
    propertyId: 'prop1',
    propertyTitle: 'Modern Downtown Loft'
  },
  {
    id: '2',
    participants: [
      { id: '3', name: 'David Miller', role: 'seller', online: false },
      { id: '2', name: 'Mike Chen', avatar: '/avatars/mike.jpg', role: 'agent', online: true }
    ],
    lastMessage: {
      id: '2',
      senderId: '3',
      senderName: 'David Miller',
      content: 'Thanks for the market analysis. When can we schedule the listing photos?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text',
      read: true
    },
    unreadCount: 0,
    propertyId: 'prop2',
    propertyTitle: 'Luxury Family Home'
  },
  {
    id: '3',
    participants: [
      { id: '4', name: 'Emma Wilson', role: 'buyer', online: true },
      { id: '2', name: 'Mike Chen', avatar: '/avatars/mike.jpg', role: 'agent', online: true }
    ],
    lastMessage: {
      id: '3',
      senderId: '2',
      senderName: 'Mike Chen',
      content: 'I\'ve sent you the mortgage pre-approval documents.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: 'document',
      read: true
    },
    unreadCount: 0,
    propertyId: 'prop3',
    propertyTitle: 'Suburban Family Home'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'Sarah Johnson',
    content: 'Hi Mike, I\'m interested in the downtown loft listing.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'text',
    read: true
  },
  {
    id: '2',
    senderId: '2',
    senderName: 'Mike Chen',
    content: 'Great! I\'d be happy to help. The property has some amazing features. Would you like to schedule a viewing?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
    type: 'text',
    read: true
  },
  {
    id: '3',
    senderId: '1',
    senderName: 'Sarah Johnson',
    content: 'Yes, that would be perfect. What times are available this weekend?',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    type: 'text',
    read: true
  },
  {
    id: '4',
    senderId: '2',
    senderName: 'Mike Chen',
    content: 'I have Saturday at 2 PM and Sunday at 10 AM available. Which works better for you?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'text',
    read: true
  },
  {
    id: '5',
    senderId: '1',
    senderName: 'Sarah Johnson',
    content: 'Is the property still available for viewing this weekend?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'text',
    read: false
  }
];

export default function ChatSystem() {
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredChats = mockChats.filter(chat =>
    chat.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || 
    (chat.propertyTitle && chat.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedChatData = mockChats.find(chat => chat.id === selectedChat);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <MessageCircle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Real-time Chat System</h2>
          <p className="text-muted-foreground">
            Communicate with agents, buyers, and sellers in real-time
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Messages</CardTitle>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[480px]">
              <div className="space-y-1 p-3">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat === chat.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={chat.participants[0].avatar} />
                          <AvatarFallback>
                            {chat.participants[0].name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {chat.participants[0].online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">
                            {chat.participants[0].name}
                          </p>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(chat.lastMessage.timestamp)}
                            </span>
                            {chat.unreadCount > 0 && (
                              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {chat.propertyTitle && (
                          <p className="text-xs text-muted-foreground truncate">
                            Re: {chat.propertyTitle}
                          </p>
                        )}
                        
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {chat.lastMessage.type === 'document' ? '📎 Document' : chat.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          {selectedChatData ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedChatData.participants[0].avatar} />
                      <AvatarFallback>
                        {selectedChatData.participants[0].name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedChatData.participants[0].name}</h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          selectedChatData.participants[0].online ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-sm text-muted-foreground">
                          {selectedChatData.participants[0].online ? 'Online' : 'Offline'}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {selectedChatData.participants[0].role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
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
                </div>
                
                {selectedChatData.propertyTitle && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">Property Discussion</p>
                    <p className="text-sm text-muted-foreground">{selectedChatData.propertyTitle}</p>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {mockMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === '2' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${
                          msg.senderId === '2' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        } rounded-lg p-3`}>
                          <p className="text-sm">{msg.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {formatTime(msg.timestamp)}
                            </span>
                            {msg.senderId === '2' && (
                              <CheckCheck className={`h-3 w-3 ${msg.read ? 'text-blue-400' : 'opacity-50'}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!message.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a chat from the list to start messaging
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Active Conversations</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 text-green-600">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Messages Today</p>
                <p className="text-2xl font-bold">47</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2 text-orange-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Avg Response Time</p>
                <p className="text-2xl font-bold">5m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
