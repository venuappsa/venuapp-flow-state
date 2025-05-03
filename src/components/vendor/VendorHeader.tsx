
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HelpCircle,
  LifeBuoy,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

const VendorHeader = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Message data state with thread IDs for direct navigation
  const [messageData, setMessageData] = useState({
    unreadCount: 2,
    messages: [
      { 
        id: "msg1", 
        title: "Event Confirmation", 
        sender: "Event Team", 
        content: "Your booth has been confirmed for the Summer Festival", 
        time: "30 min ago",
        read: false,
        threadId: "event-confirmation-1" // Added thread ID for direct navigation
      },
      { 
        id: "msg2", 
        title: "Payment Reminder", 
        sender: "Finance Team", 
        content: "Your payment is due by Friday for the upcoming event", 
        time: "3 hours ago",
        read: false,
        threadId: "payment-reminder-1" // Added thread ID for direct navigation
      }
    ]
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        variant: "destructive",
      });
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
      navigate(`/vendor/messages?thread=${threadId}`);
    }, 100);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </button>
          <div className="flex items-center">
            <span className="text-xl font-bold text-venu-orange hidden md:inline-block">
              Vendor Portal
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
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
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Messages</span>
                <Button variant="ghost" size="sm" className="text-xs h-6" asChild>
                  <Link to="/vendor/messages">View All</Link>
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

          <NotificationBell />

          <Button variant="outline" size="icon">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full h-8 w-8 p-0">
                <span className="sr-only">Open user menu</span>
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/vendor/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/vendor/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="#">
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;
