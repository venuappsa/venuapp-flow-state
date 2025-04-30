
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare } from "lucide-react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Message, VendorProfile } from "@/types/vendor";
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
      
      // Get all vendors where there are messages between the current user and the vendor
      const { data: messageData, error: messageError } = await supabase
        .rpc("get_user_messages", { user_id: user.id });
        
      if (messageError) throw messageError;
      
      if (messageData) {
        // Extract unique contact IDs (excluding the current user)
        const uniqueContactIds = [...new Set(
          messageData
            .flatMap(msg => [msg.sender_id, msg.recipient_id])
            .filter(id => id !== user.id)
        )];
        
        if (uniqueContactIds.length > 0) {
          // Get vendor profiles for these user IDs
          const { data: vendorData, error: vendorError } = await supabase
            .from("vendor_profiles")
            .select("*")
            .in("user_id", uniqueContactIds);
            
          if (vendorError) throw vendorError;
          
          // Create contact objects
          const contactsArray: Contact[] = uniqueContactIds.map(contactId => {
            const vendor = vendorData?.find(v => v.user_id === contactId);
            
            // Find the most recent message from/to this contact
            const contactMessages = messageData
              .filter(msg => msg.sender_id === contactId || msg.recipient_id === contactId)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              
            const lastMsg = contactMessages[0];
            const unreadCount = contactMessages.filter(msg => !msg.is_read && msg.recipient_id === user.id).length;
            
            return {
              id: vendor?.id || contactId,
              userId: contactId,
              name: vendor?.business_name || vendor?.company_name || "Vendor",
              role: "vendor",
              lastMessage: lastMsg?.content || "No messages yet",
              lastMessageTime: lastMsg ? formatMessageTime(lastMsg.created_at) : "-",
              unread: unreadCount,
              avatar: vendor?.logo_url
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
        .rpc("get_user_messages", { user_id: user.id });
        
      if (error) throw error;
      
      // Filter messages that are between the current user and the selected contact
      const filteredMessages = data.filter(
        (msg: Message) => 
          (msg.sender_id === user.id && msg.recipient_id === contactId) || 
          (msg.sender_id === contactId && msg.recipient_id === user.id)
      );
      
      setMessages(filteredMessages as Message[]);
      
      // Mark messages as read
      const messagesToMarkAsRead = filteredMessages.filter(
        (msg: Message) => !msg.is_read && msg.recipient_id === user.id
      );
      
      if (messagesToMarkAsRead.length > 0) {
        await Promise.all(messagesToMarkAsRead.map((msg: Message) => 
          supabase
            .from("messages_read_status")
            .insert({ message_id: msg.id, user_id: user.id })
        ));
      }
        
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
        sender_role: "host",
        recipient_role: "vendor",
        content,
        is_read: false
      };
      
      const { data, error } = await supabase
        .rpc("send_message", newMessage);
        
      if (error) throw error;
      
      // Refresh messages
      fetchMessages(selectedContact.userId);
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully"
      });
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
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Vendor Messages</h1>
        <p className="text-gray-500 mb-6">Communicate with your vendors</p>
        
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
                          {contact.avatar ? (
                            <AvatarImage src={contact.avatar} />
                          ) : (
                            <AvatarFallback>
                              {contact.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
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
                      When you message vendors, they'll appear here
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
                        {selectedContact.avatar ? (
                          <AvatarImage src={selectedContact.avatar} />
                        ) : (
                          <AvatarFallback>
                            {selectedContact.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h2 className="font-medium text-sm">{selectedContact.name}</h2>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          Vendor
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/host/vendors?id=${selectedContact.id}`}>
                        View Profile
                      </a>
                    </Button>
                  </div>
                  
                  {/* Message Thread */}
                  {user && (
                    <MessageThread
                      messages={messages}
                      currentUserId={user.id}
                      currentUserRole="host"
                      contactName={selectedContact.name}
                      contactAvatar={selectedContact.avatar}
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
                    Choose a vendor from the left to view your conversation
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </HostPanelLayout>
  );
}
