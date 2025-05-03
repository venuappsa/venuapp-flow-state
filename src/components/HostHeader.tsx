
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, Settings, User, Plus, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { supabase } from "@/integrations/supabase/client";
import NotificationBell from "@/components/NotificationBell";
import { AuthService } from "@/services/AuthService";

export default function HostHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Message data state with thread IDs for direct navigation
  const [messageData, setMessageData] = useState({
    unreadCount: 2,
    messages: [
      { 
        id: "msg1", 
        title: "Vendor Question", 
        sender: "Food Truck Co", 
        content: "What time can we arrive to set up?", 
        time: "15 min ago",
        read: false,
        threadId: "vendor-question-1" // Added thread ID for direct navigation
      },
      { 
        id: "msg2", 
        title: "Guest Inquiry", 
        sender: "Jane Smith", 
        content: "Are there vegetarian options at the event?", 
        time: "2 hours ago",
        read: false,
        threadId: "guest-inquiry-1" // Added thread ID for direct navigation
      }
    ]
  });

  const displayName = user?.user_metadata?.full_name || 
    user?.email?.split("@")[0] || 
    "Host";
  
  const initials = displayName
    .split(" ")
    .map(name => name.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const handleLogout = async () => {
    const success = await AuthService.signOut();
    if (success) {
      navigate("/auth");
    }
  };

  // Updated function to handle message click with navigation
  const handleMessageClick = (threadId: string, messageId: string) => {
    // Mark the message as read
    setMessageData(prev => ({
      ...prev,
      unreadCount: Math.max(0, prev.unreadCount - 1),
      messages: prev.messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    }));

    // Close dropdown before navigating
    setTimeout(() => {
      // Navigate to the specific message thread
      navigate(`/host/messages?thread=${threadId}`);
    }, 100);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border h-16 flex items-center px-4 md:px-6">
      <div className="flex items-center w-full justify-between">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>

        {/* Logo - visible on both mobile and desktop */}
        <div className={cn("flex items-center", mobileMenuOpen ? "hidden" : "")}>
          <Link to="/host" className="flex items-center">
            <img
              src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
              alt="Venuapp Logo"
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-xl font-semibold ml-2 hidden sm:inline-block text-venu-orange">
              Venuapp
            </h1>
          </Link>
        </div>

        {/* Right side of header - actions, notifications and profile */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="hidden md:flex">
            <Link to="/host/events/new">
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Link>
          </Button>

          {/* Messages dropdown with enhanced navigation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="h-5 w-5" />
                {messageData.unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-venu-orange text-white rounded-full">
                    {messageData.unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 z-50">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Messages</span>
                <Button variant="ghost" size="sm" className="text-xs h-6" asChild>
                  <Link to="/host/messages">View All</Link>
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {messageData.messages.map(message => (
                <DropdownMenuItem 
                  key={message.id}
                  className={`flex flex-col w-full p-4 cursor-pointer ${!message.read ? 'bg-accent/50' : ''}`}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleMessageClick(message.threadId, message.id);
                  }}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-medium">{message.title}</span>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {message.content}
                  </p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Updated notification bell that includes old notice board content */}
          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-venu-orange text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 z-50">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/host/profile" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/host/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer text-red-500 focus:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
          <div className="h-full">
            <DashboardSidebar />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
