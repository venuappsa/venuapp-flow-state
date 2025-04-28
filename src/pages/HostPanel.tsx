
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SecurePanelButton from "@/components/SecurePanelButton";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building, 
  Calendar, 
  Users, 
  DollarSign, 
  Grid, 
  ShieldCheck, 
  Settings,
  Plus,
  ArrowRight,
  MapPin,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  dummyVenues, 
  dummyEvents, 
  dummyVendors, 
  dummyTransactions, 
  dashboardStats 
} from "@/data/hostDummyData";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { VenuePricingPlans } from "@/data/venuePricingPlans";

export default function HostPanel() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  
  // Query host profile data
  const { data: hostProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ["host-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("host_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching host profile:", error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });
  
  // Query wallet data
  const { data: walletData, isLoading: loadingWallet } = useQuery({
    queryKey: ["host-wallet", hostProfile?.id],
    queryFn: async () => {
      if (!hostProfile?.id) return null;
      const { data, error } = await supabase
        .from("host_wallets")
        .select("*")
        .eq("host_id", hostProfile.id)
        .single();
      
      if (error) {
        // If wallet doesn't exist yet, return default values
        if (error.code === "PGRST116") {
          return { balance: 0 };
        }
        console.error("Error fetching wallet data:", error);
        return null;
      }
      return data;
    },
    enabled: !!hostProfile?.id,
  });

  // Track when stats are loaded
  const [statsLoaded, setStatsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate loading delay for a more natural UX
    const timer = setTimeout(() => {
      setStatsLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to format date
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    });
  };
  
  // Mock function for subscription upgrade
  const handleUpgradeSubscription = (plan: string) => {
    toast({
      title: "Subscription request received",
      description: `You selected the ${plan} plan. This will be processed when payment integration is completed.`,
    });
  };
  
  // Mock function for creating a new venue
  const handleCreateVenue = () => {
    navigate("/host/venues/new");
  };
  
  return (
    <AuthTransitionWrapper requireAuth allowedRoles={["host"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-lg shadow">
                <Building className="h-6 w-6 sm:h-8 sm:w-8 text-venu-orange" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Host Panel</h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage your venues and events</p>
              </div>
            </div>
            <SecurePanelButton />
          </div>

          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto -mx-4 sm:mx-0 mb-6">
              <TabsList className="mb-1 px-4 sm:px-0">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="venues">Venues</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
                {!statsLoaded ? (
                  // Skeleton loading state for stats cards
                  Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  // Actual stats cards
                  dashboardStats.map((stat, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {stat.icon && <stat.icon className="h-5 w-5 text-venu-orange" />}
                          {stat.title}
                        </CardTitle>
                        <CardDescription>{stat.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-semibold">{stat.value}</div>
                        <p className={`text-sm ${
                          stat.changeType === 'positive' ? 'text-green-600' : 
                          stat.changeType === 'negative' ? 'text-red-600' : 
                          'text-gray-500'
                        }`}>
                          {stat.change}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => stat.link && navigate(stat.link)}
                        >
                          Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Upcoming Events */}
                <Card className="lg:col-span-2 border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Upcoming Events</CardTitle>
                      <Button variant="ghost" size="sm" className="text-venu-orange" onClick={() => setActiveTab("events")}>
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!statsLoaded ? (
                      // Skeleton for events
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                          <Skeleton className="h-12 w-12 rounded-md" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-40 mb-2" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-8 w-20" />
                        </div>
                      ))
                    ) : (
                      // Actual events
                      dummyEvents
                        .filter(event => event.status === 'upcoming')
                        .slice(0, 3)
                        .map((event) => (
                          <div key={event.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                            <div className="bg-orange-100 rounded-md p-2 w-12 h-12 flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-venu-orange" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{event.name}</h3>
                              <p className="text-sm text-gray-600">
                                {event.venueName} • {formatEventDate(event.date)}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">Details</Button>
                          </div>
                        ))
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => setActiveTab("events")}
                    >
                      Create New Event
                      <Plus className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Wallet/Financial Summary */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Financial Summary</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingWallet || !statsLoaded ? (
                      // Skeleton for wallet
                      <div className="space-y-4">
                        <Skeleton className="h-10 w-32 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ) : (
                      <>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                          <div className="text-3xl font-bold text-venu-black">
                            R{(walletData?.balance || 0).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Recent Transactions</p>
                          {dummyTransactions.slice(0, 2).map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                              <div className="text-sm">
                                <p className="font-medium">{tx.description.substring(0, 20)}{tx.description.length > 20 ? '...' : ''}</p>
                                <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                              </div>
                              <div className={`text-sm font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-gray-600'}`}>
                                {tx.type === 'income' ? '+' : ''}
                                R{Math.abs(tx.amount).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View All Transactions</Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Venues */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">My Venues</CardTitle>
                      <Button variant="ghost" size="sm" className="text-venu-orange" onClick={() => setActiveTab("venues")}>
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!statsLoaded ? (
                      // Skeleton for venues
                      Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                          <Skeleton className="h-14 w-14 rounded-md" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      ))
                    ) : dummyVenues.length > 0 ? (
                      // Actual venues
                      dummyVenues.slice(0, 2).map((venue) => (
                        <div key={venue.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                          <div className="bg-gray-200 rounded-md overflow-hidden w-14 h-14">
                            {venue.imageUrl ? (
                              <img 
                                src={venue.imageUrl} 
                                alt={venue.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Building className="w-full h-full p-3 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{venue.name}</h3>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              {venue.location}
                            </div>
                            <div className="flex items-center mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                venue.status === 'active' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {venue.status === 'active' ? 'Active' : 'Pending'}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {venue.upcoming_events} upcoming {venue.upcoming_events === 1 ? 'event' : 'events'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Empty state
                      <div className="text-center py-4">
                        <Building className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <h3 className="text-sm font-medium text-gray-900">No venues yet</h3>
                        <p className="text-xs text-gray-500 mt-1">Create your first venue to get started.</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={handleCreateVenue}
                    >
                      Create New Venue
                      <Plus className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Vendors */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Recent Vendors</CardTitle>
                      <Button variant="ghost" size="sm" className="text-venu-orange" onClick={() => setActiveTab("vendors")}>
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!statsLoaded ? (
                      // Skeleton for vendors
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dummyVendors.map((vendor) => (
                            <TableRow key={vendor.id}>
                              <TableCell className="font-medium">{vendor.name}</TableCell>
                              <TableCell>{vendor.category}</TableCell>
                              <TableCell>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {vendor.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      Manage Vendor Rules
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Venues Tab */}
            <TabsContent value="venues">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Your Venues</h2>
                  <Button onClick={handleCreateVenue}>
                    Create New Venue
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {dummyVenues.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dummyVenues.map((venue) => (
                      <Card key={venue.id} className="overflow-hidden border border-gray-200">
                        <div className="h-40 overflow-hidden">
                          {venue.imageUrl ? (
                            <img 
                              src={venue.imageUrl} 
                              alt={venue.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Building className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle>{venue.name}</CardTitle>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              venue.status === 'active' ? 'bg-green-100 text-green-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {venue.status}
                            </span>
                          </div>
                          <CardDescription className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {venue.location}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">Capacity</p>
                              <p className="font-medium">{venue.capacity}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Created</p>
                              <p className="font-medium">{formatDistanceToNow(new Date(venue.created_at), { addSuffix: true })}</p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-gray-500 text-sm">Categories</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {venue.categories.map((category, i) => (
                                <span 
                                  key={i} 
                                  className="text-xs px-2 py-0.5 bg-gray-100 rounded-full"
                                >
                                  {category}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full">Manage Venue</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  // Empty state for venues
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No venues yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new venue.</p>
                    <div className="mt-6">
                      <Button onClick={handleCreateVenue}>
                        Create Venue
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Vendor Rules Management</h2>
                <p className="mb-4 text-gray-600">
                  Define rules for vendors who can apply to sell at your venues. This helps ensure quality and consistency across all your events.
                </p>
                
                {/* Vendor rules preview */}
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-lg mb-2">Rule Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Allowed Categories</p>
                      <p className="font-medium">Food, Beverages, Merchandise</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price Range</p>
                      <p className="font-medium">R50 - R500</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-medium">25 vendors</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Operating Hours</p>
                      <p className="font-medium">09:00 - 22:00</p>
                    </div>
                  </div>
                </div>
                
                <Button onClick={() => navigate("/host/rules")}>
                  Manage Vendor Rules
                </Button>
              </div>
            </TabsContent>
            
            {/* Events Tab */}
            <TabsContent value="events">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Upcoming Events</h2>
                  <Button>
                    Create New Event
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {dummyEvents.filter(e => e.status === 'upcoming').length > 0 ? (
                  <div className="space-y-6">
                    {dummyEvents
                      .filter(event => event.status === 'upcoming')
                      .map((event) => (
                        <Card key={event.id} className="overflow-hidden border border-gray-200">
                          <div className="md:flex">
                            <div className="w-full md:w-1/3 lg:w-1/4 bg-orange-100 p-6 flex items-center justify-center">
                              <div className="text-center">
                                <Calendar className="h-12 w-12 mx-auto text-venu-orange mb-2" />
                                <time className="block text-xl font-bold">
                                  {new Date(event.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                                </time>
                                <span className="text-sm">
                                  {new Date(event.date).toLocaleDateString('en-ZA', { year: 'numeric' })}
                                </span>
                              </div>
                            </div>
                            <div className="p-6 md:w-2/3 lg:w-3/4 flex flex-col">
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-lg font-bold">{event.name}</h3>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                    {event.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 flex items-center mb-2">
                                  <Building className="h-4 w-4 mr-1 inline" />
                                  {event.venueName}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center">
                                  <Clock className="h-4 w-4 mr-1 inline" />
                                  {new Date(event.date).toLocaleTimeString('en-ZA', { 
                                    hour: 'numeric', 
                                    minute: '2-digit', 
                                    hour12: true 
                                  })} - {new Date(event.endDate).toLocaleTimeString('en-ZA', { 
                                    hour: 'numeric', 
                                    minute: '2-digit', 
                                    hour12: true 
                                  })}
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                                <div>
                                  <p className="text-sm text-gray-500">Tickets Sold</p>
                                  <p className="font-medium">{event.ticketsSold}/{event.capacity}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Revenue</p>
                                  <p className="font-medium">R{event.revenue.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Vendors</p>
                                  <p className="font-medium">{event.vendors}</p>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex justify-end">
                                <Button variant="outline" size="sm" className="mr-2">
                                  Edit Event
                                </Button>
                                <Button size="sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                ) : (
                  // Empty state for events
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No events scheduled</h3>
                    <p className="mt-1 text-sm text-gray-500">Create an event to start inviting vendors and guests.</p>
                    <div className="mt-6">
                      <Button>
                        Create Event
                      </Button>
                    </div>
                  </div>
                )}
                
                {dummyEvents.filter(e => e.status === 'completed').length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Past Events</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event Name</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Venue</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dummyEvents
                          .filter(event => event.status === 'completed')
                          .map((event) => (
                            <TableRow key={event.id}>
                              <TableCell className="font-medium">{event.name}</TableCell>
                              <TableCell>{formatEventDate(event.date)}</TableCell>
                              <TableCell>{event.venueName}</TableCell>
                              <TableCell>R{event.revenue.toLocaleString()}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  View Report
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Vendors Tab */}
            <TabsContent value="vendors">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-6">Vendor Management</h2>
                
                <div className="mb-6">
                  <Table>
                    <TableCaption>List of vendors that can sell at your venues</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dummyVendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell className="font-medium">{vendor.name}</TableCell>
                          <TableCell>{vendor.category}</TableCell>
                          <TableCell>{vendor.contact}</TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {vendor.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {vendor.status === 'pending' ? (
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" className="text-green-600">
                                  Approve
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline">
                    Invite New Vendor
                  </Button>
                  <Button onClick={() => navigate("/host/rules")}>
                    Manage Vendor Rules
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Subscription Tab */}
            <TabsContent value="subscription">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Your Subscription</h2>
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                    <span className="font-medium">Current Plan:</span>
                    <span className="ml-2">{hostProfile?.subscription_status === 'trial' ? 'Trial' : hostProfile?.subscription_status === 'active' ? 'Active' : 'Free'}</span>
                  </div>
                  
                  {hostProfile?.subscription_renewal && (
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                      <span className="font-medium">Renewal Date:</span>
                      <span className="ml-2">{new Date(hostProfile?.subscription_renewal).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                    <span className="font-medium">Features:</span>
                    <span className="ml-2">
                      {hostProfile?.subscription_status === 'none' ? 'Basic features' : hostProfile?.subscription_status === 'trial' ? 'All premium features (trial)' : 'All premium features'}
                    </span>
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-4">Available Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Free Plan</CardTitle>
                    <CardDescription>Basic features for small venues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold mb-4">R0<span className="text-sm font-normal text-gray-500">/month</span></p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>1 venue</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Basic analytics</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Up to 3 merchants</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span className="text-gray-500">No vendor rules</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled={hostProfile?.subscription_status === 'none'}
                    >
                      Current Plan
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border-2 border-venu-orange relative">
                  <div className="absolute -top-3 right-4 bg-venu-orange text-white text-xs px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                  <CardHeader>
                    <CardTitle>Growth</CardTitle>
                    <CardDescription>Perfect for growing venues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold mb-4">R950<span className="text-sm font-normal text-gray-500">/month</span></p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>3 venues</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Advanced analytics</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Up to 7 merchants</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Custom vendor rules</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-venu-orange hover:bg-venu-orange/90"
                      onClick={() => handleUpgradeSubscription('Growth')}
                    >
                      {hostProfile?.subscription_status === 'active' ? 'Change Plan' : 'Upgrade Now'}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle>Pro</CardTitle>
                    <CardDescription>For established venues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold mb-4">R3,000<span className="text-sm font-normal text-gray-500">/month</span></p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Unlimited venues</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Full analytics suite</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Unlimited merchants</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Advanced vendor rules</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleUpgradeSubscription('Pro')}
                    >
                      Upgrade Now
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
                <p className="text-gray-600 mb-6">
                  Manage your host profile details and preferences.
                </p>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Host Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium">{hostProfile?.company_name || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Name</p>
                      <p className="font-medium">{hostProfile?.contact_name || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Email</p>
                      <p className="font-medium">{hostProfile?.contact_email || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Phone</p>
                      <p className="font-medium">{hostProfile?.contact_phone || "Not set"}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline">
                      Update Profile
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Payment Methods
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Security Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Grid className="mr-2 h-4 w-4" />
                      Notification Preferences
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthTransitionWrapper>
  );
}
