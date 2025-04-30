
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorProfile } from "@/types/vendor";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, ChevronRight, MessageSquare, Store } from "lucide-react";
import VendorMetricsDashboard from "@/components/vendor/VendorMetricsDashboard";

export default function VendorDashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchVendorProfile();
    }
  }, [user]);
  
  const fetchVendorProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      setVendorProfile(data as VendorProfile);
    } catch (error) {
      console.error("Error fetching vendor profile:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const getSetupProgress = () => {
    if (!vendorProfile) return 0;
    
    switch(vendorProfile.setup_stage) {
      case "welcome": return 10;
      case "profile": return 30;
      case "services": return 60;
      case "pricing": return 90;
      case "live": return 100;
      default: return 0;
    }
  };
  
  const setupProgress = getSetupProgress();
  
  return (
    <VendorPanelLayout>
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-4">
          Vendor Dashboard
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-venu-orange"></div>
          </div>
        ) : (
          <>
            {/* Setup Status Card */}
            {setupProgress < 100 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Complete Your Vendor Profile</h3>
                      <p className="text-gray-500">You've completed {setupProgress}% of your vendor setup</p>
                      <div className="w-full max-w-md">
                        <Progress value={setupProgress} className="h-2" />
                      </div>
                    </div>
                    
                    <Button onClick={() => {
                      switch(vendorProfile?.setup_stage) {
                        case "welcome":
                          navigate("/vendor/profile");
                          break;
                        case "profile":
                          navigate("/vendor/services");
                          break;
                        case "services":
                          navigate("/vendor/pricing");
                          break;
                        case "pricing":
                          navigate("/vendor/go-live");
                          break;
                        default:
                          navigate("/vendor/profile");
                      }
                    }}>
                      Continue Setup <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {setupProgress === 100 && (
              <Card className="mb-6 bg-green-50 border-green-100">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-lg">Your Vendor Profile is Live!</h3>
                      <p className="text-gray-600">Your services are now visible to hosts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {/* Quick Actions Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Manage your vendor account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href="/vendor/profile">
                          <Store className="mr-2 h-4 w-4" />
                          Edit Business Profile
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href="/vendor/services">
                          <Store className="mr-2 h-4 w-4" />
                          Manage Services
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href="/vendor/messages">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          View Messages
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Account Status Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Status</CardTitle>
                      <CardDescription>Your current vendor status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Profile</span>
                          <span className="flex items-center text-sm font-medium text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Services</span>
                          <span className="flex items-center text-sm font-medium text-green-600">
                            {vendorProfile?.setup_stage === "services" || 
                             vendorProfile?.setup_stage === "pricing" || 
                             vendorProfile?.setup_stage === "live" ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                                Incomplete
                              </>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Pricing</span>
                          <span className="flex items-center text-sm font-medium text-green-600">
                            {vendorProfile?.setup_stage === "pricing" || 
                             vendorProfile?.setup_stage === "live" ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                                Incomplete
                              </>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Verification</span>
                          <span className="flex items-center text-sm font-medium text-green-600">
                            {vendorProfile?.verification_status === 'verified' ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Verified
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                                {vendorProfile?.verification_status || 'Pending'}
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Subscription Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription</CardTitle>
                      <CardDescription>Your current plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium">
                            {vendorProfile?.subscription_status === 'active' 
                              ? 'Active Subscription' 
                              : 'No Active Subscription'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {vendorProfile?.subscription_status === 'active' && vendorProfile?.subscription_renewal
                              ? `Renews on ${new Date(vendorProfile.subscription_renewal).toLocaleDateString()}`
                              : 'Upgrade to access all features'}
                          </p>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          Manage Subscription
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="metrics">
                <VendorMetricsDashboard />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </VendorPanelLayout>
  );
}
