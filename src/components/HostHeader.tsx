
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import SecurePanelButton from "@/components/SecurePanelButton";
import { useUser } from "@/hooks/useUser";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HostHeader() {
  const { user } = useUser();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const displayName = user?.user_metadata?.full_name || 
    user?.user_metadata?.name || 
    user?.email?.split("@")[0] || 
    "Host";

  const menuItems = [
    { label: "Dashboard", href: "/host" },
    { label: "Venues", href: "/host/venues" },
    { label: "Events", href: "/host/events" },
    { label: "Vendors", href: "/host/vendors" },
    { label: "Finance", href: "/host/finance" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b h-16 flex items-center px-4">
      <div className="flex-1 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="py-4">
                  <div className="px-3 mb-6">
                    <h2 className="text-xl font-semibold text-venu-orange flex items-center">
                      Venuapp Host
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Welcome back, {displayName}</p>
                  </div>
                  <nav className="space-y-1">
                    {menuItems.map((item) => (
                      <Link 
                        key={item.label} 
                        to={item.href}
                        className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <h1 className="text-xl font-semibold text-venu-orange">
            Venuapp Host
          </h1>
          {!isMobile && (
            <span className="bg-venu-orange/10 text-venu-orange text-xs px-2 py-1 rounded">
              Host
            </span>
          )}
        </div>
        
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link 
                key={item.label} 
                to={item.href}
                className="text-sm font-medium text-gray-700 hover:text-venu-orange transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px] md:w-80 bg-white">
              <div className="p-4 text-sm">
                <h3 className="font-medium mb-2">Notifications</h3>
                <p className="text-gray-500">No new notifications</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <SecurePanelButton showWelcome />
        </div>
      </div>
    </header>
  );
}
