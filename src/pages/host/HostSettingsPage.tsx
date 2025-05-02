
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, CreditCard, Bell, Shield, Users, Settings, Lock } from "lucide-react";

export default function HostSettingsPage() {
  return (
    <HostPanelLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-6">
          Settings
        </h1>
        
        <Tabs defaultValue="profile" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-image.jpg" />
                      <AvatarFallback className="text-xl bg-venu-orange text-white">JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Camera className="mr-2 h-4 w-4" />
                      Change Photo
                    </Button>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Doe" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" defaultValue="john@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+27 71 234 5678" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company/Organization</Label>
                      <Input id="company" defaultValue="Event Horizon Ltd." />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself or your organization"
                    defaultValue="Event planner with over 10 years of experience specializing in corporate events and conferences."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" placeholder="https://" defaultValue="https://eventhorizon.co.za" />
                </div>
                
                <Button className="mt-4">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-events" className="font-medium">Event Updates</Label>
                        <p className="text-sm text-muted-foreground">Receive emails about your events</p>
                      </div>
                      <Switch id="email-events" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-bookings" className="font-medium">Booking Confirmations</Label>
                        <p className="text-sm text-muted-foreground">Receive emails about vendor bookings</p>
                      </div>
                      <Switch id="email-bookings" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-messages" className="font-medium">New Messages</Label>
                        <p className="text-sm text-muted-foreground">Get notified about new messages</p>
                      </div>
                      <Switch id="email-messages" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-marketing" className="font-medium">Marketing & Promotions</Label>
                        <p className="text-sm text-muted-foreground">Receive marketing emails and promotions</p>
                      </div>
                      <Switch id="email-marketing" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-medium">Push Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-all" className="font-medium">Allow Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Enable browser push notifications</p>
                      </div>
                      <Switch id="push-all" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-messages" className="font-medium">Messages</Label>
                        <p className="text-sm text-muted-foreground">Get alerts for new messages</p>
                      </div>
                      <Switch id="push-messages" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-events" className="font-medium">Event Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminders about upcoming events</p>
                      </div>
                      <Switch id="push-events" defaultChecked />
                    </div>
                  </div>
                  
                  <Button className="mt-4">Save Notification Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <Button className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Update Password
                  </Button>
                </div>
                
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                  
                  <Button variant="outline">Set Up Two-Factor Authentication</Button>
                </div>
                
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-medium">Sessions</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">Chrome on Windows • Cape Town, South Africa</p>
                        </div>
                        <div className="text-sm text-green-600 font-medium">Active Now</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Sign Out All Other Devices
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your subscription and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Current Plan: Professional</p>
                      <p className="text-sm text-muted-foreground">R499/month • Renews on June 15, 2025</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Change Plan</Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Methods</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 09/2026</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <Button variant="ghost" size="sm" className="h-8">Edit</Button>
                        <Button variant="ghost" size="sm" className="h-8 text-red-600">Remove</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline">Add Payment Method</Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Billing Address</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Event Horizon Ltd." />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address-line1">Address Line 1</Label>
                      <Input id="address-line1" defaultValue="123 Main Street" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address-line2">Address Line 2</Label>
                      <Input id="address-line2" defaultValue="Suite 456" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="Cape Town" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      <Input id="province" defaultValue="Western Cape" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal-code">Postal Code</Label>
                      <Input id="postal-code" defaultValue="8001" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select defaultValue="za">
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="za">South Africa</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button>Save Billing Information</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <CardDescription>Customize your app experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Regional Settings</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="af">Afrikaans</SelectItem>
                        <SelectItem value="zu">isiZulu</SelectItem>
                        <SelectItem value="xh">isiXhosa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="africa_johannesburg">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="africa_johannesburg">Africa/Johannesburg (SAST)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="europe_london">Europe/London (GMT/BST)</SelectItem>
                        <SelectItem value="america_new_york">America/New York (EST/EDT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="dd_mm_yyyy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy_mm_dd">YYYY/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-medium">Appearance</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Compact Mode</p>
                      <p className="text-sm text-muted-foreground">Display more information on screen</p>
                    </div>
                    <Switch id="compact-mode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Quick Stats</p>
                      <p className="text-sm text-muted-foreground">Display quick statistics on dashboard</p>
                    </div>
                    <Switch id="show-stats" defaultChecked />
                  </div>
                </div>
                
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HostPanelLayout>
  );
}
