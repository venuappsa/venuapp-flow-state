
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, MessageSquare, CreditCard, CheckCircle } from 'lucide-react';
import { VendorNotification } from '@/utils/vendorAnalyticsData';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsCardProps {
  notifications: VendorNotification[];
  loading?: boolean;
}

const NotificationsCard = ({ notifications, loading = false }: NotificationsCardProps) => {
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'booking': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'review': return <MessageSquare className="h-4 w-4 text-amber-500" />;
      case 'payment': return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'system': return <Bell className="h-4 w-4 text-purple-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-6 h-80 animate-pulse bg-gray-100"></CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Notifications</CardTitle>
        <Button variant="outline" size="sm" className="text-xs">
          Mark all as read
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`flex items-start space-x-4 p-3 rounded-lg ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                >
                  <div className={`rounded-full p-2 ${
                    notification.read ? 'bg-gray-100' : 'bg-blue-100'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        notification.read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <span className="rounded-full h-2 w-2 bg-blue-500"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <CheckCircle className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500 font-medium">All caught up!</p>
              <p className="text-gray-400 text-sm">You have no new notifications</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;
