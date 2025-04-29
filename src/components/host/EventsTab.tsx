import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarPlus, ChevronRight, Share2, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { dummyEvents } from "@/data/hostDummyData";
import { useNavigate } from "react-router-dom";

export default function EventsTab() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-ZA', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };
  
  const handleShareEvent = (eventId: string, eventName: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const shareableLink = `https://venuapp.co.za/events/${eventId}`;
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        toast({
          title: "Link copied",
          description: `Shareable link for ${eventName} copied to clipboard`,
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

  const filteredEvents = statusFilter === "all" 
    ? dummyEvents 
    : dummyEvents.filter(event => event.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Events Management</h2>
          <p className="text-gray-500">Create and manage your events</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <button 
              className={`px-3 py-1.5 text-sm ${statusFilter === "all" ? "bg-venu-orange text-white" : "bg-white text-gray-700"}`}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button 
              className={`px-3 py-1.5 text-sm ${statusFilter === "upcoming" ? "bg-venu-orange text-white" : "bg-white text-gray-700"}`}
              onClick={() => setStatusFilter("upcoming")}
            >
              Upcoming
            </button>
            <button 
              className={`px-3 py-1.5 text-sm ${statusFilter === "completed" ? "bg-venu-orange text-white" : "bg-white text-gray-700"}`}
              onClick={() => setStatusFilter("completed")}
            >
              Past
            </button>
          </div>
          <Button onClick={() => navigate("/host/events/new")}>
            <CalendarPlus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredEvents.map((event) => (
          <Card 
            key={event.id}
            className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            onClick={() => navigateToEvent(event.id)}
          >
            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4">
              <div className="bg-gray-100 rounded-md h-24 w-full md:w-32 flex items-center justify-center">
                <Calendar className="h-12 w-12 text-venu-orange" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{event.name}</h3>
                    <p className="text-gray-500">{event.venueName}</p>
                  </div>
                  <Badge className={`${
                    event.status === "upcoming" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {event.status === "upcoming" ? "Upcoming" : "Completed"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-medium">{formatDate(event.date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tickets Sold</p>
                    <p className="text-sm font-medium">{event.ticketsSold}/{event.capacity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-sm font-medium">R {event.revenue.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    {event.vendors || 0} vendors
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareEvent(event.id, event.name, e);
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast({
                          title: "Event Settings",
                          description: `Manage settings for ${event.name}`,
                        });
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
