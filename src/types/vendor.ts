
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
  website?: string;
  setup_stage: string;
  setup_progress: number;
  status: string;
  is_suspended: boolean;
  verification_status: string;
  subscription_status: string;
  subscription_renewal?: string;
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
