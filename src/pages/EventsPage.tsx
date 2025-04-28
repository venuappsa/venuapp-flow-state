
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { dummyEvents } from "@/data/hostDummyData";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarPlus,
  Filter,
  Search,
  ChevronRight,
  Map,
  CalendarDays,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateFetchmanEstimate } from "@/utils/fetchmanCalculator";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import HostHeader from "@/components/HostHeader";
import { toast } from "@/components/ui/use-toast";

export default function EventsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-ZA', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };
  
  const navigateToEvent = (eventId: string) => {
    navigate(`/host/events/${eventId}`);
  };
  
  const filteredEvents = dummyEvents.filter(event => {
    // Apply search filter
    if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter && event.status !== statusFilter) {
      return false;
    }
    
    // Apply venue filter
    if (venueFilter && event.venueName !== venueFilter) {
      return false;
    }
    
    // Apply tab filter
    if (activeTab === 'upcoming' && event.status !== 'upcoming') {
      return false;
    } else if (activeTab === 'past' && event.status !== 'past') {
      return false;
    } else if (activeTab === 'active' && event.status !== 'active') {
      return false;
    }
    
    return true;
  });
  
  // Get unique venues for filter
  const venues = [...new Set(dummyEvents.map(event => event.venueName))];
  
  return (
    <AuthTransitionWrapper requireAuth={true} allowedRoles={["host"]} showFallback={true}>
      <div className="min-h-screen bg-gray-50">
        <HostHeader />
        <main className="pt-16 px-4 md:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Events</h1>
                <p className="text-gray-500">Manage all your event schedules</p>
              </div>
              <Button onClick={() => toast({ title: "Coming Soon", description: "Event creation will be available in the next update." })}>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={venueFilter} onValueChange={setVenueFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by venue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Venues</SelectItem>
                      {venues.map(venue => (
                        <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex justify-end">
                    <Button variant="outline" className="flex gap-2">
                      <Filter size={16} />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="upcoming" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Upcoming Events</span>
                </TabsTrigger>
                <TabsTrigger value="active" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Active Events</span>
                </TabsTrigger>
                <TabsTrigger value="past" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Past Events</span>
                </TabsTrigger>
                <TabsTrigger value="draft" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Draft Events</span>
                </TabsTrigger>
              </TabsList>

              {['upcoming', 'active', 'past', 'draft'].map(tab => (
                <TabsContent key={tab} value={tab}>
                  {filteredEvents.length > 0 ? (
                    <div className="space-y-4">
                      {filteredEvents.map(event => (
                        <Card 
                          key={event.id} 
                          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigateToEvent(event.id)}
                        >
                          <div className="md:flex">
                            <div className="md:w-1/4 lg:w-1/6 bg-gray-100 flex items-center justify-center p-4">
                              <div className="text-center">
                                <div className="text-lg font-bold">{new Date(event.date).toLocaleDateString('en-ZA', { day: 'numeric' })}</div>
                                <div className="text-sm">{new Date(event.date).toLocaleDateString('en-ZA', { month: 'short' })}</div>
                                <div className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('en-ZA', { year: 'numeric' })}</div>
                              </div>
                            </div>
                            <div className="flex-1 p-4">
                              <div className="md:flex md:items-start md:justify-between">
                                <div className="mb-2 md:mb-0">
                                  <div className="flex items-center">
                                    <h3 className="font-medium text-lg">{event.name}</h3>
                                    <Badge className={`ml-2 ${
                                      event.status === "upcoming" ? "bg-blue-100 text-blue-800" :
                                      event.status === "active" ? "bg-green-100 text-green-800" :
                                      "bg-gray-100 text-gray-800"
                                    }`}>
                                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">{event.venueName} • {formatDate(event.date)}</div>
                                </div>
                                <div className="flex space-x-1 md:space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="p-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast({
                                        title: "Map View",
                                        description: `View map for ${event.name}`,
                                      });
                                    }}
                                  >
                                    <Map className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="p-1">
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-4">
                                <div>
                                  <div className="text-xs text-gray-500">Capacity</div>
                                  <div className="font-medium">{event.capacity}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Tickets Sold</div>
                                  <div className="font-medium">{event.ticketsSold} / {event.capacity}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Vendors</div>
                                  <div className="font-medium">{event.vendors || 12}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Fetchmen Needed</div>
                                  <div className="font-medium">{calculateFetchmanEstimate(event.capacity, event.vendors || 12)}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <CardTitle className="mb-2">No {tab} events found</CardTitle>
                        <p className="text-gray-500 mb-4">
                          {tab === "upcoming" && "You don't have any upcoming events scheduled."}
                          {tab === "active" && "You don't have any active events right now."}
                          {tab === "past" && "No past events match your filter criteria."}
                          {tab === "draft" && "You don't have any draft events."}
                        </p>
                        <Button onClick={() => toast({ title: "Coming Soon", description: "Event creation will be available in the next update." })}>
                          <CalendarPlus className="h-4 w-4 mr-2" />
                          Create Event
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
    </AuthTransitionWrapper>
  );
}
