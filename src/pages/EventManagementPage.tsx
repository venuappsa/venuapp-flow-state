
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, CalendarClock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import EventCreationForm from "@/components/event/EventCreationForm";
import VendorBookingsCard from "@/components/event/VendorBookingsCard";

interface EventData {
  id: string;
  name: string;
  description: string;
  venue_id: string;
  venue_name?: string; // Optional as it might come from a join
  start_date: string;
  end_date: string;
  status: string;
  capacity: number;
  is_public: boolean;
}

export default function EventManagementPage() {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [event, setEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isNew = !eventId || eventId === "new";
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Get active tab from location state if provided
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    // Only fetch event data if this is an existing event
    if (!isNew && eventId) {
      fetchEventData(eventId);
    } else {
      setIsLoading(false);
    }
  }, [isNew, eventId, location.state]);

  const fetchEventData = async (id: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select(`
          id, 
          name, 
          description, 
          venue_id, 
          start_date, 
          end_date, 
          status, 
          capacity, 
          is_public
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      
      if (data) {
        setEvent(data);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      toast({
        title: "Error loading event",
        description: "Failed to load event details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFormattedDates = () => {
    if (!event) return "";
    
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-purple-100 text-purple-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'complete':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isNew) {
    return (
      <HostPanelLayout>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/host/events")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-bold">Create New Event</h1>
          </div>
          <EventCreationForm />
        </div>
      </HostPanelLayout>
    );
  }

  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-40 col-span-2" />
              <Skeleton className="h-40" />
            </div>
          </div>
        ) : event ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/host/events")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">{event.name}</h1>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <CalendarClock className="h-4 w-4 mr-1" />
                    <span>{getFormattedDates()}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  Edit Event
                </Button>
                <Button>
                  Publish Event
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="guests">Guests</TabsTrigger>
                <TabsTrigger value="finances">Finances</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                      <h2 className="text-lg font-medium mb-4">Event Details</h2>
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Event Name</dt>
                          <dd className="mt-1">{event.name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(event.status)}`}>
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Date Range</dt>
                          <dd className="mt-1">{getFormattedDates()}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Capacity</dt>
                          <dd className="mt-1">{event.capacity || 'Not set'}</dd>
                        </div>
                        <div className="md:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Description</dt>
                          <dd className="mt-1">{event.description || 'No description provided.'}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                      <h2 className="text-lg font-medium mb-4">Timeline</h2>
                      <div className="text-center py-12 text-gray-500">
                        <p>Timeline feature coming soon.</p>
                        <Button variant="outline" className="mt-4">
                          Set Up Event Timeline
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <VendorBookingsCard eventId={event.id} />
                    
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                      <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          Edit Event Details
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Manage Guest List
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          View Booking History
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="vendors">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h2 className="text-lg font-medium mb-4">Vendor Management</h2>
                  <div className="mb-6">
                    <VendorBookingsCard eventId={event.id} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h2 className="text-lg font-medium mb-4">Event Schedule</h2>
                  <div className="text-center py-20 text-gray-500">
                    <p>Schedule management feature coming soon.</p>
                    <Button className="mt-4">
                      Set Up Event Schedule
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="guests">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h2 className="text-lg font-medium mb-4">Guest Management</h2>
                  <div className="text-center py-20 text-gray-500">
                    <p>Guest management feature coming soon.</p>
                    <Button className="mt-4">
                      Add Guests
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="finances">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h2 className="text-lg font-medium mb-4">Financial Overview</h2>
                  <div className="text-center py-20 text-gray-500">
                    <p>Financial tracking feature coming soon.</p>
                    <Button className="mt-4">
                      Set Up Budget
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-medium text-gray-500">Event not found</h2>
            <p className="text-gray-400 mt-2">The event you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button className="mt-6" onClick={() => navigate("/host/events")}>
              Back to Events
            </Button>
          </div>
        )}
      </div>
    </HostPanelLayout>
  );
}
