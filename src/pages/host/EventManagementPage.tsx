import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { dummyEvents } from "@/data/hostDummyData";
import { Pencil, Calendar, Users, Store, MessageSquare, Clock } from "lucide-react";
import TaskManager from "@/components/event/TaskManager";
import EventVendorManager from "@/components/event/EventVendorManager";
import EventMessaging from "@/components/event/EventMessaging";

// Make sure each dummy event in your data has a description property
// If you're not importing dummyEvents from another file, you'll need to add the description property to each event

export default function EventManagementPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Find the event
  const event = dummyEvents.find(event => event.id === eventId);

  if (!event) {
    return (
      <HostPanelLayout>
        <div className="max-w-5xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate("/host/events")}>
            Back to Events
          </Button>
        </div>
      </HostPanelLayout>
    );
  }

  // If an event doesn't have a description, add a default one
  if (!event.description) {
    event.description = "No description provided for this event.";
  }

  const formatEventDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <HostPanelLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{event.name}</h1>
              {getStatusBadge(event.status)}
            </div>
            <p className="text-gray-500">
              {event.venueName} • {formatEventDate(event.date)}
            </p>
          </div>
          
          <Button onClick={() => navigate(`/host/events/${eventId}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Event
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <CardTitle className="text-base">Event Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Date</div>
                      <div>{formatEventDate(event.date)}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Venue</div>
                      <div>{event.venueName || 'No venue selected'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Status</div>
                      <div className="capitalize">{event.status}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <CardTitle className="text-base">Attendance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Capacity</div>
                      <div>{event.capacity} guests</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Tickets Sold</div>
                      <div>{event.ticketsSold} tickets</div>
                      <div className="w-full mt-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-venu-orange h-1.5 rounded-full" 
                          style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }} 
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-gray-500" />
                    <CardTitle className="text-base">Vendors</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Total Vendors</div>
                      <div>{event.vendors || 0} vendors</div>
                    </div>
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setActiveTab("vendors")}
                      >
                        Manage Vendors
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Links Section */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Manage different aspects of your event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-auto py-6 flex flex-col items-center justify-center"
                      onClick={() => setActiveTab("tasks")}
                    >
                      <Clock className="h-8 w-8 mb-2" />
                      <div className="font-medium">Manage Tasks</div>
                      <div className="text-xs text-gray-500">Track event timeline</div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto py-6 flex flex-col items-center justify-center"
                      onClick={() => setActiveTab("vendors")}
                    >
                      <Store className="h-8 w-8 mb-2" />
                      <div className="font-medium">Manage Vendors</div>
                      <div className="text-xs text-gray-500">Add or remove vendors</div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto py-6 flex flex-col items-center justify-center"
                      onClick={() => setActiveTab("messages")}
                    >
                      <MessageSquare className="h-8 w-8 mb-2" />
                      <div className="font-medium">Messages</div>
                      <div className="text-xs text-gray-500">Communicate with vendors</div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto py-6 flex flex-col items-center justify-center"
                      onClick={() => navigate(`/host/events/${eventId}/edit`)}
                    >
                      <Pencil className="h-8 w-8 mb-2" />
                      <div className="font-medium">Edit Event</div>
                      <div className="text-xs text-gray-500">Update event details</div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Event Description */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Event Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {event.description || "No description provided for this event."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <TaskManager />
          </TabsContent>
          
          {/* Vendors Tab */}
          <TabsContent value="vendors">
            <EventVendorManager />
          </TabsContent>
          
          {/* Messages Tab */}
          <TabsContent value="messages">
            <EventMessaging />
          </TabsContent>
        </Tabs>
      </div>
    </HostPanelLayout>
  );
}
