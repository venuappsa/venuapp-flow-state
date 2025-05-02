
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, Settings } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { usePlatformSettings } from "@/contexts/PlatformSettingsContext";
import SoftLaunchBanner from "@/components/banners/SoftLaunchBanner";

export default function AdminPlatformSettingsPage() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { settings, updateSettings, saveSettings } = usePlatformSettings();
  
  const handleSettingChange = (key: string, value: string | boolean) => {
    updateSettings({ [key]: value });
  };

  const handleSaveSettings = () => {
    saveSettings();
    
    addNotification({
      title: "Platform settings saved",
      message: "Your platform settings have been updated successfully.",
      type: "success",
    });
  };

  return (
    <AdminPanelLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/admin/settings")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Platform Settings</h1>
            <p className="text-gray-500">Configure global platform settings</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="mr-2 h-5 w-5" /> Basic Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input
                  id="platform-name"
                  value={settings.platformName}
                  onChange={(e) => handleSettingChange("platformName", e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="primary-color">Primary Color Theme</Label>
                <Select 
                  value={settings.primaryColor} 
                  onValueChange={(value) => handleSettingChange("primaryColor", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a color theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="mt-2 flex gap-2">
                  <div className={`h-6 w-6 rounded-full ${settings.primaryColor === 'blue' ? 'bg-blue-500' : settings.primaryColor === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                  <span className="text-sm text-muted-foreground">Preview</span>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Feature Toggles</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="vendor-discovery" className="text-base">Enable Vendor Discovery</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow public users to browse and discover vendors
                  </p>
                </div>
                <Switch
                  id="vendor-discovery"
                  checked={settings.enableVendorDiscovery}
                  onCheckedChange={(checked) => handleSettingChange("enableVendorDiscovery", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reviews-system" className="text-base">Enable Reviews System</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to leave and view reviews for vendors
                  </p>
                </div>
                <Switch
                  id="reviews-system"
                  checked={settings.enableReviewsSystem}
                  onCheckedChange={(checked) => handleSettingChange("enableReviewsSystem", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="quote-requests" className="text-base">Enable Public Quote Requests</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow public users to request quotes from vendors
                  </p>
                </div>
                <Switch
                  id="quote-requests"
                  checked={settings.enablePublicQuoteRequests}
                  onCheckedChange={(checked) => handleSettingChange("enablePublicQuoteRequests", checked)}
                />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Launch Controls</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="soft-launch" className="text-base">Soft Launch Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Display soft launch banner and limit some features
                  </p>
                </div>
                <Switch
                  id="soft-launch"
                  checked={settings.isSoftLaunchActive}
                  onCheckedChange={(checked) => handleSettingChange("isSoftLaunchActive", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode" className="text-base">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Restrict access to all routes except login
                  </p>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                />
              </div>
            </div>
          </Card>
          
          <Button onClick={handleSaveSettings} size="lg">
            Save Platform Settings
          </Button>
          
          {settings.isSoftLaunchActive && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800 text-sm">
              <strong>Note:</strong> Soft launch mode is currently enabled. A banner will be displayed to users.
            </div>
          )}
          
          {settings.maintenanceMode && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-800 text-sm">
              <strong>Warning:</strong> Maintenance mode is currently enabled. Only administrators will be able to access the platform.
            </div>
          )}
        </div>
      </div>
    </AdminPanelLayout>
  );
}
