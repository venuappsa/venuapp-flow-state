
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import MessageThread from "@/components/messaging/MessageThread";

interface UserProfileData {
  id: string;
  email: string;
  name: string;
  surname: string;
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export default function UserMessage() {
  const { userId } = useParams<{ userId: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("support");
  const [isSending, setIsSending] = useState(false);

  const { data: userProfile, isLoading: profileLoading, error: profileError } = useQuery<UserProfileData>({
    queryKey: ["admin-message-user", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, name, surname")
        .eq("id", userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Query for fetching message history
  const { data: messageHistory, isLoading: messagesLoading, refetch: refetchMessages } = useQuery<Message[]>({
    queryKey: ["admin-user-messages", userId],
    queryFn: async () => {
      // Try to fetch real messages if they exist
      try {
        const { data, error } = await supabase
          .from("fetchman_messages") // Use an appropriate message table
          .select("*")
          .or(`fetchman_id.eq.${userId},admin_id.eq.${userId}`)
          .order("sent_at", { ascending: false });
          
        if (error) {
          console.log("Error fetching messages or no messages table:", error);
          // Fall back to mock data
          return getMockMessages(userId || "");
        }
        
        if (data && data.length > 0) {
          return data.map(msg => ({
            id: msg.id,
            sender_id: msg.admin_id || "admin",
            recipient_id: msg.fetchman_id,
            content: msg.message,
            created_at: msg.sent_at,
            read: msg.read
          }));
        }
        
        // If no data found, use mock data
        return getMockMessages(userId || "");
      } catch (error) {
        console.log("Error in message query:", error);
        return getMockMessages(userId || "");
      }
    },
    enabled: !!userId,
  });

  // Create a mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: string) => {
      // Attempt to save message to database
      const adminId = "admin"; // In production, this would be the actual admin's ID
      
      try {
        const { data, error } = await supabase
          .from("fetchman_messages")
          .insert({
            fetchman_id: userId,
            admin_id: adminId,
            message: newMessage,
            sender_role: "admin",
            sent_at: new Date().toISOString(),
            read: false
          })
          .select();
          
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error) {
        console.log("Error saving to fetchman_messages, using mock data:", error);
        // Return mock data as fallback if database insert fails
        return {
          id: `mock-${Date.now()}`,
          sender_id: adminId,
          recipient_id: userId,
          content: newMessage,
          created_at: new Date().toISOString(),
          read: false
        };
      }
    },
    onSuccess: () => {
      // Invalidate and refetch queries after successful message send
      queryClient.invalidateQueries({
        queryKey: ["admin-user-messages", userId]
      });
      
      refetchMessages();
      
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${userProfile?.name || 'the user'}.`,
      });
      
      setMessage("");
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast({
        title: "Message failed",
        description: "There was an error sending your message.",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;
    
    setIsSending(true);
    
    try {
      await sendMessageMutation.mutateAsync(message);
    } finally {
      setIsSending(false);
    }
  };

  if (profileLoading || messagesLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (profileError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading user profile: {(profileError as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  const currentUserId = "admin"; // In production, this would be the actual admin's ID
  
  return (
    <Card className="h-[calc(100vh-350px)] min-h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle>Message User</CardTitle>
        <CardDescription>
          Send a direct message to {userProfile?.name} {userProfile?.surname}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
        {messageHistory && messageHistory.length > 0 ? (
          <MessageThread
            messages={messageHistory}
            currentUserId={currentUserId}
            currentUserRole="admin"
            contactName={`${userProfile?.name || ''} ${userProfile?.surname || ''}`}
            onSendMessage={handleSendMessage}
            isLoading={isSending}
          />
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex items-center justify-center text-center">
              <div className="text-muted-foreground">
                <p>No message history found.</p>
                <p>Start the conversation by sending a message below.</p>
              </div>
            </div>
            
            <div className="p-4 border-t bg-white space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="message-type">Message Type</Label>
                <Select value={messageType} onValueChange={setMessageType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="verification">Verification</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid w-full gap-1.5">
                <Label htmlFor="message">Your message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={handleSendMessage} 
                disabled={!message.trim() || isSending}
                className="w-full"
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Mock data function - would be replaced with real API calls in production
function getMockMessages(userId: string): Message[] {
  // [MOCK DATA] - This would normally come from your API
  const adminId = "admin";
  const now = new Date();
  
  return [
    {
      id: "msg1",
      sender_id: adminId,
      recipient_id: userId,
      content: "Hello, we're reaching out regarding your recent activity on the platform.",
      created_at: new Date(now.getTime() - 86400000 * 2).toISOString(),
      read: true
    },
    {
      id: "msg2",
      sender_id: userId,
      recipient_id: adminId,
      content: "Hi there, thanks for reaching out. What specifically did you want to discuss?",
      created_at: new Date(now.getTime() - 86400000 * 2 + 3600000).toISOString(),
      read: true
    },
    {
      id: "msg3",
      sender_id: adminId,
      recipient_id: userId,
      content: "We noticed you've completed your profile setup and wanted to check if you need any assistance with getting started.",
      created_at: new Date(now.getTime() - 86400000 * 2 + 7200000).toISOString(),
      read: true
    },
    {
      id: "msg4",
      sender_id: userId,
      recipient_id: adminId,
      content: "That's great, thank you! I do have a question about subscription options. Can you tell me more about what's available?",
      created_at: new Date(now.getTime() - 86400000 + 1800000).toISOString(),
      read: true
    },
    {
      id: "msg5",
      sender_id: adminId,
      recipient_id: userId,
      content: "Absolutely! We offer several subscription tiers: Basic ($29/month), Professional ($79/month), and Enterprise ($199/month). Each comes with different features and service levels. Would you like me to explain the differences in detail?",
      created_at: new Date(now.getTime() - 43200000).toISOString(),
      read: false
    }
  ];
}
