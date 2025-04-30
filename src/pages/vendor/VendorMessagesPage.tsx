
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare } from "lucide-react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Message } from "@/types/vendor";
import MessageThread from "@/components/messaging/MessageThread";
import { useToast } from "@/components/ui/use-toast";

interface Contact {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  avatar?: string;
  userId: string;
}

export default function VendorMessagesPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.userId);
    }
  }, [selectedContact]);

  const fetchContacts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get all hosts where there are messages between the current user and the host
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
        
      if (messageError) throw messageError;
      
      if (messageData && messageData.length > 0) {
        // Extract unique contact IDs (excluding the current user)
        const uniqueContactIds = [...new Set(
          messageData
            .flatMap(msg => [msg.sender_id, msg.recipient_id])
            .filter(id => id !== user.id)
        )];
        
        if (uniqueContactIds.length > 0) {
          // Get host profiles for these user IDs
          const { data: hostData, error: hostError } = await supabase
            .from("host_profiles")
            .select("*")
            .in("user_id", uniqueContactIds);
            
          if (hostError) throw hostError;
          
          // Create contact objects
          const contactsArray: Contact[] = uniqueContactIds.map(contactId => {
            const host = hostData?.find(h => h.user_id === contactId);
            
            // Find the most recent message from/to this contact
            const contactMessages = messageData
              .filter(msg => msg.sender_id === contactId || msg.recipient_id === contactId)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              
            const lastMsg = contactMessages[0];
            const unreadCount = contactMessages.filter(msg => !msg.is_read && msg.recipient_id === user.id).length;
            
            return {
              id: host?.id || contactId,
              userId: contactId,
              name: host?.company_name || "Host",
              role: "host",
              lastMessage: lastMsg?.content || "No messages yet",
              lastMessageTime: lastMsg ? formatMessageTime(lastMsg.created_at) : "-",
              unread: unreadCount
            };
          });
          
          setContacts(contactsArray);
          
          // If there are contacts, select the first one
          if (contactsArray.length > 0 && !selectedContact) {
            setSelectedContact(contactsArray[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Error",
        description: "Failed to load messaging contacts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId: string) => {
    if (!user || !contactId) return;
    
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${user.id})`)
        .order("created_at", { ascending: true });
        
      if (error) throw error;
      
      setMessages(data as Message[]);
      
      // Mark messages as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("recipient_id", user.id)
        .eq("sender_id", contactId);
        
      // Update unread count for this contact
      setContacts(current =>
        current.map(c =>
          c.userId === contactId
            ? { ...c, unread: 0 }
            : c
        )
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || !selectedContact) return;
    
    try {
      setSending(true);
      
      const newMessage = {
        sender_id: user.id,
        recipient_id: selectedContact.userId,
        sender_role: "vendor",
        recipient_role: "host",
        content,
        is_read: false
      };
      
      const { data, error } = await supabase
        .from("messages")
        .insert(newMessage)
        .select();
        
      if (error) throw error;
      
      // Update messages list with the new message
      setMessages(current => [...current, data[0] as Message]);
      
      // Update the contact's last message
      setContacts(current =>
        current.map(c =>
          c.userId === selectedContact.userId
            ? {
                ...c,
                lastMessage: content,
                lastMessageTime: "Just now"
              }
            : c
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <VendorPanelLayout>
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Host Messages</h1>
        <p className="text-gray-500 mb-6">Communicate with hosts regarding events and services</p>
        
        <div className="bg-white border rounded-lg overflow-hidden h-[calc(80vh-8rem)]">
          <div className="flex h-full">
            {/* Contacts List */}
            <div className="w-full sm:w-1/3 md:w-1/4 border-r">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="h-[calc(100%-73px)] overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-venu-orange"></div>
                  </div>
                ) : filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedContact?.userId === contact.userId ? "bg-gray-50" : ""
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {contact.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {contact.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {contact.lastMessageTime}
                            </p>
                          </div>
                          <div className="flex mt-1 justify-between">
                            <p className="text-xs text-gray-500 truncate">
                              {contact.lastMessage}
                            </p>
                            {contact.unread > 0 && (
                              <Badge className="h-5 w-5 flex items-center justify-center rounded-full p-0 bg-venu-orange text-white">
                                {contact.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                    <h3 className="text-gray-500">No messages yet</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      When hosts message you, they'll appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Messages */}
            <div className="hidden sm:flex sm:w-2/3 md:w-3/4 flex-col">
              {selectedContact ? (
                <>
                  <div className="border-b p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>
                          {selectedContact.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-medium text-sm">{selectedContact.name}</h2>
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          Host
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message Thread */}
                  {user && (
                    <MessageThread
                      messages={messages}
                      currentUserId={user.id}
                      currentUserRole="vendor"
                      contactName={selectedContact.name}
                      onSendMessage={sendMessage}
                      isLoading={sending}
                    />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Choose a host from the left to view your conversation
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </VendorPanelLayout>
  );
}
