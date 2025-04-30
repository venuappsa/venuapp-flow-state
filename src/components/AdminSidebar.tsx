
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  LayoutDashboard,
  Users,
  Building,
  CalendarRange,
  Store,
  CreditCard,
  FileBarChart,
  Settings,
  Bell,
  LogOut,
  Shield,
  MessageSquare,
  GanttChart
} from "lucide-react";

interface AdminSidebarProps {
  className?: string;
  onNavItemClick?: () => void;
}

export default function AdminSidebar({ className, onNavItemClick }: AdminSidebarProps) {
  const { pathname } = useLocation();
  const { user } = useUser();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
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

  const displayName = user?.user_metadata?.full_name || 
    user?.email?.split("@")[0] || 
    "Admin";

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/users", label: "Users", icon: <Users size={18} /> },
    { href: "/admin/hosts", label: "Hosts", icon: <Building size={18} /> },
    { href: "/admin/events", label: "Events", icon: <CalendarRange size={18} /> },
    { href: "/admin/merchants", label: "Merchants", icon: <Store size={18} /> },
    { href: "/admin/subscriptions", label: "Subscriptions", icon: <CreditCard size={18} /> },
    { href: "/admin/reports", label: "Reports", icon: <FileBarChart size={18} /> },
    { href: "/admin/verifications", label: "Verifications", icon: <Shield size={18} /> },
    { href: "/admin/notifications", label: "Notifications", icon: <Bell size={18} /> },
    { href: "/admin/support", label: "Support", icon: <MessageSquare size={18} /> },
    { href: "/admin/platform", label: "Platform", icon: <GanttChart size={18} /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
  ];
  
  return (
    <div className={cn("flex h-full w-full flex-col bg-background border-r", className)}>
      <div className="p-4 border-b">
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
            <p className="text-xs text-muted-foreground">{displayName}</p>
          </div>
        </Link>
      </div>
      
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavItemClick}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="mt-auto p-4 border-t">
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
