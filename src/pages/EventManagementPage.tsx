
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  Calendar,
  MapPin,
  Users,
  Store,
  FileText,
  AlertTriangle,
  Share2,
  BarChart,
  Map,
  Truck,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { dummyEvents } from "@/data/hostDummyData";
import { toast } from "@/components/ui/use-toast";
import FetchmanEstimation from "@/components/FetchmanEstimation";
import { 
  calculateFetchmanEstimate,
  calculateFetchmanCost,
  generateFetchmanStaffingPlan,
  calculateFetchmanAllocation,
  FetchmanAllocationResult
} from "@/utils/fetchmanCalculator";
import EventQRCode from "@/components/EventQRCode";
import FetchmanAllocationChart from "@/components/FetchmanAllocationChart";
import EventVenueMap from "@/components/EventVenueMap";

export default function EventManagementPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [fetchmanAllocation, setFetchmanAllocation] = useState<FetchmanAllocationResult | null>(null);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const foundEvent = dummyEvents.find((e) => e.id === eventId);
      if (foundEvent) {
        setEvent(foundEvent);
        // Pre-calculate fetchman allocation
        const allocation = calculateFetchmanAllocation(
          foundEvent.capacity, 
          foundEvent.floorArea || 1000, 
          foundEvent.multiLevel || false
        );
        setFetchmanAllocation(allocation);
      }
      setLoading(false);
    }, 300); // Simulate API call
  }, [eventId]);

  const handleShareEvent = () => {
    if (!event) return;
    
    const shareableLink = `https://venuapp.co.za/events/${event.id}`;
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        toast({
          title: "Link copied",
          description: `Shareable link for ${event.name} copied to clipboard`,
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: "Error",
          description: "Could not copy link to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  const handleFetchmanUpdate = (data: {fetchmenCount: number, cost: number, allocation: FetchmanAllocationResult}) => {
    setFetchmanAllocation(data.allocation);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-10 w-1/2 mb-6" />
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/host">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                to="/host"
                className="text-sm text-gray-500 hover:text-venu-orange"
              >
                Dashboard
              </Link>
              <span className="text-gray-500">/</span>
              <Link
                to="/host/events"
                className="text-sm text-gray-500 hover:text-venu-orange"
              >
                Events
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-sm font-medium">{event.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{event.name}</h1>
            <div className="flex items-center mt-2">
              <Badge
                className={`${
                  event.status === "upcoming"
                    ? "bg-blue-100 text-blue-800"
                    : event.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
              <div className="flex items-center ml-4 text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {new Date(event.date).toLocaleDateString("en-ZA", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleShareEvent}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Reschedule
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="fetchmen">Fetchmen</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Venue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-venu-orange mt-1 mr-2" />
                    <div>
                      <div className="font-medium">{event.venueName}</div>
                      <div className="text-sm text-gray-500">{event.location || "Location details not available"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-venu-orange mr-2" />
                    <div>
                      <div className="font-medium">{event.capacity} people</div>
                      <div className="text-sm text-gray-500">{event.ticketsSold} tickets sold</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Vendors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Store className="h-4 w-4 text-venu-orange mr-2" />
                    <div>
                      <div className="font-medium">{event.vendors || 12} vendors</div>
                      <div className="text-sm text-gray-500">{event.pendingVendors || 3} pending applications</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Wallet className="h-4 w-4 text-venu-orange mr-2" />
                    <div>
                      <div className="font-medium">R {event.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">From tickets & vendors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription>Basic information about your event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
                        <p>{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Start Time</h4>
                        <p>{event.startTime || "18:00"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                        <p>{event.duration || "5 hours"}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Description</h4>
                      <p className="text-sm mt-1">
                        {event.description || "Join us for an exciting event featuring live music, food vendors, and more. This event promises to be a memorable occasion for all attendees."}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Categories</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(event.categories || ["Music", "Food", "Entertainment"]).map((category: string, idx: number) => (
                          <Badge key={idx} variant="outline">{category}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Organizer</h4>
                      <p>{event.organizer || "Venuapp Host"}</p>
                    </div>
                    
                    <EventQRCode eventId={event.id} eventName={event.name} />
                  </div>
                </CardContent>
              </Card>
              
              <div className="lg:col-span-2">
                <FetchmanEstimation 
                  capacity={event.capacity} 
                  vendors={event.vendors || 12} 
                  hours={event.durationHours || 5}
                  venueName={event.venueName}
                  floorArea={event.floorArea || 1000}
                  onUpdate={handleFetchmanUpdate}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Required Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between p-2 bg-amber-50 border border-amber-100 rounded-md">
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 text-amber-500 mr-2" />
                        Complete safety compliance documentation
                      </span>
                      <Button variant="outline" size="sm">Complete</Button>
                    </li>
                    <li className="flex items-center justify-between p-2 bg-amber-50 border border-amber-100 rounded-md">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 text-amber-500 mr-2" />
                        Assign event staff roles
                      </span>
                      <Button variant="outline" size="sm">Assign</Button>
                    </li>
                    <li className="flex items-center justify-between p-2 bg-amber-50 border border-amber-100 rounded-md">
                      <span className="flex items-center">
                        <Truck className="h-4 w-4 text-amber-500 mr-2" />
                        Confirm vendor setup times
                      </span>
                      <Button variant="outline" size="sm">Confirm</Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-blue-500" />
                    Quick Analytics
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setAnalyticsExpanded(!analyticsExpanded)}
                  >
                    {analyticsExpanded ? "Show Less" : "Show More"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Ticket Sales</span>
                        <span className="font-medium">{((event.ticketsSold / event.capacity) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Vendor Applications</span>
                        <span className="font-medium">80%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full w-4/5"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Budget Spent</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-amber-500 rounded-full w-2/5"></div>
                      </div>
                    </div>
                    
                    {analyticsExpanded && (
                      <>
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Fetchman Allocation</span>
                            <span className="font-medium">70%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-purple-500 rounded-full w-[70%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Marketing Reach</span>
                            <span className="font-medium">65%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-pink-500 rounded-full w-[65%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Staff Assignment</span>
                            <span className="font-medium">50%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-teal-500 rounded-full w-2/4"></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-6">
                          <div className="bg-blue-50 p-3 rounded-md">
                            <h4 className="text-xs text-blue-700 font-medium">Most Popular Tickets</h4>
                            <p className="text-sm font-bold">VIP Access Pass</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-md">
                            <h4 className="text-xs text-green-700 font-medium">Top Vendor Category</h4>
                            <p className="text-sm font-bold">Food & Beverages</p>
                          </div>
                          <div className="bg-amber-50 p-3 rounded-md">
                            <h4 className="text-xs text-amber-700 font-medium">Peak Attendance Time</h4>
                            <p className="text-sm font-bold">19:00 - 21:00</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-md">
                            <h4 className="text-xs text-purple-700 font-medium">Projected Revenue</h4>
                            <p className="text-sm font-bold">R {(event.revenue * 1.2).toLocaleString()}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Management</CardTitle>
                <CardDescription>Manage vendors for this event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">12 vendors participating</h3>
                    <p className="text-sm text-gray-500">3 applications pending approval</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Import Vendors</Button>
                    <Button size="sm">Add Vendor</Button>
                  </div>
                </div>
                <div className="bg-gray-50 p-12 rounded-lg text-center">
                  <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Vendor management module</h3>
                  <p className="text-gray-500 mb-4">
                    This module is coming in the next update. It will allow you to manage vendor 
                    applications, assign locations, and communicate with vendors.
                  </p>
                  <Button onClick={() => toast({ title: "Notify Me", description: "Vendor management will be available in the next update." })}>
                    Notify Me
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Event Map</CardTitle>
                <CardDescription>Interactive map of your event venue</CardDescription>
              </CardHeader>
              <CardContent>
                {fetchmanAllocation ? (
                  <EventVenueMap 
                    venueName={event.venueName} 
                    vendorCount={event.vendors || 12}
                    fetchmanAllocation={fetchmanAllocation}
                  />
                ) : (
                  <div className="bg-gray-50 p-12 rounded-lg text-center">
                    <Map className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Interactive Venue Map</h3>
                    <p className="text-gray-500 mb-4">
                      The interactive map module allows you to assign vendor locations,
                      plan emergency routes, and visualize your event layout.
                    </p>
                    <Button onClick={() => toast({ title: "Notify Me", description: "Interactive map will be available in the next update." })}>
                      Notify Me
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fetchmen" className="space-y-6">
            <FetchmanEstimation 
              capacity={event.capacity} 
              vendors={event.vendors || 12} 
              hours={event.durationHours || 5}
              venueName={event.venueName}
              floorArea={event.floorArea || 1000}
              onUpdate={handleFetchmanUpdate}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fetchmanAllocation && (
                <FetchmanAllocationChart allocation={fetchmanAllocation} />
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Fetchman Scheduling</CardTitle>
                  <CardDescription>Schedule and assign fetchmen for this event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Recommended Fetchmen: {calculateFetchmanEstimate(event.capacity, event.vendors || 12)}</h3>
                    <Button onClick={() => toast({ title: "Request Sent", description: `Request for ${calculateFetchmanEstimate(event.capacity, event.vendors || 12)} fetchmen has been submitted.` })}>
                      Request Fetchmen
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <Clock className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                    <h4 className="text-base font-medium mb-2">Scheduling Tool</h4>
                    <p className="text-gray-500 mb-3">
                      The detailed scheduling tool will be available in the next update.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Management</CardTitle>
                <CardDescription>Manage tickets for this event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">Ticket management module</h3>
                  <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
                    This section will be available in the next update. It will allow you to create ticket types, 
                    set pricing, and track sales.
                  </p>
                  <Button onClick={() => toast({ title: "Notify Me", description: "Ticket management will be available in the next update." })}>
                    Notify Me
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {["schedule", "staff", "finances"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <CardTitle>{tab.charAt(0).toUpperCase() + tab.slice(1)} Management</CardTitle>
                  <CardDescription>Manage {tab} for this event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    {tab === "schedule" && <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />}
                    {tab === "staff" && <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />}
                    {tab === "finances" && <Wallet className="h-12 w-12 mx-auto text-gray-400 mb-4" />}
                    <h3 className="text-lg font-medium">{tab.charAt(0).toUpperCase() + tab.slice(1)} management module</h3>
                    <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
                      This section will be available in the next update.
                    </p>
                    <Button onClick={() => toast({ title: "Notify Me", description: `${tab.charAt(0).toUpperCase() + tab.slice(1)} management will be available in the next update.` })}>
                      Notify Me
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
