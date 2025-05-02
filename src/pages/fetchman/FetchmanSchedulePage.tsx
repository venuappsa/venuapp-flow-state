
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Filter, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

// Create a basic layout similar to the other role layouts
const FetchmanLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
            alt="Venuapp Logo"
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-xl font-semibold text-venu-orange">Venuapp Fetchman</h1>
        </div>
        <div className="flex items-center gap-4">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <Calendar className="h-5 w-5 text-gray-500" />
          <div className="h-8 w-8 rounded-full bg-venu-orange text-white flex items-center justify-center">
            FB
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">{children}</main>
    </div>
  );
};

export default function FetchmanSchedulePage() {
  // Get current date for the calendar
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Mock schedule data
  const scheduleData = [
    {
      id: "1",
      date: new Date(today.getFullYear(), today.getMonth(), 15),
      tasks: [
        { time: "08:00 - 10:30", description: "Wedding Cake Delivery", location: "Grand Hyatt Hotel" },
        { time: "13:00 - 14:30", description: "Equipment Pickup", location: "Sound Masters Warehouse" }
      ]
    },
    {
      id: "2",
      date: new Date(today.getFullYear(), today.getMonth(), 16),
      tasks: [
        { time: "09:00 - 11:00", description: "Floral Arrangements", location: "Thaba Eco Hotel" },
      ]
    },
    {
      id: "3",
      date: new Date(today.getFullYear(), today.getMonth(), 18),
      tasks: [
        { time: "10:00 - 12:30", description: "Catering Delivery", location: "Sandton Convention Centre" },
        { time: "15:00 - 16:30", description: "Décor Items Return", location: "Elegant Events Storage" },
        { time: "18:00 - 19:30", description: "Last Minute Supplies", location: "Party Wholesale Warehouse" }
      ]
    }
  ];

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: null, date: null, hasEvents: false });
  }
  
  // Add days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(today.getFullYear(), today.getMonth(), day);
    const hasEvents = scheduleData.some(schedule => 
      schedule.date.getDate() === day && 
      schedule.date.getMonth() === today.getMonth() && 
      schedule.date.getFullYear() === today.getFullYear()
    );
    
    calendarDays.push({ day, date: currentDate, hasEvents });
  }

  // Schedule for today or selected day
  const todaySchedule = scheduleData.find(schedule => 
    schedule.date.getDate() === today.getDate() &&
    schedule.date.getMonth() === today.getMonth() &&
    schedule.date.getFullYear() === today.getFullYear()
  );

  return (
    <FetchmanLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold mb-2">Schedule</h1>
          <p className="text-gray-500">Manage your delivery calendar and availability</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Calendar</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-medium">
                      {monthNames[today.getMonth()]} {today.getFullYear()}
                    </span>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>Your delivery schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day, index) => (
                    <div 
                      key={index}
                      className={`aspect-square flex flex-col items-center justify-center p-1 rounded-md border ${
                        day.day === today.getDate() ? 'bg-venu-orange text-white' : 
                        day.hasEvents ? 'border-venu-orange' : 'border-transparent'
                      }`}
                    >
                      {day.day && (
                        <>
                          <span className="text-sm">{day.day}</span>
                          {day.hasEvents && day.day !== today.getDate() && (
                            <div className="mt-1 w-1 h-1 rounded-full bg-venu-orange"></div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Your Availability</h3>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Set Hours
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <div key={day} className="border rounded-md p-3">
                        <div className="text-sm font-medium">{day}</div>
                        <div className="text-xs text-gray-500">08:00 - 18:00</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>{today.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent>
              {todaySchedule ? (
                <div className="space-y-4">
                  {todaySchedule.tasks.map((task, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="h-4 w-4 text-venu-orange" />
                        {task.time}
                      </div>
                      <div className="mt-2 font-medium">{task.description}</div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {task.location}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">No tasks scheduled for today</p>
                  <Button className="mt-4" variant="outline">
                    Find Available Tasks
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Your delivery tasks for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {scheduleData.length > 0 ? (
              <div className="space-y-4">
                {scheduleData
                  .filter(schedule => schedule.date >= today)
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 3)
                  .map((schedule) => (
                    <div key={schedule.id} className="border rounded-md p-4">
                      <div className="font-medium">
                        {schedule.date.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="mt-3 space-y-3">
                        {schedule.tasks.map((task, index) => (
                          <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                            <div className="bg-gray-100 rounded-md p-2">
                              <Clock className="h-5 w-5 text-venu-orange" />
                            </div>
                            <div>
                              <div className="font-medium">{task.description}</div>
                              <div className="text-sm text-gray-500">{task.time}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {task.location}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No upcoming tasks scheduled</p>
                <Button className="mt-4" variant="outline">
                  Find Available Tasks
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FetchmanLayout>
  );
}
