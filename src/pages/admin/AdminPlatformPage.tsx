
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Save, RefreshCw, Server, Shield, Globe, Mail, Settings, Upload } from "lucide-react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";

export default function AdminPlatformPage() {
  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Platform Settings</h1>
            <p className="text-gray-500">Manage global platform configuration</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="Venuapp" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="platform-url">Website URL</Label>
                    <Input id="platform-url" defaultValue="https://venuapp.co.za" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email Address</Label>
                    <Input id="admin-email" defaultValue="admin@venuapp.co.za" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-address">Company Address</Label>
                    <Textarea id="company-address" defaultValue="123 Business Park, Sandton, Johannesburg, 2196, South Africa" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <select
                      id="timezone"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="Africa/Johannesburg"
                    >
                      <option value="Africa/Johannesburg">Africa/Johannesburg (GMT+2)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                      <option value="Europe/London">Europe/London (GMT+1)</option>
                      <option value="America/New_York">America/New_York (GMT-4)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <select
                      id="date-format"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="DD/MM/YYYY"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="user-registration">User Registration</Label>
                      <div className="text-sm text-muted-foreground">Allow new users to register</div>
                    </div>
                    <Switch id="user-registration" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                      <div className="text-sm text-muted-foreground">Put the site into maintenance mode</div>
                    </div>
                    <Switch id="maintenance-mode" defaultChecked={false} />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Platform Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center">
                        <img
                          src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
                          alt="Logo"
                          className="h-16 w-16 object-contain"
                        />
                      </div>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New Logo
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Favicon</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                        <img
                          src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
                          alt="Favicon"
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Favicon
                      </Button>
                    </div>
                  </div>
                
                  <div className="space-y-2 md:col-span-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-4">
                      <Input type="color" className="w-16 h-10" defaultValue="#ff6b35" />
                      <Input defaultValue="#ff6b35" className="max-w-xs" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label>Secondary Color</Label>
                    <div className="flex items-center gap-4">
                      <Input type="color" className="w-16 h-10" defaultValue="#6610f2" />
                      <Input defaultValue="#6610f2" className="max-w-xs" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="footer-text">Footer Text</Label>
                    <Textarea id="footer-text" defaultValue="© 2025 Venuapp. All rights reserved." />
                  </div>
                  
                  <div className="flex items-center justify-between md:col-span-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode Option</Label>
                      <div className="text-sm text-muted-foreground">Allow users to switch to dark mode</div>
                    </div>
                    <Switch id="dark-mode" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between md:col-span-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-logo">Show Logo in Navigation</Label>
                      <div className="text-sm text-muted-foreground">Display the logo in the navigation bar</div>
                    </div>
                    <Switch id="show-logo" defaultChecked={true} />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email delivery and templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email-from">From Email Address</Label>
                    <Input id="email-from" defaultValue="noreply@venuapp.co.za" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-name">From Name</Label>
                    <Input id="email-name" defaultValue="Venuapp Team" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>SMTP Configuration</Label>
                    <Card className="border shadow-none">
                      <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="smtp-host">SMTP Host</Label>
                            <Input id="smtp-host" defaultValue="smtp.example.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="smtp-port">SMTP Port</Label>
                            <Input id="smtp-port" defaultValue="587" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="smtp-username">SMTP Username</Label>
                            <Input id="smtp-username" defaultValue="username@example.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="smtp-password">SMTP Password</Label>
                            <Input id="smtp-password" type="password" defaultValue="••••••••••••" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="smtp-encryption">Use SSL/TLS</Label>
                          </div>
                          <Switch id="smtp-encryption" defaultChecked={true} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Email Templates</Label>
                    <Card className="border shadow-none">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 gap-2">
                          <Button variant="outline" className="justify-start">
                            <Mail className="mr-2 h-4 w-4" />
                            Welcome Email
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Mail className="mr-2 h-4 w-4" />
                            Password Reset
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Mail className="mr-2 h-4 w-4" />
                            Account Verification
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Mail className="mr-2 h-4 w-4" />
                            Invoice Template
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Mail className="mr-2 h-4 w-4" />
                            Event Notification
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="test-email">Send Test Email</Label>
                      <div className="text-sm text-muted-foreground">Test email delivery configuration</div>
                    </div>
                    <Button variant="outline">
                      Send Test
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>Configure third-party integrations and APIs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Payment Gateways</CardTitle>
                        <Switch id="payment-active" defaultChecked={true} />
                      </div>
                      <CardDescription>Configure payment processing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Paystack</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="paystack-public">Public Key</Label>
                            <Input id="paystack-public" defaultValue="pk_test_••••••••••••••••••••••••••••••" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paystack-secret">Secret Key</Label>
                            <Input id="paystack-secret" type="password" defaultValue="sk_test_••••••••••••••••••••••••••••••" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Stripe</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="stripe-public">Publishable Key</Label>
                            <Input id="stripe-public" defaultValue="pk_test_••••••••••••••••••••••••••••••" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="stripe-secret">Secret Key</Label>
                            <Input id="stripe-secret" type="password" defaultValue="sk_test_••••••••••••••••••••••••••••••" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Google Maps API</CardTitle>
                        <Switch id="maps-active" defaultChecked={true} />
                      </div>
                      <CardDescription>Location services for venues</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor="google-maps-key">API Key</Label>
                        <Input id="google-maps-key" defaultValue="AIza••••••••••••••••••••••••••••••••" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Social Media</CardTitle>
                        <Switch id="social-active" defaultChecked={true} />
                      </div>
                      <CardDescription>Social media integration settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Facebook Login</Label>
                            <div className="text-sm text-muted-foreground">Allow users to sign in with Facebook</div>
                          </div>
                          <Switch id="facebook-login" defaultChecked={false} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Google Login</Label>
                            <div className="text-sm text-muted-foreground">Allow users to sign in with Google</div>
                          </div>
                          <Switch id="google-login" defaultChecked={false} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure platform security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <Label>Password Policy</Label>
                    <Card className="border shadow-none">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Minimum Password Length</Label>
                            <div className="text-sm text-muted-foreground">Set the minimum required password length</div>
                          </div>
                          <Input
                            type="number"
                            min="6"
                            max="32"
                            className="w-20"
                            defaultValue="8"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="require-special">Require Special Characters</Label>
                            <div className="text-sm text-muted-foreground">Passwords must include special characters</div>
                          </div>
                          <Switch id="require-special" defaultChecked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="require-numbers">Require Numbers</Label>
                            <div className="text-sm text-muted-foreground">Passwords must include numbers</div>
                          </div>
                          <Switch id="require-numbers" defaultChecked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="require-uppercase">Require Uppercase</Label>
                            <div className="text-sm text-muted-foreground">Passwords must include uppercase letters</div>
                          </div>
                          <Switch id="require-uppercase" defaultChecked={true} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-verification">Require Email Verification</Label>
                      <div className="text-sm text-muted-foreground">Require new users to verify their email</div>
                    </div>
                    <Switch id="email-verification" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                      <div className="text-sm text-muted-foreground">Allow users to set up 2FA</div>
                    </div>
                    <Switch id="two-factor" defaultChecked={false} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="session-timeout">Session Timeout</Label>
                      <div className="text-sm text-muted-foreground">Automatically log out inactive users</div>
                    </div>
                    <select
                      id="session-timeout"
                      className="w-40 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium"
                      defaultValue="60"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="240">4 hours</option>
                      <option value="720">12 hours</option>
                      <option value="1440">24 hours</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>API Access</Label>
                    <Card className="border shadow-none">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="enable-api">Enable API Access</Label>
                            <div className="text-sm text-muted-foreground">Allow access to the platform API</div>
                          </div>
                          <Switch id="enable-api" defaultChecked={true} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="api-key">API Key</Label>
                          <div className="flex space-x-2">
                            <Input id="api-key" defaultValue="venuapp_api_••••••••••••••••••••••••••••••" />
                            <Button variant="outline">Regenerate</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Settings</CardTitle>
                <CardDescription>System maintenance and optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">System Status</CardTitle>
                      <CardDescription>Current system metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">CPU Usage</div>
                          <div className="text-xl font-semibold">12%</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Memory</div>
                          <div className="text-xl font-semibold">3.2 GB</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Storage</div>
                          <div className="text-xl font-semibold">65.8 GB</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Uptime</div>
                          <div className="text-xl font-semibold">42 days</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border shadow-sm h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Database</CardTitle>
                        <CardDescription>Database maintenance options</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button className="w-full" variant="outline">
                          <Server className="mr-2 h-4 w-4" />
                          Optimize Database
                        </Button>
                        <Button className="w-full" variant="outline">
                          Export Database Backup
                        </Button>
                        <Button className="w-full" variant="outline">
                          Import Database
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border shadow-sm h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Cache</CardTitle>
                        <CardDescription>Cache management</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button className="w-full" variant="outline">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Clear System Cache
                        </Button>
                        <Button className="w-full" variant="outline">
                          Clear Image Cache
                        </Button>
                        <Button className="w-full" variant="outline">
                          Rebuild Cache
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Maintenance Mode</CardTitle>
                      <CardDescription>Take the site offline for maintenance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="maintenance-toggle">Enable Maintenance Mode</Label>
                          <div className="text-sm text-muted-foreground">Site will be unavailable to regular users</div>
                        </div>
                        <Switch id="maintenance-toggle" defaultChecked={false} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-message">Maintenance Message</Label>
                        <Textarea
                          id="maintenance-message"
                          rows={3}
                          defaultValue="We're currently performing scheduled maintenance. Please check back soon!"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenance-ip">IP Whitelist (one per line)</Label>
                        <Textarea
                          id="maintenance-ip"
                          rows={2}
                          placeholder="Enter IP addresses to allow access during maintenance"
                          defaultValue="196.168.1.1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPanelLayout>
  );
}
