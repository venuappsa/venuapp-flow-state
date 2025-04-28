
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Building, 
  CalendarPlus, 
  PlusCircle, 
  ChevronRight, 
  Settings, 
  Share2, 
  Users
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { dashboardStats, dummyEvents, dummyVenues } from "@/data/hostDummyData";
import NoticeBoard from "@/components/NoticeBoard";
import SalesBreakdownDialog from "@/components/SalesBreakdownDialog";
import { generateEventSalesData } from "@/data/salesData";

export default function DashboardTab() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [salesDialogOpen, setSalesDialogOpen] = useState(false);
  const [selectedSalesData, setSelectedSalesData] = useState<any>(null);
  const [venueDialogOpen, setVenueDialogOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);

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
    if (stat.title === "Events") {
      navigate("/host/events");
    } else {
      toast({
        title: stat.title,
        description: `View detailed ${stat.title.toLowerCase()} metrics and analytics`,
      });
    }
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

  return (
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
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"} 
            className="gap-1"
            onClick={() => navigate("/host/events")}
          >
            <CalendarPlus className="h-4 w-4" />
            <span>View All Events</span>
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
                  {dummyEvents.filter(event => event.status === 'upcoming').slice(0, 5).map((event) => (
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
              <div className="text-center p-3">
                <Button 
                  variant="ghost" 
                  className="text-sm text-venu-orange"
                  onClick={() => navigate("/host/events")}
                >
                  View All Events
                </Button>
              </div>
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
}
