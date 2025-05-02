import { Building, BadgePercent, Clock, Users, Wallet } from "lucide-react";

// Dummy venues data
export const dummyVenues = [
  {
    id: "venue-1",
    name: "The Grand Ballroom",
    location: "Johannesburg, South Africa",
    capacity: 500,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098",
    categories: ["Event Hall", "Conference", "Wedding"],
    created_at: "2023-10-15T14:30:00Z",
    upcoming_events: 3,
  },
  {
    id: "venue-2",
    name: "Riverside Gardens",
    location: "Cape Town, South Africa",
    capacity: 200,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1504718855392-c0f33b372e72?q=80&w=2070",
    categories: ["Outdoor", "Wedding", "Party"],
    created_at: "2023-11-20T09:15:00Z",
    upcoming_events: 1,
  },
  {
    id: "venue-3",
    name: "Tech Conference Center",
    location: "Pretoria, South Africa",
    capacity: 350,
    status: "pending",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012",
    categories: ["Conference", "Corporate", "Workshop"],
    created_at: "2024-01-05T11:45:00Z",
    upcoming_events: 0,
  },
];

// Dummy events data
export const dummyEvents = [
  {
    id: "event-1",
    name: "Summer Music Festival",
    venueId: "venue-1",
    venueName: "The Grand Ballroom",
    date: "2024-05-15T18:00:00Z",
    endDate: "2024-05-15T23:00:00Z",
    status: "upcoming",
    ticketsSold: 289,
    capacity: 500,
    revenue: 86700,
    vendors: 7,
    floorArea: 800,
    multiLevel: false,
    durationHours: 5,
    description: "An exciting summer music festival featuring local and international artists with food stalls and activities."
  },
  {
    id: "event-2",
    name: "Corporate Tech Summit",
    venueId: "venue-1",
    venueName: "The Grand Ballroom",
    date: "2024-05-28T09:00:00Z",
    endDate: "2024-05-28T17:00:00Z",
    status: "upcoming",
    ticketsSold: 175,
    capacity: 300,
    revenue: 43750,
    vendors: 5,
    floorArea: 600,
    multiLevel: false,
    durationHours: 8,
    description: "A professional gathering of tech industry leaders with keynote speeches, workshops, and networking opportunities."
  },
  {
    id: "event-3",
    name: "Wedding Expo",
    venueId: "venue-2",
    venueName: "Riverside Gardens",
    date: "2024-06-10T10:00:00Z",
    endDate: "2024-06-10T16:00:00Z",
    status: "upcoming",
    ticketsSold: 110,
    capacity: 200,
    revenue: 22000,
    vendors: 12,
    floorArea: 450,
    multiLevel: false,
    durationHours: 6,
    description: "Showcase of wedding services, venues, and products for couples planning their special day."
  },
  {
    id: "event-4",
    name: "New Year's Eve Party",
    venueId: "venue-1",
    venueName: "The Grand Ballroom",
    date: "2023-12-31T20:00:00Z",
    endDate: "2024-01-01T02:00:00Z",
    status: "completed",
    ticketsSold: 478,
    capacity: 500,
    revenue: 143400,
    vendors: 10,
    floorArea: 800,
    multiLevel: true,
    durationHours: 6,
    description: "Ring in the new year with a glamorous celebration featuring live music, premium dining, and countdown festivities."
  },
];

// Dummy vendors
export const dummyVendors = [
  {
    id: "vendor-1",
    name: "Gourmet Delights",
    category: "Food",
    contact: "contact@gourmetdelights.com",
    status: "approved",
  },
  {
    id: "vendor-2",
    name: "Craft Brewery Co.",
    category: "Beverages",
    contact: "info@craftbrewery.co.za",
    status: "approved",
  },
  {
    id: "vendor-3",
    name: "Artisanal Crafts",
    category: "Merchandise",
    contact: "sales@artisanalcrafts.com",
    status: "pending",
  },
  {
    id: "vendor-4",
    name: "Sound & Lights Pro",
    category: "Equipment",
    contact: "bookings@soundlightspro.com",
    status: "approved",
  },
  {
    id: "vendor-5",
    name: "Event Photographers",
    category: "Services",
    contact: "shoot@eventphotographers.co.za",
    status: "approved",
  },
];

// Dummy transactions
export const dummyTransactions = [
  {
    id: "trans-1",
    date: "2024-04-15T10:23:00Z",
    amount: 86700,
    type: "income",
    description: "Summer Music Festival revenue",
    status: "completed"
  },
  {
    id: "trans-2",
    date: "2024-03-28T14:15:00Z",
    amount: 43750,
    type: "income",
    description: "Corporate Tech Summit revenue",
    status: "completed"
  },
  {
    id: "trans-3",
    date: "2024-04-01T09:45:00Z",
    amount: -12500,
    type: "payout",
    description: "Vendor payments",
    status: "completed"
  },
  {
    id: "trans-4",
    date: "2024-04-20T16:30:00Z",
    amount: -1850,
    type: "subscription",
    description: "Monthly subscription payment",
    status: "completed"
  }
];

// Dashboard stats
export const dashboardStats = [
  {
    title: "Total Venues",
    value: 3,
    change: "+1",
    changeType: "positive",
    icon: Building,
    link: "/host/venues",
    description: "Active venue count"
  },
  {
    title: "Upcoming Events",
    value: 3,
    change: "+2",
    changeType: "positive",
    icon: Clock,
    link: "/host/events",
    description: "Scheduled events"
  },
  {
    title: "Total Guests",
    value: 574,
    change: "+125",
    changeType: "positive",
    icon: Users,
    link: "/host/guests",
    description: "Guest capacity"
  },
  {
    title: "Monthly Revenue",
    value: "R130,450",
    change: "+15%",
    changeType: "positive",
    icon: Wallet,
    link: "/host/finance",
    description: "Current month"
  },
  {
    title: "Subscription",
    value: "Growth",
    change: "23 days left",
    changeType: "neutral",
    icon: BadgePercent,
    link: "/host?tab=subscription",
    description: "Current plan"
  }
];

// Dummy guest data
export const dummyGuests = Array.from({ length: 50 }, (_, i) => ({
  id: `guest-${i+1}`,
  name: `Guest ${i+1}`,
  email: `guest${i+1}@example.com`,
  events: Math.floor(Math.random() * 5) + 1,
  lastVisit: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  totalSpent: Math.floor(Math.random() * 5000) + 500
}));
