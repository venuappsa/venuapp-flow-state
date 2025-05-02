
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  updated_at?: string;
  read: boolean;
  // Adding properties needed by components
  sender_role?: 'host' | 'vendor' | 'admin';
  recipient_role?: 'host' | 'vendor' | 'admin';
  is_read?: boolean; // Add this to support both naming conventions
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

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name?: string;
  company_name?: string;
  business_category?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  description?: string;
  setup_stage?: string;
  status?: string;
  verification_status?: string;
  is_suspended?: boolean;
  subscription_status?: string;
  created_at?: string;
  updated_at?: string;
  // Adding missing properties from VendorProfilePage
  logo_url?: string;
  zipcode?: string;
  country?: string;
  website?: string;
}

export interface VendorHostRelationship {
  id: string;
  vendor_id: string;
  host_id: string;
  status: 'invited' | 'active' | 'paused' | 'rejected';
  engagement_score: number;
  first_contact_date: string;
  last_interaction_date: string;
  invitation_date: string;
  created_at: string;
  updated_at: string;
}

export interface HostMetrics {
  total_vendors: number;
  live_vendors: number;
  avg_engagement_score: number;
  avg_response_time_minutes: number;
  message_activity_week: number;
}

export interface VendorMetrics {
  total_hosts: number;
  active_hosts: number;
  messages_this_week: number;
  response_rate: number;
}

export interface VendorService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: string;
  category: string;
  vendorId: string;
  status: 'active' | 'draft' | 'archived';
  created_at?: string;
  updated_at?: string;
  // For compatibility with legacy code using vendor_id
  vendor_id?: string;
  // Fields from VendorServicesPage
  title?: string;
  price_unit?: string;
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
  location?: string;
  status: 'draft' | 'planning' | 'upcoming' | 'live' | 'completed' | 'cancelled';
  budget?: number;
  vendorBudget?: number;
  spentBudget?: number;
  capacity: number;
  category?: string;
  venueId?: string;
  venueName?: string;
  vendors?: number;
  tasks?: Task[];
  assignedVendors?: AssignedVendor[];
  ticketsSold?: number;
  revenue?: number;
  floorArea?: number;
  multiLevel?: boolean;
  durationHours?: number;
}

// Updated interface for document status to use literal types
export type DocumentStatus = 'pending' | 'uploaded' | 'approved' | 'rejected';

// Updated interface for vendor invitation status to use literal types
export type VendorInviteStatus = 'pending' | 'accepted' | 'rejected' | 'confirmed' | 'paid';

// Updated interface for payment status to use literal types
export type PaymentStatus = 'pending' | 'paid' | 'failed';

// Interface for vendor invitations
export interface VendorInvite {
  id: string;
  vendor_id: string;
  host_id: string;
  event_id: string;
  status: VendorInviteStatus;
  created_at: string;
  updated_at: string;
  required_documents: RequiredDocument[];
  invitation_message?: string;
  response_message?: string;
  payment_amount?: number;
  payment_status?: PaymentStatus;
  payment_date?: string;
}

// Interface for required documents
export interface RequiredDocument {
  id: string;
  invite_id: string;
  document_type: DocumentType;
  name: string;
  description?: string;
  is_required: boolean;
  status: DocumentStatus;
  file_path?: string;
  file_name?: string;
  upload_date?: string;
  review_date?: string;
  review_notes?: string;
}

// Document types
export type DocumentType = 
  | 'business_registration'
  | 'tax_clearance'
  | 'proof_of_address'
  | 'health_safety'
  | 'public_liability'
  | 'bank_letter'
  | 'custom';
