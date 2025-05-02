
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import MessageThread from "@/components/messaging/MessageThread";
import { Message } from "@/types/vendor";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare } from "lucide-react";

export default function EventMessaging() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useUser();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEventMessages();
    }
  }, [user, eventId]);

  const fetchEventMessages = async () => {
    setLoading(true);
    
    // Mock data for event messages
    const mockMessages: Message[] = [
      {
        id: "1",
        sender_id: user?.id || "host-id",
        recipient_id: "vendor-id-1",
        content: "Hi there, can we discuss your setup time for the event?",
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
        read: true,
        is_read: true,
        sender_role: "host",
        recipient_role: "vendor"
      },
      {
        id: "2",
        sender_id: "vendor-id-1",
        recipient_id: user?.id || "host-id",
        content: "Sure! I can be there 3 hours before to set up. Would that work?",
        created_at: new Date(Date.now() - 3600000 * 47).toISOString(),
        read: true,
        is_read: true,
        sender_role: "vendor",
        recipient_role: "host"
      },
      {
        id: "3",
        sender_id: user?.id || "host-id",
        recipient_id: "vendor-id-1",
        content: "That works perfectly. Thanks for confirming.",
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        read: true,
        is_read: true,
        sender_role: "host",
        recipient_role: "vendor"
      }
    ];
    
    setMessages(mockMessages);
    setLoading(false);
  };

  const handleSendMessage = (content: string) => {
    if (!user || !content.trim()) return;
    
    setSending(true);
    
    setTimeout(() => {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender_id: user.id,
        recipient_id: "vendor-id-1",
        content: content,
        created_at: new Date().toISOString(),
        read: false,
        is_read: false,
        sender_role: "host",
        recipient_role: "vendor"
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully",
      });
      
      setSending(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Event Messages</h1>
        <p className="text-gray-500">Communicate with vendors for this event</p>
      </div>
      
      <Card className="overflow-hidden h-[70vh]">
        {user ? (
          <MessageThread
            messages={messages}
            currentUserId={user.id}
            currentUserRole="host"
            contactName="Event Vendors"
            onSendMessage={handleSendMessage}
            isLoading={sending}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
            <h3 className="text-lg font-medium text-gray-700">Sign in to view messages</h3>
            <p className="text-sm text-gray-500">You need to be signed in to access messaging features</p>
          </div>
        )}
      </Card>
    </div>
  );
}
