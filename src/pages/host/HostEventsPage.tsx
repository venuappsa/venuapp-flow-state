import React from "react";
import { useNavigate } from "react-router-dom";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus, Search, Filter, ChevronRight, CheckCircle2, AlertTriangle, CalendarX, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for events
const mockEvents = [
  {
    id: "event-1",
    name: "Wedding Expo 2025",
    date: "2025-06-15",
    venue: "Grand Hall",
    status: "upcoming",
    vendorsCount: 12,
    guestsCount: 450
  },
  {
    id: "event-2",
    name: "Corporate Retreat",
    date: "2025-07-22",
    venue: "Mountain Resort",
    status: "planning",
    vendorsCount: 5,
    guestsCount: 75
  },
  {
    id: "event-3",
    name: "Tech Conference",
    date: "2025-05-10",
    venue: "Innovation Center",
    status: "completed",
    vendorsCount: 20,
    guestsCount: 800
  },
  {
    id: "event-4",
    name: "Music Festival",
    date: "2025-08-05",
    venue: "City Park",
    status: "cancelled",
    vendorsCount: 35,
    guestsCount: 2000
  }
];

export default function HostEventsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'planning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'cancelled':
        return <CalendarX className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const filteredEvents = mockEvents.filter(
    event => event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEventClick = (id: string) => {
    navigate(`/host/events/${id}`);
  };
  
  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-gray-500">Manage your events and venues</p>
          </div>
          
          <Button onClick={() => navigate("/host/events/new")}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
        
        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search events..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 gap-4">
              {filteredEvents.map((event) => (
                <Card 
                  key={event.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleEventClick(event.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                          {getStatusIcon(event.status)}
                        </div>
                        
                        <div>
                          <h3 className="font-medium">{event.name}</h3>
                          <p className="text-sm text-gray-500">
                            {event.venue} • {new Date(event.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4 md:mt-0">
                        <span className={`${getStatusClass(event.status)} px-2 py-1 rounded text-xs mr-4 capitalize`}>
                          {event.status}
                        </span>
                        
                        <div className="text-right mr-4">
                          <div className="text-sm font-medium">{event.vendorsCount} vendors</div>
                          <div className="text-sm font-medium">{event.guestsCount} guests</div>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 gap-4">
              {filteredEvents
                .filter(event => event.status === 'upcoming')
                .map((event) => (
                  <Card 
                    key={event.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-gray-100 p-3 rounded-full">
                            {getStatusIcon(event.status)}
                          </div>
                          
                          <div>
                            <h3 className="font-medium">{event.name}</h3>
                            <p className="text-sm text-gray-500">
                              {event.venue} • {new Date(event.date).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4 md:mt-0">
                          <span className={`${getStatusClass(event.status)} px-2 py-1 rounded text-xs mr-4 capitalize`}>
                            {event.status}
                          </span>
                          
                          <div className="text-right mr-4">
                            <div className="text-sm font-medium">{event.vendorsCount} vendors</div>
                            <div className="text-sm font-medium">{event.guestsCount} guests</div>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="planning">
            <div className="grid grid-cols-1 gap-4">
              {filteredEvents
                .filter(event => event.status === 'planning')
                .map((event) => (
                  <Card 
                    key={event.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-gray-100 p-3 rounded-full">
                            {getStatusIcon(event.status)}
                          </div>
                          
                          <div>
                            <h3 className="font-medium">{event.name}</h3>
                            <p className="text-sm text-gray-500">
                              {event.venue} • {new Date(event.date).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4 md:mt-0">
                          <span className={`${getStatusClass(event.status)} px-2 py-1 rounded text-xs mr-4 capitalize`}>
                            {event.status}
                          </span>
                          
                          <div className="text-right mr-4">
                            <div className="text-sm font-medium">{event.vendorsCount} vendors</div>
                            <div className="text-sm font-medium">{event.guestsCount} guests</div>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="grid grid-cols-1 gap-4">
              {filteredEvents
                .filter(event => event.status === 'completed')
                .map((event) => (
                  <Card 
                    key={event.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-gray-100 p-3 rounded-full">
                            {getStatusIcon(event.status)}
                          </div>
                          
                          <div>
                            <h3 className="font-medium">{event.name}</h3>
                            <p className="text-sm text-gray-500">
                              {event.venue} • {new Date(event.date).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4 md:mt-0">
                          <span className={`${getStatusClass(event.status)} px-2 py-1 rounded text-xs mr-4 capitalize`}>
                            {event.status}
                          </span>
                          
                          <div className="text-right mr-4">
                            <div className="text-sm font-medium">{event.vendorsCount} vendors</div>
                            <div className="text-sm font-medium">{event.guestsCount} guests</div>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HostPanelLayout>
  );
}
