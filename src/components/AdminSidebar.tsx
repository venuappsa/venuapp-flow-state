import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/AuthService";
import { useToast } from "@/components/ui/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
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
  GanttChart,
  BarChart3,
  FileText,
  DollarSign,
  CheckSquare,
  Globe,
  Megaphone,
  FileQuestion,
  LifeBuoy,
  AlertCircle
} from "lucide-react";

interface AdminSidebarProps {
  className?: string;
  onNavItemClick?: () => void;
}

export default function AdminSidebar({ className, onNavItemClick }: AdminSidebarProps) {
  const { pathname } = useLocation();
  const { user, forceClearUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { unreadCount } = useNotifications();

  const handleLogout = async () => {
    const success = await AuthService.signOut();
    if (success) {
      forceClearUser(); // Backup local state clearing
      navigate("/auth");
    }
  };

  const displayName = user?.user_metadata?.full_name || 
    user?.email?.split("@")[0] || 
    "Admin";

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
        { href: "/admin/fetchman", label: "Fetchmen", icon: <Shield size={18} />, badge: 7 },
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
        <nav className="px-2 py-4">
          {navigationCategories.map((category, index) => (
            <div key={category.category} className="mb-4">
              <h4 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {category.category}
              </h4>
              <div className="grid gap-1">
                {category.items.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onNavItemClick}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors relative",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.icon}
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <span className="absolute right-2 top-2 bg-venu-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              {index < navigationCategories.length - 1 && (
                <Separator className="my-4 mx-3" />
              )}
            </div>
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
