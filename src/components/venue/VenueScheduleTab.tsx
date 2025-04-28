
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Clock, Plus, ChevronRight, Users } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface VenueScheduleTabProps {
  venueId: string;
}

export default function VenueScheduleTab({ venueId }: VenueScheduleTabProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [createEventDialogOpen, setCreateEventDialogOpen] = useState(false);
  
  // Demo events data
  const scheduledEvents = [
    { 
      id: "e1", 
      name: "Weekly Market", 
      date: new Date(2025, 4, 15), 
      startTime: "10:00", 
      endTime: "16:00",
      type: "Market",
      capacity: 250
    },
    { 
      id: "e2", 
      name: "Live Music Night", 
      date: new Date(2025, 4, 17), 
      startTime: "18:00", 
      endTime: "23:00",
      type: "Entertainment",
      capacity: 150
    },
    { 
      id: "e3", 
      name: "Corporate Workshop", 
      date: new Date(2025, 4, 20), 
      startTime: "09:00", 
      endTime: "17:00",
      type: "Corporate",
      capacity: 50
    },
  ];
  
  const handleCreateEvent = () => {
    toast({
      title: "Event Created",
      description: "Your new event has been scheduled successfully.",
    });
    setCreateEventDialogOpen(false);
  };

  const isDateWithEvent = (date: Date) => {
    return scheduledEvents.some(
      event => 
        event.date.getDate() === date.getDate() && 
        event.date.getMonth() === date.getMonth() && 
        event.date.getFullYear() === date.getFullYear()
    );
  };
  
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    return scheduledEvents.filter(
      event => 
        event.date.getDate() === selectedDate.getDate() && 
        event.date.getMonth() === selectedDate.getMonth() && 
        event.date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold">Venue Schedule</h2>
          <p className="text-sm text-gray-500">
            Manage events and operating hours
          </p>
        </div>
        <Button onClick={() => setCreateEventDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Event
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                booked: (date) => isDateWithEvent(date),
              }}
              modifiersStyles={{
                booked: { backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 'bold' }
              }}
            />
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium mb-2">Legend</h3>
              <div className="flex items-center mb-2">
                <div className="h-4 w-4 rounded bg-amber-100 mr-2"></div>
                <span className="text-sm">Events scheduled</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded bg-white border border-gray-300 mr-2"></div>
                <span className="text-sm">Available for booking</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">
                {selectedDate ? (
                  <>Events for {selectedDate.toLocaleDateString("en-ZA", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</>
                ) : (
                  <>Select a date</>
                )}
              </h3>
              {selectedDate && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCreateEventDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              )}
            </div>
            
            {selectedDate ? (
              <div className="space-y-3">
                {getEventsForSelectedDate().length > 0 ? (
                  getEventsForSelectedDate().map((event) => (
                    <div 
                      key={event.id} 
                      className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                      onClick={() => window.location.href = `/host/events/${event.id}`}
                    >
                      <div className="flex-grow">
                        <div className="flex items-center gap-3">
                          <div className="bg-venu-orange/10 p-2 rounded">
                            <CalendarDays className="h-5 w-5 text-venu-orange" />
                          </div>
                          <div>
                            <h4 className="font-medium">{event.name}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{event.startTime} - {event.endTime}</span>
                              <span className="mx-2">•</span>
                              <Users className="h-3.5 w-3.5 mr-1" />
                              <span>Up to {event.capacity} people</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          {event.type}
                        </Badge>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-md">
                    <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium mb-1">No events scheduled</h3>
                    <p className="text-gray-500 mb-4">There are no events scheduled for this date.</p>
                    <Button onClick={() => setCreateEventDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Event
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Please select a date to view events.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Regular Operating Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="p-3 border rounded-md">
                  <div className="font-medium mb-2">{day}</div>
                  <div className="text-sm">
                    <span className="text-gray-700">10:00 AM - 10:00 PM</span>
                  </div>
                </div>
              ))}
              <div className="p-3 border rounded-md border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <Button variant="ghost">
                  <Plus className="h-4 w-4 mr-1" />
                  Update Hours
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Create Event Dialog */}
      <Dialog open={createEventDialogOpen} onOpenChange={setCreateEventDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Event</DialogTitle>
            <DialogDescription>
              Create a new event for your venue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="eventName" className="text-sm font-medium">Event Name</label>
              <Input id="eventName" placeholder="Enter event name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="eventDate" className="text-sm font-medium">Date</label>
              <Input 
                id="eventDate" 
                type="date" 
                defaultValue={selectedDate ? selectedDate.toISOString().split('T')[0] : undefined}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startTime" className="text-sm font-medium">Start Time</label>
                <Input id="startTime" type="time" defaultValue="10:00" />
              </div>
              <div className="space-y-2">
                <label htmlFor="endTime" className="text-sm font-medium">End Time</label>
                <Input id="endTime" type="time" defaultValue="16:00" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="eventType" className="text-sm font-medium">Event Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="private">Private Event</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="capacity" className="text-sm font-medium">Maximum Capacity</label>
              <Input id="capacity" type="number" placeholder="Enter maximum capacity" />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setCreateEventDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateEvent}>
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
