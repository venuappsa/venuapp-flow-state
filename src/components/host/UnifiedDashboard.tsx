
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
  Activity,
  LineChart
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
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { subscribed, subscription_tier, subscription_status } = useSubscription();
  const [salesDialogOpen, setSalesDialogOpen] = useState(false);
  const [selectedSalesData, setSelectedSalesData] = useState<any>(null);
  const [dashboardView, setDashboardView] = useState("summary");

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
          navigate("/#pricing");
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

      <Tabs defaultValue="summary" value={dashboardView} onValueChange={setDashboardView} className="w-full">
        <TabsList className="bg-white border w-full md:w-auto p-1 rounded-xl mb-6">
          <TabsTrigger value="summary" className="rounded-lg data-[state=active]:bg-venu-purple data-[state=active]:text-white">Summary</TabsTrigger>
          <TabsTrigger value="venues" className="rounded-lg data-[state=active]:bg-venu-purple data-[state=active]:text-white">Venues</TabsTrigger>
          <TabsTrigger value="events" className="rounded-lg data-[state=active]:bg-venu-purple data-[state=active]:text-white">Events</TabsTrigger>
        </TabsList>
          
        <TabsContent value="summary" className="space-y-8 mt-6">
          <DashboardSection title="Key Metrics" gradient>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {dashboardStats.slice(0, 8).map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  description={stat.description}
                  icon={<stat.icon className="h-5 w-5" />}
                  change={stat.change}
                  changeType={stat.changeType as 'positive' | 'negative' | 'neutral'}
                  onClick={() => handleStatsCardClick(stat)}
                  gradient={index % 2 === 0}
                />
              ))}
            </div>
          </DashboardSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <Card className="lg:col-span-2 bg-gradient-to-br from-white to-venu-soft-gray hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-venu-purple" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple">
                    Performance Analytics
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <AnalyticsSnapshot
                  subscriptionTier={subscription_tier || "Free"} 
                  subscriptionStatus={subscription_status}
                />
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-0 border-b">
                <CardTitle className="text-lg flex items-center text-venu-purple">
                  <CalendarPlus className="h-5 w-5 mr-2 text-venu-purple" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {dummyEvents.filter(event => event.status === 'upcoming').slice(0, 5).map((event) => (
                    <div 
                      key={event.id}
                      className="flex items-center justify-between p-4 border-b last:border-b-0 cursor-pointer hover:bg-venu-soft-gray/50 transition-colors"
                      onClick={() => navigateToEvent(event.id)}
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{event.name}</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span className="mr-3">{formatDate(event.date)}</span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {event.ticketsSold}/{event.capacity}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-venu-soft-gray/50 border-t">
                  <Button 
                    variant="ghost" 
                    className="text-xs text-venu-purple w-full"
                    onClick={() => navigate("/host/events")}
                  >
                    View All Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <DashboardSection 
            title="Quick Actions"
            description="Common tasks and actions to manage your venues and events"
            action={
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 border-venu-purple text-venu-purple hover:bg-venu-purple/10"
                onClick={() => navigate("/host/settings")}
              >
                <Settings className="h-4 w-4" />
                <span>Customize</span>
              </Button>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-6 w-full flex flex-col items-center justify-center gap-3 border-dashed border-venu-purple text-venu-purple hover:bg-venu-purple/10"
                onClick={() => navigate("/host/events/new")}
              >
                <div className="bg-venu-purple/10 p-3 rounded-full">
                  <CalendarPlus className="h-5 w-5" />
                </div>
                <span className="text-sm">New Event</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 w-full flex flex-col items-center justify-center gap-3 border-dashed border-venu-purple text-venu-purple hover:bg-venu-purple/10"
                onClick={() => navigate("/host/venues/new")}
              >
                <div className="bg-venu-purple/10 p-3 rounded-full">
                  <Building className="h-5 w-5" />
                </div>
                <span className="text-sm">New Venue</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 w-full flex flex-col items-center justify-center gap-3 border-dashed border-venu-purple text-venu-purple hover:bg-venu-purple/10"
                onClick={() => navigate("/host/merchants")}
              >
                <div className="bg-venu-purple/10 p-3 rounded-full">
                  <UserPlus className="h-5 w-5" />
                </div>
                <span className="text-sm">Invite Vendor</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 w-full flex flex-col items-center justify-center gap-3 border-dashed border-venu-purple text-venu-purple hover:bg-venu-purple/10"
                onClick={() => navigate("/host/finance")}
              >
                <div className="bg-venu-purple/10 p-3 rounded-full">
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="text-sm">View Finance</span>
              </Button>
            </div>
          </DashboardSection>
        </TabsContent>

        <TabsContent value="venues" className="space-y-8 mt-6 animate-fade-in">
          <DashboardSection 
            title="Your Venues" 
            gradient
            action={
              <Button 
                className="bg-venu-purple text-white hover:bg-venu-purple/90"
                onClick={() => navigate("/host/venues/new")}
              >
                <Building className="h-4 w-4 mr-2" />
                Add Venue
              </Button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {dummyVenues.map((venue) => (
                <Card 
                  key={venue.id} 
                  className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                  onClick={() => navigateToVenue(venue.id)}
                >
                  <div className="h-36 overflow-hidden relative">
                    <img 
                      src={venue.imageUrl} 
                      alt={venue.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <Badge className={cn(
                        "text-white",
                        venue.status === 'active' ? 'bg-green-500' : 'bg-amber-500'
                      )}>
                        {venue.status === 'active' ? 'Active' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium truncate">{venue.name}</h3>
                        <p className="text-sm text-gray-500">{venue.location}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                        <Settings className="h-4 w-4 text-venu-purple" />
                      </Button>
                    </div>
                    <div className="flex items-center text-sm mt-2">
                      <Building className="h-4 w-4 text-venu-purple mr-1" />
                      <span className="text-gray-600">Capacity: {venue.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-sm">
                        <CalendarPlus className="h-4 w-4 text-venu-purple mr-1" />
                        <span>{venue.upcoming_events} upcoming events</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1 h-8 w-8"
                          onClick={(e) => handleGenerateVenueLink(venue.id, venue.name, e)}
                        >
                          <Share2 className="h-4 w-4 text-venu-purple" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                          <ChevronRight className="h-4 w-4 text-venu-purple" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DashboardSection>
        </TabsContent>

        <TabsContent value="events" className="space-y-8 animate-fade-in mt-6">
          <DashboardSection 
            title="Your Events" 
            gradient
            action={
              <Button 
                className="bg-venu-purple text-white hover:bg-venu-purple/90"
                onClick={() => navigate("/host/events/new")}
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            }
          >
            <Card className="overflow-hidden border-0 shadow-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-venu-soft-gray">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-venu-purple uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-venu-purple uppercase tracking-wider">Venue</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-venu-purple uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-venu-purple uppercase tracking-wider">Event Sales</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-venu-purple uppercase tracking-wider">Revenue</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dummyEvents.map((event) => (
                      <tr 
                        key={event.id} 
                        className="hover:bg-venu-soft-gray/30 cursor-pointer transition-colors"
                        onClick={() => navigateToEvent(event.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{event.name}</div>
                          <div className="text-xs text-gray-500">ID: {event.id.slice(0, 8)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.venueName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(event.date)}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="text-venu-purple hover:underline focus:outline-none text-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSalesBreakdown(event.id, event.name, event.revenue);
                            }}
                          >
                            {event.ticketsSold} / {event.capacity}
                          </button>
                          <div className="w-32 mt-1 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-venu-purple h-1.5 rounded-full" 
                              style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }} 
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="text-venu-purple hover:underline focus:outline-none text-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSalesBreakdown(event.id, event.name, event.revenue);
                            }}
                          >
                            R {event.revenue.toLocaleString()}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-0 h-8 w-8 text-venu-purple"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToEvent(event.id);
                            }}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </DashboardSection>
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
