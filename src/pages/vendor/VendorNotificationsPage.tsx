
import React, { useState } from "react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, InfoIcon, Bell, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function VendorNotificationsPage() {
  // Mock notifications data
  const mockNotifications = [
    { 
      id: 1, 
      type: "booking", 
      title: "New Booking Request", 
      message: "You have received a new booking request from John Smith for Wedding Expo 2025.", 
      date: "2025-05-02T10:30:00", 
      read: false, 
      priority: "high" 
    },
    { 
      id: 2, 
      type: "system", 
      title: "Profile Verification Complete", 
      message: "Your vendor profile has been verified. You now have access to all platform features.", 
      date: "2025-05-01T14:45:00", 
      read: true, 
      priority: "medium" 
    },
    { 
      id: 3, 
      type: "payment", 
      title: "Payment Received", 
      message: "You have received a payment of R 3,500 for Corporate Retreat event.", 
      date: "2025-04-30T09:15:00", 
      read: true, 
      priority: "medium" 
    },
    { 
      id: 4, 
      type: "review", 
      title: "New Review Received", 
      message: "Sarah Johnson has left a 5-star review for your services at Birthday Celebration event.", 
      date: "2025-04-28T16:20:00", 
      read: true, 
      priority: "medium" 
    },
    { 
      id: 5, 
      type: "message", 
      title: "New Message from Host", 
      message: "Event Masters has sent you a message regarding the upcoming Music Festival event.", 
      date: "2025-04-27T11:05:00", 
      read: false, 
      priority: "high" 
    },
    { 
      id: 6, 
      type: "system", 
      title: "System Maintenance", 
      message: "Venuapp will be undergoing scheduled maintenance on May 5, 2025, from 2:00 AM to 4:00 AM.", 
      date: "2025-04-25T08:30:00", 
      read: true, 
      priority: "low" 
    }
  ];

  const [notifications, setNotifications] = useState(mockNotifications);
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const getNotificationIcon = (type: string, priority: string) => {
    switch (type) {
      case "booking":
        return <Bell className={`h-5 w-5 ${priority === "high" ? "text-venu-orange" : "text-blue-500"}`} />;
      case "payment":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "system":
        return <InfoIcon className={`h-5 w-5 ${priority === "low" ? "text-gray-500" : "text-blue-500"}`} />;
      case "review":
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      case "message":
        return <Bell className="h-5 w-5 text-venu-orange" />;
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "booking":
        return "bg-blue-100 text-blue-800";
      case "payment":
        return "bg-green-100 text-green-800";
      case "system":
        return "bg-gray-100 text-gray-800";
      case "review":
        return "bg-purple-100 text-purple-800";
      case "message":
        return "bg-venu-orange/20 text-venu-orange";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <VendorPanelLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with all your activities</p>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="outline" onClick={clearAllNotifications}>
                Clear all
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-venu-orange">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>All your recent notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`border p-4 rounded-lg transition-colors ${
                          notification.read ? "bg-white" : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                                {notification.title}
                              </h3>
                              <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getTypeBadgeColor(notification.type)}>
                                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                              </Badge>
                              <Badge className={getPriorityBadgeColor(notification.priority)}>
                                {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-end gap-2">
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              Mark as read
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteNotification(notification.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <FilterX className="h-16 w-16 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No notifications</h3>
                    <p className="text-muted-foreground">You don't have any notifications at the moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="unread">
            <Card>
              <CardHeader>
                <CardTitle>Unread Notifications</CardTitle>
                <CardDescription>Notifications you haven't read yet</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.filter(n => !n.read).length > 0 ? (
                  <div className="space-y-4">
                    {notifications.filter(n => !n.read).map(notification => (
                      <div 
                        key={notification.id} 
                        className="border border-blue-200 p-4 rounded-lg bg-blue-50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">
                                {notification.title}
                              </h3>
                              <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getTypeBadgeColor(notification.type)}>
                                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                              </Badge>
                              <Badge className={getPriorityBadgeColor(notification.priority)}>
                                {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                            Mark as read
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteNotification(notification.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="h-16 w-16 text-green-300" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">All caught up!</h3>
                    <p className="text-muted-foreground">You have read all your notifications.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Notifications</CardTitle>
                <CardDescription>Notifications related to your bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.filter(n => n.type === "booking").length > 0 ? (
                  <div className="space-y-4">
                    {notifications.filter(n => n.type === "booking").map(notification => (
                      <div 
                        key={notification.id} 
                        className={`border p-4 rounded-lg transition-colors ${
                          notification.read ? "bg-white" : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                                {notification.title}
                              </h3>
                              <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getPriorityBadgeColor(notification.priority)}>
                                {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-end gap-2">
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              Mark as read
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteNotification(notification.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <FilterX className="h-16 w-16 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No booking notifications</h3>
                    <p className="text-muted-foreground">You don't have any booking notifications at the moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Notifications</CardTitle>
                <CardDescription>Notifications related to your payments</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.filter(n => n.type === "payment").length > 0 ? (
                  <div className="space-y-4">
                    {notifications.filter(n => n.type === "payment").map(notification => (
                      <div 
                        key={notification.id} 
                        className={`border p-4 rounded-lg transition-colors ${
                          notification.read ? "bg-white" : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                                {notification.title}
                              </h3>
                              <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getPriorityBadgeColor(notification.priority)}>
                                {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-end gap-2">
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              Mark as read
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteNotification(notification.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <FilterX className="h-16 w-16 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No payment notifications</h3>
                    <p className="text-muted-foreground">You don't have any payment notifications at the moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>System updates and announcements</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.filter(n => n.type === "system").length > 0 ? (
                  <div className="space-y-4">
                    {notifications.filter(n => n.type === "system").map(notification => (
                      <div 
                        key={notification.id} 
                        className={`border p-4 rounded-lg transition-colors ${
                          notification.read ? "bg-white" : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                                {notification.title}
                              </h3>
                              <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getPriorityBadgeColor(notification.priority)}>
                                {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-end gap-2">
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              Mark as read
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteNotification(notification.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <FilterX className="h-16 w-16 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No system notifications</h3>
                    <p className="text-muted-foreground">You don't have any system notifications at the moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Customize how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Notification Channels</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications" className="flex items-center gap-2">
                        Email Notifications
                      </Label>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notifications" className="flex items-center gap-2">
                        SMS Notifications
                      </Label>
                      <Switch id="sms-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications" className="flex items-center gap-2">
                        Push Notifications
                      </Label>
                      <Switch id="push-notifications" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Notification Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="booking-notifications" className="flex items-center gap-2">
                        Booking Notifications
                      </Label>
                      <Switch id="booking-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="payment-notifications" className="flex items-center gap-2">
                        Payment Notifications
                      </Label>
                      <Switch id="payment-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="review-notifications" className="flex items-center gap-2">
                        Review Notifications
                      </Label>
                      <Switch id="review-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="message-notifications" className="flex items-center gap-2">
                        Message Notifications
                      </Label>
                      <Switch id="message-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-notifications" className="flex items-center gap-2">
                        System Notifications
                      </Label>
                      <Switch id="system-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-notifications" className="flex items-center gap-2">
                        Marketing & Promotions
                      </Label>
                      <Switch id="marketing-notifications" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorPanelLayout>
  );
}
