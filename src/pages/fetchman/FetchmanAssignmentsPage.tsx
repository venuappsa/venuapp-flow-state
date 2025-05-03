
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, User, Package, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { toast } from "@/components/ui/use-toast";

export default function FetchmanAssignmentsPage() {
  const { user } = useUser();
  const [fetchmanProfile, setFetchmanProfile] = useState<any>(null);
  const [currentAssignments, setCurrentAssignments] = useState<any[]>([]);
  const [availableAssignments, setAvailableAssignments] = useState<any[]>([]);
  const [completedAssignments, setCompletedAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    profile: true,
    current: true,
    available: true,
    completed: true,
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
        
        setFetchmanProfile(data);
      } catch (err) {
        console.error("Error in fetchFetchmanProfile:", err);
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }
    };
    
    fetchFetchmanProfile();
  }, [user]);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!fetchmanProfile) return;
      
      try {
        // Fetch current assignments
        const { data: currentData, error: currentError } = await supabase
          .from('fetchman_deliveries')
          .select(`
            *,
            events (*),
            vendor_profiles (*)
          `)
          .eq('fetchman_id', fetchmanProfile.id)
          .in('status', ['pending', 'accepted', 'in_progress'])
          .order('scheduled_time', { ascending: true });
        
        if (currentError) {
          console.error("Error fetching current assignments:", currentError);
        } else {
          setCurrentAssignments(currentData || []);
        }
        
        // Fetch available assignments
        const { data: availableData, error: availableError } = await supabase
          .from('fetchman_deliveries')
          .select(`
            *,
            events (*),
            vendor_profiles (*)
          `)
          .is('fetchman_id', null)
          .eq('status', 'pending')
          .order('scheduled_time', { ascending: true });
        
        if (availableError) {
          console.error("Error fetching available assignments:", availableError);
        } else {
          setAvailableAssignments(availableData || []);
        }
        
        // Fetch completed assignments
        const { data: completedData, error: completedError } = await supabase
          .from('fetchman_deliveries')
          .select(`
            *,
            events (*),
            vendor_profiles (*)
          `)
          .eq('fetchman_id', fetchmanProfile.id)
          .in('status', ['completed', 'cancelled'])
          .order('completion_time', { ascending: false })
          .limit(10);
        
        if (completedError) {
          console.error("Error fetching completed assignments:", completedError);
        } else {
          setCompletedAssignments(completedData || []);
        }
      } catch (err) {
        console.error("Error in fetchAssignments:", err);
      } finally {
        setLoading(prev => ({ 
          ...prev, 
          current: false,
          available: false,
          completed: false
        }));
      }
    };
    
    if (fetchmanProfile) {
      fetchAssignments();
    }
  }, [fetchmanProfile]);

  const acceptAssignment = async (deliveryId: string) => {
    if (!fetchmanProfile) {
      toast({
        title: "Error",
        description: "You need to have a verified profile to accept assignments.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('fetchman_deliveries')
        .update({ 
          fetchman_id: fetchmanProfile.id,
          status: 'accepted' 
        })
        .eq('id', deliveryId);
      
      if (error) {
        console.error("Error accepting assignment:", error);
        toast({
          title: "Error",
          description: "Could not accept this assignment. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Update the local state
      const assignment = availableAssignments.find(a => a.id === deliveryId);
      if (assignment) {
        setAvailableAssignments(prev => prev.filter(a => a.id !== deliveryId));
        setCurrentAssignments(prev => [...prev, { ...assignment, fetchman_id: fetchmanProfile.id, status: 'accepted' }]);
      }
      
      toast({
        title: "Success",
        description: "Assignment accepted successfully.",
      });
    } catch (err) {
      console.error("Error in acceptAssignment:", err);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      // Add completion time if the status is completed
      if (newStatus === 'completed') {
        updateData.completion_time = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('fetchman_deliveries')
        .update(updateData)
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
      const assignment = currentAssignments.find(a => a.id === deliveryId);
      if (assignment) {
        if (newStatus === 'completed' || newStatus === 'cancelled') {
          setCurrentAssignments(prev => prev.filter(a => a.id !== deliveryId));
          setCompletedAssignments(prev => [{
            ...assignment,
            status: newStatus,
            completion_time: newStatus === 'completed' ? new Date().toISOString() : assignment.completion_time
          }, ...prev]);
        } else {
          setCurrentAssignments(prev => 
            prev.map(a => a.id === deliveryId ? { ...a, status: newStatus } : a)
          );
        }
      }
      
      toast({
        title: "Status Updated",
        description: `Delivery status updated to ${newStatus.replace('_', ' ')}.`,
      });
    } catch (err) {
      console.error("Error in updateDeliveryStatus:", err);
    }
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

  const getDeliveryActionButton = (delivery: any) => {
    switch (delivery.status) {
      case 'pending':
        return (
          <Button 
            onClick={() => updateDeliveryStatus(delivery.id, 'accepted')}
            className="w-full"
          >
            Accept Delivery
          </Button>
        );
      case 'accepted':
        return (
          <Button 
            onClick={() => updateDeliveryStatus(delivery.id, 'in_progress')}
            className="w-full"
          >
            Start Delivery
          </Button>
        );
      case 'in_progress':
        return (
          <Button 
            onClick={() => updateDeliveryStatus(delivery.id, 'completed')}
            className="w-full"
          >
            Mark as Delivered
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold mb-2">Assignments</h1>
        <p className="text-gray-500">Manage your delivery assignments</p>
      </div>

      <Tabs defaultValue="current">
        <TabsList className="mb-6">
          <TabsTrigger value="current">Current Assignments</TabsTrigger>
          <TabsTrigger value="available">Available Assignments</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          {loading.profile || loading.current ? (
            <div className="text-center py-10">Loading assignments...</div>
          ) : currentAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {assignment.pickup_location}
                      </CardTitle>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <CardDescription>
                      {formatDate(assignment.scheduled_time)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Dropoff Location</p>
                          <p className="text-sm text-gray-500">{assignment.dropoff_location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Package className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Items</p>
                          <p className="text-sm text-gray-500">
                            {assignment.items && assignment.items.length > 0 
                              ? `${assignment.items.length} items` 
                              : "No items specified"}
                          </p>
                        </div>
                      </div>
                      
                      {assignment.vendor_profiles && (
                        <div className="flex items-start">
                          <User className="h-5 w-5 mr-2 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Vendor</p>
                            <p className="text-sm text-gray-500">
                              {assignment.vendor_profiles.company_name || "Unknown vendor"}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex mt-4">
                        {getDeliveryActionButton(assignment)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="text-center py-10">
                <p className="text-gray-500 mb-4">You don't have any current assignments.</p>
                <p className="text-gray-500 mb-4">Check the Available Assignments tab to find new delivery opportunities.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="available">
          {loading.profile || loading.available ? (
            <div className="text-center py-10">Loading available assignments...</div>
          ) : availableAssignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{assignment.pickup_location}</CardTitle>
                    <CardDescription>{formatDate(assignment.scheduled_time)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Dropoff Location</p>
                          <p className="text-sm text-gray-500">{assignment.dropoff_location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Scheduled Time</p>
                          <p className="text-sm text-gray-500">{formatDate(assignment.scheduled_time)}</p>
                        </div>
                      </div>
                      
                      {assignment.vendor_profiles && (
                        <div className="flex items-start">
                          <User className="h-5 w-5 mr-2 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Vendor</p>
                            <p className="text-sm text-gray-500">
                              {assignment.vendor_profiles.company_name || "Unknown vendor"}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Earnings</p>
                          <p className="text-sm text-gray-500">R {assignment.fee || 120}</p>
                        </div>
                      </div>
                      
                      <div className="flex mt-4">
                        <Button 
                          className="w-full"
                          onClick={() => acceptAssignment(assignment.id)}
                          disabled={!fetchmanProfile || fetchmanProfile.verification_status !== 'verified'}
                        >
                          Accept Assignment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="text-center py-10">
                <p className="text-gray-500 mb-4">No available assignments at this time.</p>
                <p className="text-gray-500">Check back later for new opportunities.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {loading.profile || loading.completed ? (
            <div className="text-center py-10">Loading completed assignments...</div>
          ) : completedAssignments.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Completed Assignments</CardTitle>
                <CardDescription>Your recently completed deliveries</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-3 px-4">Pickup</th>
                        <th className="text-left py-3 px-4">Dropoff</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-right py-3 px-4">Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedAssignments.map((assignment) => (
                        <tr key={assignment.id} className="border-b">
                          <td className="py-3 px-4">{assignment.pickup_location}</td>
                          <td className="py-3 px-4">{assignment.dropoff_location}</td>
                          <td className="py-3 px-4">
                            {formatDate(assignment.completion_time || assignment.scheduled_time)}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(assignment.status)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            R {assignment.status === 'completed' ? assignment.fee : 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="text-center py-10">
                <p className="text-gray-500 mb-4">You haven't completed any deliveries yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
