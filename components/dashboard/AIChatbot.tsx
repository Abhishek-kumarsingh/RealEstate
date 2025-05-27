'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send, Mic, Volume2, Calculator, Home, TrendingUp, Calendar,
  Sparkles, Zap, Star, Loader2, AlertCircle, MessageSquare
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faCog, faCircle, faMicrochip } from '@fortawesome/free-solid-svg-icons';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI real estate assistant powered by Google Gemini. I can help you with property searches, market analysis, mortgage calculations, and scheduling tours. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
      suggestions: ['Find properties', 'Calculate mortgage', 'Market analysis', 'Schedule tour']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, context: 'Real estate assistance' }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: data.suggestions || []
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setError('Sorry, I encountered an error. Please try again.');

      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to help with real estate questions! I can assist with property searches, market analysis, mortgage calculations, and scheduling tours. What would you like to know?",
        sender: 'ai',
        timestamp: new Date(),
        suggestions: ['Find properties', 'Calculate mortgage', 'Market analysis', 'Schedule tour']
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { icon: Calculator, label: 'Mortgage Calculator', color: 'bg-blue-100 text-blue-600', action: 'Help me calculate mortgage payments' },
    { icon: Home, label: 'Find Properties', color: 'bg-green-100 text-green-600', action: 'I want to search for properties' },
    { icon: TrendingUp, label: 'Market Analysis', color: 'bg-purple-100 text-purple-600', action: 'Show me market analysis' },
    { icon: Calendar, label: 'Schedule Tour', color: 'bg-orange-100 text-orange-600', action: 'I want to schedule a property tour' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-3 text-white shadow-lg">
          <FontAwesomeIcon icon={faRobot} className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">AI Assistant</h2>
            <FontAwesomeIcon icon={faMicrochip} className="h-5 w-5 text-blue-500" />
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
              Powered by Google AI
            </Badge>
          </div>
          <p className="text-muted-foreground">24/7 intelligent support with advanced ML capabilities</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <FontAwesomeIcon icon={faRobot} className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <FontAwesomeIcon icon={faCog} className="h-2 w-2 text-white animate-spin" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">RealEstate AI</CardTitle>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">
                      {isLoading ? 'Thinking...' : 'Online & Ready'}
                    </span>
                    {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[400px] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.suggestions.map((suggestion, index) => (
                            <Button key={index} variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleSendMessage(suggestion)}>
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t bg-muted/20">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" title="Voice input">
                  <Mic className="h-4 w-4" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    placeholder={isLoading ? "AI is thinking..." : "Ask me anything about real estate..."}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleSendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              {!isLoading && inputMessage === '' && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Find properties', 'Calculate mortgage', 'Market trends', 'Investment advice'].map((suggestion) => (
                    <Button key={suggestion} variant="outline" size="sm" className="h-7 text-xs bg-white hover:bg-muted" onClick={() => handleSendMessage(suggestion)}>
                      <Sparkles className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Get instant help with common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button key={index} variant="outline" className="w-full justify-start h-auto p-3 hover:shadow-md transition-all duration-200" onClick={() => handleSendMessage(action.action)}>
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${action.color}`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{action.label}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FontAwesomeIcon icon={faMicrochip} className="h-5 w-5 text-blue-600" />
                AI Performance
              </CardTitle>
              <CardDescription>Real-time AI metrics powered by Google Gemini</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{'< 2s'}</div>
                  <div className="text-xs text-muted-foreground">Response Time</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-xs text-muted-foreground">Accuracy Rate</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">AI Model:</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">Google Gemini Pro</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Availability:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">24/7 Online</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
