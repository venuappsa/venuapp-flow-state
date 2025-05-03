
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

// Added new interface for system notices from the old notice board
interface SystemNotice {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "error";
  date: string;
  read: boolean;
  link?: string; // Added link property for navigation
}

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className }: NotificationBellProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  // Added system notices (formerly from notice board)
  const [systemNotices, setSystemNotices] = useState<SystemNotice[]>([
    {
      id: "1",
      title: "System Maintenance",
      content: "Scheduled maintenance on Saturday from 2AM to 4AM. Brief service interruptions expected.",
      type: "info",
      date: "2023-04-28",
      read: false,
      link: "/admin/system", // Added link for system maintenance notice
    },
    {
      id: "2",
      title: "New Feature: QR Code Generation",
      content: "You can now generate QR codes for your venues! Find this feature in your venue settings.",
      type: "success",
      date: "2023-04-27",
      read: false,
      link: "/admin/platform", // Added link for platform features notice
    },
    {
      id: "3",
      title: "Payment Processing Update",
      content: "We've improved our payment processing system for faster transactions and better reporting.",
      type: "info",
      date: "2023-04-25",
      read: true,
      link: "/admin/payments", // Added link for payments notice
    }
  ]);
  
  const unreadSystemNotices = systemNotices.filter(notice => !notice.read).length;
  const totalUnreadCount = unreadCount + unreadSystemNotices;

  const handleNotificationClick = (id: string) => {
    // Mark the notification as read
    markAsRead(id);
    
    // Find the notification to get its link
    const notification = notifications.find(n => n.id === id);
    if (notification?.link) {
      // Close dropdown before navigating
      setOpen(false);
      
      // Wait a moment before navigating to ensure the dropdown closes smoothly
      setTimeout(() => {
        // Using navigate instead of window.location.href for SPA navigation
        navigate(notification.link);
      }, 100);
    } else {
      // If no specific link, just close the dropdown
      setOpen(false);
    }
  };
  
  const handleSystemNoticeClick = (id: string) => {
    // Mark the notice as read
    setSystemNotices(
      systemNotices.map(notice =>
        notice.id === id ? { ...notice, read: true } : notice
      )
    );
    
    // Find the notice to get its link
    const notice = systemNotices.find(n => n.id === id);
    if (notice?.link) {
      // Close dropdown before navigating
      setOpen(false);
      
      // Wait a moment before navigating to ensure the dropdown closes smoothly
      setTimeout(() => {
        // Navigate to the notice's link
        navigate(notice.link);
      }, 100);
    } else {
      // If no specific link, just close the dropdown
      setOpen(false);
    }
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setSystemNotices(
      systemNotices.map(notice => ({ ...notice, read: true }))
    );
  };

  // Combine notifications and system notices for display
  const allNotifications = [
    ...notifications.slice(0, 5).map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      timestamp: n.timestamp,
      read: n.read,
      isSystemNotice: false,
      type: "notification" as const,
      link: n.link // Pass through the link from the notification
    })),
    ...systemNotices.map(n => ({
      id: n.id,
      title: n.title,
      message: n.content,
      timestamp: new Date(n.date).toISOString(),
      read: n.read,
      isSystemNotice: true,
      type: n.type,
      link: n.link // Pass through the link from the system notice
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative ${className}`}>
          <Bell className="h-5 w-5" />
          {totalUnreadCount > 0 && (
            <Badge variant="destructive" className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
              {totalUnreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {totalUnreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs h-6">
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px] overflow-auto">
          {allNotifications.length > 0 ? (
            allNotifications.map((notification) => (
              <DropdownMenuItem
                key={`${notification.isSystemNotice ? 'notice-' : 'notif-'}${notification.id}`}
                onSelect={(e) => {
                  e.preventDefault();
                  notification.isSystemNotice 
                    ? handleSystemNoticeClick(notification.id) 
                    : handleNotificationClick(notification.id);
                }}
                className={`p-4 cursor-pointer ${!notification.read ? 'bg-accent/50' : ''}`}
              >
                <div className="w-full">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
