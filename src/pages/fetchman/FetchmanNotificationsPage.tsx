
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

export default function FetchmanNotificationsPage() {
  const { user } = useUser();
  const [fetchmanProfile, setFetchmanProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFetchmanProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('fetchman_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching fetchman profile:", error);
          return;
        }
        
        setFetchmanProfile(data);
      } catch (err) {
        console.error("Error in fetchFetchmanProfile:", err);
      }
    };
    
    fetchFetchmanProfile();
  }, [user]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!fetchmanProfile) return;
      
      try {
        // In a real app, we would fetch from a notifications table
        // For now, we'll use mock data
        const mockNotifications: Notification[] = [
          {
            id: "1",
            title: "New Assignment Available",
            message: "A new delivery assignment is available in your area. Check your assignments tab.",
            timestamp: new Date().toISOString(),
            read: false,
            type: "info"
          },
          {
            id: "2",
            title: "Payment Processed",
            message: "Your payment of R1,250 has been processed and will be deposited to your account.",
            timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            read: true,
            type: "success"
          },
          {
            id: "3",
            title: "Schedule Change",
            message: "Your shift on May 5th has been updated. Please check your schedule.",
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            read: false,
            type: "warning"
          },
          {
            id: "4",
            title: "Profile Verified",
            message: "Congratulations! Your Fetchman profile has been verified. You can now accept assignments.",
            timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            read: true,
            type: "success"
          },
          {
            id: "5",
            title: "System Maintenance",
            message: "The system will undergo maintenance on May 10th from 02:00 - 04:00. Some features may be temporarily unavailable.",
            timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            read: true,
            type: "info"
          }
        ];
        
        setNotifications(mockNotifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [fetchmanProfile]);

  const markAsRead = (id: string) => {
    // In a real app, we would update the database
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    // In a real app, we would update the database
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getNotificationTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return "bg-green-50 border-green-200";
      case 'warning':
        return "bg-yellow-50 border-yellow-200";
      case 'error':
        return "bg-red-50 border-red-200";
      case 'info':
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Notifications</h1>
          <p className="text-gray-500">Stay updated with your delivery assignments and account activity</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {getUnreadCount() > 0 && (
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              className="whitespace-nowrap"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>All Notifications</CardTitle>
            {getUnreadCount() > 0 && (
              <Badge variant="secondary">
                {getUnreadCount()} unread
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Loading notifications...</div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex items-start p-4 border rounded-lg ${getNotificationTypeStyles(notification.type)} ${!notification.read ? 'ring-2 ring-blue-300' : ''}`}
                >
                  <div className="mr-3 mt-1">
                    <Bell className={`h-5 w-5 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    
                    {!notification.read && (
                      <Button 
                        variant="link" 
                        className="text-xs p-0 h-auto mt-2"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">New Assignment Alerts</h3>
                <p className="text-sm text-gray-500">Get notified when new delivery assignments are available</p>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Payment Updates</h3>
                <p className="text-sm text-gray-500">Receive notifications about payments and earnings</p>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Schedule Changes</h3>
                <p className="text-sm text-gray-500">Be notified when your schedule changes</p>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">System Announcements</h3>
                <p className="text-sm text-gray-500">Important updates about the Fetchman platform</p>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
