
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  Building,
  CalendarRange,
  Store,
  CreditCard,
  Settings,
  Bell,
  LogOut,
  Shield,
  MessageSquare,
  GanttChart,
  BarChart3,
  FileText,
  DollarSign,
  CheckSquare,
  Globe,
  Megaphone,
  FileQuestion,
  LifeBuoy,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface CollapsibleAdminSidebarProps {
  className?: string;
  onNavItemClick?: () => void;
}

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  badge?: number;
  collapsed: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, label, icon, isActive, badge, collapsed, onClick }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
      isActive
        ? "bg-accent text-accent-foreground"
        : "hover:bg-accent hover:text-accent-foreground",
      collapsed && "justify-center px-2"
    )}
    onClick={onClick}
  >
    <div className={cn(
      "flex h-7 w-7 items-center justify-center rounded-md",
      isActive ? "bg-venu-orange text-white" : "text-muted-foreground"
    )}>
      {icon}
    </div>
    {!collapsed && (
      <div className="flex flex-1 items-center justify-between">
        <span>{label}</span>
        {badge !== undefined && badge > 0 && (
          <span className="ml-auto bg-venu-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
    )}
    {collapsed && badge !== undefined && badge > 0 && (
      <span className="absolute right-2 top-2 bg-venu-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {badge}
      </span>
    )}
  </Link>
);

export function CollapsibleAdminSidebar({ className, onNavItemClick }: CollapsibleAdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const { unreadCount } = useNotifications();

  const displayName = user?.user_metadata?.full_name || 
    user?.email?.split("@")[0] || 
    "Admin";
  
  const initials = displayName
    .split(" ")
    .map(name => name.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/auth");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account"
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Organize navigation items into categories
  const navigationCategories = [
    {
      category: "Overview",
      items: [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      ]
    },
    {
      category: "User Management",
      items: [
        { href: "/admin/users", label: "Users", icon: <Users size={18} /> },
        { href: "/admin/hosts", label: "Hosts", icon: <Building size={18} /> },
        { href: "/admin/merchants", label: "Merchants", icon: <Store size={18} /> },
        { href: "/admin/verification", label: "Verification Center", icon: <Shield size={18} />, badge: 7 },
      ]
    },
    {
      category: "Event Management",
      items: [
        { href: "/admin/events", label: "Events", icon: <CalendarRange size={18} /> },
        { href: "/admin/vendors/performance", label: "Vendor Performance", icon: <CheckSquare size={18} /> },
      ]
    },
    {
      category: "Finance",
      items: [
        { href: "/admin/subscriptions", label: "Subscriptions", icon: <CreditCard size={18} /> },
        { href: "/admin/payments", label: "Payments & Payouts", icon: <DollarSign size={18} /> },
      ]
    },
    {
      category: "Analytics & Reporting",
      items: [
        { href: "/admin/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
        { href: "/admin/reports", label: "Reports", icon: <FileText size={18} /> },
      ]
    },
    {
      category: "Communication",
      items: [
        { href: "/admin/messages", label: "Messages", icon: <MessageSquare size={18} />, badge: 3 },
        { href: "/admin/notifications", label: "Notifications", icon: <Bell size={18} />, badge: unreadCount },
        { href: "/admin/announcements", label: "Announcements", icon: <Megaphone size={18} /> },
      ]
    },
    {
      category: "Content",
      items: [
        { href: "/admin/cms", label: "Content Management", icon: <FileQuestion size={18} /> },
        { href: "/admin/website", label: "Website", icon: <Globe size={18} /> },
      ]
    },
    {
      category: "Support",
      items: [
        { href: "/admin/support", label: "Support Tickets", icon: <LifeBuoy size={18} /> },
        { href: "/admin/system", label: "System Status", icon: <AlertCircle size={18} /> },
      ]
    },
    {
      category: "Configuration",
      items: [
        { href: "/admin/platform", label: "Platform", icon: <GanttChart size={18} /> },
        { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
      ]
    },
  ];
  
  return (
    <div className={cn(
      "flex h-full flex-col bg-background border-r",
      className,
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b flex items-center">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <img
              src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
              alt="Venuapp Logo"
              className="h-8 w-8 object-contain"
            />
            <div>
              <h3 className="font-semibold text-lg">
                <span className="text-venu-orange">Venuapp</span>
                <span className="ml-1 text-gray-500">Admin</span>
              </h3>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link to="/admin" className="mx-auto">
            <img
              src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
              alt="Venuapp Logo"
              className="h-8 w-8 object-contain"
            />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", collapsed ? "rotate-180" : "")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className={cn(
        "p-4 border-b flex",
        collapsed ? "flex-col items-center" : "flex-row items-center gap-4"
      )}>
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-venu-orange text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {!collapsed && (
          <div className="flex-1">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-auto">
        <ScrollArea className="h-full">
          <div className="px-2 py-4">
            {navigationCategories.map((category, index) => (
              <div key={category.category} className="mb-4">
                {!collapsed && (
                  <h4 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {category.category}
                  </h4>
                )}
                <div className="grid gap-1">
                  {category.items.map((item) => (
                    <NavItem
                      key={item.href}
                      to={item.href}
                      label={item.label}
                      icon={item.icon}
                      isActive={pathname === item.href}
                      badge={item.badge}
                      collapsed={collapsed}
                      onClick={onNavItemClick}
                    />
                  ))}
                </div>
                {index < navigationCategories.length - 1 && (
                  <Separator className="my-4 mx-3" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <div className="mt-auto p-4 border-t">
        {!collapsed && (
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        )}
        {collapsed && (
          <Button 
            variant="destructive" 
            size="icon"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
