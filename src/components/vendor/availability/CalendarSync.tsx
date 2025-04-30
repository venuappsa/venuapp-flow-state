
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { CalendarIcon, Info } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface CalendarSyncProps {
  userId: string;
}

interface SyncedCalendar {
  email: string;
  provider: 'google' | 'outlook' | 'apple';
  lastSynced: Date;
}

export default function CalendarSync({ userId }: CalendarSyncProps) {
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncedCalendars, setSyncedCalendars] = useState<SyncedCalendar[]>([]);

  useEffect(() => {
    // Load synced calendars from localStorage
    try {
      const savedCalendars = localStorage.getItem(`vendor_synced_calendars_${userId}`);
      if (savedCalendars) {
        const parsed = JSON.parse(savedCalendars);
        // Convert string dates to Date objects
        const calendars = parsed.map((cal: any) => ({
          ...cal,
          lastSynced: new Date(cal.lastSynced)
        }));
        setSyncedCalendars(calendars);
      }
    } catch (error) {
      console.error('Error loading synced calendars:', error);
    }
  }, [userId]);

  const handleConnectCalendar = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your Google account email",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCalendar: SyncedCalendar = {
      email,
      provider: 'google',
      lastSynced: new Date()
    };
    
    const updatedCalendars = [...syncedCalendars, newCalendar];
    setSyncedCalendars(updatedCalendars);
    
    // Save to localStorage
    try {
      localStorage.setItem(`vendor_synced_calendars_${userId}`, JSON.stringify(updatedCalendars));
    } catch (error) {
      console.error('Error saving synced calendars:', error);
    }
    
    setIsConnecting(false);
    setShowSyncDialog(false);
    
    toast({
      title: "Calendar connected",
      description: `Your Google Calendar (${email}) has been connected successfully.`
    });
  };

  const handleRemoveCalendar = (emailToRemove: string) => {
    const updatedCalendars = syncedCalendars.filter(cal => cal.email !== emailToRemove);
    setSyncedCalendars(updatedCalendars);
    
    // Save to localStorage
    try {
      localStorage.setItem(`vendor_synced_calendars_${userId}`, JSON.stringify(updatedCalendars));
    } catch (error) {
      console.error('Error saving synced calendars:', error);
    }
    
    toast({
      title: "Calendar disconnected",
      description: `Calendar ${emailToRemove} has been disconnected.`
    });
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Calendar Sync</CardTitle>
          <CardDescription>
            Connect your external calendars to automatically update your availability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {syncedCalendars.length > 0 ? (
            <div className="space-y-2">
              {syncedCalendars.map((calendar) => (
                <div key={calendar.email} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{calendar.email}</p>
                      <p className="text-xs text-gray-500">
                        Last synced: {calendar.lastSynced.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveCalendar(calendar.email)}
                  >
                    Disconnect
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full justify-start mt-2"
                onClick={() => setShowSyncDialog(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Connect Another Calendar</span>
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="w-full justify-start" onClick={() => setShowSyncDialog(true)}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Connect Google Calendar</span>
            </Button>
          )}
          
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-500 shrink-0" />
              <p className="text-sm text-blue-700">
                Calendar sync will allow you to automatically mark dates as unavailable based on your existing calendars.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect Google Calendar</DialogTitle>
            <DialogDescription>
              Enter your Google account email to connect your calendar
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="your.email@gmail.com" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-2">
              We'll redirect you to Google to authorize access to your calendar.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSyncDialog(false)}>Cancel</Button>
            <Button onClick={handleConnectCalendar} disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : 'Connect Calendar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
