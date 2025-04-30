import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Check, X, Info } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';
import VendorPanelLayout from '@/components/layouts/VendorPanelLayout';

interface Availability {
  id: string;
  date: string;
  is_available: boolean;
  time_start: string | null;
  time_end: string | null;
  notes: string | null;
}

interface AvailabilityDay {
  date: Date;
  isAvailable: boolean;
  timeStart?: string;
  timeEnd?: string;
  notes?: string;
  id?: string;
}

export default function VendorAvailabilityPage() {
  const { user } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availabilityDays, setAvailabilityDays] = useState<AvailabilityDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<AvailabilityDay | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [timeStart, setTimeStart] = useState('09:00');
  const [timeEnd, setTimeEnd] = useState('17:00');
  const [notes, setNotes] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAvailability();
    }
  }, [user]);

  const fetchAvailability = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // First, get the vendor profile ID
      const { data: vendorProfile, error: vendorError } = await supabase
        .from('vendor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (vendorError) throw vendorError;

      if (!vendorProfile) {
        toast({
          title: "Vendor profile not found",
          description: "Please complete your vendor profile setup.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('vendor_availability')
        .select('*')
        .eq('vendor_id', vendorProfile.id);

      if (error) throw error;

      if (data) {
        const days: AvailabilityDay[] = data.map(item => ({
          date: new Date(item.date),
          isAvailable: item.is_available,
          timeStart: item.time_start,
          timeEnd: item.time_end,
          notes: item.notes,
          id: item.id,
        }));
        setAvailabilityDays(days);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: 'Failed to load availability',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayClick = (day: Date) => {
    const selectedDate = new Date(day);
    
    // Check if this day already has availability set
    const existingDay = availabilityDays.find((d) => 
      isSameDay(new Date(d.date), selectedDate)
    );

    if (existingDay) {
      setSelectedDay({
        ...existingDay,
        date: selectedDate,
      });
      setIsAvailable(existingDay.isAvailable);
      setTimeStart(existingDay.timeStart || '09:00');
      setTimeEnd(existingDay.timeEnd || '17:00');
      setNotes(existingDay.notes || '');
    } else {
      setSelectedDay({
        date: selectedDate,
        isAvailable: true,
      });
      setIsAvailable(true);
      setTimeStart('09:00');
      setTimeEnd('17:00');
      setNotes('');
    }

    setShowDialog(true);
  };

  const handleSaveAvailability = async () => {
    if (!selectedDay || !user) return;

    setIsLoading(true);
    try {
      // First, get the vendor profile ID
      const { data: vendorProfile, error: vendorError } = await supabase
        .from('vendor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (vendorError) throw vendorError;

      if (!vendorProfile) {
        toast({
          title: "Vendor profile not found",
          description: "Please complete your vendor profile setup.",
          variant: "destructive",
        });
        return;
      }

      const availabilityData = {
        vendor_id: vendorProfile.id,
        date: format(selectedDay.date, 'yyyy-MM-dd'),
        is_available: isAvailable,
        time_start: isAvailable ? timeStart : null,
        time_end: isAvailable ? timeEnd : null,
        notes: notes || null,
      };

      let response;
      
      // If we're editing an existing day
      if (selectedDay.id) {
        response = await supabase
          .from('vendor_availability')
          .update(availabilityData)
          .eq('id', selectedDay.id);
      } else {
        response = await supabase
          .from('vendor_availability')
          .insert([availabilityData]);
      }

      if (response.error) throw response.error;

      toast({
        title: 'Availability updated',
        description: `${format(selectedDay.date, 'MMMM d, yyyy')} has been ${isAvailable ? 'marked as available' : 'blocked'}`,
      });

      await fetchAvailability();
      setShowDialog(false);
    } catch (error) {
      console.error('Error saving availability:', error);
      toast({
        title: 'Failed to update availability',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDayClassName = (day: Date) => {
    const existingDay = availabilityDays.find((d) => 
      isSameDay(new Date(d.date), day)
    );
    
    if (existingDay) {
      return existingDay.isAvailable 
        ? 'bg-green-50 text-green-800 rounded-full border-green-200 hover:bg-green-100'
        : 'bg-red-50 text-red-800 rounded-full border-red-200 hover:bg-red-100';
    }
    
    return '';
  };

  return (
    <VendorPanelLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manage Availability</h1>
            <p className="text-gray-500">Set your available dates and working hours</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Calendar</span>
                  <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" disabled={isLoading}>
                        Set Availability
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Set Availability</DialogTitle>
                        <DialogDescription>
                          {selectedDay && format(selectedDay.date, 'MMMM d, yyyy')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant={isAvailable ? "default" : "outline"}
                            onClick={() => setIsAvailable(true)}
                            className="flex-1"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Available
                          </Button>
                          <Button
                            type="button"
                            variant={!isAvailable ? "default" : "outline"}
                            onClick={() => setIsAvailable(false)}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Not Available
                          </Button>
                        </div>
                        
                        {isAvailable && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="start-time">Start Time</Label>
                                <Input
                                  id="start-time"
                                  type="time"
                                  value={timeStart}
                                  onChange={(e) => setTimeStart(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="end-time">End Time</Label>
                                <Input
                                  id="end-time"
                                  type="time"
                                  value={timeEnd}
                                  onChange={(e) => setTimeEnd(e.target.value)}
                                />
                              </div>
                            </div>
                          </>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes (optional)</Label>
                          <Textarea
                            id="notes"
                            placeholder="Add any notes about this day"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                        <Button 
                          onClick={handleSaveAvailability}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription>
                  Click on a day to set or update your availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  onDayClick={handleDayClick}
                  className="rounded-md border"
                  dayClassName={getDayClassName}
                  classNames={{
                    day_selected: "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600",
                  }}
                />
                <div className="flex space-x-4 mt-4">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm">Unavailable</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Calendar Sync</CardTitle>
                <CardDescription>
                  Connect your external calendars to automatically update your availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" disabled>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Connect Google Calendar</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="ml-auto">Coming Soon</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        This feature will be available soon!
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Button>
                
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4 flex gap-3">
                    <Info className="h-5 w-5 text-blue-500 shrink-0" />
                    <p className="text-sm text-blue-700">
                      Calendar sync will allow you to automatically mark dates as unavailable based on your existing calendars.
                    </p>
                  </CardContent>
                </Card>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Default Working Hours</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="default-start">Start</Label>
                      <Input 
                        id="default-start" 
                        type="time" 
                        defaultValue="09:00" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="default-end">End</Label>
                      <Input 
                        id="default-end" 
                        type="time" 
                        defaultValue="17:00" 
                      />
                    </div>
                  </div>
                  <Button className="w-full mt-2" variant="outline" disabled>
                    Save Default Hours <Badge variant="outline" className="ml-2">Coming Soon</Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </VendorPanelLayout>
  );
}
