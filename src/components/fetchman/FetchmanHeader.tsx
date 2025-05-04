
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/AuthService";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FetchmanSidebar from "@/components/fetchman/FetchmanSidebar";

const FetchmanHeader = () => {
  const { user, forceClearUser } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    try {
      const success = await AuthService.signOut();
      
      if (success) {
        // Clear local user state first
        forceClearUser();
        
        // Show success message
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account."
        });
        
        // Redirect to the root route (/) which contains the login/auth page
        navigate("/", { replace: true });
      } else {
        // Handle failed logout
        toast({
          title: "Logout failed",
          description: "There was an issue logging out. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error during logout",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.user_metadata?.full_name || 
    user?.user_metadata?.name || 
    user?.email?.split("@")[0] || 
    "Fetchman";
  
  const initials = displayName
    .split(" ")
    .map(name => name.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
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
            <img
              src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
              alt="Venuapp Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold text-venu-orange hidden md:inline-block ml-2">
              Fetchman Portal
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Messages button with dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
                <span className="bg-venu-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center absolute -top-1 -right-1">3</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Messages</span>
                <Button variant="ghost" size="sm" className="text-xs h-6" asChild>
                  <Link to="/fetchman/messages">View All</Link>
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/fetchman/messages" className="flex flex-col w-full p-4 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="font-medium">John Smith</span>
                    <span className="text-xs text-muted-foreground">10 min ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    When should I arrive to set up my stall?
                  </p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/fetchman/messages" className="flex flex-col w-full p-4 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="font-medium">Event Organizer</span>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    Your schedule for this weekend has been updated.
                  </p>
                </Link>
              </DropdownMenuItem>
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
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-venu-orange text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>My Account</span>
                  <span className="text-xs text-muted-foreground">{displayName}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/fetchman/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut} 
                disabled={isLoggingOut}
                className="flex items-center cursor-pointer text-red-500 focus:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
          <FetchmanSidebar />
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default FetchmanHeader;
