import React from "react";
import FetchmanPanelLayout from "@/components/layouts/FetchmanPanelLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Settings, CheckCircle, Calendar, MessageSquare, AlertTriangle, Store, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";

export default function FetchmanNotificationsPage() {
  const { notifications: contextNotifications, markAllAsRead, markAsRead } = useNotifications();
  
  // Filter notifications to show only those relevant to fetchman
  const notifications = [
    { id: 1, type: "assignment", title: "New Assignment", description: "You have been assigned to the Summer Festival event.", time: "10 minutes ago", read: false, icon: <Calendar className="h-5 w-5 text-venu-orange" /> },
    { id: 2, type: "message", title: "New Message", description: "You have a new message from the event organizer.", time: "1 hour ago", read: false, icon: <MessageSquare className="h-5 w-5 text-blue-500" /> },
    { id: 3, type: "alert", title: "Schedule Change", description: "Your shift for the Wedding Expo has been rescheduled.", time: "2 hours ago", read: true, icon: <AlertTriangle className="h-5 w-5 text-amber-500" /> },
    { id: 4, type: "earnings", title: "Payment Processed", description: "Your payment for last week's assignments has been processed.", time: "Yesterday", read: true, icon: <Store className="h-5 w-5 text-green-500" /> },
    { id: 5, type: "assignment", title: "Assignment Completed", description: "You have successfully completed the Corporate Retreat assignment.", time: "2 days ago", read: true, icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
    // In a real implementation, this would update the local notifications as well
  };
  
  const handleMarkAsRead = (id: number) => {
    markAsRead(id.toString());
    // In a real implementation, this would update the local notification
  };

  return (
    <FetchmanPanelLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple">
            Notifications
          </h1>
          <Button variant="outline" className="flex gap-2 items-center">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg flex gap-2 items-center">
                  <Bell className="h-5 w-5 text-venu-orange" />
                  All Notifications
                </CardTitle>
                <CardDescription>Stay updated on your assignments and messages</CardDescription>
              </div>
              {unreadCount > 0 && (
                <Badge className="bg-venu-orange">
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pb-1">
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex gap-4 p-3 rounded-lg ${notification.read ? '' : 'bg-gray-50'}`}
                      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                      role="button"
                    >
                      <div className="mt-1">{notification.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className={`font-medium ${notification.read ? '' : 'text-venu-dark-purple'}`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{notification.description}</p>
                      </div>
                      {!notification.read && (
                        <div className="self-center">
                          <div className="h-2 w-2 bg-venu-orange rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Other tab contents - follow the same pattern as the "all" tab */}
              <TabsContent value="unread">
                <div className="space-y-4">
                  {notifications.filter(n => !n.read).map((notification) => (
                    <div 
                      key={notification.id} 
                      className="flex gap-4 p-3 rounded-lg bg-gray-50"
                      onClick={() => handleMarkAsRead(notification.id)}
                      role="button"
                    >
                      <div className="mt-1">{notification.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-venu-dark-purple">{notification.title}</h3>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{notification.description}</p>
                      </div>
                      <div className="self-center">
                        <div className="h-2 w-2 bg-venu-orange rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Filter by type tabs */}
              <TabsContent value="assignments">
                <div className="space-y-4">
                  {notifications.filter(n => n.type === 'assignment').map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex gap-4 p-3 rounded-lg ${notification.read ? '' : 'bg-gray-50'}`}
                      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                      role="button"
                    >
                      <div className="mt-1">{notification.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className={`font-medium ${notification.read ? '' : 'text-venu-dark-purple'}`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{notification.description}</p>
                      </div>
                      {!notification.read && (
                        <div className="self-center">
                          <div className="h-2 w-2 bg-venu-orange rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="messages">
                <div className="space-y-4">
                  {notifications.filter(n => n.type === 'message').map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex gap-4 p-3 rounded-lg ${notification.read ? '' : 'bg-gray-50'}`}
                      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                      role="button"
                    >
                      <div className="mt-1">{notification.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className={`font-medium ${notification.read ? '' : 'text-venu-dark-purple'}`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{notification.description}</p>
                      </div>
                      {!notification.read && (
                        <div className="self-center">
                          <div className="h-2 w-2 bg-venu-orange rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="alerts">
                <div className="space-y-4">
                  {notifications.filter(n => n.type === 'alert').map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex gap-4 p-3 rounded-lg ${notification.read ? '' : 'bg-gray-50'}`}
                      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                      role="button"
                    >
                      <div className="mt-1">{notification.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className={`font-medium ${notification.read ? '' : 'text-venu-dark-purple'}`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{notification.description}</p>
                      </div>
                      {!notification.read && (
                        <div className="self-center">
                          <div className="h-2 w-2 bg-venu-orange rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            {notifications.length > 5 && (
              <div className="flex justify-center py-4">
                <Button variant="outline">Load More</Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleMarkAllAsRead}>Mark All as Read</Button>
          <Button variant="outline">Clear All</Button>
        </div>
      </div>
    </FetchmanPanelLayout>
  );
}
