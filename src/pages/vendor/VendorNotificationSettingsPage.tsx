
import React from "react";
import { useNavigate } from "react-router-dom";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

export default function VendorNotificationSettingsPage() {
  const navigate = useNavigate();
  const { preferences, updatePreferences, addNotification } = useNotifications();

  const handleSavePreferences = () => {
    addNotification({
      title: "Notification Preferences Saved",
      message: "Your notification preferences have been saved successfully.",
      type: "success",
    });
  };

  return (
    <VendorPanelLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/vendor/settings")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Notification Settings</h1>
            <p className="text-gray-500">Configure how you receive notifications</p>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.enableEmailNotifications}
                onCheckedChange={(checked) => updatePreferences({ enableEmailNotifications: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="toast-notifications" className="text-base">Toast Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Show popup notifications in the app
                </p>
              </div>
              <Switch
                id="toast-notifications"
                checked={preferences.enableToastNotifications}
                onCheckedChange={(checked) => updatePreferences({ enableToastNotifications: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="in-app-notifications" className="text-base">In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Show notifications in the notification center
                </p>
              </div>
              <Switch
                id="in-app-notifications"
                checked={preferences.enableInAppNotifications}
                onCheckedChange={(checked) => updatePreferences({ enableInAppNotifications: checked })}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Notification Types</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Booking Updates</p>
                    <p className="text-sm text-gray-500">When your bookings change status</p>
                  </div>
                  <Switch defaultChecked id="booking-notifications" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Reviews</p>
                    <p className="text-sm text-gray-500">When you receive new reviews</p>
                  </div>
                  <Switch defaultChecked id="review-notifications" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Updates</p>
                    <p className="text-sm text-gray-500">When payments are processed</p>
                  </div>
                  <Switch defaultChecked id="payment-notifications" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-gray-500">Platform announcements and updates</p>
                  </div>
                  <Switch defaultChecked id="system-notifications" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleSavePreferences} className="w-full">
                Save Preferences
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Test Notification</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click the button below to send yourself a test notification with your current preferences.
            </p>
            <Button 
              onClick={() => {
                addNotification({
                  title: "Test Notification",
                  message: "This is a test notification to preview your settings.",
                  type: "info"
                });
              }}
              variant="outline"
            >
              Send Test Notification
            </Button>
          </Card>
        </div>
      </div>
    </VendorPanelLayout>
  );
}
