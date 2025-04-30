
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorProfile } from "@/types/vendor";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, ChevronRight, MessageSquare, Store } from "lucide-react";

// Import our new components
import VendorMetricsCards from "@/components/vendor/dashboard/VendorMetricsCards";
import BookingTrendsChart from "@/components/vendor/dashboard/BookingTrendsChart";
import NotificationsCard from "@/components/vendor/dashboard/NotificationsCard";
import BookingHistoryTable from "@/components/vendor/bookings/BookingHistoryTable";
import { getVendorData } from "@/utils/vendorAnalyticsData";

export default function VendorDashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendorDataLoading, setVendorDataLoading] = useState(true);
  const [vendorData, setVendorData] = useState<any>(null);
  
  useEffect(() => {
    if (user) {
      fetchVendorProfile();
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      // Get vendor analytics data
      setVendorDataLoading(true);
      const data = getVendorData(user.id);
      setVendorData(data);
      setVendorDataLoading(false);
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
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* Metrics Cards */}
                <VendorMetricsCards 
                  metrics={vendorData?.metrics || []}
                  loading={vendorDataLoading} 
                />
                
                {/* Charts and Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <BookingTrendsChart 
                    weeklyData={vendorData?.weeklyTrends || []}
                    monthlyData={vendorData?.monthlyTrends || []}
                    loading={vendorDataLoading}
                  />
                  
                  <NotificationsCard 
                    notifications={vendorData?.notifications || []}
                    loading={vendorDataLoading}
                  />
                </div>
                
                {/* Quick Actions Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <a href="/vendor/availability">
                          <Store className="mr-2 h-4 w-4" />
                          Update Availability
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href="/vendor/messages">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          View Messages
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="metrics">
                <div className="space-y-6">
                  <VendorMetricsCards 
                    metrics={vendorData?.metrics || []}
                    loading={vendorDataLoading} 
                  />
                  
                  <BookingTrendsChart 
                    weeklyData={vendorData?.weeklyTrends || []}
                    monthlyData={vendorData?.monthlyTrends || []}
                    loading={vendorDataLoading}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="bookings">
                <BookingHistoryTable 
                  bookings={vendorData?.bookings || []}
                  loading={vendorDataLoading}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </VendorPanelLayout>
  );
}
