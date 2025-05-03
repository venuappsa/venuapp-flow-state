
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Calendar as CalendarIcon, Plus } from "lucide-react";

export default function FetchmanSchedulePage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // Mock scheduled shifts
  const scheduledShifts = [
    {
      id: "1",
      date: "2025-05-03",
      startTime: "08:00",
      endTime: "16:00",
      location: "Sandton Hub",
      status: "confirmed"
    },
    {
      id: "2",
      date: "2025-05-05",
      startTime: "09:00",
      endTime: "17:00",
      location: "Rosebank Hub",
      status: "confirmed"
    },
    {
      id: "3",
      date: "2025-05-07",
      startTime: "10:00",
      endTime: "18:00",
      location: "Sandton Hub",
      status: "pending"
    }
  ];

  // Mock available shifts that can be claimed
  const availableShifts = [
    {
      id: "4",
      date: "2025-05-04",
      startTime: "08:00",
      endTime: "16:00",
      location: "Sandton Hub",
      slots: 3
    },
    {
      id: "5",
      date: "2025-05-06",
      startTime: "09:00",
      endTime: "17:00",
      location: "Rosebank Hub",
      slots: 2
    },
    {
      id: "6",
      date: "2025-05-08",
      startTime: "08:00",
      endTime: "16:00",
      location: "Menlyn Hub",
      slots: 5
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold mb-2">Schedule</h1>
        <p className="text-gray-500">Manage your work schedule and shifts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Schedule</CardTitle>
                <CardDescription>
                  {date ? date.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' }) : ''}
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> Set Availability
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Shifts</h3>
              {scheduledShifts.length > 0 ? (
                <div className="space-y-3">
                  {scheduledShifts.map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between border rounded-md p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">{formatDate(shift.date)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{shift.startTime} - {shift.endTime}</span>
                        </div>
                        <div className="mt-1 text-gray-500">{shift.location}</div>
                      </div>
                      <div>
                        <Badge className={
                          shift.status === "confirmed" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }>
                          {shift.status === "confirmed" ? "Confirmed" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No shifts scheduled for this period.</p>
              )}

              <h3 className="text-lg font-medium mt-8">Available Shifts</h3>
              {availableShifts.length > 0 ? (
                <div className="space-y-3">
                  {availableShifts.map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between border rounded-md p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">{formatDate(shift.date)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{shift.startTime} - {shift.endTime}</span>
                        </div>
                        <div className="mt-1 text-gray-500">{shift.location}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-500">{shift.slots} slots left</span>
                        <Button size="sm" className="mt-2">Claim Shift</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No available shifts at this time.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
