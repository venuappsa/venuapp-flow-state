
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import SecurePanelButton from "@/components/SecurePanelButton";
import { useUser } from "@/hooks/useUser";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubscription } from "@/hooks/useSubscription";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function HostHeader() {
  const { user } = useUser();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { subscribed, subscription_tier, subscription_status } = useSubscription();
  
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

  const [notifications, setNotifications] = useState([
    { id: 1, title: "New vendor application", content: "Food Truck Masters wants to join your venue", time: "2 hours ago", read: false },
    { id: 2, title: "Subscription renewed", content: "Your premium subscription was renewed successfully", time: "1 day ago", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b h-16 flex items-center px-4">
      <div className="flex-1 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="py-4">
                  <div className="px-3 mb-6">
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold text-venu-orange">
                        Venuapp Host
                      </h2>
                      <div className="ml-2">
                        <Badge className={`${
                          subscription_status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {subscription_tier || "Free"}
                        </Badge>
                      </div>
                    </div>
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
                    {!subscribed && (
                      <Link 
                        to="/subscribe"
                        className="flex items-center px-3 py-2 text-venu-orange font-medium hover:bg-orange-50 rounded-md mt-4"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Upgrade Subscription
                      </Link>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Link to="/host" className="flex items-center">
            <img
              src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
              alt="Venuapp Logo"
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-xl font-semibold text-venu-orange ml-2">
              Venuapp
            </h1>
          </Link>
          <Badge className="bg-venu-orange/10 text-venu-orange">
            Host
          </Badge>
          {!subscribed && !isMobile && (
            <Link to="/subscribe">
              <Badge variant="outline" className="ml-2 border-amber-400 text-amber-600 hover:bg-amber-50 cursor-pointer">
                Upgrade Plan
              </Badge>
            </Link>
          )}
          {subscribed && !isMobile && (
            <Badge className="bg-green-100 text-green-700 ml-2">
              {subscription_tier || "Premium"}
            </Badge>
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
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px] md:w-80 bg-white">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-0 focus:bg-transparent">
                    <div className={`w-full p-3 ${!notification.read ? 'bg-blue-50' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-xs text-gray-500">{notification.time}</div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{notification.content}</div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-blue-600 cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SecurePanelButton showWelcome />
        </div>
      </div>
    </header>
  );
}
