
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  read: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  image?: string;
}

export interface AssignedVendor extends Vendor {
  assignedRole: string;
  status: 'pending' | 'confirmed' | 'rejected';
  quoteAmount: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  completed: boolean;
  assignedTo?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Event {
  id: string;
  name: string;
  date: string;
  endDate: string;
  description: string;
  location: string;
  status: 'draft' | 'planning' | 'upcoming' | 'live' | 'completed' | 'cancelled';
  budget: number;
  vendorBudget: number;
  spentBudget: number;
  capacity: number;
  category: string;
  venueId?: string;
  venueName?: string;
  vendors?: number;
  tasks?: Task[];
  assignedVendors?: AssignedVendor[];
}
