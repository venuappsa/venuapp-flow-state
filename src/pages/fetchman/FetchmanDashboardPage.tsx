import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Package,
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  ArrowRight,
  Loader
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserService } from "@/services/UserService";

export default function FetchmanDashboardPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [pendingDeliveries, setPendingDeliveries] = useState<any[]>([]);
  const [completedDeliveries, setCompletedDeliveries] = useState<any[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileChecked, setProfileChecked] = useState(false);
  
  useEffect(() => {
    const loadFetchmanData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Load fetchman profile
        const profileData = await UserService.getRoleProfile(user.id, 'fetchman');
        
        // Check if profile exists
        if (!profileData) {
          console.log("No fetchman profile found - redirecting to onboarding");
          setIsLoading(false);
          // Profile doesn't exist, but this is expected behavior - don't set an error
          setProfile(null);
          setProfileChecked(true);
          return;
        }
        
        // If profile exists, use it
        setProfile(profileData);
        setProfileChecked(true);
        
        // Try to load actual deliveries if they exist (fallback to mock data)
        const { data: deliveriesData, error: deliveriesError } = await supabase
          .from('fetchman_deliveries')
          .select('*')
          .eq('fetchman_id', user.id)
          .order('scheduled_time', { ascending: true });
          
        if (deliveriesError) {
          console.error("Error loading deliveries:", deliveriesError);
          // Continue execution and use mock data
        }
        
        // If we have real deliveries from database, use them
        if (deliveriesData && deliveriesData.length > 0) {
          const pending = deliveriesData.filter(d => ['pending', 'assigned', 'accepted'].includes(d.status));
          const completed = deliveriesData.filter(d => d.status === 'completed');
          
          setPendingDeliveries(pending);
          setCompletedDeliveries(completed);
          
          // Calculate total earnings from completed deliveries
          const totalEarnings = completed.reduce((sum, delivery) => sum + (delivery.fee || 0), 0);
          setEarnings(totalEarnings);
        } else {
          // For demo, we'll use mock data
          // In a real implementation, we'd load from fetchman_deliveries table
          setPendingDeliveries([
            {
              id: '1',
              event_name: 'Wedding Reception',
              pickup_location: 'Rose Garden Venue',
              dropoff_location: 'Hamilton Hotel',
              scheduled_time: '2025-05-04T15:30:00',
              status: 'assigned',
              fee: 350,
              items: [
                { name: 'Floral Arrangements', quantity: 12 },
                { name: 'Table Centerpieces', quantity: 20 }
              ]
            },
            {
              id: '2',
              event_name: 'Corporate Lunch',
              pickup_location: 'Gourmet Catering',
              dropoff_location: 'Sandton Office Park',
              scheduled_time: '2025-05-05T11:00:00',
              status: 'pending',
              fee: 450,
              items: [
                { name: 'Lunch Boxes', quantity: 50 },
                { name: 'Drinks Package', quantity: 10 }
              ]
            }
          ]);
          
          setCompletedDeliveries([
            {
              id: '3',
              event_name: 'Birthday Party',
              pickup_location: 'Party Supply Store',
              dropoff_location: 'Private Residence',
              completion_time: '2025-05-01T14:45:00',
              fee: 250,
              rating: 5
            },
            {
              id: '4',
              event_name: 'Book Launch',
              pickup_location: 'Publishers Ltd',
              dropoff_location: 'City Library',
              completion_time: '2025-04-28T16:20:00',
              fee: 300,
              rating: 4
            }
          ]);
          
          // Calculate mock earnings
          setEarnings(900);
        }
      } catch (error: any) {
        console.error("Error loading fetchman data:", error);
        setError("Could not load your fetchman information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFetchmanData();
  }, [user, navigate]);

  // Simulate accepting a delivery
  const handleAcceptDelivery = async (deliveryId: string) => {
    try {
      // Try to update in database first
      const { error } = await supabase
        .from('fetchman_deliveries')
        .update({ status: 'accepted' })
        .eq('id', deliveryId);
        
      if (error) {
        console.error("Error accepting delivery:", error);
        // Continue with UI update anyway for demo purposes
      }
      
      // Update UI
      setPendingDeliveries(current => 
        current.map(delivery => 
          delivery.id === deliveryId 
            ? { ...delivery, status: 'accepted' } 
            : delivery
        )
      );
      
      toast({
        title: "Delivery accepted",
        description: "You have accepted this delivery. Check in with the venue for details."
      });
    } catch (error) {
      console.error("Error in handleAcceptDelivery:", error);
      toast({
        title: "Error accepting delivery",
        description: "There was a problem accepting the delivery. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Simulate declining a delivery
  const handleDeclineDelivery = async (deliveryId: string) => {
    try {
      // Try to update in database first (mark as declined or remove fetchman_id)
      const { error } = await supabase
        .from('fetchman_deliveries')
        .update({ 
          status: 'declined',
          fetchman_id: null 
        })
        .eq('id', deliveryId);
        
      if (error) {
        console.error("Error declining delivery:", error);
        // Continue with UI update anyway for demo purposes
      }
      
      // Update UI
      setPendingDeliveries(current => 
        current.filter(delivery => delivery.id !== deliveryId)
      );
      
      toast({
        title: "Delivery declined",
        description: "You have declined this delivery. It will be reassigned."
      });
    } catch (error) {
      console.error("Error in handleDeclineDelivery:", error);
      toast({
        title: "Error declining delivery",
        description: "There was a problem declining the delivery. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Simulate marking a delivery as completed
  const handleCompleteDelivery = async (deliveryId: string) => {
    try {
      const delivery = pendingDeliveries.find(d => d.id === deliveryId);
      
      if (delivery) {
        const completionTime = new Date().toISOString();
        
        // Try to update in database first
        const { error } = await supabase
          .from('fetchman_deliveries')
          .update({ 
            status: 'completed',
            completion_time: completionTime
          })
          .eq('id', deliveryId);
          
        if (error) {
          console.error("Error completing delivery:", error);
          // Continue with UI update anyway for demo purposes
        }
        
        // Remove from pending
        setPendingDeliveries(current => 
          current.filter(d => d.id !== deliveryId)
        );
        
        // Add to completed with completion time and default rating
        setCompletedDeliveries(current => [
          {
            ...delivery,
            completion_time: completionTime,
            rating: 5
          },
          ...current
        ]);
        
        // Update earnings
        setEarnings(current => current + delivery.fee);
        
        toast({
          title: "Delivery completed",
          description: "Great job! The delivery has been marked as completed."
        });
      }
    } catch (error) {
      console.error("Error in handleCompleteDelivery:", error);
      toast({
        title: "Error completing delivery",
        description: "There was a problem marking the delivery as complete. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleNavigateToOnboarding = () => {
    navigate("/fetchman/onboarding");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-[70vh]">
        <Loader className="h-10 w-10 text-venu-orange animate-spin mb-4" />
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
            <p className="text-center text-gray-600 mb-6">
              We encountered an error while loading your fetchman information. 
              Please try refreshing the page or contact support if the issue persists.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-venu-orange hover:bg-venu-dark-orange"
            >
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No profile case - show onboarding prompt
  if (profileChecked && !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold flex items-center mb-6">
          <Truck className="mr-2 h-6 w-6" /> Fetchman Dashboard
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              You need to complete your Fetchman profile to start accepting deliveries
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-6">
            <Truck className="h-16 w-16 text-venu-orange mb-4" />
            <p className="text-center mb-4">
              Your Fetchman profile is not yet set up. Complete your registration to start accepting delivery jobs.
            </p>
            <Button 
              className="bg-venu-orange hover:bg-venu-dark-orange"
              onClick={handleNavigateToOnboarding}
            >
              Complete Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Main dashboard content - profile exists
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Truck className="mr-2 h-6 w-6" /> Fetchman Dashboard
          </h1>
          <p className="text-gray-500">Manage your deliveries and track your earnings</p>
        </div>
        
        {profile?.verification_status && (
          <Badge 
            className={`mt-2 md:mt-0 px-3 py-1 text-sm ${
              profile.verification_status === 'approved' 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : profile.verification_status === 'pending'
                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }`}
          >
            {profile.verification_status === 'approved' 
              ? 'Approved' 
              : profile.verification_status === 'pending'
              ? 'Pending Approval'
              : 'Verification Failed'}
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Available Deliveries</CardTitle>
            <CardDescription>Pending job requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingDeliveries.length}</div>
            <p className="text-sm text-emerald-600 mt-1">
              {pendingDeliveries.length > 0 ? "Jobs are waiting for you" : "No pending jobs"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed Deliveries</CardTitle>
            <CardDescription>Your successful jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedDeliveries.length}</div>
            <p className="text-sm text-emerald-600 mt-1">
              Well done on your deliveries!
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Earnings</CardTitle>
            <CardDescription>Your revenue to date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R{earnings}</div>
            <p className="text-sm text-emerald-600 mt-1">
              Next payout: 15 May 2025
            </p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Package className="mr-2 h-5 w-5" /> Pending Deliveries
      </h2>
      
      {pendingDeliveries.length === 0 ? (
        <Card className="mb-8">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-center text-gray-500">
              No pending deliveries at the moment. Check back soon for new jobs.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {pendingDeliveries.map((delivery) => (
            <Card key={delivery.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{delivery.event_name}</CardTitle>
                    <CardDescription className="mt-1">Delivery #{delivery.id}</CardDescription>
                  </div>
                  <Badge className={delivery.status === 'assigned' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                    {delivery.status === 'assigned' ? 'Assigned' : delivery.status === 'accepted' ? 'Accepted' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Pickup:</p>
                      <p className="text-gray-600">{delivery.pickup_location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Dropoff:</p>
                      <p className="text-gray-600">{delivery.dropoff_location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Scheduled Time:</p>
                      <p className="text-gray-600">
                        {new Date(delivery.scheduled_time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Package className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Items:</p>
                      <ul className="text-gray-600 list-disc list-inside">
                        {delivery.items.map((item: any, idx: number) => (
                          <li key={idx}>{item.name} (x{item.quantity})</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Fee:</p>
                      <p className="text-gray-600">R{delivery.fee}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-gray-50 flex justify-between">
                {delivery.status === 'assigned' || delivery.status === 'pending' ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleDeclineDelivery(delivery.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                    
                    <Button 
                      className="bg-venu-orange hover:bg-venu-dark-orange"
                      onClick={() => handleAcceptDelivery(delivery.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Accept Job
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => window.open(`https://maps.google.com/?q=${delivery.pickup_location}`, '_blank')}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                    
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleCompleteDelivery(delivery.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark Complete
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <CheckCircle className="mr-2 h-5 w-5" /> Recent Completed Deliveries
      </h2>
      
      {completedDeliveries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-center text-gray-500">
              You haven't completed any deliveries yet. Accept jobs to start building your history.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedDeliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{delivery.event_name}</CardTitle>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Completed
                  </Badge>
                </div>
                <CardDescription>Delivery #{delivery.id}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-600 text-sm">{delivery.pickup_location} → {delivery.dropoff_location}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-600 text-sm">
                      {new Date(delivery.completion_time).toLocaleDateString()} at {new Date(delivery.completion_time).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-600 text-sm">Earned: R{delivery.fee}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < delivery.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">Rating: {delivery.rating}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
