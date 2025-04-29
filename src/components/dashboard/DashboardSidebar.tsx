
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Building,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Store,
  Users,
  BookOpen,
  Bell
} from "lucide-react";

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  badge?: string | number;
  collapsed: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, label, icon, isActive, badge, collapsed, onClick }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
      isActive
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      collapsed && "justify-center px-2"
    )}
    onClick={onClick}
  >
    <div className={cn(
      "flex h-7 w-7 items-center justify-center rounded-md",
      isActive ? "bg-venu-purple text-white" : "text-muted-foreground"
    )}>
      {icon}
    </div>
    {!collapsed && (
      <div className="flex flex-1 items-center justify-between">
        <span>{label}</span>
        {badge && (
          <Badge className="ml-auto" variant={isActive ? "default" : "outline"}>
            {badge}
          </Badge>
        )}
      </div>
    )}
    {collapsed && badge && (
      <Badge className="absolute right-2 top-1 h-5 w-5 justify-center rounded-full p-0">
        {badge}
      </Badge>
    )}
  </Link>
);

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { user } = useUser();
  const { subscribed, subscription_tier, subscription_status } = useSubscription();
  
  const displayName = user?.user_metadata?.full_name || 
    user?.user_metadata?.name || 
    user?.email?.split("@")[0] || 
    "Host";
  
  const initials = displayName.split(" ")
    .map(name => name.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const navItems = [
    { to: "/host", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/host/venues", label: "Venues", icon: <Building size={18} /> },
    { to: "/host/events", label: "Events", icon: <CalendarRange size={18} /> },
    { to: "/host/vendors", label: "Vendors", icon: <Store size={18} /> },
    { to: "/host/guests", label: "Guests", icon: <Users size={18} /> },
    { to: "/host/finance", label: "Finance", icon: <CreditCard size={18} /> },
    { to: "/host/analytics", label: "Analytics", icon: <LineChart size={18} /> },
    { to: "/host/messages", label: "Messages", icon: <MessageSquare size={18} />, badge: 3 },
    { to: "/host/notifications", label: "Notifications", icon: <Bell size={18} />, badge: 5 },
    { to: "/host/knowledge", label: "Knowledge Base", icon: <BookOpen size={18} /> },
    { to: "/host/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col border-r transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
                alt="Venuapp Logo"
                className="h-8 w-8 object-contain"
              />
              <h1 className="text-xl font-semibold text-venu-purple ml-2">
                Venuapp
              </h1>
            </Link>
          )}
          {collapsed && (
            <Link to="/" className="flex items-center justify-center w-full">
              <img
                src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
                alt="Venuapp Logo"
                className="h-8 w-8 object-contain"
              />
            </Link>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className={cn(
        "flex items-center border-b p-4 transition-all duration-300",
        collapsed ? "flex-col" : "flex-row gap-4"
      )}>
        <Avatar className={cn(
          "h-10 w-10 transition-all duration-300",
          collapsed ? "mb-2" : ""
        )}>
          <AvatarFallback className="bg-venu-purple text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {!collapsed && (
          <div className="flex-1">
            <p className="text-sm font-medium">{displayName}</p>
            <Badge className={cn(
              "mt-1",
              subscription_status === "active"
                ? "bg-green-100 text-green-800"
                : subscription_status === "paused"
                ? "bg-amber-100 text-amber-800"
                : "bg-gray-100 text-gray-800"
            )}>
              {subscription_tier || "Free"}
            </Badge>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.to}
              badge={item.badge}
              collapsed={collapsed}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4 mt-auto">
        {!collapsed && (
          <Link 
            to="/#pricing" 
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm",
              "bg-venu-purple text-white hover:bg-venu-purple/90 transition-colors",
            )}
          >
            <CreditCard size={18} />
            <span>{subscribed ? "Manage Subscription" : "Upgrade Plan"}</span>
          </Link>
        )}
        {collapsed && (
          <Link 
            to="/#pricing" 
            className="flex h-10 w-10 items-center justify-center rounded-full bg-venu-purple text-white hover:bg-venu-purple/90 transition-colors"
          >
            <CreditCard size={18} />
          </Link>
        )}
      </div>
    </aside>
  );
}
