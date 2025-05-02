
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CreditCard, Globe, Mail, Moon, Settings, Upload } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTheme } from "next-themes";

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { setTheme, theme } = useTheme();
  
  const [businessSettings, setBusinessSettings] = useState({
    name: "Venuapp",
    supportEmail: "support@venuapp.com",
    address: "123 Main Street, Sandton, Johannesburg",
    phone: "+27 11 123 4567",
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleBusinessSettingChange = (key: string, value: string) => {
    setBusinessSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setLogoPreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    // Mock upload logic
    if (logoFile) {
      console.log(`Mock logo upload: ${logoFile.name} (${Math.round(logoFile.size / 1024)} KB)`);
    }
    
    addNotification({
      title: "Settings Saved",
      message: "Your settings have been saved successfully.",
      type: "success",
    });
  };

  const handleThemeToggle = (isDark: boolean) => {
    setTheme(isDark ? "dark" : "light");
    
    addNotification({
      title: "Theme Changed",
      message: `Theme switched to ${isDark ? "dark" : "light"} mode.`,
      type: "info",
    });
  };

  return (
    <AdminPanelLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" /> General
            </TabsTrigger>
            <TabsTrigger value="notifications" onClick={() => navigate("/admin/settings/notifications")}>
              <Bell className="h-4 w-4 mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="platform" onClick={() => navigate("/admin/settings/platform")}>
              <Globe className="h-4 w-4 mr-2" /> Platform
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Business Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="business-name">Business Name</Label>
                      <Input
                        id="business-name"
                        value={businessSettings.name}
                        onChange={(e) => handleBusinessSettingChange("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="support-email">Support Email</Label>
                      <Input
                        id="support-email"
                        type="email"
                        value={businessSettings.supportEmail}
                        onChange={(e) => handleBusinessSettingChange("supportEmail", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      value={businessSettings.address}
                      onChange={(e) => handleBusinessSettingChange("address", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Business Phone</Label>
                    <Input
                      id="phone"
                      value={businessSettings.phone}
                      onChange={(e) => handleBusinessSettingChange("phone", e.target.value)}
                    />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Logo</h2>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-md border flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <img
                        src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
                        alt="Default Logo"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor="logo-upload" className="block mb-2">Upload Logo</Label>
                    <div className="flex gap-2">
                      <Input
                        id="logo-upload"
                        type="file"
                        onChange={handleLogoChange}
                        className="w-full"
                        accept="image/png, image/jpeg"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: 512px x 512px, PNG or JPEG
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Appearance</h2>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dark mode for the admin interface
                    </p>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={handleThemeToggle}
                  />
                </div>
              </Card>
              
              <Button onClick={handleSaveSettings} size="lg">
                Save Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPanelLayout>
  );
}
