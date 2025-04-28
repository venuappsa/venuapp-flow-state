
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SecurePanelButton from "@/components/SecurePanelButton";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calendar, Users, DollarSign, Grid, ShieldCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function HostPanel() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  
  // Query host profile data
  const { data: hostProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ["host-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("host_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching host profile:", error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });
  
  // Query wallet data
  const { data: walletData } = useQuery({
    queryKey: ["host-wallet", hostProfile?.id],
    queryFn: async () => {
      if (!hostProfile?.id) return null;
      const { data, error } = await supabase
        .from("host_wallets")
        .select("*")
        .eq("host_id", hostProfile.id)
        .single();
      
      if (error) {
        // If wallet doesn't exist yet, return default values
        if (error.code === "PGRST116") {
          return { balance: 0 };
        }
        console.error("Error fetching wallet data:", error);
        return null;
      }
      return data;
    },
    enabled: !!hostProfile?.id,
  });
  
  // Query upcoming events (placeholder for now)
  const upcomingEvents = 0;
  
  // Query total guests (placeholder for now)
  const totalGuests = 0;
  
  // Mock function for subscription upgrade
  const handleUpgradeSubscription = (plan: string) => {
    toast({
      title: "Subscription request received",
      description: `You selected the ${plan} plan. This will be processed when payment integration is completed.`,
    });
  };
  
  // Mock function for creating a new venue
  const handleCreateVenue = () => {
    navigate("/host/venues/new");
  };
  
  return (
    <AuthTransitionWrapper requireAuth allowedRoles={["host"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-lg shadow">
                <Building className="h-8 w-8 text-venu-orange" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Host Panel</h1>
                <p className="text-gray-600">Manage your venues and events</p>
              </div>
            </div>
            <SecurePanelButton />
          </div>

          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="venues">Venues & Rules</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-venu-orange" />
                      Venues
                    </CardTitle>
                    <CardDescription>Manage your venues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">0</div>
                    <p className="text-gray-600">Active venues</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" onClick={() => setActiveTab("venues")}>Manage Venues</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-venu-orange" />
                      Events
                    </CardTitle>
                    <CardDescription>Manage your events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{upcomingEvents}</div>
                    <p className="text-gray-600">Upcoming events</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" onClick={() => setActiveTab("events")}>Manage Events</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-venu-orange" />
                      Guests
                    </CardTitle>
                    <CardDescription>Manage your guest lists</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{totalGuests}</div>
                    <p className="text-gray-600">Total guests</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Manage Guests</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-venu-orange" />
                      Wallet
                    </CardTitle>
                    <CardDescription>Your earnings and balance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">R{walletData?.balance || 0}</div>
                    <p className="text-gray-600">Available balance</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">View Transactions</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-venu-orange" />
                      Subscription
                    </CardTitle>
                    <CardDescription>Your current subscription</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-md font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 inline-block">
                      {hostProfile?.subscription_status === 'trial' ? 'Trial' : hostProfile?.subscription_status === 'active' ? 'Active' : 'Free'}
                    </div>
                    {hostProfile?.subscription_status === 'trial' && (
                      <p className="text-gray-600 mt-2">Expires in 30 days</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => setActiveTab("subscription")}>
                      {hostProfile?.subscription_status === 'active' ? 'Manage Plan' : 'Upgrade Plan'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Subscription Tab */}
            <TabsContent value="subscription">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Your Subscription</h2>
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                    <span className="font-medium">Current Plan:</span>
                    <span className="ml-2">{hostProfile?.subscription_status === 'trial' ? 'Trial' : hostProfile?.subscription_status === 'active' ? 'Active' : 'Free'}</span>
                  </div>
                  
                  {hostProfile?.subscription_renewal && (
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                      <span className="font-medium">Renewal Date:</span>
                      <span className="ml-2">{new Date(hostProfile?.subscription_renewal).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                    <span className="font-medium">Features:</span>
                    <span className="ml-2">
                      {hostProfile?.subscription_status === 'none' ? 'Basic features' : hostProfile?.subscription_status === 'trial' ? 'All premium features (trial)' : 'All premium features'}
                    </span>
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-4">Available Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Free Plan</CardTitle>
                    <CardDescription>Basic features for small venues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold mb-4">R0<span className="text-sm font-normal text-gray-500">/month</span></p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>1 venue</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Basic analytics</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Up to 3 merchants</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span className="text-gray-500">No vendor rules</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled={hostProfile?.subscription_status === 'none'}
                    >
                      Current Plan
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border-2 border-venu-orange relative">
                  <div className="absolute -top-3 right-4 bg-venu-orange text-white text-xs px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                  <CardHeader>
                    <CardTitle>Growth</CardTitle>
                    <CardDescription>Perfect for growing venues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold mb-4">R950<span className="text-sm font-normal text-gray-500">/month</span></p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>3 venues</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Advanced analytics</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Up to 7 merchants</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Custom vendor rules</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-venu-orange hover:bg-venu-orange/90"
                      onClick={() => handleUpgradeSubscription('Growth')}
                    >
                      {hostProfile?.subscription_status === 'active' ? 'Change Plan' : 'Upgrade Now'}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Pro</CardTitle>
                    <CardDescription>For established venues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold mb-4">R3,000<span className="text-sm font-normal text-gray-500">/month</span></p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Unlimited venues</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Full analytics suite</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Unlimited merchants</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Advanced vendor rules</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleUpgradeSubscription('Pro')}
                    >
                      Upgrade Now
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Venues Tab */}
            <TabsContent value="venues">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Your Venues</h2>
                  <Button onClick={handleCreateVenue}>
                    Create New Venue
                  </Button>
                </div>
                
                {/* Empty state for venues */}
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Building className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No venues yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new venue.</p>
                  <div className="mt-6">
                    <Button onClick={handleCreateVenue}>
                      Create Venue
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Vendor Rules Management</h2>
                <p className="mb-4 text-gray-600">
                  Define rules for vendors who can apply to sell at your venues. This helps ensure quality and consistency across all your events.
                </p>
                
                {/* Vendor rules preview */}
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-lg mb-2">Rule Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Allowed Categories</p>
                      <p className="font-medium">Food, Beverages, Merchandise</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price Range</p>
                      <p className="font-medium">R50 - R500</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-medium">25 vendors</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Operating Hours</p>
                      <p className="font-medium">09:00 - 22:00</p>
                    </div>
                  </div>
                </div>
                
                <Button onClick={() => navigate("/host/rules")}>
                  Manage Vendor Rules
                </Button>
              </div>
            </TabsContent>
            
            {/* Events Tab */}
            <TabsContent value="events">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Upcoming Events</h2>
                  <Button>
                    Create New Event
                  </Button>
                </div>
                
                {/* Empty state for events */}
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No events scheduled</h3>
                  <p className="mt-1 text-sm text-gray-500">Create an event to start inviting vendors and guests.</p>
                  <div className="mt-6">
                    <Button>
                      Create Event
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
                <p className="text-gray-600 mb-6">
                  Manage your host profile details and preferences.
                </p>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Host Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium">{hostProfile?.company_name || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Name</p>
                      <p className="font-medium">{hostProfile?.contact_name || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Email</p>
                      <p className="font-medium">{hostProfile?.contact_email || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Phone</p>
                      <p className="font-medium">{hostProfile?.contact_phone || "Not set"}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline">
                      Update Profile
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Payment Methods
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Security Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Grid className="mr-2 h-4 w-4" />
                      Notification Preferences
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthTransitionWrapper>
  );
}
