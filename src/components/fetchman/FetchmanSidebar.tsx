
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  DollarSign,
  Settings,
  ChevronRight,
  ChevronLeft,
  Bell,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/contexts/NotificationContext";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  isCollapsed: boolean;
  badgeCount?: number;
  onClick?: () => void;
}

const SidebarItem = ({
  icon,
  label,
  path,
  isActive,
  isCollapsed,
  badgeCount,
  onClick,
}: SidebarItemProps) => (
  <Link to={path}>
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start mb-1 relative",
        isActive
          ? "bg-venu-orange/10 text-venu-orange hover:bg-venu-orange/15"
          : "text-gray-600 hover:text-venu-orange hover:bg-venu-orange/5"
      )}
      onClick={onClick}
    >
      {icon}
      {!isCollapsed && <span className="ml-2">{label}</span>}
      {badgeCount && badgeCount > 0 && (
        <span className="absolute top-1 right-1 bg-venu-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {badgeCount}
        </span>
      )}
    </Button>
  </Link>
);

export default function FetchmanSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { unreadCount } = useNotifications();

  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/fetchman/dashboard",
    },
    {
      icon: <CalendarCheck size={20} />,
      label: "Assignments",
      path: "/fetchman/assignments",
    },
    {
      icon: <Clock size={20} />,
      label: "Schedule",
      path: "/fetchman/schedule",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Messages",
      path: "/fetchman/messages",
      badgeCount: 3,
    },
    {
      icon: <Bell size={20} />,
      label: "Notifications",
      path: "/fetchman/notifications",
      badgeCount: unreadCount,
    },
    {
      icon: <DollarSign size={20} />,
      label: "Earnings",
      path: "/fetchman/earnings",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/fetchman/settings",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="px-3 py-4 flex items-center justify-between">
        {!isCollapsed && (
          <Link to="/" className="text-xl font-bold text-venu-orange">
            Venuapp
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1 p-3">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
              isCollapsed={isCollapsed}
              badgeCount={item.badgeCount}
            />
          ))}
        </nav>
      </ScrollArea>
      <div className="p-3 border-t border-gray-200">
        {!isCollapsed && (
          <div className="px-2 py-3">
            <div className="text-xs font-medium text-gray-500">
              Fetchman Account
            </div>
            <div className="text-sm font-medium truncate">
              {/* This would be populated with the user's name */}
              Fetchman
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
