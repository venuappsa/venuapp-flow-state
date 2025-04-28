
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  CalendarPlus,
  Users,
  CreditCard,
  ChevronRight,
  TrendingUp,
  UserPlus,
  Share2,
  Settings,
  MessageSquare,
  ExternalLink,
  Activity
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubscription } from "@/hooks/useSubscription";
import { dashboardStats, dummyEvents, dummyVenues } from "@/data/hostDummyData";
import NoticeBoard from "@/components/NoticeBoard";
import SalesBreakdownDialog from "@/components/SalesBreakdownDialog";
import { generateEventSalesData } from "@/data/salesData";
import AnalyticsSnapshot from "@/components/analytics/AnalyticsSnapshot";

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { subscribed, subscription_tier, subscription_status } = useSubscription();
  const [salesDialogOpen, setSalesDialogOpen] = useState(false);
  const [selectedSalesData, setSelectedSalesData] = useState<any>(null);
  const [dashboardView, setDashboardView] = useState("summary"); // summary, venues, events

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-ZA', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  const handleOpenSalesBreakdown = (eventId: string, eventName: string, revenue: number) => {
    const salesData = generateEventSalesData(eventId, eventName, revenue);
    setSelectedSalesData(salesData);
    setSalesDialogOpen(true);
  };
  
  const handleStatsCardClick = (stat: any) => {
    if (stat.link) {
      navigate(stat.link);
    } else {
      switch (stat.title.toLowerCase()) {
        case "total revenue":
        case "monthly revenue":
          navigate("/host/finance");
          break;
        case "total guests":
        case "guests this month":
          navigate("/host/guests");
          break;
        case "events":
        case "upcoming events":
          navigate("/host/events");
          break;
        case "venues":
        case "active venues":
          navigate("/host/venues");
          break;
        case "vendors":
        case "active vendors":
          navigate("/host/vendors");
          break;
        case "subscription":
        case "growth":
          navigate("/host/subscription");
          break;
        default:
          toast({
            title: stat.title,
            description: `View detailed ${stat.title.toLowerCase()} metrics and analytics`,
          });
      }
    }
  };

  const navigateToEvent = (eventId: string) => {
    navigate(`/host/events/${eventId}`);
  };

  const navigateToVenue = (venueId: string) => {
    navigate(`/host/venues/${venueId}`);
  };

  const handleGenerateVenueLink = (venueId: string, venueName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const shareableLink = `https://venuapp.co.za/v/${venueId}`;
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        toast({
          title: "Link copied",
          description: `Shareable link for ${venueName} copied to clipboard`,
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <NoticeBoard />
      </div>

      <Tabs defaultValue={dashboardView} onValueChange={setDashboardView} className="w-full">
        <TabsList className="bg-gray-50 mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {dashboardStats.map((stat, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleStatsCardClick(stat)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <stat.icon className="h-5 w-5 text-venu-orange" />
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : stat.changeType === 'negative' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}>
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium text-gray-500 text-sm">{stat.title}</h3>
                    <div className="text-2xl font-bold mt-1">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <AnalyticsSnapshot 
              subscriptionTier={subscription_tier || "Free"} 
              subscriptionStatus={subscription_status}
            />
          </div>

          {/* Recently Active Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Events */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <CalendarPlus className="h-5 w-5 mr-2 text-venu-orange" />
                    Recent Events
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/host/events")}
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-6">
                <div className="space-y-4">
                  {dummyEvents.slice(0, 3).map((event) => (
                    <div 
                      key={event.id}
                      className="flex items-center justify-between py-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 px-2 rounded"
                      onClick={() => navigateToEvent(event.id)}
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{event.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-3">{formatDate(event.date)}</span>
                          <span>{event.ticketsSold}/{event.capacity} guests</span>
                        </div>
                      </div>
                      <Badge className={event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                        {event.status === 'upcoming' ? 'Upcoming' : 'Active'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Venues */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <Building className="h-5 w-5 mr-2 text-venu-orange" />
                    Recent Venues
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/host/venues")}
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-6">
                <div className="space-y-4">
                  {dummyVenues.slice(0, 3).map((venue) => (
                    <div 
                      key={venue.id}
                      className="flex items-center justify-between py-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 px-2 rounded"
                      onClick={() => navigateToVenue(venue.id)}
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{venue.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{venue.location}</span>
                          <span className="mx-2">•</span>
                          <span>{venue.upcoming_events} upcoming events</span>
                        </div>
                      </div>
                      <Badge className={venue.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                        {venue.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-venu-orange" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center gap-2 border-dashed" 
                onClick={() => navigate("/host/events/new")}
              >
                <CalendarPlus className="h-6 w-6" />
                <span>New Event</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center gap-2 border-dashed" 
                onClick={() => navigate("/host/venues/new")}
              >
                <Building className="h-6 w-6" />
                <span>New Venue</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center gap-2 border-dashed" 
                onClick={() => navigate("/host/vendors/invite")}
              >
                <UserPlus className="h-6 w-6" />
                <span>Invite Vendor</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex flex-col items-center justify-center gap-2 border-dashed" 
                onClick={() => navigate("/host/finance")}
              >
                <CreditCard className="h-6 w-6" />
                <span>View Finance</span>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="venues" className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Your Venues</h2>
            <Button onClick={() => navigate("/host/venues/new")}>
              <Building className="h-4 w-4 mr-2" />
              Add Venue
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dummyVenues.map((venue) => (
              <Card 
                key={venue.id} 
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigateToVenue(venue.id)}
              >
                <div className="h-32 overflow-hidden relative">
                  <img 
                    src={venue.imageUrl} 
                    alt={venue.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <div className={`inline-block text-xs px-2 py-1 rounded ${venue.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {venue.status === 'active' ? 'Active' : 'Pending'}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium truncate">{venue.name}</h3>
                      <p className="text-sm text-gray-500">{venue.location}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center text-sm mt-2">
                    <Building className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-600">Capacity: {venue.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-sm">
                      <CalendarPlus className="h-4 w-4 text-venu-orange mr-1" />
                      <span>{venue.upcoming_events} upcoming events</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1"
                        onClick={(e) => handleGenerateVenueLink(venue.id, venue.name, e)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Your Events</h2>
            <Button 
              onClick={() => navigate("/host/events/new")}
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Sales</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                      <th scope="col" className="relative px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dummyEvents.map((event) => (
                      <tr 
                        key={event.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigateToEvent(event.id)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{event.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{event.venueName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(event.date)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          <button
                            className="text-blue-600 hover:underline focus:outline-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSalesBreakdown(event.id, event.name, event.revenue);
                            }}
                          >
                            {event.ticketsSold} / {event.capacity}
                          </button>
                          <div className="w-full mt-1 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-venu-orange h-1.5 rounded-full" 
                              style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }} 
                            ></div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          <button
                            className="text-blue-600 hover:underline focus:outline-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSalesBreakdown(event.id, event.name, event.revenue);
                            }}
                          >
                            R {event.revenue.toLocaleString()}
                          </button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToEvent(event.id);
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <SalesBreakdownDialog 
        open={salesDialogOpen} 
        onOpenChange={setSalesDialogOpen} 
        salesData={selectedSalesData} 
      />
    </div>
  );
}
