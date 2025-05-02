
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function HostMessagesPage() {
  const contacts = [
    { id: 1, name: "Elegant Events & Catering", role: "Vendor", unread: 3, avatar: null, initials: "EE", lastMessage: "We'll be there at 9am to set up.", time: "10:25 AM" },
    { id: 2, name: "Sarah Johnson", role: "Guest", unread: 0, avatar: null, initials: "SJ", lastMessage: "Thank you for the information!", time: "Yesterday" },
    { id: 3, name: "Grand Ballroom", role: "Venue", unread: 0, avatar: null, initials: "GB", lastMessage: "Your booking is confirmed for June 15th.", time: "Yesterday" },
    { id: 4, name: "Michael Brown", role: "Guest", unread: 1, avatar: null, initials: "MB", lastMessage: "Is there parking available at the venue?", time: "Monday" },
    { id: 5, name: "Sound Masters", role: "Vendor", unread: 0, avatar: null, initials: "SM", lastMessage: "We've updated our equipment list as requested.", time: "Last week" },
  ];
  
  const [selectedContact, setSelectedContact] = React.useState(contacts[0]);
  
  const messages = [
    { id: 1, sender: "them", content: "Good morning! Just wanted to confirm some details for the upcoming event.", time: "10:15 AM" },
    { id: 2, sender: "me", content: "Hi there! Sure, what do you need to know?", time: "10:18 AM" },
    { id: 3, sender: "them", content: "We were wondering about the setup time. The contract says 9am, but we'd prefer to start at 8am if possible.", time: "10:20 AM" },
    { id: 4, sender: "me", content: "Let me check with the venue and get back to you on that. I think 8am should be fine, but I need to confirm.", time: "10:22 AM" },
    { id: 5, sender: "them", content: "Perfect, thank you! Also, we'll be bringing our own decorations. Is there any restriction on what we can put up?", time: "10:23 AM" },
    { id: 6, sender: "them", content: "We'll be there at 9am to set up.", time: "10:25 AM" },
  ];

  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-5rem)]">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-4">
          Messages
        </h1>
        
        <div className="bg-white rounded-lg shadow flex h-[calc(100vh-10rem)]">
          {/* Contacts sidebar */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input placeholder="Search messages..." className="pl-10" />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer ${selectedContact.id === contact.id ? 'bg-gray-50' : ''}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatar || undefined} />
                    <AvatarFallback className="bg-venu-orange text-white">{contact.initials}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-medium truncate">{contact.name}</p>
                      <span className="text-xs text-gray-500">{contact.time}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                      {contact.unread > 0 && (
                        <span className="bg-venu-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          
          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-venu-orange text-white">{selectedContact.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedContact.name}</p>
                  <p className="text-xs text-gray-500">{selectedContact.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical size={18} />
              </Button>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'me' 
                      ? 'bg-venu-orange text-white rounded-br-none' 
                      : 'bg-gray-100 rounded-bl-none'}`}>
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 text-right ${message.sender === 'me' ? 'text-white/80' : 'text-gray-500'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Message input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip size={18} />
                </Button>
                <Input placeholder="Type a message..." className="flex-1" />
                <Button size="icon">
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HostPanelLayout>
  );
}
