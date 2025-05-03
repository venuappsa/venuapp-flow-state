
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FetchmanSchedulePage() {
  const { user } = useUser();
  const [fetchmanProfile, setFetchmanProfile] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [scheduledShifts, setScheduledShifts] = useState<any[]>([]);
  const [availableShifts, setAvailableShifts] = useState<any[]>([]);
  const [userAvailability, setUserAvailability] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState({
    profile: true,
    shifts: true,
    availability: true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAvailability, setNewAvailability] = useState({
    date: new Date(),
    startTime: "09:00",
    endTime: "17:00",
    location: "Any",
    notes: "",
  });

  useEffect(() => {
    const fetchFetchmanProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('fetchman_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching fetchman profile:", error);
          return;
        }
        
        setFetchmanProfile(data);
      } catch (err) {
        console.error("Error in fetchFetchmanProfile:", err);
      } finally {
        setIsLoading(prev => ({ ...prev, profile: false }));
      }
    };
    
    fetchFetchmanProfile();
  }, [user]);

  useEffect(() => {
    const fetchShifts = async () => {
      if (!fetchmanProfile) return;
      
      try {
        // Fetch assigned deliveries (these serve as "scheduled shifts")
        const { data: deliveries, error } = await supabase
          .from('fetchman_deliveries')
          .select('*')
          .eq('fetchman_id', fetchmanProfile.id)
          .in('status', ['accepted', 'pending', 'in_progress'])
          .order('scheduled_time', { ascending: true });
        
        if (error) {
          console.error("Error fetching assigned deliveries:", error);
          return;
        }
        
        // Convert to scheduled shifts format
        const shifts = deliveries?.map(delivery => ({
          id: delivery.id,
          date: delivery.scheduled_time.split('T')[0],
          startTime: new Date(delivery.scheduled_time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          endTime: (() => {
            const endTime = new Date(delivery.scheduled_time);
            endTime.setHours(endTime.getHours() + 1);
            return endTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
          })(),
          location: delivery.pickup_location,
          status: delivery.status === 'accepted' ? 'confirmed' : 'pending'
        })) || [];
        
        setScheduledShifts(shifts);
      } catch (err) {
        console.error("Error processing shifts data:", err);
      } finally {
        setIsLoading(prev => ({ ...prev, shifts: false }));
      }
    };
    
    const fetchAvailableShifts = async () => {
      try {
        // For demonstration, we'll use static data
        // In a real app, this would come from a server endpoint
        setAvailableShifts([
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
        ]);
      } catch (err) {
        console.error("Error fetching available shifts:", err);
      }
    };
    
    const fetchUserAvailability = async () => {
      if (!fetchmanProfile) return;
      
      try {
        // In a real app, we would fetch from a fetchman_availability table
        // For now, we'll use mock data that aligns with the current date
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        // Mock data that we would typically fetch from the database
        const mockAvailability = [
          {
            id: "av1",
            date: todayStr,
            startTime: "09:00",
            endTime: "17:00",
            location: "Any",
            notes: "Available for full day shifts"
          },
          {
            id: "av2",
            date: tomorrowStr,
            startTime: "08:00",
            endTime: "12:00",
            location: "Sandton Only",
            notes: "Morning availability"
          }
        ];
        
        setUserAvailability(mockAvailability);
      } catch (err) {
        console.error("Error fetching user availability:", err);
      } finally {
        setIsLoading(prev => ({ ...prev, availability: false }));
      }
    };
    
    if (fetchmanProfile) {
      fetchShifts();
      fetchAvailableShifts();
      fetchUserAvailability();
    }
  }, [fetchmanProfile]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const addAvailability = () => {
    // In a real app, we would save to the database
    const newAvailabilityEntry = {
      id: `av${userAvailability.length + 1}`,
      date: newAvailability.date.toISOString().split('T')[0],
      startTime: newAvailability.startTime,
      endTime: newAvailability.endTime,
      location: newAvailability.location,
      notes: newAvailability.notes
    };
    
    setUserAvailability(prev => [...prev, newAvailabilityEntry]);
    setDialogOpen(false);
    
    toast({
      title: "Availability Added",
      description: `You're now available on ${formatDate(newAvailabilityEntry.date)}.`,
    });
  };

  const removeAvailability = (id: string) => {
    // In a real app, we would delete from the database
    setUserAvailability(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Availability Removed",
      description: "Your availability has been removed.",
    });
  };

  const claimShift = (shiftId: string) => {
    // In a real app, this would make an API call to claim the shift
    toast({
      title: "Shift Claimed",
      description: "You have successfully claimed this shift.",
    });
    
    // Update the UI
    const claimedShift = availableShifts.find(s => s.id === shiftId);
    if (claimedShift) {
      setScheduledShifts(prev => [...prev, {
        ...claimedShift,
        status: 'confirmed'
      }]);
      setAvailableShifts(prev => prev.filter(s => s.id !== shiftId));
    }
  };

  const isDateWithAvailability = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return userAvailability.some(a => a.date === dateStr);
  };

  const getAvailabilityForSelectedDate = () => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return userAvailability.filter(a => a.date === dateStr);
  };

  const getShiftsForSelectedDate = () => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return scheduledShifts.filter(s => s.date === dateStr);
  };
  
  const getAvailableShiftsForSelectedDate = () => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return availableShifts.filter(s => s.date === dateStr);
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
              modifiers={{
                availability: (date) => isDateWithAvailability(date),
                booked: (date) => {
                  const dateStr = date.toISOString().split('T')[0];
                  return scheduledShifts.some(s => s.date === dateStr);
                }
              }}
              modifiersStyles={{
                availability: { backgroundColor: 'rgba(34, 197, 94, 0.1)' },
                booked: { backgroundColor: 'rgba(59, 130, 246, 0.1)' }
              }}
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 mr-2 rounded-full bg-green-100"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 mr-2 rounded-full bg-blue-100"></div>
                <span>Shift Scheduled</span>
              </div>
            </div>
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
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Set Availability
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Set Your Availability</DialogTitle>
                    <DialogDescription>
                      Let us know when you're available to work.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="avail-date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="avail-date"
                        type="date"
                        className="col-span-3"
                        value={newAvailability.date.toISOString().split('T')[0]}
                        onChange={(e) => 
                          setNewAvailability(prev => ({
                            ...prev,
                            date: new Date(e.target.value)
                          }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="start-time" className="text-right">
                        Start Time
                      </Label>
                      <Input
                        id="start-time"
                        type="time"
                        className="col-span-3"
                        value={newAvailability.startTime}
                        onChange={(e) => 
                          setNewAvailability(prev => ({
                            ...prev,
                            startTime: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="end-time" className="text-right">
                        End Time
                      </Label>
                      <Input
                        id="end-time"
                        type="time"
                        className="col-span-3"
                        value={newAvailability.endTime}
                        onChange={(e) => 
                          setNewAvailability(prev => ({
                            ...prev,
                            endTime: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Location
                      </Label>
                      <Select 
                        value={newAvailability.location}
                        onValueChange={(value) => 
                          setNewAvailability(prev => ({
                            ...prev,
                            location: value
                          }))
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Any">Any Location</SelectItem>
                          <SelectItem value="Sandton">Sandton</SelectItem>
                          <SelectItem value="Rosebank">Rosebank</SelectItem>
                          <SelectItem value="Menlyn">Menlyn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Notes
                      </Label>
                      <Input
                        id="notes"
                        className="col-span-3"
                        placeholder="Any specific requirements"
                        value={newAvailability.notes}
                        onChange={(e) => 
                          setNewAvailability(prev => ({
                            ...prev,
                            notes: e.target.value
                          }))
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={addAvailability}>Set Availability</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {isLoading.profile || isLoading.availability ? (
                <div className="text-center py-6">Loading your schedule...</div>
              ) : (
                <>
                  <h3 className="text-lg font-medium">Your Availability</h3>
                  {getAvailabilityForSelectedDate().length > 0 ? (
                    <div className="space-y-3">
                      {getAvailabilityForSelectedDate().map((availability) => (
                        <div key={availability.id} className="flex items-center justify-between border rounded-md p-4 bg-green-50">
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="font-medium">{formatDate(availability.date)}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{availability.startTime} - {availability.endTime}</span>
                            </div>
                            <div className="mt-1 text-gray-500">
                              {availability.location} - {availability.notes}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeAvailability(availability.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No availability set for this date.</p>
                  )}

                  <h3 className="text-lg font-medium mt-8">Your Shifts</h3>
                  {isLoading.shifts ? (
                    <div className="text-center py-6">Loading your shifts...</div>
                  ) : getShiftsForSelectedDate().length > 0 ? (
                    <div className="space-y-3">
                      {getShiftsForSelectedDate().map((shift) => (
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
                    <p className="text-gray-500">No shifts scheduled for this date.</p>
                  )}

                  <h3 className="text-lg font-medium mt-8">Available Shifts</h3>
                  {getAvailableShiftsForSelectedDate().length > 0 ? (
                    <div className="space-y-3">
                      {getAvailableShiftsForSelectedDate().map((shift) => (
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
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => claimShift(shift.id)}
                            >
                              Claim Shift
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No available shifts for this date.</p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
