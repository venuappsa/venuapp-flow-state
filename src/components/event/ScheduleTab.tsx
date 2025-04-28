
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  X,
  ChevronRight,
  AlarmClock
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock schedule data
const mockSchedule = [
  {
    id: "schedule-1",
    title: "Gates Open",
    time: "17:00",
    endTime: null,
    description: "Main entrance opens for general admission",
    type: "general"
  },
  {
    id: "schedule-2",
    title: "VIP Early Access",
    time: "16:00",
    endTime: "17:00",
    description: "Early access for VIP ticket holders",
    type: "vip"
  },
  {
    id: "schedule-3",
    title: "Main Performance",
    time: "19:30",
    endTime: "21:00",
    description: "Headliner performance on the main stage",
    type: "performance"
  },
  {
    id: "schedule-4",
    title: "Food & Drink Service",
    time: "17:00",
    endTime: "23:00",
    description: "All food and beverage vendors operational",
    type: "vendor"
  },
  {
    id: "schedule-5",
    title: "Event Closes",
    time: "23:00",
    endTime: null,
    description: "End of event and venue closes",
    type: "general"
  }
];

export default function EventScheduleTab({ eventId }: { eventId: string }) {
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const formattedDate = new Intl.DateTimeFormat('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(selectedDate);

  const getTimelinePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    // Base timeline is 16:00 (4pm) to 00:00 (midnight)
    const startHour = 16;
    const totalHours = 8;
    
    const hoursSinceStart = hours - startHour + (minutes / 60);
    const position = (hoursSinceStart / totalHours) * 100;
    return Math.max(0, Math.min(100, position));
  };

  const getTimelineDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return 5; // Default width for point events
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    // Duration in hours
    const durationHours = (endTotalMinutes - startTotalMinutes) / 60;
    
    // Convert to percentage of the timeline (8 hours total)
    return (durationHours / 8) * 100;
  };

  const getItemColor = (type: string) => {
    switch(type) {
      case 'vip': return 'bg-purple-500';
      case 'performance': return 'bg-blue-500';
      case 'vendor': return 'bg-green-500';
      case 'general': 
      default: return 'bg-venu-orange';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Event Schedule</h3>
          <p className="text-sm text-gray-500">Plan and manage your event timeline</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex border rounded-md overflow-hidden">
            <button 
              className={`px-3 py-1.5 text-sm ${viewMode === 'timeline' ? 'bg-venu-orange text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </button>
            <button 
              className={`px-3 py-1.5 text-sm ${viewMode === 'list' ? 'bg-venu-orange text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-venu-orange" />
            <CardTitle>{formattedDate}</CardTitle>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() - 1);
                setSelectedDate(newDate);
              }}
            >
              Previous Day
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() + 1);
                setSelectedDate(newDate);
              }}
            >
              Next Day
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {viewMode === 'timeline' ? (
            <div className="space-y-6">
              <div className="relative h-12 border-t border-b border-gray-200">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div 
                    key={index}
                    className="absolute top-0 bottom-0 border-l border-gray-200 flex flex-col justify-between"
                    style={{ left: `${index * 12.5}%` }}
                  >
                    <span className="text-xs text-gray-500 -translate-x-1/2 -translate-y-full">
                      {`${index + 16}:00`}
                    </span>
                    <span className="h-2 w-px bg-gray-300"></span>
                  </div>
                ))}
                
                {mockSchedule.map((item) => (
                  <div
                    key={item.id}
                    className={`absolute h-8 rounded-md flex items-center px-2 text-white ${getItemColor(item.type)}`}
                    style={{ 
                      left: `${getTimelinePosition(item.time)}%`,
                      width: `${item.endTime ? getTimelineDuration(item.time, item.endTime) : 5}%`,
                      minWidth: '60px'
                    }}
                    onClick={() => toast({
                      title: item.title,
                      description: item.description
                    })}
                  >
                    <span className="text-xs font-medium truncate">
                      {item.time} {item.title}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium mb-2">Legend</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-venu-orange mr-2"></div>
                    <span className="text-sm">General</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-sm">VIP</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Performance</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Vendor</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th scope="col" className="relative px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockSchedule.sort((a, b) => a.time.localeCompare(b.time)).map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.time}{item.endTime ? ` - ${item.endTime}` : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.type === 'vip' ? 'bg-purple-100 text-purple-800' :
                          item.type === 'performance' ? 'bg-blue-100 text-blue-800' :
                          item.type === 'vendor' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlarmClock className="h-5 w-5 mr-2 text-venu-orange" />
              Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium">Vendor Setup Reminder</p>
                    <p className="text-xs text-gray-500">Send 2 hours before event</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-md">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-purple-600 mr-2" />
                  <div>
                    <p className="font-medium">Staff Check-in</p>
                    <p className="text-xs text-gray-500">Send 1 hour before gates open</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Copy className="h-5 w-5 mr-2 text-venu-orange" />
              Schedule Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">Standard Music Event</p>
                  <p className="text-xs text-gray-500">5 schedule items</p>
                </div>
                <Button size="sm" variant="outline">Apply</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">Conference Schedule</p>
                  <p className="text-xs text-gray-500">8 schedule items</p>
                </div>
                <Button size="sm" variant="outline">Apply</Button>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Save Current as Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
