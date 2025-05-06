
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast, ToastActionElement } from "@/hooks/use-toast";
// Don't import useToast from here, to avoid circular dependency

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
  link?: string;
}

interface NotificationPreferences {
  enableEmailNotifications: boolean;
  enableToastNotifications: boolean;
  enableInAppNotifications: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  sendEmail: (to: string, subject: string, body: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enableEmailNotifications: true,
    enableToastNotifications: true,
    enableInAppNotifications: true
  });
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Load preferences from localStorage on initial mount
  useEffect(() => {
    console.log("NotificationProvider: Initializing");
    const savedPreferences = localStorage.getItem('notificationPreferences');
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        setPreferences(parsedPreferences);
      } catch (e) {
        console.error('Error parsing notification preferences:', e);
      }
    }
  }, []);
  
  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  }, [preferences]);
  
  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast if enabled in preferences
    if (preferences.enableToastNotifications) {
      // Using imported toast function directly, not hook
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'error' ? 'destructive' : 'default',
        ...(notification.link && {
          action: <ToastActionElement altText="View" asChild>
            <a href={notification.link}>View</a>
          </ToastActionElement>
        })
      });
    }
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };
  
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };
  
  const sendEmail = (to: string, subject: string, body: string) => {
    // Mock email sending with console log
    if (preferences.enableEmailNotifications) {
      console.log(`Email sent to ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${body}`);
    }
  };
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        preferences,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        updatePreferences,
        sendEmail
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
