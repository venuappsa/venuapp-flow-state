
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Send, Search } from "lucide-react";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  timestamp: string;
  read: boolean;
  sender_name?: string;
  sender_avatar?: string;
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  status: "online" | "offline" | "away";
  role: string;
}

export default function FetchmanMessagesPage() {
  const { user } = useUser();
  const [fetchmanProfile, setFetchmanProfile] = useState<any>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState({
    profile: true,
    contacts: true,
    messages: false,
  });

  useEffect(() => {
    const fetchFetchmanProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('fetchman_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching fetchman profile:", error);
          return;
        }
        
        setFetchmanProfile(data);
      } catch (err) {
        console.error("Error in fetchFetchmanProfile:", err);
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }
    };
    
    fetchFetchmanProfile();
  }, [user]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!fetchmanProfile) return;
      
      try {
        // In a real app, we would fetch from a contacts or conversations table
        // For now, we'll use mock data
        const mockContacts: Contact[] = [
          {
            id: "support-1",
            name: "Venu Support",
            avatar: "/lovable-uploads/00295b81-909c-4b6d-b67d-6638afdd5ba3.png",
            last_message: "How can I help you today?",
            last_message_time: new Date().toISOString(),
            unread_count: 0,
            status: "online",
            role: "support"
          },
          {
            id: "host-1",
            name: "Jane Smith",
            avatar: "/lovable-uploads/5764a894-257e-4259-8705-fb644012ef15.png",
            last_message: "Thanks for delivering to our event yesterday!",
            last_message_time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            unread_count: 2,
            status: "online",
            role: "host"
          },
          {
            id: "vendor-1",
            name: "Delicious Delights",
            avatar: "/lovable-uploads/9dcd780e-610c-4ec1-8768-c28c01583e44.png",
            last_message: "Please ensure the food is kept hot during delivery.",
            last_message_time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            unread_count: 0,
            status: "offline",
            role: "vendor"
          },
          {
            id: "admin-1",
            name: "System Administrator",
            avatar: "/lovable-uploads/9398a69c-8a46-4dd6-892d-204e4fe5a8ef.png",
            last_message: "Your account has been verified successfully.",
            last_message_time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            unread_count: 0,
            status: "away",
            role: "admin"
          },
        ];
        
        setContacts(mockContacts);
        
        // Auto-select the first contact if none is selected
        if (!selectedContact && mockContacts.length > 0) {
          setSelectedContact(mockContacts[0]);
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
      } finally {
        setLoading(prev => ({ ...prev, contacts: false }));
      }
    };
    
    fetchContacts();
  }, [fetchmanProfile, selectedContact]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedContact) return;
      
      setLoading(prev => ({ ...prev, messages: true }));
      
      try {
        // In a real app, we would fetch messages from a database
        // For now, we'll use mock data based on the selected contact
        const mockMessages: Message[] = [];
        
        if (selectedContact.id === "support-1") {
          mockMessages.push(
            {
              id: "msg-1",
              sender_id: "support-1",
              recipient_id: user?.id || "",
              content: "Hello! Welcome to Venu's Fetchman service. How can I assist you today?",
              timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              read: true,
              sender_name: "Venu Support"
            },
            {
              id: "msg-2",
              sender_id: user?.id || "",
              recipient_id: "support-1",
              content: "Hi, I'm having trouble understanding how the payment system works.",
              timestamp: new Date(Date.now() - 3540000).toISOString(), // 59 minutes ago
              read: true
            },
            {
              id: "msg-3",
              sender_id: "support-1",
              recipient_id: user?.id || "",
              content: "I'd be happy to explain! As a Fetchman, you'll earn money for each delivery you complete. The payment is calculated based on distance, time, and complexity of the delivery. You can withdraw your earnings from your account once they've been processed, which typically happens every week.",
              timestamp: new Date(Date.now() - 3480000).toISOString(), // 58 minutes ago
              read: true,
              sender_name: "Venu Support"
            }
          );
        } else if (selectedContact.id === "host-1") {
          mockMessages.push(
            {
              id: "msg-4",
              sender_id: "host-1",
              recipient_id: user?.id || "",
              content: "Hi there! I wanted to thank you for your excellent service at our event yesterday. Everything arrived on time and in perfect condition.",
              timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              read: true,
              sender_name: "Jane Smith"
            },
            {
              id: "msg-5",
              sender_id: user?.id || "",
              recipient_id: "host-1",
              content: "You're welcome! I'm glad everything went smoothly. It was a pleasure working with your team.",
              timestamp: new Date(Date.now() - 85800000).toISOString(), // 23 hours 50 minutes ago
              read: true
            },
            {
              id: "msg-6",
              sender_id: "host-1",
              recipient_id: user?.id || "",
              content: "We have another event coming up next month. Would you be interested in handling deliveries for that as well?",
              timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              read: false,
              sender_name: "Jane Smith"
            },
            {
              id: "msg-7",
              sender_id: "host-1",
              recipient_id: user?.id || "",
              content: "The event will be similar to yesterday's but with more attendees.",
              timestamp: new Date(Date.now() - 3540000).toISOString(), // 59 minutes ago
              read: false,
              sender_name: "Jane Smith"
            }
          );
        } else if (selectedContact.id === "vendor-1") {
          mockMessages.push(
            {
              id: "msg-8",
              sender_id: "vendor-1",
              recipient_id: user?.id || "",
              content: "Hello! I have a delivery scheduled for tomorrow. I want to make sure you have all the details.",
              timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
              read: true,
              sender_name: "Delicious Delights"
            },
            {
              id: "msg-9",
              sender_id: user?.id || "",
              recipient_id: "vendor-1",
              content: "Hi! Yes, I've received the assignment. What specific details should I be aware of?",
              timestamp: new Date(Date.now() - 172740000).toISOString(), // 1 day 23 hours 59 minutes ago
              read: true
            },
            {
              id: "msg-10",
              sender_id: "vendor-1",
              recipient_id: user?.id || "",
              content: "Please ensure the food is kept hot during delivery. We're providing thermal bags, but they need to be handled carefully. Also, there's a specific entrance at the venue - I'll send instructions.",
              timestamp: new Date(Date.now() - 172680000).toISOString(), // 1 day 23 hours 58 minutes ago
              read: true,
              sender_name: "Delicious Delights"
            },
            {
              id: "msg-11",
              sender_id: user?.id || "",
              recipient_id: "vendor-1",
              content: "Got it. I'll make sure to handle everything properly. Looking forward to the detailed instructions.",
              timestamp: new Date(Date.now() - 172620000).toISOString(), // 1 day 23 hours 57 minutes ago
              read: true
            }
          );
        } else if (selectedContact.id === "admin-1") {
          mockMessages.push(
            {
              id: "msg-12",
              sender_id: "admin-1",
              recipient_id: user?.id || "",
              content: "Hello, this is an automated message from the Venu system. Your Fetchman account has been successfully verified. You can now accept delivery assignments.",
              timestamp: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
              read: true,
              sender_name: "System Administrator"
            },
            {
              id: "msg-13",
              sender_id: "admin-1",
              recipient_id: user?.id || "",
              content: "Please ensure your availability is kept up to date in the system to receive appropriate assignments.",
              timestamp: new Date(Date.now() - 604740000).toISOString(), // 6 days 23 hours 59 minutes ago
              read: true,
              sender_name: "System Administrator"
            },
            {
              id: "msg-14",
              sender_id: user?.id || "",
              recipient_id: "admin-1",
              content: "Thank you for the verification. I've updated my availability and look forward to receiving assignments.",
              timestamp: new Date(Date.now() - 604680000).toISOString(), // 6 days 23 hours 58 minutes ago
              read: true
            }
          );
        }
        
        setMessages(mockMessages);
        
        // Mark messages as read
        if (selectedContact.unread_count > 0) {
          setContacts(prev => 
            prev.map(contact => 
              contact.id === selectedContact.id 
                ? { ...contact, unread_count: 0 } 
                : contact
            )
          );
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(prev => ({ ...prev, messages: false }));
      }
    };
    
    fetchMessages();
  }, [selectedContact, user?.id]);

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact || !user?.id) return;
    
    const newMessageObj: Message = {
      id: `msg-${Date.now()}`,
      sender_id: user.id,
      recipient_id: selectedContact.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Add message to the list
    setMessages(prev => [...prev, newMessageObj]);
    
    // Clear input
    setNewMessage("");
    
    // In a real app, we would send to the database here
    console.log("Sending message:", newMessageObj);
    
    // Simulate response for demo purposes
    if (selectedContact.id === "support-1") {
      setTimeout(() => {
        const responseMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          sender_id: "support-1",
          recipient_id: user.id,
          content: "Thank you for your message! Our support team will get back to you shortly.",
          timestamp: new Date().toISOString(),
          read: false,
          sender_name: "Venu Support"
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 1000);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    const isToday = date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).getDate() === date.getDate() &&
                         new Date(now.setDate(now.getDate())).getMonth() === date.getMonth() &&
                         new Date(now.setDate(now.getDate())).getFullYear() === date.getFullYear();
    
    if (isYesterday) {
      return "Yesterday";
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredContacts = searchQuery 
    ? contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-16rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>
      
      <Card className="flex flex-col flex-1 overflow-hidden">
        <div className="grid grid-cols-12 h-full">
          {/* Contacts sidebar */}
          <div className="col-span-12 md:col-span-4 border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="h-[calc(100vh-20rem)] overflow-y-auto">
              {loading.profile || loading.contacts ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading conversations...</p>
                </div>
              ) : filteredContacts.length > 0 ? (
                <div className="divide-y">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`flex items-start p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedContact?.id === contact.id ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 rounded-full w-3 h-3 ${
                          contact.status === 'online' ? 'bg-green-500' :
                          contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                        } border-2 border-white`}></span>
                      </div>
                      <div className="flex-1 ml-3">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-sm">{contact.name}</h3>
                          <span className="text-xs text-gray-500">
                            {contact.last_message_time && formatTime(contact.last_message_time)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{contact.last_message}</p>
                      </div>
                      {contact.unread_count > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unread_count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No conversations found</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Conversation area */}
          <div className="col-span-12 md:col-span-8 flex flex-col h-full">
            {selectedContact ? (
              <>
                {/* Contact header */}
                <div className="p-4 border-b flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback>{selectedContact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h2 className="font-medium">{selectedContact.name}</h2>
                    <p className="text-xs text-gray-500">
                      {selectedContact.role.charAt(0).toUpperCase() + selectedContact.role.slice(1)}
                    </p>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  {loading.messages ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Loading messages...</p>
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isOwnMessage = message.sender_id === user?.id;
                        return (
                          <div 
                            key={message.id} 
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="flex items-start max-w-[75%]">
                              {!isOwnMessage && (
                                <Avatar className="h-8 w-8 mr-2 mt-1">
                                  <AvatarImage src={selectedContact.avatar} />
                                  <AvatarFallback>
                                    {message.sender_name?.substring(0, 2).toUpperCase() || 'UN'}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div>
                                <div 
                                  className={`p-3 rounded-lg ${
                                    isOwnMessage 
                                      ? 'bg-blue-500 text-white rounded-br-none' 
                                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatTime(message.timestamp)}
                                  {isOwnMessage && (
                                    <span className="ml-1">{message.read ? '✓✓' : '✓'}</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No messages yet</p>
                    </div>
                  )}
                </div>
                
                {/* Message input */}
                <div className="p-4 border-t">
                  <div className="flex">
                    <Input
                      placeholder="Type a message..."
                      className="flex-1 mr-2"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-xl font-medium text-gray-700 mb-2">No conversation selected</h2>
                  <p className="text-gray-500">Choose a conversation from the list</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
