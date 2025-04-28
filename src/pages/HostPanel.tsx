import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useSubscription } from "@/hooks/useSubscription";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBreakpoint } from "@/hooks/useResponsive";
import { Link, useNavigate } from "react-router-dom";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import HostHeader from "@/components/HostHeader";
import NoticeBoard from "@/components/NoticeBoard";
import VendorDiscovery from "@/components/VendorDiscovery";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  CalendarPlus,
  PlusCircle,
  Clock, 
  Users, 
  Wallet, 
  BadgePercent,
  ChevronRight,
  Settings,
  Store,
  LineChart,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardStats, dummyEvents, dummyVenues } from "@/data/hostDummyData";
import SalesBreakdownDialog from "@/components/SalesBreakdownDialog";
import { generateEventSalesData } from "@/data/salesData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

export default function HostPanel() {
  const { user } = useUser();
  const { data: roles = [], isLoading: rolesLoading } = useUserRoles(user?.id);
  const { subscribed, subscription_tier, isLoading: subLoading } = useSubscription();
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();

  const [salesDialogOpen, setSalesDialogOpen] = useState(false);
  const [selectedSalesData, setSelectedSalesData] = useState<any>(null);
  
  const [venueDialogOpen, setVenueDialogOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

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

  const handleOpenVenueDetails = (venue: any) => {
    setSelectedVenue(venue);
    setVenueDialogOpen(true);
  };

  const handleStatsCardClick = (stat: any) => {
    toast({
      title: stat.title,
      description: `View detailed ${stat.title.toLowerCase()} metrics and analytics`,
    });
  };

  const handleGenerateVenueLink = (venueId: string, venueName: string) => {
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
  
  const navigateToEvent = (eventId: string) => {
    navigate(`/host/events/${eventId}`);
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="mb-8">
        <NoticeBoard />
      </div>

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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Your Venues</h2>
          <Button asChild variant="outline" size={isMobile ? "sm" : "default"} className="gap-1">
            <Link to="/host/venues/new">
              <PlusCircle className="h-4 w-4" />
              <span>{isMobile ? "Add" : "Add Venue"}</span>
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dummyVenues.map((venue) => (
            <Card 
              key={venue.id} 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOpenVenueDetails(venue)}
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
                  <Button variant="ghost" size="sm" className="p-0 h-8 w-8" onClick={(e) => {
                    e.stopPropagation();
                    toast({
                      title: "Venue Settings",
                      description: `Manage settings for ${venue.name}`,
                    });
                  }}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center text-sm mt-2">
                  <Users className="h-4 w-4 text-gray-400 mr-1" />
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateVenueLink(venue.id, venue.name);
                      }}
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
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Upcoming Events</h2>
          <Button variant="outline" size={isMobile ? "sm" : "default"} className="gap-1">
            <CalendarPlus className="h-4 w-4" />
            <span>Schedule Event</span>
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
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-left text-xs font-medium text-gray-500 uppercase hover:text-venu-orange focus:outline-none flex items-center gap-1">
                            Event Sales
                            <LineChart className="h-3 w-3" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3">
                          <div className="font-medium text-sm mb-2">Filter by revenue type</div>
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <input type="checkbox" id="filter-ticket" className="mr-2" defaultChecked />
                              <label htmlFor="filter-ticket" className="text-sm">Ticket Sales</label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="filter-merchant" className="mr-2" defaultChecked />
                              <label htmlFor="filter-merchant" className="text-sm">Merchant Fees</label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="filter-commission" className="mr-2" defaultChecked />
                              <label htmlFor="filter-commission" className="text-sm">Commission</label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="filter-food" className="mr-2" defaultChecked />
                              <label htmlFor="filter-food" className="text-sm">Food & Drinks</label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="filter-other" className="mr-2" defaultChecked />
                              <label htmlFor="filter-other" className="text-sm">Other</label>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th scope="col" className="relative px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dummyEvents.filter(event => event.status === 'upcoming').map((event) => (
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
      </div>

      <SalesBreakdownDialog 
        open={salesDialogOpen} 
        onOpenChange={setSalesDialogOpen} 
        salesData={selectedSalesData} 
      />

      <Dialog open={venueDialogOpen} onOpenChange={setVenueDialogOpen}>
        {selectedVenue && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedVenue.name}</DialogTitle>
              <DialogDescription>
                {selectedVenue.location} • Capacity: {selectedVenue.capacity}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="h-48 overflow-hidden rounded-md">
                <img 
                  src={selectedVenue.imageUrl} 
                  alt={selectedVenue.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVenue.categories.map((category: string, idx: number) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {category}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium mb-2">Status</h4>
                    <div className={`inline-block text-xs px-2 py-1 rounded ${selectedVenue.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {selectedVenue.status === 'active' ? 'Active' : 'Pending'}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Created on {new Date(selectedVenue.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button className="flex-1" variant="outline" onClick={() => handleGenerateVenueLink(selectedVenue.id, selectedVenue.name)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Venue
                </Button>
                <Button className="flex-1">
                  Manage Venue
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );

  const renderVendors = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vendor Management</h2>
        {!subscribed && (
          <Link to="/subscribe">
            <Button variant="outline" className="border-venu-orange text-venu-orange hover:bg-venu-orange/10">
              Upgrade to invite more vendors
            </Button>
          </Link>
        )}
      </div>
      
      <Tabs defaultValue="discover">
        <TabsList className="mb-6">
          <TabsTrigger value="discover" className="flex gap-1">
            <Store className="h-4 w-4" />
            <span>Discover Vendors</span>
          </TabsTrigger>
          <TabsTrigger value="my-vendors" className="flex gap-1">
            <Store className="h-4 w-4" />
            <span>My Vendors</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex gap-1">
            <Store className="h-4 w-4" />
            <span>Applications</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover">
          <VendorDiscovery />
        </TabsContent>
        
        <TabsContent value="my-vendors">
          <div className="p-12 bg-gray-50 text-center rounded-lg">
            <Store className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Vendors Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You haven't added any vendors to your venues yet. Discover and invite vendors to start collaboration.
            </p>
            <Button>Discover Vendors</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="applications">
          <div className="p-12 bg-gray-50 text-center rounded-lg">
            <Store className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Applications</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You don't have any pending vendor applications. Share your venue link to receive applications.
            </p>
            <Button>Generate Venue Link</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <AuthTransitionWrapper 
      requireAuth={true} 
      allowedRoles={["host"]} 
      showFallback={true}
    >
      <div className="min-h-screen bg-gray-50">
        <HostHeader />
        <main className="pt-16 px-4 md:px-6 lg:px-8 pb-8">
          {rolesLoading ? (
            <div className="max-w-7xl mx-auto py-8">
              <Skeleton className="h-8 w-64 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto py-8">
              <div className="mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Host Dashboard</h1>
                    {!subscribed && breakpoint !== "xs" && (
                      <Link to="/subscribe">
                        <Button variant="outline" className="border-venu-orange text-venu-orange hover:bg-venu-orange/10">
                          Upgrade to Premium
                        </Button>
                      </Link>
                    )}
                  </div>
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="vendors">Vendors</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="finance">Finance</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'vendors' && renderVendors()}
              {activeTab === 'events' && (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <CalendarPlus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h2 className="text-xl font-medium text-gray-700 mb-2">Event Management</h2>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Create and manage events at your venues. Set up ticketing, scheduling, and vendor assignments.
                  </p>
                  <Button>Create New Event</Button>
                </div>
              )}
              {activeTab === 'finance' && (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <Wallet className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h2 className="text-xl font-medium text-gray-700 mb-2">Financial Dashboard</h2>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Track revenue, expenses, and vendor commissions. Manage your wallet and make withdrawals.
                  </p>
                  <Button>View Wallet</Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </AuthTransitionWrapper>
  );
}
