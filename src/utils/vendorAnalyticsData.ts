
import { format, subDays, subMonths } from 'date-fns';

// Types for analytics data
export interface VendorMetric {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

export interface BookingTrend {
  date: string;
  bookings: number;
  revenue: number;
}

export interface VendorReview {
  id: string;
  hostId: string;
  hostName: string;
  eventId: string;
  eventName: string;
  rating: number;
  comment: string;
  date: string;
  status?: 'published' | 'pending' | 'flagged';
}

export interface VendorBookingHistory {
  id: string;
  eventName: string;
  hostName: string;
  date: string;
  startTime?: string;
  endTime?: string;
  amount: number;
  status: 'completed' | 'upcoming' | 'cancelled';
  eventId: string;
  hostId: string;
}

export interface VendorNotification {
  id: string;
  message: string;
  type: 'booking' | 'review' | 'payment' | 'system';
  read: boolean;
  date: string;
  link?: string;
}

// Helper function to generate dates for trends
const generateDates = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), days - i - 1);
    return format(date, 'MMM dd');
  });
};

// Generate weekly trend data
export const generateWeeklyTrendData = (userId: string): BookingTrend[] => {
  const dates = generateDates(7);
  
  // Use the userId as seed for pseudo-random data
  const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return dates.map((date, i) => {
    // Generate somewhat randomized but seeded data
    const randomFactor = ((seed + i) % 10) / 10;
    const bookings = Math.max(0, Math.floor(randomFactor * 5));
    const revenue = bookings * (100 + Math.floor(randomFactor * 200));
    
    return {
      date,
      bookings,
      revenue
    };
  });
};

// Generate monthly trend data
export const generateMonthlyTrendData = (userId: string): BookingTrend[] => {
  const months = Array.from({ length: 6 }).map((_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return format(date, 'MMM yyyy');
  });
  
  // Use the userId as seed for pseudo-random data
  const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return months.map((date, i) => {
    // Generate somewhat randomized but seeded data
    const randomFactor = ((seed + i) % 10) / 10;
    const bookings = Math.max(1, Math.floor(randomFactor * 15) + 5);
    const revenue = bookings * (100 + Math.floor(randomFactor * 300));
    
    return {
      date,
      bookings,
      revenue
    };
  });
};

// Generate sample booking history data
export const generateBookingHistory = (userId: string): VendorBookingHistory[] => {
  const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const eventNames = [
    'Summer Wedding Reception',
    'Corporate Anniversary',
    'Graduation Celebration',
    'Charity Gala Dinner',
    'Product Launch Event',
    'Birthday Party',
    'Networking Breakfast',
    'Annual Conference',
    'Team Building Day'
  ];
  
  const hostNames = [
    'Emma Johnson',
    'James Smith',
    'Sophia Wilson',
    'Michael Brown',
    'Olivia Davis',
    'Ethan Martinez',
    'Ava Taylor',
    'Noah Anderson'
  ];
  
  return Array.from({ length: 8 }).map((_, i) => {
    const seedOffset = (seed + i) % 100;
    const randomEventIndex = (seedOffset + i) % eventNames.length;
    const randomHostIndex = (seedOffset + i * 3) % hostNames.length;
    
    // Create different date patterns - some past, some upcoming
    let bookingDate;
    let status: 'completed' | 'upcoming' | 'cancelled';
    
    if (i < 4) {
      // Past events
      bookingDate = format(subDays(new Date(), 7 + (i * 5)), 'yyyy-MM-dd');
      status = Math.random() > 0.1 ? 'completed' : 'cancelled';
    } else {
      // Upcoming events
      bookingDate = format(subDays(new Date(), -10 - (i * 5)), 'yyyy-MM-dd');
      status = Math.random() > 0.05 ? 'upcoming' : 'cancelled';
    }
    
    return {
      id: `booking-${seed}-${i}`,
      eventName: eventNames[randomEventIndex],
      hostName: hostNames[randomHostIndex],
      date: bookingDate,
      startTime: '14:00',
      endTime: '22:00',
      amount: 250 + (seedOffset * 10),
      status,
      eventId: `event-${seed}-${i}`,
      hostId: `host-${randomHostIndex}`
    };
  });
};

// Generate sample reviews data
export const generateVendorReviews = (userId: string): VendorReview[] => {
  const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const comments = [
    "Excellent service! Very professional and friendly staff.",
    "The quality was outstanding. Would definitely hire again.",
    "Good service overall, but they were a bit late to set up.",
    "Amazing job! Went above and beyond our expectations.",
    "Very responsive to our requests and flexible with changes.",
    "Great value for the quality provided.",
    "Professional service with attention to detail.",
    "Reliable and punctual. Made our event special!"
  ];
  
  return Array.from({ length: 6 }).map((_, i) => {
    const seedOffset = (seed + i) % 100;
    const randomCommentIndex = (seedOffset + i) % comments.length;
    const randomRating = Math.min(5, Math.max(3, Math.floor(seedOffset % 5) + 1));
    
    return {
      id: `review-${seed}-${i}`,
      hostId: `host-${i + 1}`,
      hostName: `Host ${i + 1}`,
      eventId: `event-${seed}-${i}`,
      eventName: `Event ${i + 1}`,
      rating: randomRating,
      comment: comments[randomCommentIndex],
      date: format(subDays(new Date(), i * 15 + 5), 'yyyy-MM-dd'),
      status: 'published'
    };
  });
};

// Generate sample notifications
export const generateVendorNotifications = (userId: string): VendorNotification[] => {
  const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const notificationMessages = [
    { 
      message: "You received a new booking request", 
      type: "booking" as const
    },
    { 
      message: "A host has left a new review", 
      type: "review" as const
    },
    { 
      message: "Payment for Event #1234 has been processed", 
      type: "payment" as const
    },
    { 
      message: "Reminder: You have an event tomorrow", 
      type: "booking" as const
    },
    { 
      message: "Your profile has been verified", 
      type: "system" as const
    },
    { 
      message: "Please update your availability for next month", 
      type: "system" as const
    }
  ];
  
  return Array.from({ length: 5 }).map((_, i) => {
    const seedOffset = (seed + i) % 100;
    const randomIndex = (seedOffset + i) % notificationMessages.length;
    const randomReadStatus = i > 1;
    
    return {
      id: `notification-${seed}-${i}`,
      message: notificationMessages[randomIndex].message,
      type: notificationMessages[randomIndex].type,
      read: randomReadStatus,
      date: format(subDays(new Date(), i * 2), 'yyyy-MM-dd'),
      link: `/vendor/${notificationMessages[randomIndex].type === 'booking' ? 'bookings' : notificationMessages[randomIndex].type === 'review' ? 'reviews' : 'dashboard'}`
    };
  });
};

// Calculate vendor metrics
export const calculateVendorMetrics = (
  userId: string,
  bookings: VendorBookingHistory[],
  reviews: VendorReview[]
): VendorMetric[] => {
  // Calculate total revenue
  const totalRevenue = bookings
    .filter(booking => booking.status === 'completed')
    .reduce((sum, booking) => sum + booking.amount, 0);
  
  // Calculate upcoming bookings
  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming').length;
  
  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';
    
  // Calculate profile completion (mock)
  const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const profileCompletion = Math.min(100, 60 + (seed % 40));
  
  return [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12% from last month',
      changeType: 'positive'
    },
    {
      label: 'Upcoming Bookings',
      value: upcomingBookings,
      change: upcomingBookings > 2 ? '+1 from last week' : 'Same as last week',
      changeType: upcomingBookings > 2 ? 'positive' : 'neutral'
    },
    {
      label: 'Average Rating',
      value: avgRating,
      change: reviews.length > 0 ? `from ${reviews.length} reviews` : 'No reviews yet',
      changeType: reviews.length > 0 ? 'neutral' : 'neutral'
    },
    {
      label: 'Profile Completion',
      value: `${profileCompletion}%`,
      change: profileCompletion < 100 ? 'Complete your profile' : 'Profile complete',
      changeType: profileCompletion < 100 ? 'negative' : 'positive'
    }
  ];
};

// Get vendor data
export const getVendorData = (userId: string) => {
  if (!userId) return null;
  
  const bookings = generateBookingHistory(userId);
  const reviews = generateVendorReviews(userId);
  const weeklyTrends = generateWeeklyTrendData(userId);
  const monthlyTrends = generateMonthlyTrendData(userId);
  const notifications = generateVendorNotifications(userId);
  const metrics = calculateVendorMetrics(userId, bookings, reviews);
  
  return {
    bookings,
    reviews,
    weeklyTrends,
    monthlyTrends,
    notifications,
    metrics
  };
};
