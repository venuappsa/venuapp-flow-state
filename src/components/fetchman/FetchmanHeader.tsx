
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from '@/hooks/useUser';
import { AuthService } from '@/services/AuthService';
import { Bell, LogOut, Menu, MessageSquare, Settings, User } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import FetchmanSidebar from './FetchmanSidebar';

export default function FetchmanHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, forceClearUser } = useUser();
  const navigate = useNavigate();

  const displayName = user?.user_metadata?.full_name || 
    user?.email?.split('@')[0] || 
    'Fetchman';

  const initials = displayName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  const handleLogout = async () => {
    const success = await AuthService.signOut();
    if (success) {
      forceClearUser();
      navigate('/auth');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-gray-200 h-16 flex items-center px-4">
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
        <div className="flex items-center">
          <Link to="/fetchman" className="flex items-center">
            <img
              src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
              alt="Venuapp Logo"
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-xl font-semibold ml-2 hidden sm:inline-block">
              <span className="text-venu-orange">Venuapp</span>
              <span className="ml-1 text-gray-500">Fetchman</span>
            </h1>
          </Link>
        </div>

        {/* Right side of header */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <MessageSquare className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-venu-orange text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/fetchman/profile" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/fetchman/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer text-red-500">
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
          <FetchmanSidebar onNavItemClick={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
