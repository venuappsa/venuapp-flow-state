
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Send, User, UserPlus, Filter, ChevronRight } from "lucide-react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";

interface Message {
  id: string;
  content: string;
  sender: string;
  senderRole: "host" | "vendor" | "guest" | "fetchman" | "support";
  sentAt: string;
  read: boolean;
  avatar?: string;
}

interface Conversation {
  id: string;
  name: string;
  role: "vendor" | "guest" | "fetchman" | "support";
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "c1",
      name: "John Smith",
      role: "vendor",
      lastMessage: "When should I arrive to set up my stall?",
      lastMessageTime: "30 min ago",
      unread: 1,
    },
    {
      id: "c2",
      name: "Support Team",
      role: "support",
      avatar: "/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png",
      lastMessage: "Your ticket #4532 has been resolved",
      lastMessageTime: "1 day ago",
      unread: 0,
    },
    {
      id: "c3",
      name: "Sarah Wilson",
      role: "guest",
      lastMessage: "Is there vegetarian food available?",
      lastMessageTime: "2 hours ago",
      unread: 2,
    },
    {
      id: "c4",
      name: "Mike Johnson",
      role: "fetchman",
      lastMessage: "I'm available to work at the Summer Festival",
      lastMessageTime: "3 hours ago",
      unread: 0,
    },
    {
      id: "c5",
      name: "Pizza Express",
      role: "vendor",
      lastMessage: "We've submitted our menu for approval",
      lastMessageTime: "1 day ago",
      unread: 0,
    },
    {
      id: "c6",
      name: "Craft Beer Co.",
      role: "vendor",
      lastMessage: "Do we need to bring our own refrigeration?",
      lastMessageTime: "2 days ago",
      unread: 0,
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      content: "Hi there! I'm planning to set up my stall at the Summer Festival. What time should I arrive for setup?",
      sender: "John Smith",
      senderRole: "vendor",
      sentAt: "2025-05-10T10:00:00Z",
      read: true,
    },
    {
      id: "m2",
      content: "Hello John! Thanks for your message. Vendor setup for Summer Festival starts at 7 AM on the event day. You should have about 3 hours to set up before guests arrive at 10 AM.",
      sender: "Me",
      senderRole: "host",
      sentAt: "2025-05-10T10:15:00Z",
      read: true,
    },
    {
      id: "m3",
      content: "That sounds good. How much space will I have for my food stall?",
      sender: "John Smith",
      senderRole: "vendor",
      sentAt: "2025-05-10T10:20:00Z",
      read: true,
    },
    {
      id: "m4",
      content: "You'll have a 3x3 meter space as per your vendor application. If you need more space, please let me know as soon as possible so I can check if we can accommodate that.",
      sender: "Me",
      senderRole: "host",
      sentAt: "2025-05-10T10:25:00Z",
      read: true,
    },
    {
      id: "m5",
      content: "Perfect, thanks! Will there be power outlets available?",
      sender: "John Smith",
      senderRole: "vendor",
      sentAt: "2025-05-10T10:35:00Z",
      read: true,
    },
    {
      id: "m6",
      content: "Yes, each vendor stall has access to 2 power outlets (220V). If you need more, please bring an extension cord or let us know in advance if you have high power requirements.",
      sender: "Me",
      senderRole: "host",
      sentAt: "2025-05-10T10:40:00Z",
      read: true,
    },
    {
      id: "m7",
      content: "That covers everything I needed to know. Thanks for your help!",
      sender: "John Smith",
      senderRole: "vendor",
      sentAt: "2025-05-10T10:45:00Z",
      read: true,
    },
    {
      id: "m8",
      content: "When should I arrive to set up my stall?",
      sender: "John Smith",
      senderRole: "vendor",
      sentAt: "2025-05-11T09:30:00Z",
      read: false,
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  
  const filteredConversations = conversations.filter(conversation => {
    // Filter by search query
    if (searchQuery && !conversation.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by role
    if (selectedRole !== "all" && conversation.role !== selectedRole) {
      return false;
    }
    
    return true;
  });
  
  const currentMessages = messages.filter(message => 
    (message.sender === selectedConversation?.name || message.sender === "Me")
  );
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMessageObj: Message = {
      id: `m${messages.length + 1}`,
      content: newMessage,
      sender: "Me",
      senderRole: "host",
      sentAt: new Date().toISOString(),
      read: true,
    };
    
    setMessages([...messages, newMessageObj]);
    
    // Update the conversation with the new message
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation.id 
        ? { 
            ...conv, 
            lastMessage: newMessage,
            lastMessageTime: "Just now"
          }
        : conv
    );
    
    setConversations(updatedConversations);
    setNewMessage("");
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
  };
  
  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // Mark messages as read
    setMessages(messages.map(msg => 
      msg.sender === conversation.name && !msg.read
        ? { ...msg, read: true }
        : msg
    ));
    
    // Update unread count in conversation
    setConversations(conversations.map(conv =>
      conv.id === conversation.id
        ? { ...conv, unread: 0 }
        :  conv
    ));
  };
  
  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case "vendor":
        return "bg-blue-100 text-blue-800";
      case "guest":
        return "bg-green-100 text-green-800";
      case "fetchman":
        return "bg-purple-100 text-purple-800";
      case "support":
        return "bg-venu-orange/20 text-venu-orange";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <HostPanelLayout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="flex h-[calc(80vh-8rem)] border rounded-lg overflow-hidden bg-white">
          {/* Conversations List */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="flex gap-2 mb-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts</SelectItem>
                  <SelectItem value="vendor">Vendors</SelectItem>
                  <SelectItem value="guest">Guests</SelectItem>
                  <SelectItem value="fetchman">Fetchmen</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-grow overflow-y-auto">
              {filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`flex items-center p-4 cursor-pointer gap-3 hover:bg-gray-50 border-b ${
                    selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => selectConversation(conversation)}
                >
                  <Avatar className="h-10 w-10">
                    {conversation.avatar && <AvatarImage src={conversation.avatar} />}
                    <AvatarFallback className={`${
                      conversation.role === 'support' ? 'bg-venu-orange text-white' : 'bg-gray-200'
                    }`}>
                      {getInitials(conversation.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <Badge className="bg-venu-orange text-white h-5 w-5 flex items-center justify-center rounded-full p-0">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredConversations.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No conversations found.
                </div>
              )}
            </div>
            
            <div className="p-3 border-t">
              <Button variant="outline" className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      {selectedConversation.avatar && <AvatarImage src={selectedConversation.avatar} />}
                      <AvatarFallback className={`${
                        selectedConversation.role === 'support' ? 'bg-venu-orange text-white' : 'bg-gray-200'
                      }`}>
                        {getInitials(selectedConversation.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-medium text-sm">{selectedConversation.name}</h2>
                      <div className="flex items-center">
                        <Badge className={`text-xs ${getRoleBadgeColor(selectedConversation.role)}`}>
                          {selectedConversation.role.charAt(0).toUpperCase() + selectedConversation.role.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    {currentMessages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'Me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === 'Me'
                              ? 'bg-venu-orange text-white'
                              : 'bg-white border'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'Me' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {formatTimestamp(message.sentAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-10 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} className="self-end">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </HostPanelLayout>
  );
}
