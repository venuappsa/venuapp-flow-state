import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, Calendar, User, Store, Settings, AlertTriangle } from "lucide-react";

const mockNotifications = [
  {
    id: "n1",
    title: "New vendor application",
    message: "Classic Catering has applied to be a vendor at your venue",
    type: "vendor",
    isRead: false,
    timestamp: "2025-05-01T14:30:00Z"
  },
  {
    id: "n2",
    title: "Event booking confirmed",
    message: "Wedding Expo 2025 has been confirmed for June 15, 2025",
    type: "event",
    isRead: false,
    timestamp: "2025-05-01T10:15:00Z"
  },
  {
    id: "n3",
    title: "System maintenance",
    message: "Venuapp will undergo scheduled maintenance on May 10, 2025",
    type: "system",
    isRead: true,
    timestamp: "2025-04-28T09:00:00Z"
  },
  {
    id: "n4",
    title: "Payment received",
    message: "Payment of R12,500 received for Corporate Retreat booking",
    type: "payment",
    isRead: true,
    timestamp: "2025-04-27T16:45:00Z"
  },
  {
    id: "n5",
    title: "New feature available",
    message: "Try our new vendor rating system now available in your dashboard",
    type: "system",
    isRead: false,
    timestamp: "2025-04-26T11:20:00Z"
  }
];

export default function HostNotificationsPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today, " + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Yesterday, " + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' }) + ", " + 
        date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ", " + 
        date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-6 w-6 text-blue-500" />;
      case 'vendor':
        return <Store className="h-6 w-6 text-purple-500" />;
      case 'payment':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'system':
        return <Settings className="h-6 w-6 text-gray-500" />;
      default:
        return <Bell className="h-6 w-6 text-amber-500" />;
    }
  };
  
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  
  return (
    <HostPanelLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-venu-orange hover:bg-venu-dark-orange">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div>
            <Button variant="outline" size="sm">
              Mark all as read
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && <Badge className="ml-2 bg-venu-orange">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNotifications.length > 0 ? (
                    mockNotifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`flex gap-4 p-4 rounded-lg transition-colors ${
                          notification.isRead ? 'bg-white' : 'bg-blue-50'
                        } hover:bg-gray-50`}
                      >
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className={`font-medium ${!notification.isRead && 'text-blue-700'}`}>
                              {notification.title}
                              {!notification.isRead && (
                                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2"></span>
                              )}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-2 text-gray-500">No notifications at this time</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Other tab contents would filter by notification type */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Event Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNotifications.filter(n => n.type === 'event').length > 0 ? (
                    mockNotifications
                      .filter(n => n.type === 'event')
                      .map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`flex gap-4 p-4 rounded-lg transition-colors ${
                            notification.isRead ? 'bg-white' : 'bg-blue-50'
                          } hover:bg-gray-50`}
                        >
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className={`font-medium ${!notification.isRead && 'text-blue-700'}`}>
                                {notification.title}
                                {!notification.isRead && (
                                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2"></span>
                                )}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatDate(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">{notification.message}</p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-2 text-gray-500">No event notifications</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Similar structure for the other tabs */}
          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNotifications.filter(n => n.type === 'vendor').length > 0 ? (
                    mockNotifications
                      .filter(n => n.type === 'vendor')
                      .map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`flex gap-4 p-4 rounded-lg transition-colors ${
                            notification.isRead ? 'bg-white' : 'bg-blue-50'
                          } hover:bg-gray-50`}
                        >
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className={`font-medium ${!notification.isRead && 'text-blue-700'}`}>
                                {notification.title}
                                {!notification.isRead && (
                                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2"></span>
                                )}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatDate(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">{notification.message}</p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <Store className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-2 text-gray-500">No vendor notifications</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNotifications.filter(n => n.type === 'payment').length > 0 ? (
                    mockNotifications
                      .filter(n => n.type === 'payment')
                      .map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`flex gap-4 p-4 rounded-lg transition-colors ${
                            notification.isRead ? 'bg-white' : 'bg-blue-50'
                          } hover:bg-gray-50`}
                        >
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className={`font-medium ${!notification.isRead && 'text-blue-700'}`}>
                                {notification.title}
                                {!notification.isRead && (
                                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2"></span>
                                )}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatDate(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">{notification.message}</p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-2 text-gray-500">No payment notifications</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNotifications.filter(n => n.type === 'system').length > 0 ? (
                    mockNotifications
                      .filter(n => n.type === 'system')
                      .map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`flex gap-4 p-4 rounded-lg transition-colors ${
                            notification.isRead ? 'bg-white' : 'bg-blue-50'
                          } hover:bg-gray-50`}
                        >
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className={`font-medium ${!notification.isRead && 'text-blue-700'}`}>
                                {notification.title}
                                {!notification.isRead && (
                                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2"></span>
                                )}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatDate(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">{notification.message}</p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-2 text-gray-500">No system notifications</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                You can customize which notifications you receive and how you receive them.
              </p>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Manage Notification Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </HostPanelLayout>
  );
}
