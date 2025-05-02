
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Bell, Mail, AlertTriangle } from "lucide-react";
import SoftLaunchBanner from "@/components/banners/SoftLaunchBanner";
import MaintenanceBanner from "@/components/banners/MaintenanceBanner";

export default function AdminNotificationSettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  // Email summary notification settings
  const [emailSummaryEnabled, setEmailSummaryEnabled] = useState(true);
  const [summaryFrequency, setSummaryFrequency] = useState("weekly");
  const [adminEmail, setAdminEmail] = useState("admin@venuapp.com");

  // Platform notification settings
  const [vendorNotifications, setVendorNotifications] = useState(true);
  const [hostNotifications, setHostNotifications] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  // Email template settings
  const [customizeTemplates, setCustomizeTemplates] = useState(false);
  const [testMode, setTestMode] = useState(false);

  // Platform status banners
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [softLaunchMode, setSoftLaunchMode] = useState(true);

  const handleSaveSettings = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings updated",
        description: "Your notification settings have been saved successfully."
      });
    }, 1000);
  };

  return (
    <AdminPanelLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notification Settings</h1>
        </div>
        
        <Tabs defaultValue="email-summary">
          <TabsList className="mb-4">
            <TabsTrigger value="email-summary">Email Summary</TabsTrigger>
            <TabsTrigger value="platform-notifications">Platform Notifications</TabsTrigger>
            <TabsTrigger value="system-alerts">System Alerts</TabsTrigger>
          </TabsList>
          
          {/* Email Summary Settings */}
          <TabsContent value="email-summary">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Admin Email Summary
                </CardTitle>
                <CardDescription>
                  Configure automated email reports summarizing platform activity
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="weekly-summary" className="flex flex-col space-y-1">
                    <span>Weekly Summary Report</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive an email with key metrics and activity
                    </span>
                  </Label>
                  <Switch
                    id="weekly-summary"
                    checked={emailSummaryEnabled}
                    onCheckedChange={setEmailSummaryEnabled}
                  />
                </div>
                
                {emailSummaryEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="summary-frequency">Report Frequency</Label>
                      <Select value={summaryFrequency} onValueChange={setSummaryFrequency}>
                        <SelectTrigger id="summary-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@example.com"
                      />
                      <p className="text-sm text-muted-foreground">
                        This is where summary reports will be sent
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="test-mode"
                        checked={testMode}
                        onCheckedChange={setTestMode}
                      />
                      <Label htmlFor="test-mode">Enable test mode</Label>
                    </div>
                    
                    {testMode && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Test Mode Active</AlertTitle>
                        <AlertDescription>
                          Test emails will be sent to admin address only and will be clearly labeled as test messages.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </CardContent>
              
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Platform Notification Settings */}
          <TabsContent value="platform-notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Platform Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure which events trigger notifications for users
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="vendor-notifications" className="flex flex-col space-y-1">
                    <span>Vendor Notifications</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Bookings, reviews, and payment notifications
                    </span>
                  </Label>
                  <Switch
                    id="vendor-notifications"
                    checked={vendorNotifications}
                    onCheckedChange={setVendorNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="host-notifications" className="flex flex-col space-y-1">
                    <span>Host Notifications</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Event updates, vendor responses, and guest RSVPs
                    </span>
                  </Label>
                  <Switch
                    id="host-notifications"
                    checked={hostNotifications}
                    onCheckedChange={setHostNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="system-alerts" className="flex flex-col space-y-1">
                    <span>System Alerts</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Maintenance updates and system changes
                    </span>
                  </Label>
                  <Switch
                    id="system-alerts"
                    checked={systemAlerts}
                    onCheckedChange={setSystemAlerts}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="payment-alerts" className="flex flex-col space-y-1">
                    <span>Payment Alerts</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Subscription renewals and payment processing
                    </span>
                  </Label>
                  <Switch
                    id="payment-alerts"
                    checked={paymentAlerts}
                    onCheckedChange={setPaymentAlerts}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="customize-templates" className="flex flex-col space-y-1">
                      <span>Customize Email Templates</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Use custom email templates for notifications
                      </span>
                    </Label>
                    <Switch
                      id="customize-templates"
                      checked={customizeTemplates}
                      onCheckedChange={setCustomizeTemplates}
                    />
                  </div>
                  
                  {customizeTemplates && (
                    <div className="mt-4">
                      <Button variant="outline" asChild>
                        <Link to="/admin/settings/email-templates">
                          Edit Email Templates
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* System Alert Settings */}
          <TabsContent value="system-alerts">
            <Card>
              <CardHeader>
                <CardTitle>System Alert Banners</CardTitle>
                <CardDescription>
                  Configure system-wide notification banners
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="maintenance-mode" className="flex flex-col space-y-1">
                    <span>Maintenance Mode</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Display a maintenance banner to all users
                    </span>
                  </Label>
                  <Switch
                    id="maintenance-mode"
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
                
                {maintenanceMode && (
                  <div className="mt-2 mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Banner Preview:</p>
                    <MaintenanceBanner />
                  </div>
                )}
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="soft-launch-mode" className="flex flex-col space-y-1">
                    <span>Soft Launch Mode</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Display a soft launch banner to all users
                    </span>
                  </Label>
                  <Switch
                    id="soft-launch-mode"
                    checked={softLaunchMode}
                    onCheckedChange={setSoftLaunchMode}
                  />
                </div>
                
                {softLaunchMode && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Banner Preview:</p>
                    <SoftLaunchBanner />
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPanelLayout>
  );
}
