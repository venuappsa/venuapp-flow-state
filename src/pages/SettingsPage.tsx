
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Bell, 
  Mail, 
  Settings, 
  User, 
  Shield, 
  CreditCard, 
  MessageSquare, 
  BookOpen, 
  Building, 
  CalendarDays 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";

export default function SettingsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    });
  };

  return (
    <HostPanelLayout>
      <div className="max-w-5xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-50 mb-6">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="venue-rules" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Venue Rules
            </TabsTrigger>
            <TabsTrigger value="event-rules" className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              Event Rules
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal and business details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.user_metadata?.full_name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue={user?.email || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter your phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" placeholder="Enter your company name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Company Description</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about your business..." 
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked id="email-notifications" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">SMS Notifications</h3>
                      <p className="text-sm text-gray-500">Receive important alerts via SMS</p>
                    </div>
                    <Switch id="sms-notifications" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">In-App Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications within the app</p>
                    </div>
                    <Switch defaultChecked id="app-notifications" />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Notification Types</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Merchant Applications</p>
                        <p className="text-sm text-gray-500">When a merchant applies to your venue</p>
                      </div>
                      <Switch defaultChecked id="merchant-notifications" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Event Reminders</p>
                        <p className="text-sm text-gray-500">Reminders about upcoming events</p>
                      </div>
                      <Switch defaultChecked id="event-notifications" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sales Reports</p>
                        <p className="text-sm text-gray-500">Daily and weekly sales summaries</p>
                      </div>
                      <Switch defaultChecked id="sales-notifications" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">System Alerts</p>
                        <p className="text-sm text-gray-500">Important system notifications</p>
                      </div>
                      <Switch defaultChecked id="system-notifications" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Updates</p>
                        <p className="text-sm text-gray-500">News and promotional information</p>
                      </div>
                      <Switch id="marketing-notifications" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Guest Messages</p>
                        <p className="text-sm text-gray-500">Messages from event guests</p>
                      </div>
                      <Switch defaultChecked id="guest-notifications" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="venue-rules">
            <Card>
              <CardHeader>
                <CardTitle>Venue Rules Configuration</CardTitle>
                <CardDescription>
                  Set default rules for vendors at your venues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="operating-start">Operating Hours Start</Label>
                    <Input id="operating-start" type="time" defaultValue="08:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operating-end">Operating Hours End</Label>
                    <Input id="operating-end" type="time" defaultValue="22:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity-limit">Vendor Capacity Limit</Label>
                    <Input id="capacity-limit" type="number" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stall-fee">Default Stall Fee (ZAR)</Label>
                    <Input id="stall-fee" type="number" defaultValue="250" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Allowed Vendor Types</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="food-vendors"
                        className="rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="food-vendors">Food Vendors</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="beverage-vendors"
                        className="rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="beverage-vendors">Beverage Vendors</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="merchandise-vendors"
                        className="rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="merchandise-vendors">Merchandise Vendors</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="service-vendors"
                        className="rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="service-vendors">Service Providers</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor-rules">Additional Vendor Rules</Label>
                  <Textarea 
                    id="vendor-rules" 
                    placeholder="Enter any additional rules or guidelines for vendors..." 
                    className="min-h-[100px]"
                    defaultValue="1. All vendors must have proper licensing and permits.
2. Vendors must provide their own equipment.
3. Waste disposal is the responsibility of each vendor.
4. No loud music or disruptions allowed."
                  />
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Reset to Defaults
                  </Button>
                  <Button onClick={handleSave}>Save Rules</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="event-rules">
            <Card>
              <CardHeader>
                <CardTitle>Event Rules Configuration</CardTitle>
                <CardDescription>
                  Set default rules for vendors at your events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="setup-time">Default Setup Time (Hours before event)</Label>
                    <Input id="setup-time" type="number" defaultValue="2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cleanup-time">Default Cleanup Time (Hours after event)</Label>
                    <Input id="cleanup-time" type="number" defaultValue="1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-stall-fee">Default Event Stall Fee (ZAR)</Label>
                    <Input id="event-stall-fee" type="number" defaultValue="350" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commission-rate">Default Commission Rate (%)</Label>
                    <Input id="commission-rate" type="number" defaultValue="5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Event Payment Options</Label>
                  <RadioGroup defaultValue="venuapp">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="venuapp" id="venuapp-payment" />
                      <Label htmlFor="venuapp-payment">Venuapp Payment System (Recommended)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual-payment" />
                      <Label htmlFor="manual-payment">Manual Payment Collection</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="integration" id="integration-payment" />
                      <Label htmlFor="integration-payment">Third-Party Payment Integration</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-rules">Event-Specific Rules</Label>
                  <Textarea 
                    id="event-rules" 
                    placeholder="Enter any additional rules specific to events..." 
                    className="min-h-[100px]"
                    defaultValue="1. All events must have dedicated entry and exit points.
2. Every event must have at least one first aid station.
3. Sound levels must comply with local regulations.
4. Alcohol service requires special permission and licensing."
                  />
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Reset to Defaults
                  </Button>
                  <Button onClick={handleSave}>Save Rules</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="two-factor-auth" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Session Timeout</h3>
                      <p className="text-sm text-gray-500">Automatically log out after a period of inactivity</p>
                    </div>
                    <Switch defaultChecked id="session-timeout" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Activity Logs</h3>
                      <p className="text-sm text-gray-500">Keep track of login attempts and account activity</p>
                    </div>
                    <Switch defaultChecked id="activity-logs" />
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Label htmlFor="change-password">Change Password</Label>
                  <Input id="change-password" type="password" placeholder="Enter new password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                </div>

                <div className="flex justify-end">
                  <Button variant="destructive" className="mr-2">
                    Reset Password
                  </Button>
                  <Button onClick={handleSave}>Save Security Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HostPanelLayout>
  );
}
