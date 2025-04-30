
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UserRound,
  ClipboardList,
  DollarSign,
  Radio,
  Settings,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  InboxIcon,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  icon,
  label,
  path,
  isActive,
  isCollapsed,
  onClick,
}: SidebarItemProps) => (
  <Link to={path}>
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start mb-1",
        isActive
          ? "bg-venu-orange/10 text-venu-orange hover:bg-venu-orange/15"
          : "text-gray-600 hover:text-venu-orange hover:bg-venu-orange/5"
      )}
      onClick={onClick}
    >
      {icon}
      {!isCollapsed && <span className="ml-2">{label}</span>}
    </Button>
  </Link>
);

export default function VendorSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/vendor/dashboard",
    },
    {
      icon: <UserRound size={20} />,
      label: "Profile",
      path: "/vendor/profile",
    },
    {
      icon: <ClipboardList size={20} />,
      label: "Services",
      path: "/vendor/services",
    },
    {
      icon: <DollarSign size={20} />,
      label: "Pricing",
      path: "/vendor/pricing",
    },
    {
      icon: <InboxIcon size={20} />,
      label: "Bookings",
      path: "/vendor/bookings",
    },
    {
      icon: <Calendar size={20} />,
      label: "Availability",
      path: "/vendor/availability",
    },
    {
      icon: <Star size={20} />,
      label: "Reviews",
      path: "/vendor/reviews",
    },
    {
      icon: <Radio size={20} />,
      label: "Go Live",
      path: "/vendor/go-live",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Messages",
      path: "/vendor/messages",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/vendor/settings",
    },
    {
      icon: <HelpCircle size={20} />,
      label: "Support",
      path: "/vendor/support",
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
            />
          ))}
        </nav>
      </ScrollArea>
      <div className="p-3 border-t border-gray-200">
        {!isCollapsed && (
          <div className="px-2 py-3">
            <div className="text-xs font-medium text-gray-500">
              Vendor Account
            </div>
            <div className="text-sm font-medium truncate">
              {/* This would be populated with the user's business name */}
              Business Name
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
