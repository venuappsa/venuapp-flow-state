
import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, X } from 'lucide-react';
import { AvailabilityDay, getDayClassName } from '@/utils/availability';

interface AvailabilityCalendarProps {
  availabilityDays: AvailabilityDay[];
  defaultTimeStart: string;
  defaultTimeEnd: string;
  isLoading: boolean;
  onSaveAvailability: (day: AvailabilityDay) => Promise<void>;
}

export default function AvailabilityCalendar({
  availabilityDays,
  defaultTimeStart,
  defaultTimeEnd,
  isLoading,
  onSaveAvailability
}: AvailabilityCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<AvailabilityDay | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [notes, setNotes] = useState('');
  const [showDialog, setShowDialog] = useState(false);

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
      setTimeStart(existingDay.timeStart || defaultTimeStart);
      setTimeEnd(existingDay.timeEnd || defaultTimeEnd);
      setNotes(existingDay.notes || '');
    } else {
      setSelectedDay({
        date: selectedDate,
        isAvailable: true,
      });
      setIsAvailable(true);
      setTimeStart(defaultTimeStart);
      setTimeEnd(defaultTimeEnd);
      setNotes('');
    }

    setShowDialog(true);
  };

  const handleSaveAvailability = async () => {
    if (!selectedDay) return;
    
    const dayToSave: AvailabilityDay = {
      ...selectedDay,
      isAvailable,
      timeStart: isAvailable ? timeStart : null,
      timeEnd: isAvailable ? timeEnd : null,
      notes: notes || null
    };
    
    await onSaveAvailability(dayToSave);
    setShowDialog(false);
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Calendar</span>
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
            dayClassName={(day) => getDayClassName(availabilityDays, day)}
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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
    </>
  );
}
