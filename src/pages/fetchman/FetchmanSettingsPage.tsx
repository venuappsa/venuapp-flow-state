
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MessageSquare, Save, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Create a basic layout similar to the other role layouts
const FetchmanLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
            alt="Venuapp Logo"
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-xl font-semibold text-venu-orange">Venuapp Fetchman</h1>
        </div>
        <div className="flex items-center gap-4">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <Calendar className="h-5 w-5 text-gray-500" />
          <div className="h-8 w-8 rounded-full bg-venu-orange text-white flex items-center justify-center">
            FB
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">{children}</main>
    </div>
  );
};

export default function FetchmanSettingsPage() {
  const [notificationPreferences, setNotificationPreferences] = useState({
    newAssignments: true,
    reminders: true,
    statusUpdates: true,
    marketing: false,
  });

  return (
    <FetchmanLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-gray-500">Manage your account preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle Info</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  <Button>Change Picture</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">First Name</Label>
                    <Input id="firstname" placeholder="First Name" defaultValue="Frank" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input id="lastname" placeholder="Last Name" defaultValue="Brown" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Email" defaultValue="frank.brown@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Phone Number" defaultValue="+27 82 123 4567" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Home Address</Label>
                    <Input id="address" placeholder="Address" defaultValue="123 Main Street, Sandton" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Short Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself" defaultValue="Experienced delivery driver with 3 years in the logistics industry. Reliable and punctual with excellent customer service skills." />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="mr-2">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="vehicle">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
                <CardDescription>Update your vehicle details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle-type">Vehicle Type</Label>
                    <Select defaultValue="car">
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="bicycle">Bicycle</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="make-model">Make & Model</Label>
                    <Input id="make-model" placeholder="Make & Model" defaultValue="Toyota Hilux" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" placeholder="Year" defaultValue="2022" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license-plate">License Plate</Label>
                    <Input id="license-plate" placeholder="License Plate" defaultValue="GP 123-456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" placeholder="Color" defaultValue="White" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance">Insurance Provider</Label>
                    <Input id="insurance" placeholder="Insurance Provider" defaultValue="Discovery Insure" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Vehicle Documents</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Button variant="outline" className="h-32 flex flex-col">
                      <div className="text-sm mb-2">Upload Vehicle License</div>
                      <div className="text-xs text-gray-500">PDF or JPG format</div>
                    </Button>
                    <Button variant="outline" className="h-32 flex flex-col">
                      <div className="text-sm mb-2">Upload Insurance Certificate</div>
                      <div className="text-xs text-gray-500">PDF or JPG format</div>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="mr-2">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Notification Method</h3>
                  <RadioGroup defaultValue="both">
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="email" id="email-only" />
                      <Label htmlFor="email-only">Email Only</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="sms" id="sms-only" />
                      <Label htmlFor="sms-only">SMS Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both" />
                      <Label htmlFor="both">Both Email and SMS</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Notification Types</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="new-assignments" 
                        checked={notificationPreferences.newAssignments}
                        onCheckedChange={(checked) => 
                          setNotificationPreferences({...notificationPreferences, newAssignments: checked === true})
                        }
                      />
                      <Label htmlFor="new-assignments">New Assignment Opportunities</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="reminders" 
                        checked={notificationPreferences.reminders}
                        onCheckedChange={(checked) => 
                          setNotificationPreferences({...notificationPreferences, reminders: checked === true})
                        }
                      />
                      <Label htmlFor="reminders">Delivery Reminders</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="status-updates" 
                        checked={notificationPreferences.statusUpdates}
                        onCheckedChange={(checked) => 
                          setNotificationPreferences({...notificationPreferences, statusUpdates: checked === true})
                        }
                      />
                      <Label htmlFor="status-updates">Status Updates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="marketing" 
                        checked={notificationPreferences.marketing}
                        onCheckedChange={(checked) => 
                          setNotificationPreferences({...notificationPreferences, marketing: checked === true})
                        }
                      />
                      <Label htmlFor="marketing">Marketing & Promotional Messages</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="mr-2">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Payout Method</h3>
                  <RadioGroup defaultValue="bank-transfer">
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                      <Label htmlFor="bank-transfer">Bank Transfer</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="mobile-money" id="mobile-money" />
                      <Label htmlFor="mobile-money">Mobile Money</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Bank Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input id="bank-name" placeholder="Bank Name" defaultValue="Standard Bank" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-holder">Account Holder Name</Label>
                      <Input id="account-holder" placeholder="Account Holder" defaultValue="Frank Brown" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input id="account-number" placeholder="Account Number" defaultValue="•••• •••• 1234" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="branch-code">Branch Code</Label>
                      <Input id="branch-code" placeholder="Branch Code" defaultValue="051001" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="mr-2">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Payment Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FetchmanLayout>
  );
}
