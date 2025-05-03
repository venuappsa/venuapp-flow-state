
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, UserPlus } from "lucide-react";
import MessageThread from "@/components/messaging/MessageThread";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

export interface Contact {
  id: string;
  name: string;
  role: "host" | "vendor" | "guest" | "fetchman" | "support" | "admin";
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export interface MessageData {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string; // Changed from receiver_id to recipient_id
  created_at: string;
  read: boolean;
}

const UniversalMessagingModule: React.FC = () => {
  const { user } = useUser();
  const { data: userRoles = [] } = useUserRoles(user?.id);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get thread parameter from URL if available
  const urlParams = new URLSearchParams(location.search);
  const threadParam = urlParams.get('thread');
  
  const [contacts, setContacts] = useState<Contact[]>([
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
    }
  ]);
  
  const [messages, setMessages] = useState<MessageData[]>([
    {
      id: "m1",
      content: "Hi there! I'm planning to set up my stall at the Summer Festival. What time should I arrive for setup?",
      sender_id: "c1",
      recipient_id: "current-user", // Changed from receiver_id to recipient_id
      created_at: "2025-05-10T10:00:00Z",
      read: true,
    },
    {
      id: "m2",
      content: "Hello John! Thanks for your message. Vendor setup for Summer Festival starts at 7 AM on the event day. You should have about 3 hours to set up before guests arrive at 10 AM.",
      sender_id: "current-user",
      recipient_id: "c1", // Changed from receiver_id to recipient_id
      created_at: "2025-05-10T10:15:00Z",
      read: true,
    },
    {
      id: "m3",
      content: "That sounds good. How much space will I have for my food stall?",
      sender_id: "c1",
      recipient_id: "current-user", // Changed from receiver_id to recipient_id
      created_at: "2025-05-10T10:20:00Z",
      read: true,
    },
    {
      id: "m4",
      content: "You'll have a 3x3 meter space as per your vendor application. If you need more space, please let me know as soon as possible so I can check if we can accommodate that.",
      sender_id: "current-user",
      recipient_id: "c1", // Changed from receiver_id to recipient_id
      created_at: "2025-05-10T10:25:00Z",
      read: true,
    },
    {
      id: "m8",
      content: "When should I arrive to set up my stall?",
      sender_id: "c1",
      recipient_id: "current-user", // Changed from receiver_id to recipient_id
      created_at: "2025-05-11T09:30:00Z",
      read: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState("");
  
  // Auto-select contact if thread param is present
  useEffect(() => {
    if (threadParam) {
      // This is simplified for demo - in a real app, you'd look up the contact by thread ID
      // For now, select the first contact that has unread messages as a demo
      const contactWithUnread = contacts.find(c => c.unread > 0);
      if (contactWithUnread) {
        selectContact(contactWithUnread);
      }
    } else if (!selectedContact && contacts.length > 0) {
      // If no thread param and no selected contact, default to first contact
      setSelectedContact(contacts[0]);
    }
  }, [threadParam, contacts]);
  
  // Filter contacts based on search query and role
  const filteredContacts = contacts.filter(contact => {
    // Filter by search query
    if (searchQuery && !contact.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by role
    if (selectedRole !== "all" && contact.role !== selectedRole) {
      return false;
    }
    
    // Don't show admin contacts for direct messaging
    if (contact.role === "admin") {
      return false;
    }
    
    return true;
  });
  
  // Get messages for the current conversation
  const currentMessages = selectedContact 
    ? messages.filter(message => 
        (message.sender_id === selectedContact.id && message.recipient_id === "current-user") || 
        (message.sender_id === "current-user" && message.recipient_id === selectedContact.id)
      )
    : [];
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    // Check if trying to message an admin
    if (selectedContact.role === "admin") {
      toast({
        title: "Cannot send direct messages to admins",
        description: "Please create a support ticket instead.",
        variant: "destructive"
      });
      return;
    }
    
    const newMessageObj: MessageData = {
      id: `m${messages.length + 1}`,
      content: newMessage,
      sender_id: "current-user",
      recipient_id: selectedContact.id, // Changed from receiver_id to recipient_id
      created_at: new Date().toISOString(),
      read: true,
    };
    
    setMessages([...messages, newMessageObj]);
    
    // Update the contact with the new message
    const updatedContacts = contacts.map(contact => 
      contact.id === selectedContact.id 
        ? { 
            ...contact, 
            lastMessage: newMessage,
            lastMessageTime: "Just now"
          }
        : contact
    );
    
    setContacts(updatedContacts);
    setNewMessage("");
  };
  
  const selectContact = (contact: Contact) => {
    setSelectedContact(contact);
    
    // Update URL with thread parameter without page reload
    const currentPath = location.pathname;
    const newParams = new URLSearchParams();
    newParams.set('thread', contact.id);
    navigate(`${currentPath}?${newParams.toString()}`, { replace: true });
    
    // Mark messages as read
    setMessages(messages.map(msg => 
      msg.sender_id === contact.id && !msg.read
        ? { ...msg, read: true }
        : msg
    ));
    
    // Update unread count in conversation
    setContacts(contacts.map(c =>
      c.id === contact.id
        ? { ...c, unread: 0 }
        : c
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

  // Function to create a support ticket instead of direct messaging admin
  const createSupportTicket = () => {
    toast({
      title: "Support Ticket Created",
      description: "Your request has been sent to the support team.",
    });
    // Here you would integrate with the ticketing system
  };

  const handleNewConversation = () => {
    // Here you would implement the logic to start a new conversation
    // For now, just show a toast
    toast({
      title: "New Conversation",
      description: "This feature is coming soon!",
    });
  };

  return (
    <div className="flex h-[calc(80vh-8rem)] border rounded-lg overflow-hidden bg-white">
      {/* Contacts List */}
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
        
        <ScrollArea className="flex-grow">
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              className={`flex items-center p-4 cursor-pointer gap-3 hover:bg-gray-50 border-b ${
                selectedContact?.id === contact.id ? 'bg-gray-50' : ''
              }`}
              onClick={() => selectContact(contact)}
            >
              <Avatar className="h-10 w-10">
                {contact.avatar && <AvatarImage src={contact.avatar} />}
                <AvatarFallback className={`${
                  contact.role === 'support' ? 'bg-venu-orange text-white' : 'bg-gray-200'
                }`}>
                  {getInitials(contact.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-600 truncate">{contact.lastMessage}</p>
                  {contact.unread > 0 && (
                    <Badge className="bg-venu-orange text-white h-5 w-5 flex items-center justify-center rounded-full p-0">
                      {contact.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredContacts.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No conversations found matching your filters.
            </div>
          )}
        </ScrollArea>
        
        <div className="p-3 border-t">
          <Button variant="outline" className="w-full" onClick={handleNewConversation}>
            <UserPlus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>
      
      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  {selectedContact.avatar && <AvatarImage src={selectedContact.avatar} />}
                  <AvatarFallback className={`${
                    selectedContact.role === 'support' ? 'bg-venu-orange text-white' : 'bg-gray-200'
                  }`}>
                    {getInitials(selectedContact.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium text-sm">{selectedContact.name}</h2>
                  <div className="flex items-center">
                    <Badge className={`text-xs ${getRoleBadgeColor(selectedContact.role)}`}>
                      {selectedContact.role.charAt(0).toUpperCase() + selectedContact.role.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {selectedContact.role === "support" && (
                <Button variant="outline" size="sm" onClick={createSupportTicket}>
                  Create Ticket
                </Button>
              )}
            </div>
            
            <MessageThread 
              messages={currentMessages.map(m => ({
                // Convert from our internal format to MessageThread component format
                content: m.content,
                created_at: m.created_at,
                id: m.id,
                sender_id: m.sender_id === "current-user" ? user?.id || "current-user" : m.sender_id,
                recipient_id: m.recipient_id,
                read: m.read // Adding the missing read property
              }))}
              currentUserId={user?.id || "current-user"}
              currentUserRole={userRoles.includes("host") ? "host" : "vendor"}
              contactName={selectedContact.name}
              contactAvatar={selectedContact.avatar}
              onSendMessage={(content) => {
                if (content.trim()) {
                  handleSendMessage();
                }
              }}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalMessagingModule;
