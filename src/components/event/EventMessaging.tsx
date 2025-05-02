
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import MessageThread from '@/components/messaging/MessageThread';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Search, MessageSquare, MessagesSquare, X, Check, Plus } from 'lucide-react';
import { Message } from '@/types/vendor';

// Mock event data
const mockEvent = {
  id: "event-1",
  name: "Corporate Annual Gala",
  date: "2024-06-15T18:00:00Z",
  location: "Grand Ballroom, Sandton",
};

// Mock vendor data with conversation threads
const mockVendors = [
  {
    id: "v1",
    name: "Gourmet Catering Co.",
    role: "Catering",
    avatar: "",
    lastMessage: "We'll prepare the menu options as discussed.",
    lastMessageTime: "2024-04-25T14:30:00Z",
    unread: 0,
  },
  {
    id: "v2",
    name: "Urban Sound DJ's",
    role: "Music",
    avatar: "",
    lastMessage: "Looking forward to discussing the playlist with you.",
    lastMessageTime: "2024-04-28T09:15:00Z",
    unread: 3,
  },
  {
    id: "v3",
    name: "Elegant Decor Solutions",
    role: "Decoration",
    avatar: "",
    lastMessage: "I've sent over some theme ideas for your review.",
    lastMessageTime: "2024-04-26T16:45:00Z",
    unread: 1,
  }
];

// Mock message threads
const mockMessages: Record<string, Message[]> = {
  "v1": [
    {
      id: "msg1-1",
      content: "Hello! I'd like to discuss the catering options for our event.",
      sender_id: "host-1",
      recipient_id: "v1",
      created_at: "2024-04-24T10:00:00Z",
      read: true
    },
    {
      id: "msg1-2",
      content: "Hi there! We'd be happy to help with your event catering. What kind of menu are you looking for?",
      sender_id: "v1",
      recipient_id: "host-1",
      created_at: "2024-04-24T10:15:00Z",
      read: true
    },
    {
      id: "msg1-3",
      content: "We're thinking of a three-course meal with vegetarian options.",
      sender_id: "host-1",
      recipient_id: "v1",
      created_at: "2024-04-24T11:00:00Z",
      read: true
    },
    {
      id: "msg1-4",
      content: "That sounds great! We can definitely accommodate that. Would you like appetizers as well?",
      sender_id: "v1",
      recipient_id: "host-1",
      created_at: "2024-04-24T11:30:00Z",
      read: true
    },
    {
      id: "msg1-5",
      content: "Yes, appetizers would be perfect. And could we include a dessert bar?",
      sender_id: "host-1",
      recipient_id: "v1",
      created_at: "2024-04-25T09:00:00Z",
      read: true
    },
    {
      id: "msg1-6",
      content: "Absolutely! We'll prepare the menu options as discussed. I'll send over a proposal by tomorrow.",
      sender_id: "v1",
      recipient_id: "host-1",
      created_at: "2024-04-25T14:30:00Z",
      read: true
    }
  ],
  "v2": [
    {
      id: "msg2-1",
      content: "Hi, we're looking for a DJ for our corporate event.",
      sender_id: "host-1",
      recipient_id: "v2",
      created_at: "2024-04-27T15:00:00Z",
      read: true
    },
    {
      id: "msg2-2",
      content: "Hello! Thanks for reaching out. We specialize in corporate events and would be delighted to provide music for yours.",
      sender_id: "v2",
      recipient_id: "host-1",
      created_at: "2024-04-27T15:45:00Z",
      read: true
    },
    {
      id: "msg2-3",
      content: "Great! We need background music for the reception and dance music for later in the evening.",
      sender_id: "host-1",
      recipient_id: "v2",
      created_at: "2024-04-27T16:30:00Z",
      read: true
    },
    {
      id: "msg2-4",
      content: "Perfect! We can definitely handle that. Do you have any specific genre preferences?",
      sender_id: "v2",
      recipient_id: "host-1",
      created_at: "2024-04-28T09:00:00Z",
      read: true
    },
    {
      id: "msg2-5",
      content: "We'd like a mix of jazz for the reception and popular dance hits later. Can you provide a sample playlist?",
      sender_id: "host-1",
      recipient_id: "v2",
      created_at: "2024-04-28T09:10:00Z",
      read: true
    },
    {
      id: "msg2-6",
      content: "Looking forward to discussing the playlist with you. I'll send over some suggestions soon!",
      sender_id: "v2",
      recipient_id: "host-1",
      created_at: "2024-04-28T09:15:00Z",
      read: false
    },
    {
      id: "msg2-7",
      content: "Here's our jazz collection for the reception: [Jazz Playlist Link]",
      sender_id: "v2",
      recipient_id: "host-1",
      created_at: "2024-04-28T10:00:00Z",
      read: false
    },
    {
      id: "msg2-8",
      content: "And here are some popular dance tracks we recommend: [Dance Playlist Link]",
      sender_id: "v2",
      recipient_id: "host-1",
      created_at: "2024-04-28T10:05:00Z",
      read: false
    }
  ],
  "v3": [
    {
      id: "msg3-1",
      content: "Hello, we're planning a corporate gala and need decoration services.",
      sender_id: "host-1",
      recipient_id: "v3",
      created_at: "2024-04-26T10:00:00Z",
      read: true
    },
    {
      id: "msg3-2",
      content: "Hi there! We'd love to help decorate your gala. What's your vision for the event?",
      sender_id: "v3",
      recipient_id: "host-1",
      created_at: "2024-04-26T10:30:00Z",
      read: true
    },
    {
      id: "msg3-3",
      content: "We're thinking of an elegant blue and silver theme, with a focus on our company logo colors.",
      sender_id: "host-1",
      recipient_id: "v3",
      created_at: "2024-04-26T11:15:00Z",
      read: true
    },
    {
      id: "msg3-4",
      content: "That sounds beautiful! Blue and silver make for a very sophisticated combination. Would you like centerpieces for the tables as well?",
      sender_id: "v3",
      recipient_id: "host-1",
      created_at: "2024-04-26T13:00:00Z",
      read: true
    },
    {
      id: "msg3-5",
      content: "Yes, centerpieces would be great. Something not too tall so guests can see each other across the table.",
      sender_id: "host-1",
      recipient_id: "v3",
      created_at: "2024-04-26T14:30:00Z",
      read: true
    },
    {
      id: "msg3-6",
      content: "I've sent over some theme ideas for your review. Please check your email and let me know what you think!",
      sender_id: "v3",
      recipient_id: "host-1",
      created_at: "2024-04-26T16:45:00Z",
      read: false
    }
  ]
};

export default function EventMessaging() {
  const { eventId } = useParams<{ eventId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeVendor, setActiveVendor] = useState(mockVendors[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages[mockVendors[0].id] || []);
  const [newMessage, setNewMessage] = useState("");

  // Filter vendors based on search term
  const filteredVendors = mockVendors.filter(
    vendor => vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              vendor.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectVendor = (vendor: typeof mockVendors[0]) => {
    setActiveVendor(vendor);
    setMessages(mockMessages[vendor.id] || []);
    
    // Mark messages as read
    if (vendor.unread > 0) {
      const updatedMockMessages = { ...mockMessages };
      updatedMockMessages[vendor.id] = mockMessages[vendor.id].map(msg => ({
        ...msg,
        read: true
      }));
      
      // Update the vendor's unread count
      const updatedVendors = mockVendors.map(v => 
        v.id === vendor.id ? { ...v, unread: 0 } : v
      );
      
      // In a real app, you would update the database here
    }
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    const newMsg: Message = {
      id: `new-msg-${Date.now()}`,
      content: content,
      sender_id: "host-1", // Current user ID
      recipient_id: activeVendor.id,
      created_at: new Date().toISOString(),
      read: false
    };
    
    // Update the messages list
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    
    // In a real app, you would send the message to the backend here
    
    // Update the last message in vendor list
    const updatedVendors = mockVendors.map(vendor => 
      vendor.id === activeVendor.id
        ? {
            ...vendor,
            lastMessage: content,
            lastMessageTime: new Date().toISOString(),
            unread: 0 // Reset unread count for the current vendor
          }
        : vendor
    );
    
    // Simulate successful message send
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully"
    });
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Event Messages</h1>
        <p className="text-gray-500">Communicate with vendors for {mockEvent.name}</p>
      </div>

      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0 h-full flex">
          {/* Sidebar with vendors */}
          <div className="w-full sm:w-64 lg:w-80 border-r flex flex-col h-full bg-gray-50">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search vendors..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {filteredVendors.length > 0 ? (
              <div className="flex-1 overflow-auto">
                {filteredVendors.map((vendor) => (
                  <div 
                    key={vendor.id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-100 transition-colors ${
                      activeVendor.id === vendor.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleSelectVendor(vendor)}
                  >
                    <div className="flex gap-3">
                      <Avatar>
                        {vendor.avatar ? (
                          <AvatarImage src={vendor.avatar} alt={vendor.name} />
                        ) : (
                          <AvatarFallback>{getInitials(vendor.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium truncate">{vendor.name}</div>
                          {vendor.unread > 0 && (
                            <Badge className="ml-1 bg-venu-orange">{vendor.unread}</Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-500">{vendor.role}</div>
                        
                        <div className="mt-1 text-sm truncate text-gray-600">
                          {vendor.lastMessage}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 text-center">
                <div>
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <h3 className="font-medium">No vendors found</h3>
                  <p className="text-sm text-gray-500">Try a different search term</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Message thread area */}
          <div className="hidden sm:flex flex-1 flex-col h-full">
            {activeVendor ? (
              <>
                {/* Vendor header */}
                <div className="p-3 border-b flex justify-between items-center bg-white">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {activeVendor.avatar ? (
                        <AvatarImage src={activeVendor.avatar} alt={activeVendor.name} />
                      ) : (
                        <AvatarFallback>{getInitials(activeVendor.name)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">{activeVendor.name}</div>
                      <div className="text-sm text-gray-500">{activeVendor.role}</div>
                    </div>
                  </div>
                </div>
                
                {/* Message thread */}
                <MessageThread
                  messages={messages}
                  currentUserId="host-1" // Current user ID
                  currentUserRole="host"
                  contactName={activeVendor.name}
                  contactAvatar={activeVendor.avatar}
                  onSendMessage={handleSendMessage}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 text-center bg-gray-50">
                <div>
                  <MessagesSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No conversation selected</h3>
                  <p className="text-gray-500 mb-4">
                    Choose a vendor from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
