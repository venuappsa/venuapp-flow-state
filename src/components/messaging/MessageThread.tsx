
import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Message } from "@/types/vendor";

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  currentUserRole: string;
  contactName: string;
  contactAvatar?: string;
  onSendMessage: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export default function MessageThread({
  messages,
  currentUserId,
  currentUserRole,
  contactName,
  contactAvatar,
  onSendMessage,
  isLoading = false,
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await onSendMessage(newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};
  messages.forEach(message => {
    const date = formatDate(message.created_at);
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex justify-center my-4">
              <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600">
                {date}
              </div>
            </div>
            
            {dateMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === currentUserId ? "justify-end" : "justify-start"
                } mb-4`}
              >
                {message.sender_id !== currentUserId && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    {contactAvatar ? (
                      <AvatarImage src={contactAvatar} />
                    ) : (
                      <AvatarFallback>
                        {getInitials(contactName)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    message.sender_id === currentUserId
                      ? "bg-venu-orange text-white"
                      : "bg-white border"
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender_id === currentUserId
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.created_at)}
                  </p>
                </div>
                
                {message.sender_id === currentUserId && (
                  <Avatar className="h-8 w-8 ml-2 mt-1">
                    <AvatarFallback>
                      {currentUserRole === "host" ? "H" : "V"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-10 resize-none"
          />
          <Button 
            onClick={handleSendMessage} 
            className="self-end" 
            disabled={isLoading || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
