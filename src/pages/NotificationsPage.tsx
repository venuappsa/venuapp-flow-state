
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Check, Calendar, Trash2, Filter, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "system" | "merchant" | "event" | "guest" | "financial";
  read: boolean;
  timestamp: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      title: "New merchant application",
      message: "Food Truck Masters has applied to join your venue.",
      type: "merchant",
      read: false,
      timestamp: "2025-05-15T10:30:00Z",
    },
    {
      id: "n2",
      title: "Subscription renewed",
      message: "Your Growth subscription was successfully renewed for the next billing period.",
      type: "system",
      read: true,
      timestamp: "2025-05-14T09:15:00Z",
    },
    {
      id: "n3",
      title: "Event reminder",
      message: "Summer Festival starts tomorrow. Don't forget to check your vendor list.",
      type: "event",
      read: false,
      timestamp: "2025-05-14T16:45:00Z",
    },
    {
      id: "n4",
      title: "New guest message",
      message: "You have 3 unread messages from guests attending your events.",
      type: "guest",
      read: false,
      timestamp: "2025-05-14T14:20:00Z",
    },
    {
      id: "n5",
      title: "Weekly financial report",
      message: "Your weekly revenue report is ready to view.",
      type: "financial",
      read: true,
      timestamp: "2025-05-13T08:00:00Z",
    },
    {
      id: "n6",
      title: "Vendor payment received",
      message: "Sweet Treats has paid their stall fee for the Summer Festival.",
      type: "financial",
      read: true,
      timestamp: "2025-05-13T11:30:00Z",
    },
    {
      id: "n7",
      title: "System update",
      message: "Venuapp has been updated with new features. Check out what's new!",
      type: "system",
      read: true,
      timestamp: "2025-05-12T15:45:00Z",
    },
    {
      id: "n8",
      title: "Fetchman assignment",
      message: "5 fetchmen have been assigned to your Summer Festival event.",
      type: "event",
      read: false,
      timestamp: "2025-05-12T13:20:00Z",
    },
    {
      id: "n9",
      title: "Vendor menu approval needed",
      message: "Craft Beer Co. has submitted their menu for approval.",
      type: "merchant",
      read: true,
      timestamp: "2025-05-11T09:10:00Z",
    },
    {
      id: "n10",
      title: "Analytics insight",
      message: "Your guest attendance is up 15% from last month.",
      type: "system",
      read: true,
      timestamp: "2025-05-10T14:00:00Z",
    },
  ]);
  
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  
  const filteredNotifications = notifications.filter(notification => {
    // Filter by tab
    if (activeTab === "unread" && notification.read) return false;
    
    // Filter by notification type
    if (typeFilter !== "all" && notification.type !== typeFilter) return false;
    
    // Filter by search query
    if (searchQuery && 
        !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
      });
    }
  };
  
  const handleMarkAsRead = (ids: string[] = []) => {
    const idsToMark = ids.length > 0 ? ids : selectedNotifications;
    if (idsToMark.length === 0) return;
    
    setNotifications(notifications.map(notification => 
      idsToMark.includes(notification.id) ? { ...notification, read: true } : notification
    ));
    
    setSelectedNotifications([]);
    
    toast({
      title: "Notifications marked as read",
      description: `${idsToMark.length} notification(s) marked as read.`,
    });
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    setSelectedNotifications([]);
    
    toast({
      title: "All notifications marked as read",
    });
  };
  
  const handleDelete = () => {
    if (selectedNotifications.length === 0) return;
    
    setNotifications(notifications.filter(notification => 
      !selectedNotifications.includes(notification.id)
    ));
    
    setSelectedNotifications([]);
    
    toast({
      title: "Notifications deleted",
      description: `${selectedNotifications.length} notification(s) deleted.`,
    });
  };
  
  const handleSelectNotification = (id: string) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(nId => nId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case "merchant":
        return <MerchantIcon className="h-5 w-5 text-blue-500" />;
      case "event":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case "guest":
        return <GuestIcon className="h-5 w-5 text-green-500" />;
      case "financial":
        return <FinancialIcon className="h-5 w-5 text-venu-orange" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getNotificationTypeText = (type: string) => {
    switch(type) {
      case "merchant":
        return "Merchant";
      case "event":
        return "Event";
      case "guest":
        return "Guest";
      case "financial":
        return "Financial";
      case "system":
        return "System";
      default:
        return "Notification";
    }
  };

  return (
    <HostPanelLayout>
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-gray-600 mt-1">
              Manage your notifications and alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Preferences
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="merchant">Merchant</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Card>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between p-4 border-b">
                <TabsList className="bg-transparent border">
                  <TabsTrigger value="all" className="data-[state=active]:bg-gray-100">All</TabsTrigger>
                  <TabsTrigger value="unread" className="data-[state=active]:bg-gray-100">
                    Unread
                    <Badge className="ml-1 bg-venu-orange">
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  {selectedNotifications.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleMarkAsRead()}>
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Mark Read
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDelete}>
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="divide-y">
                <div className="flex items-center px-4 py-2 bg-gray-50">
                  <Checkbox 
                    id="select-all" 
                    className="mr-3"
                    checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    Select All
                  </label>
                </div>
                
                <TabsContent value="all" className="mt-0">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No notifications found
                    </div>
                  ) : (
                    <ul>
                      {filteredNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          selected={selectedNotifications.includes(notification.id)}
                          onSelect={() => handleSelectNotification(notification.id)}
                          onMarkAsRead={(id) => handleMarkAsRead([id])}
                          formatDate={formatDate}
                          getNotificationIcon={getNotificationIcon}
                          getNotificationTypeText={getNotificationTypeText}
                        />
                      ))}
                    </ul>
                  )}
                </TabsContent>
                
                <TabsContent value="unread" className="mt-0">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No unread notifications
                    </div>
                  ) : (
                    <ul>
                      {filteredNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          selected={selectedNotifications.includes(notification.id)}
                          onSelect={() => handleSelectNotification(notification.id)}
                          onMarkAsRead={(id) => handleMarkAsRead([id])}
                          formatDate={formatDate}
                          getNotificationIcon={getNotificationIcon}
                          getNotificationTypeText={getNotificationTypeText}
                        />
                      ))}
                    </ul>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </HostPanelLayout>
  );
}

interface NotificationItemProps {
  notification: Notification;
  selected: boolean;
  onSelect: () => void;
  onMarkAsRead: (id: string) => void;
  formatDate: (timestamp: string) => string;
  getNotificationIcon: (type: string) => React.ReactNode;
  getNotificationTypeText: (type: string) => string;
}

function NotificationItem({
  notification,
  selected,
  onSelect,
  onMarkAsRead,
  formatDate,
  getNotificationIcon,
  getNotificationTypeText
}: NotificationItemProps) {
  return (
    <li className={`border-b last:border-b-0 ${!notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
      <div className="flex px-4 py-3">
        <div className="flex items-start mr-4">
          <Checkbox 
            checked={selected}
            onCheckedChange={onSelect}
            className="mt-1 mr-2"
          />
          <div className="mt-1">
            {getNotificationIcon(notification.type)}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm">{notification.title}</h3>
            <div className="flex items-center gap-2 ml-2">
              <Badge className={`text-xs ${!notification.read ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                {getNotificationTypeText(notification.type)}
              </Badge>
              <span className="text-xs whitespace-nowrap text-gray-500">{formatDate(notification.timestamp)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          
          {!notification.read && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2 text-blue-600"
                onClick={() => onMarkAsRead(notification.id)}
              >
                Mark as read
              </Button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

// Icon components
function MerchantIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M13 2v7h7" />
    </svg>
  );
}

function GuestIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function FinancialIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M17.8 14c-.73-1.4-2.15-2-3.8-2h-4c-1.65 0-3.07.6-3.8 2" />
    </svg>
  );
}
