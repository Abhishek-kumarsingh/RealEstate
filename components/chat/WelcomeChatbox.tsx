'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Sparkles, Minimize2, Maximize2 } from 'lucide-react';

export default function WelcomeChatbox() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hi! I'm your AI real estate assistant. I can help you find properties, calculate mortgages, and answer questions about real estate!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Show chatbox after 15-20 seconds (random between 15-20)
  useEffect(() => {
    const delay = Math.random() * 5000 + 15000; // 15-20 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: message,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(message),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // Set new message flag if chatbox is minimized
      if (isMinimized) {
        setHasNewMessages(true);
        setNewMessageCount(prev => prev + 1);
      }
    }, 1500);
  };

  const getBotResponse = (userMessage: string) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('properties under') || msg.includes('find properties')) {
      return "🏠 Great! I found several properties in your budget. Here are some options:\n\n• Modern 3BR House - $450k (Austin, TX)\n• Cozy 2BR Condo - $320k (Dallas, TX)\n• Family Home - $480k (Houston, TX)\n\nWould you like to see more details or filter by location?";
    } else if (msg.includes('calculate mortgage') || msg.includes('mortgage for')) {
      return "💰 For a $300k home with 20% down ($60k):\n\n• Loan Amount: $240k\n• Monthly Payment: ~$1,580\n• Interest Rate: 7.2% (30-year)\n• Property Tax: ~$250/month\n• Insurance: ~$100/month\n\n**Total Monthly: ~$1,930**\n\nWant me to adjust the down payment or loan term?";
    } else if (msg.includes('market trends') || msg.includes('trends in')) {
      return "📈 Current Market Trends:\n\n• Home prices up 3.2% this quarter\n• Average days on market: 28 days\n• Inventory levels: Moderate\n• Best time to buy: Fall/Winter\n• Interest rates: 7.0-7.5%\n\nWhich specific area interests you most?";
    } else if (msg.includes('property') || msg.includes('house') || msg.includes('home')) {
      return "🏠 I can help you find the perfect property! What type are you looking for?\n\n• Houses (Single-family)\n• Condos/Townhomes\n• Apartments (Rental)\n• Commercial Properties\n• Investment Properties\n\nWhat's your preferred location and budget?";
    } else if (msg.includes('price') || msg.includes('cost') || msg.includes('mortgage')) {
      return "💰 I can help with pricing and mortgage calculations! Here's what I can do:\n\n• Calculate monthly payments\n• Estimate closing costs\n• Compare loan options\n• Affordability analysis\n• Property value estimates\n\nWhat's your target price range?";
    } else if (msg.includes('location') || msg.includes('area') || msg.includes('neighborhood')) {
      return "📍 Location is crucial! Popular areas right now:\n\n• Austin, TX - Tech hub, growing market\n• Dallas, TX - Business center, stable prices\n• Houston, TX - Energy sector, affordable\n• San Antonio, TX - Military, family-friendly\n\nWhich city or neighborhood interests you?";
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! 😊 I'm your AI real estate assistant. I can help you with:\n\n🏠 Property searches\n💰 Mortgage calculations\n📈 Market analysis\n📍 Neighborhood insights\n💡 Investment advice\n\nWhat would you like to explore first?";
    } else if (msg.includes('thank') || msg.includes('thanks')) {
      return "You're welcome! 😊 I'm here 24/7 to help with all your real estate needs. Feel free to ask me anything else about properties, mortgages, or market trends!";
    } else {
      return "🤖 I'm here to help with real estate! I can assist with:\n\n• Finding properties in your budget\n• Calculating mortgage payments\n• Market trends and analysis\n• Neighborhood comparisons\n• Investment opportunities\n\nWhat specific information can I help you with?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible) return null;

  // Show floating robot icon when minimized
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div
          className={`
            relative h-14 w-14 rounded-full shadow-2xl transition-all duration-300 transform cursor-pointer
            bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
            hover:scale-110 hover:shadow-3xl flex items-center justify-center
            ${isHovered ? 'animate-pulse' : ''}
          `}
          onClick={() => {
            setIsMinimized(false);
            setHasNewMessages(false);
            setNewMessageCount(0);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <FontAwesomeIcon
            icon={faRobot}
            className={`h-6 w-6 text-white transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}
          />

          {/* Animated pulse ring */}
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>

          {/* Online indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>

          {/* New message indicator */}
          {hasNewMessages && (
            <div className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
              <span className="text-xs font-bold text-white">
                {newMessageCount > 9 ? '9+' : newMessageCount || '!'}
              </span>
            </div>
          )}
        </div>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-16 right-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-in fade-in duration-200">
            Click to open AI Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <Card className="w-80 h-96 shadow-2xl border-2 border-blue-200 transition-all duration-300">
        {/* Header */}
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="rounded-full bg-white/20 p-2">
                  <FontAwesomeIcon icon={faRobot} className="h-4 w-4" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs opacity-90">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-3 w-3" />
                ) : (
                  <Minimize2 className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setIsVisible(false)}
              >
                <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Chat Content */}
        <CardContent className="p-0 flex flex-col h-80">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      msg.isBot
                        ? 'bg-muted text-foreground'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-3 pb-2">
                <div className="text-xs text-muted-foreground mb-2">Quick actions:</div>
                <div className="flex flex-wrap gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => setMessage("Show me properties under $500k")}
                  >
                    🏠 Find Properties
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => setMessage("Calculate mortgage for $300k")}
                  >
                    💰 Mortgage Calc
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => setMessage("Market trends in my area")}
                  >
                    📈 Market Trends
                  </Button>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t p-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Ask me about real estate..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 text-sm"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="h-8 w-8 bg-blue-500 hover:bg-blue-600"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary" className="text-xs">
                  <FontAwesomeIcon icon={faRobot} className="h-3 w-3 mr-1" />
                  No login required
                </Badge>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">Powered by AI</span>
                </div>
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
