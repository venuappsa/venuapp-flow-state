
import React, { useState } from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function HostSettingsPage() {
  const [accountForm, setAccountForm] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    company: "Event Masters",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailUpdates: true,
    smsUpdates: false,
    bookingNotifications: true,
    marketingEmails: false,
    eventReminders: true,
    vendorMessages: true,
  });
  
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountForm({
      ...accountForm,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleNotificationToggle = (key: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key as keyof typeof notificationSettings],
    });
  };
  
  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-6">
          Settings
        </h1>
        
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing & Subscription</TabsTrigger>
            <TabsTrigger value="security">Security & Privacy</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal and account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={accountForm.firstName}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={accountForm.lastName}
                      onChange={handleAccountChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={accountForm.email}
                    onChange={handleAccountChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input 
                    id="company" 
                    name="company" 
                    value={accountForm.company}
                    onChange={handleAccountChange}
                  />
                </div>
                
                <Separator />
                
                <div>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Updates</p>
                      <p className="text-sm text-muted-foreground">Receive updates about your account via email</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailUpdates}
                      onCheckedChange={() => handleNotificationToggle("emailUpdates")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates about your account via SMS</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.smsUpdates}
                      onCheckedChange={() => handleNotificationToggle("smsUpdates")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Booking Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications when you get new bookings</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.bookingNotifications}
                      onCheckedChange={() => handleNotificationToggle("bookingNotifications")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Receive marketing emails and promotions</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={() => handleNotificationToggle("marketingEmails")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Event Reminders</p>
                      <p className="text-sm text-muted-foreground">Receive reminders about upcoming events</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.eventReminders}
                      onCheckedChange={() => handleNotificationToggle("eventReminders")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Vendor Messages</p>
                      <p className="text-sm text-muted-foreground">Receive notifications when vendors message you</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.vendorMessages}
                      onCheckedChange={() => handleNotificationToggle("vendorMessages")}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription plan and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Current Plan</h3>
                    <div className="bg-venu-orange/10 text-venu-orange p-3 rounded-md flex items-center justify-between">
                      <div>
                        <p className="font-bold">Professional Plan</p>
                        <p className="text-sm">R 499/month, billed annually</p>
                      </div>
                      <Button variant="outline">Upgrade Plan</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="flex items-center gap-3 border p-3 rounded-md">
                      <div className="bg-gray-200 h-10 w-14 rounded flex items-center justify-center">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 05/2026</p>
                      </div>
                      <Button variant="ghost" className="ml-auto">Change</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Billing History</h3>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Date</th>
                          <th className="text-left py-2">Description</th>
                          <th className="text-right py-2">Amount</th>
                          <th className="text-right py-2">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">May 1, 2025</td>
                          <td>Professional Plan (Annual)</td>
                          <td className="text-right">R 5,988.00</td>
                          <td className="text-right">
                            <Button variant="link" className="p-0 h-auto">Download</Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">May 1, 2024</td>
                          <td>Professional Plan (Annual)</td>
                          <td className="text-right">R 5,988.00</td>
                          <td className="text-right">
                            <Button variant="link" className="p-0 h-auto">Download</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security & Privacy</CardTitle>
                <CardDescription>
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Change Password</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                      <Button>Update Password</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Privacy Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Public Profile</p>
                          <p className="text-sm text-muted-foreground">Allow your profile to be visible to vendors</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Collection</p>
                          <p className="text-sm text-muted-foreground">Allow us to collect usage data to improve services</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Account Actions</h3>
                    <div className="space-x-3">
                      <Button variant="outline">Download My Data</Button>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize how you use the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Language</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-md p-3 flex items-center gap-3 bg-venu-orange/10 border-venu-orange">
                        <div className="h-5 w-5 rounded-full overflow-hidden">
                          <img src="/lovable-uploads/814de6a3-f5ad-4066-9fd5-8a8b46acb410.png" alt="English" className="h-full w-full object-cover" />
                        </div>
                        <span>English</span>
                      </div>
                      <div className="border rounded-md p-3 flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full overflow-hidden">
                          <img src="/lovable-uploads/868a71af-ddc3-4870-a5a0-a5720b9dc63f.png" alt="Afrikaans" className="h-full w-full object-cover" />
                        </div>
                        <span>Afrikaans</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Timezone</h3>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Your Timezone</Label>
                      <select className="w-full border rounded-md p-2">
                        <option>Africa/Johannesburg (GMT+2)</option>
                        <option>UTC (GMT+0)</option>
                        <option>Europe/London (GMT+1)</option>
                        <option>America/New_York (GMT-4)</option>
                      </select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Appearance</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Dark Mode</p>
                          <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Compact View</p>
                          <p className="text-sm text-muted-foreground">Enable compact view for more content per screen</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Button>Save Preferences</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HostPanelLayout>
  );
}
