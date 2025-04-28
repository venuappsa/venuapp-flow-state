
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useIsMobile } from "@/hooks/use-mobile";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import HostHeader from "@/components/HostHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building, 
  CalendarPlus,
  PlusCircle,
  Clock, 
  Users, 
  Wallet, 
  BadgePercent,
  ChevronRight,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { dashboardStats, dummyEvents, dummyVenues } from "@/data/hostDummyData";

export default function HostPanel() {
  const { user } = useUser();
  const { data: roles = [], isLoading: rolesLoading } = useUserRoles(user?.id);
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useIsMobile();

  useEffect(() => {
    // Ensure content is loaded before removing any loading states
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

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
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

      {/* Venues Section */}
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
            <Card key={venue.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                  <Users className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-600">Capacity: {venue.capacity}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-sm">
                    <CalendarPlus className="h-4 w-4 text-venu-orange mr-1" />
                    <span>{venue.upcoming_events} upcoming events</span>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Events Section */}
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
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket Sales</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th scope="col" className="relative px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dummyEvents.filter(event => event.status === 'upcoming').map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{event.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{event.venueName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(event.date)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {event.ticketsSold} / {event.capacity}
                        <div className="w-full mt-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-venu-orange h-1.5 rounded-full" 
                            style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }} 
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">R {event.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        <Button variant="ghost" size="sm" className="p-1">
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
              {/* Mobile Dashboard Title */}
              <h1 className="text-2xl font-bold mb-6">Host Dashboard</h1>
              
              {/* Dashboard Content */}
              {renderDashboard()}
            </div>
          )}
        </main>
      </div>
    </AuthTransitionWrapper>
  );
}
