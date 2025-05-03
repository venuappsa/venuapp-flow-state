
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export default function FetchmanSettingsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [fetchmanProfile, setFetchmanProfile] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    phone_number: "",
    vehicle_type: "",
    work_hours: "",
    service_area: "",
    has_own_transport: false,
    bank_name: "",
    bank_account_number: "",
    branch_code: ""
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    assignment_alerts: true,
    payment_updates: true,
    system_announcements: true
  });
  const [loading, setLoading] = useState({
    profile: true,
    update: false
  });

  useEffect(() => {
    const fetchFetchmanProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('fetchman_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching fetchman profile:", error);
          return;
        }
        
        if (data) {
          setFetchmanProfile(data);
          setProfileData({
            phone_number: data.phone_number || "",
            vehicle_type: data.vehicle_type || "",
            work_hours: data.work_hours || "",
            service_area: data.service_area || "",
            has_own_transport: data.has_own_transport || false,
            bank_name: data.bank_name || "",
            bank_account_number: data.bank_account_number || "",
            branch_code: data.branch_code || ""
          });
        }
      } catch (err) {
        console.error("Error in fetchFetchmanProfile:", err);
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }
    };
    
    fetchFetchmanProfile();
  }, [user]);

  const handleProfileChange = (field: string, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateProfile = async () => {
    if (!fetchmanProfile || !user?.id) {
      toast({
        title: "Error",
        description: "Profile data could not be loaded. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(prev => ({ ...prev, update: true }));
    
    try {
      const { error } = await supabase
        .from('fetchman_profiles')
        .update({
          phone_number: profileData.phone_number,
          vehicle_type: profileData.vehicle_type,
          work_hours: profileData.work_hours,
          service_area: profileData.service_area,
          has_own_transport: profileData.has_own_transport,
          bank_name: profileData.bank_name,
          bank_account_number: profileData.bank_account_number,
          branch_code: profileData.branch_code
        })
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Update Failed",
          description: "Could not update your profile. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
      
      // In a real app, we would also update notification settings in the database
    } catch (err) {
      console.error("Error in updateProfile:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and profile information</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          {loading.profile ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-gray-500">Loading your profile...</p>
              </CardContent>
            </Card>
          ) : fetchmanProfile ? (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      placeholder="Enter your phone number"
                      value={profileData.phone_number}
                      onChange={(e) => handleProfileChange('phone_number', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_type">Vehicle Type</Label>
                    <Select
                      value={profileData.vehicle_type}
                      onValueChange={(value) => handleProfileChange('vehicle_type', value)}
                    >
                      <SelectTrigger id="vehicle_type">
                        <SelectValue placeholder="Select a vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bicycle">Bicycle</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="work_hours">Preferred Work Hours</Label>
                    <Select
                      value={profileData.work_hours}
                      onValueChange={(value) => handleProfileChange('work_hours', value)}
                    >
                      <SelectTrigger id="work_hours">
                        <SelectValue placeholder="Select preferred hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                        <SelectItem value="evening">Evening (6PM - 12AM)</SelectItem>
                        <SelectItem value="night">Night (12AM - 6AM)</SelectItem>
                        <SelectItem value="full_day">Full Day</SelectItem>
                        <SelectItem value="weekends">Weekends Only</SelectItem>
                        <SelectItem value="weekdays">Weekdays Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service_area">Service Area</Label>
                    <Select
                      value={profileData.service_area}
                      onValueChange={(value) => handleProfileChange('service_area', value)}
                    >
                      <SelectTrigger id="service_area">
                        <SelectValue placeholder="Select a service area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandton">Sandton</SelectItem>
                        <SelectItem value="rosebank">Rosebank</SelectItem>
                        <SelectItem value="johannesburg_cbd">Johannesburg CBD</SelectItem>
                        <SelectItem value="melville">Melville</SelectItem>
                        <SelectItem value="braamfontein">Braamfontein</SelectItem>
                        <SelectItem value="fourways">Fourways</SelectItem>
                        <SelectItem value="randburg">Randburg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_own_transport"
                    checked={profileData.has_own_transport}
                    onCheckedChange={(checked) => handleProfileChange('has_own_transport', checked)}
                  />
                  <Label htmlFor="has_own_transport">I have my own transport</Label>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={updateProfile}
                    disabled={loading.update}
                  >
                    {loading.update ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-gray-500 mb-4">You don't have a Fetchman profile yet.</p>
                <Button onClick={() => navigate('/fetchman/onboarding')}>
                  Create Fetchman Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email_notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email_notifications"
                      checked={notificationSettings.email_notifications}
                      onCheckedChange={(checked) => handleNotificationChange('email_notifications', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push_notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                    </div>
                    <Switch
                      id="push_notifications"
                      checked={notificationSettings.push_notifications}
                      onCheckedChange={(checked) => handleNotificationChange('push_notifications', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms_notifications">SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Receive text message notifications</p>
                    </div>
                    <Switch
                      id="sms_notifications"
                      checked={notificationSettings.sms_notifications}
                      onCheckedChange={(checked) => handleNotificationChange('sms_notifications', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="assignment_alerts">Assignment Alerts</Label>
                      <p className="text-sm text-gray-500">Notifications about new and updated assignments</p>
                    </div>
                    <Switch
                      id="assignment_alerts"
                      checked={notificationSettings.assignment_alerts}
                      onCheckedChange={(checked) => handleNotificationChange('assignment_alerts', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="payment_updates">Payment Updates</Label>
                      <p className="text-sm text-gray-500">Updates about your earnings and payments</p>
                    </div>
                    <Switch
                      id="payment_updates"
                      checked={notificationSettings.payment_updates}
                      onCheckedChange={(checked) => handleNotificationChange('payment_updates', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="system_announcements">System Announcements</Label>
                      <p className="text-sm text-gray-500">Important updates about the platform</p>
                    </div>
                    <Switch
                      id="system_announcements"
                      checked={notificationSettings.system_announcements}
                      onCheckedChange={(checked) => handleNotificationChange('system_announcements', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={() => {
                  toast({
                    title: "Notification Settings Updated",
                    description: "Your notification preferences have been saved."
                  });
                }}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="banking">
          <Card>
            <CardHeader>
              <CardTitle>Banking Information</CardTitle>
              <CardDescription>
                Manage your banking details for payouts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bank_name">Bank Name</Label>
                  <Select
                    value={profileData.bank_name}
                    onValueChange={(value) => handleProfileChange('bank_name', value)}
                  >
                    <SelectTrigger id="bank_name">
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fnb">First National Bank</SelectItem>
                      <SelectItem value="absa">ABSA</SelectItem>
                      <SelectItem value="standard_bank">Standard Bank</SelectItem>
                      <SelectItem value="nedbank">Nedbank</SelectItem>
                      <SelectItem value="capitec">Capitec</SelectItem>
                      <SelectItem value="discovery">Discovery Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bank_account_number">Account Number</Label>
                  <Input
                    id="bank_account_number"
                    placeholder="Enter your account number"
                    value={profileData.bank_account_number}
                    onChange={(e) => handleProfileChange('bank_account_number', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="branch_code">Branch Code</Label>
                  <Input
                    id="branch_code"
                    placeholder="Enter your branch code"
                    value={profileData.branch_code}
                    onChange={(e) => handleProfileChange('branch_code', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={updateProfile}
                  disabled={loading.update}
                >
                  {loading.update ? "Saving..." : "Save Banking Details"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input
                    id="current_password"
                    type="password"
                    placeholder="Enter your current password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    placeholder="Enter your new password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    placeholder="Confirm your new password"
                  />
                </div>
                
                <Button onClick={() => {
                  toast({
                    title: "Feature Not Available",
                    description: "Password change functionality is coming soon."
                  });
                }}>
                  Update Password
                </Button>
              </div>
              
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-medium">Account Actions</h3>
                <div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      toast({
                        title: "Feature Not Available",
                        description: "Session management is coming soon."
                      });
                    }}
                  >
                    Sign Out All Devices
                  </Button>
                </div>
                
                <div>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      toast({
                        title: "Feature Not Available",
                        description: "Account deactivation is coming soon."
                      });
                    }}
                  >
                    Deactivate Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
