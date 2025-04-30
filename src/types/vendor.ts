
export interface VendorProfile {
  id: string;
  user_id: string;
  business_name?: string;
  company_name?: string;
  business_category?: string;
  logo_url?: string;
  description?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  setup_stage: string;
  setup_progress: number;
  status: string;
  is_suspended: boolean;
  verification_status: string;
  subscription_status: string;
  subscription_renewal?: string;
  website?: string;
  pricing_settings?: {
    pricingModel: string;
    depositRequired: boolean;
    depositPercentage: number;
    negotiable: boolean;
    discount: boolean;
    discountType: string;
    discountValue: number;
    availabilityMode: string;
    leadTime: string;
  };
  // New metrics fields
  response_time_minutes?: number;
  message_response_rate?: number;
  total_hosts_connected?: number;
  active_listings?: number;
  created_at: string;
  updated_at: string;
  last_active?: string;
}

export interface VendorService {
  id: string;
  vendor_id: string;
  title: string;
  description?: string;
  category?: string;
  duration?: string;
  price: number;
  price_unit: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  sender_role: "host" | "vendor" | "guest" | "fetchman" | "support";
  recipient_role: "host" | "vendor" | "guest" | "fetchman" | "support";
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorHostRelationship {
  id: string;
  vendor_id: string;
  host_id: string;
  status: "invited" | "active" | "paused" | "rejected";
  engagement_score: number;
  first_contact_date: string;
  last_interaction_date: string;
  invitation_code?: string;
  invitation_date: string;
  created_at: string;
  updated_at: string;
}

export interface VendorMetrics {
  total_hosts: number;
  active_hosts: number;
  messages_this_week: number;
  response_rate: number;
}

export interface HostMetrics {
  total_vendors: number;
  live_vendors: number;
  avg_engagement_score: number;
  avg_response_time_minutes: number;
  message_activity_week: number;
}
