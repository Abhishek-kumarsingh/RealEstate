'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faComments, faTimes, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { Sparkles, MessageSquare, X, Zap } from 'lucide-react';

interface FloatingChatbotButtonProps {
  onOpenChat?: () => void;
}

export default function FloatingChatbotButton({ onOpenChat }: FloatingChatbotButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleClick = () => {
    if (onOpenChat) {
      onOpenChat();
    } else {
      // Default behavior - could navigate to chat page or open modal
      window.location.href = '/dashboard?tab=ai-assistant';
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {showPreview && (
          <Card className="absolute bottom-16 right-0 w-80 shadow-2xl border-2 border-blue-200 animate-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-2 text-white">
                      <FontAwesomeIcon icon={faRobot} className="h-4 w-4" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <CardTitle className="text-sm">AI Assistant</CardTitle>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">Online</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowPreview(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm">
                    👋 Hi! I'm your AI real estate assistant. I can help you with:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>• Property searches & recommendations</li>
                    <li>• Market analysis & trends</li>
                    <li>• Mortgage calculations</li>
                    <li>• Investment advice</li>
                  </ul>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    <FontAwesomeIcon icon={faMicrochip} className="h-3 w-3 mr-1" />
                    Powered by Google AI
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    24/7 Available
                  </Badge>
                </div>
                <Button
                  onClick={handleClick}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  size="sm"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Chatting
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={() => setShowPreview(!showPreview)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative h-14 w-14 rounded-full shadow-2xl transition-all duration-300 transform
            bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
            hover:scale-110 hover:shadow-3xl
            ${isHovered ? 'animate-pulse' : ''}
            ${showPreview ? 'rotate-180' : ''}
          `}
          size="icon"
        >
          {showPreview ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <>
              <FontAwesomeIcon
                icon={faRobot}
                className={`h-6 w-6 text-white transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}
              />
              {/* Animated pulse ring */}
              <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>

              {/* Online indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <Zap className="h-2 w-2 text-white" />
              </div>

              {/* Notification badge */}
              <div className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                <span className="text-xs font-bold text-white">!</span>
              </div>
            </>
          )}
        </Button>

        {/* Tooltip */}
        {isHovered && !showPreview && (
          <div className="absolute bottom-16 right-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-in fade-in duration-200">
            Chat with AI Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
          </div>
        )}
      </div>

      {/* Background overlay when preview is open */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowPreview(false)}
        />
      )}
    </>
  );
}

// Alternative compact version for smaller screens
export function CompactChatbotButton({ onOpenChat }: FloatingChatbotButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onOpenChat) {
      onOpenChat();
    } else {
      window.location.href = '/dashboard?tab=ai-assistant';
    }
  };

  return (
    <Button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative h-12 w-12 rounded-full shadow-lg transition-all duration-300
        bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
        hover:scale-105 hover:shadow-xl
        ${isHovered ? 'animate-pulse' : ''}
      `}
      size="icon"
    >
      <FontAwesomeIcon
        icon={faRobot}
        className={`h-5 w-5 text-white transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}
      />

      {/* Online indicator */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
    </Button>
  );
}

// Chat button for navigation/header
export function HeaderChatbotButton({ onOpenChat }: FloatingChatbotButtonProps) {
  const handleClick = () => {
    if (onOpenChat) {
      onOpenChat();
    } else {
      window.location.href = '/dashboard?tab=ai-assistant';
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="relative bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-300"
    >
      <FontAwesomeIcon icon={faRobot} className="h-4 w-4 mr-2 text-blue-600" />
      <span className="hidden sm:inline">AI Assistant</span>
      <span className="sm:hidden">AI</span>

      {/* Online indicator */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>

      {/* New feature badge */}
      <Badge variant="secondary" className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0 h-4 min-w-4 rounded-full">
        AI
      </Badge>
    </Button>
  );
}
