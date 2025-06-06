
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/AuthService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface SecurePanelButtonProps {
  showWelcome?: boolean;
  className?: string;
}

export default function SecurePanelButton({ showWelcome = false, className }: SecurePanelButtonProps) {
  const { user, forceClearUser } = useUser();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName = user?.user_metadata?.full_name || 
    user?.user_metadata?.name || 
    user?.email?.split("@")[0] || 
    "User";

  const initials = displayName.split(" ")
    .map(name => name.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
    
  const subscriptionLink = user ? "/host/subscription" : "/subscribe";

  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      const success = await AuthService.signOut();
      if (success) {
        console.log("User signed out successfully");
        forceClearUser(); // Backup local state clearing
        navigate("/auth");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!user) {
    return (
      <Button 
        onClick={() => navigate("/auth")} 
        variant="default" 
        className={`bg-venu-orange hover:bg-venu-dark-orange text-white ${className || ''}`}
      >
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`relative h-9 w-9 rounded-full ${className || ''}`}>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-venu-orange text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
        {showWelcome && (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Welcome,</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {displayName}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => navigate('/host')} className="cursor-pointer">
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/host/venues/new')} className="cursor-pointer">
            Add Venue
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate(subscriptionLink)} className="cursor-pointer">
            Subscription
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50" 
          disabled={isSigningOut}
          onSelect={handleSignOut}
        >
          {isSigningOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
