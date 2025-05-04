import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useFetchmanProfile } from "@/hooks/useFetchmanProfile"; 
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock, MapPin, Package, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { FetchmanProfile } from "@/hooks/useAllFetchmanProfiles";
import { Skeleton } from "@/components/ui/skeleton";

export default function FetchmanDashboardPage() {
  const { user } = useUser();
  const { profile, isLoading, error } = useFetchmanProfile(user?.id);
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([]);
  const [deliveryLoading, setDeliveryLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // We're using useFetchmanProfile hook now instead of direct Supabase query
    const fetchActiveDeliveries = async () => {
      if (!user?.id || !profile) return;
      
      try {
        const { data, error } = await supabase
          .from('fetchman_deliveries')
          .select(`
            *,
            events (*),
            vendor_profiles (*)
          `)
          .eq('fetchman_id', profile.id)
          .in('status', ['pending', 'accepted', 'in_progress'])
          .order('scheduled_time', { ascending: true });
        
        if (error) {
          console.error("Error fetching active deliveries:", error);
          return;
        }
        
        setActiveDeliveries(data || []);
      } catch (err) {
        console.error("Error fetching active deliveries:", err);
      } finally {
        setDeliveryLoading(false);
      }
    };
    
    if (profile) {
      fetchActiveDeliveries();
    }
  }, [user, profile]);

  const getVerificationStatus = () => {
    // When loading
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-[100px] w-full" />
        </div>
      );
    }
    
    // When there's an error
    if (error) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Profile</AlertTitle>
          <AlertDescription>
            We encountered an error loading your profile: {String(error)}
            <div className="mt-2">
              <Button onClick={() => navigate('/fetchman/onboarding')}>
                Complete Onboarding
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }
    
    // When profile is not found
    if (!profile) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profile Not Found</AlertTitle>
          <AlertDescription>
            Your fetchman profile has not been created. Please complete the onboarding process.
            <div className="mt-2">
              <Button onClick={() => navigate('/fetchman/onboarding')}>
                Complete Onboarding
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }
    
    // Profile exists - show status-specific UI
    switch(profile.verification_status) {
      case 'pending':
        return (
          <Alert className="mb-6 border-yellow-500 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-700">Verification Pending</AlertTitle>
            <AlertDescription className="text-yellow-600">
              Your fetchman profile is currently under review. We'll notify you once it's approved.
            </AlertDescription>
          </Alert>
        );
      case 'verified':
        return (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">Verification Complete</AlertTitle>
            <AlertDescription className="text-green-600">
              Your fetchman profile has been verified. You can now accept delivery assignments.
              {profile.user && (
                <div className="mt-2">
                  <p className="font-medium">Welcome, {profile.user.name || 'Fetchman'}</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        );
      case 'declined':
        return (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Declined</AlertTitle>
            <AlertDescription>
              Your fetchman profile verification was declined. Please update your information and try again.
              <div className="mt-2">
                <Button onClick={() => navigate('/fetchman/onboarding')}>
                  Update Profile
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('fetchman_deliveries')
        .update({ status: newStatus })
        .eq('id', deliveryId);
      
      if (error) {
        console.error("Error updating delivery status:", error);
        toast({
          title: "Update Failed",
          description: "Could not update delivery status. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Update the local state
      setActiveDeliveries(prevDeliveries => 
        prevDeliveries.map(delivery => 
          delivery.id === deliveryId 
            ? { ...delivery, status: newStatus } 
            : delivery
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Delivery status updated to ${newStatus.replace('_', ' ')}.`,
      });
    } catch (err) {
      console.error("Error in updateDeliveryStatus:", err);
    }
  };

  const getDeliveryActionButton = (delivery: any) => {
    switch (delivery.status) {
      case 'pending':
        return (
          <Button 
            onClick={() => updateDeliveryStatus(delivery.id, 'accepted')
              .then(() => {
                toast({
                  title: "Delivery Accepted",
                  description: "You've accepted this delivery successfully."
                });
                // Refresh page data
                window.location.reload();
              })
              .catch((error) => {
                toast({
                  title: "Error",
                  description: "Failed to update delivery status.",
                  variant: "destructive"
                });
                console.error("Error updating status:", error);
              })
            }
            className="w-full"
          >
            Accept Delivery
          </Button>
        );
      case 'accepted':
        return (
          <Button 
            onClick={() => updateDeliveryStatus(delivery.id, 'in_progress')
              .then(() => {
                toast({
                  title: "Delivery Started",
                  description: "Delivery status updated to in progress."
                });
                // Refresh page data
                window.location.reload();
              })
              .catch((error) => {
                toast({
                  title: "Error",
                  description: "Failed to update delivery status.",
                  variant: "destructive"
                });
                console.error("Error updating status:", error);
              })
            }
            className="w-full"
          >
            Start Delivery
          </Button>
        );
      case 'in_progress':
        return (
          <Button 
            onClick={() => updateDeliveryStatus(delivery.id, 'completed')
              .then(() => {
                toast({
                  title: "Delivery Completed",
                  description: "Delivery has been marked as delivered."
                });
                // Refresh page data
                window.location.reload();
              })
              .catch((error) => {
                toast({
                  title: "Error",
                  description: "Failed to update delivery status.",
                  variant: "destructive"
                });
                console.error("Error updating status:", error);
              })
            }
            className="w-full"
          >
            Mark as Delivered
          </Button>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };

    const displayStatus = {
      pending: "Pending",
      accepted: "Accepted",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled"
    };

    return (
      <Badge className={statusClasses[status as keyof typeof statusClasses]}>
        {displayStatus[status as keyof typeof displayStatus]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Fetchman Dashboard</h1>

      {getVerificationStatus()}

      {/* Active deliveries section */}
      {profile?.verification_status === 'verified' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Active Deliveries</h2>
          
          {deliveryLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-8 w-full mt-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : activeDeliveries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeDeliveries.map((delivery) => (
                <Card key={delivery.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {delivery.pickup_location}
                        </CardTitle>
                        <CardDescription>
                          {formatDate(delivery.scheduled_time)}
                        </CardDescription>
                      </div>
                      {getStatusBadge(delivery.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Dropoff Location</p>
                          <p className="text-sm text-gray-500">{delivery.dropoff_location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Package className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Items</p>
                          <p className="text-sm text-gray-500">
                            {delivery.items && delivery.items.length > 0 
                              ? `${delivery.items.length} items` 
                              : "No items specified"}
                          </p>
                        </div>
                      </div>
                      
                      {delivery.vendor_profiles && (
                        <div className="flex items-start">
                          <User className="h-5 w-5 mr-2 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Vendor</p>
                            <p className="text-sm text-gray-500">
                              {delivery.vendor_profiles.company_name || "Unknown vendor"}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3">
                        {getDeliveryActionButton(delivery)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="text-center py-10">
                <p className="text-gray-500 mb-4">No active deliveries at this time.</p>
                <Button onClick={() => navigate('/fetchman/assignments')}>
                  Find Assignments
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Dashboard stats */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">R 0</div>
              <p className="text-sm text-gray-500 mt-1">No completed deliveries today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-green-600">Available</div>
              <Button 
                variant="outline" 
                className="mt-3 w-full"
                onClick={() => navigate('/fetchman/schedule')}
              >
                Update Schedule
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-2">
                <div className="mr-2 text-lg font-semibold">{profile.rating || '0.0'}</div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-4 h-4 ${(profile.rating || 0) >= star ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">Based on {profile.total_deliveries || 0} deliveries</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
