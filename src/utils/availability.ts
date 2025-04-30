
import { format, isSameDay } from 'date-fns';

export interface AvailabilityDay {
  date: Date;
  isAvailable: boolean;
  timeStart?: string;
  timeEnd?: string;
  notes?: string;
  id?: string;
}

export interface DefaultHours {
  timeStart: string;
  timeEnd: string;
}

export const getDefaultHours = (userId: string): DefaultHours => {
  try {
    const savedDefaults = localStorage.getItem(`vendor_default_hours_${userId}`);
    if (savedDefaults) {
      return JSON.parse(savedDefaults);
    }
  } catch (error) {
    console.error('Error fetching default hours:', error);
  }
  
  return {
    timeStart: '09:00',
    timeEnd: '17:00'
  };
};

export const saveDefaultHours = (userId: string, hours: DefaultHours): void => {
  try {
    localStorage.setItem(`vendor_default_hours_${userId}`, JSON.stringify(hours));
  } catch (error) {
    console.error('Error saving default hours:', error);
  }
};

export const getDayClassName = (availabilityDays: AvailabilityDay[], day: Date): string => {
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

export const applyDefaultsToWeek = (date: Date, defaultHours: DefaultHours, availabilityDays: AvailabilityDay[]): AvailabilityDay[] => {
  if (!date) return availabilityDays;
  
  const updatedAvailability = [...availabilityDays];
  const currentDate = new Date(date.getTime());
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday
  
  // Create availability entries for each day of the week
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);
    
    // Check if this day already has an entry
    const existingIndex = updatedAvailability.findIndex(d => 
      isSameDay(new Date(d.date), dayDate)
    );
    
    // If no entry exists, create a new one with default hours
    if (existingIndex === -1) {
      updatedAvailability.push({
        date: dayDate,
        isAvailable: true,
        timeStart: defaultHours.timeStart,
        timeEnd: defaultHours.timeEnd
      });
    } 
    // If entry exists but is marked as unavailable, update to available with default hours
    else if (!updatedAvailability[existingIndex].isAvailable) {
      updatedAvailability[existingIndex] = {
        ...updatedAvailability[existingIndex],
        isAvailable: true,
        timeStart: defaultHours.timeStart,
        timeEnd: defaultHours.timeEnd
      };
    }
  }
  
  return updatedAvailability;
};
