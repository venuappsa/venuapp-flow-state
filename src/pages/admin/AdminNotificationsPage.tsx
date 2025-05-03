
import React, { useState } from "react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Trash, CheckSquare, Bell, Megaphone, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export default function AdminNotificationsPage() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for notifications
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New Host Registration",
      message: "EventCo Planners has registered as a new host on the platform.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      type: "user",
      read: false,
    },
    {
      id: "2",
      title: "System Update Complete",
      message: "The scheduled system update has been completed successfully.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      type: "system",
      read: false,
    },
    {
      id: "3",
      title: "Payment Processing Issue",
      message: "There was an error processing payments. The technical team has been alerted.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      type: "alert",
      read: false,
    },
    {
      id: "4",
      title: "New Vendor Verification Request",
      message: "Sweet Delights Bakery has submitted documents for verification.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      type: "user",
      read: true,
    },
    {
      id: "5",
      title: "Platform Usage Report",
      message: "Monthly usage report for April 2025 is now available.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      type: "system",
      read: true,
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read."
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    
    toast({
      title: "All notifications marked as read",
      description: `${notifications.filter(n => !n.read).length} notification(s) have been marked as read.`
    });
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    
    toast({
      title: "Notification deleted",
      description: "The notification has been permanently removed."
    });
  };

  const filteredNotifications = notifications.filter(notif => {
    // Filter by tab type
    if (selectedTab !== "all" && notif.type !== selectedTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !notif.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !notif.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-gray-500">Manage system and user notifications</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline" asChild>
              <a href="/admin/notification-settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </a>
            </Button>
            <Button>
              <Megaphone className="mr-2 h-4 w-4" />
              Send Announcement
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>
                  {unreadCount > 0 ? 
                    `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 
                    'No unread notifications'}
                </CardDescription>
              </div>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleMarkAllAsRead}
                  className="mt-2 md:mt-0"
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Mark all as read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="relative max-w-md mb-4 md:mb-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Tabs 
                  defaultValue="all" 
                  value={selectedTab} 
                  onValueChange={setSelectedTab}
                  className="w-full md:w-auto"
                >
                  <TabsList className="grid w-full md:w-auto grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="user">User</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-md ${!notification.read ? 'bg-accent/20' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {notification.type === "system" ? (
                          <Bell className="h-5 w-5 text-blue-500 mr-2" />
                        ) : notification.type === "alert" ? (
                          <Bell className="h-5 w-5 text-red-500 mr-2" />
                        ) : (
                          <Bell className="h-5 w-5 text-green-500 mr-2" />
                        )}
                        <div>
                          <h3 className="font-medium">{notification.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckSquare className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2">{notification.message}</p>
                    {!notification.read && (
                      <Badge className="mt-2" variant="outline">Unread</Badge>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium">No notifications found</p>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search term' : 'You have no notifications in this category'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPanelLayout>
  );
}
