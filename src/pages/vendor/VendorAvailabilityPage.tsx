
import { useState, useEffect } from 'react';
import { addWeeks, subWeeks } from 'date-fns';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import VendorPanelLayout from '@/components/layouts/VendorPanelLayout';
import DefaultHoursForm from '@/components/vendor/availability/DefaultHoursForm';
import AvailabilityCalendar from '@/components/vendor/availability/AvailabilityCalendar';
import CalendarSync from '@/components/vendor/availability/CalendarSync';
import WeekToolbar from '@/components/vendor/availability/WeekToolbar';
import { 
  AvailabilityDay, 
  DefaultHours, 
  getDefaultHours, 
  applyDefaultsToWeek 
} from '@/utils/availability';

export default function VendorAvailabilityPage() {
  const { user } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availabilityDays, setAvailabilityDays] = useState<AvailabilityDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Default working hours state
  const [defaultHours, setDefaultHours] = useState<DefaultHours>({
    timeStart: '09:00',
    timeEnd: '17:00'
  });

  useEffect(() => {
    if (user) {
      fetchAvailability();
      fetchDefaultHours();
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

  const fetchDefaultHours = async () => {
    if (!user) return;
    const defaults = getDefaultHours(user.id);
    setDefaultHours(defaults);
  };

  const handleSaveAvailability = async (day: AvailabilityDay) => {
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

      const availabilityData = {
        vendor_id: vendorProfile.id,
        date: format(day.date, 'yyyy-MM-dd'),
        is_available: day.isAvailable,
        time_start: day.isAvailable ? day.timeStart : null,
        time_end: day.isAvailable ? day.timeEnd : null,
        notes: day.notes || null,
      };

      let response;
      
      // If we're editing an existing day
      if (day.id) {
        response = await supabase
          .from('vendor_availability')
          .update(availabilityData)
          .eq('id', day.id);
      } else {
        response = await supabase
          .from('vendor_availability')
          .insert([availabilityData]);
      }

      if (response.error) throw response.error;

      toast({
        title: 'Availability updated',
        description: `${format(day.date, 'MMMM d, yyyy')} has been ${day.isAvailable ? 'marked as available' : 'blocked'}`,
      });

      await fetchAvailability();
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

  const handleSaveDefaultHours = (hours: DefaultHours) => {
    setDefaultHours(hours);
  };

  const handleApplyDefaultsToWeek = () => {
    if (!date || !user) return;
    
    toast({
      title: 'Applying default hours',
      description: 'Default hours will be applied to the current week.',
    });
    
    // Apply default hours to current week
    const updatedAvailability = applyDefaultsToWeek(date, defaultHours, availabilityDays);
    setAvailabilityDays(updatedAvailability);
    
    toast({
      title: 'Default hours applied',
      description: 'Your availability has been updated for this week.',
    });
  };
  
  const handlePrevWeek = () => {
    setDate(prev => prev ? subWeeks(prev, 1) : subWeeks(new Date(), 1));
  };
  
  const handleNextWeek = () => {
    setDate(prev => prev ? addWeeks(prev, 1) : addWeeks(new Date(), 1));
  };
  
  const handleToday = () => {
    setDate(new Date());
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

        <WeekToolbar 
          currentDate={date || new Date()}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onToday={handleToday}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AvailabilityCalendar 
              availabilityDays={availabilityDays}
              defaultTimeStart={defaultHours.timeStart}
              defaultTimeEnd={defaultHours.timeEnd}
              isLoading={isLoading}
              onSaveAvailability={handleSaveAvailability}
            />
          </div>

          <div className="space-y-6">
            <CalendarSync userId={user?.id || ''} />
            
            <DefaultHoursForm 
              userId={user?.id || ''}
              initialValues={defaultHours}
              onSave={handleSaveDefaultHours}
              onApplyToWeek={handleApplyDefaultsToWeek}
            />
          </div>
        </div>
      </div>
    </VendorPanelLayout>
  );
}
