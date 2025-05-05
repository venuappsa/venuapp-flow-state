
export interface FetchmanProfile {
  id: string;
  user_id?: string;
  phone_number?: string;
  address?: string;
  vehicle_type?: string;
  service_area?: string;
  work_hours?: string;
  verification_status?: string;
  is_suspended?: boolean;
  is_blacklisted?: boolean;
  role?: string;
  has_own_transport?: boolean;
  bank_name?: string;
  bank_account_number?: string;
  branch_code?: string;
  identity_number?: string;
  work_areas?: string[];
  mobility_preference?: Record<string, boolean>;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  emergency_contact_email?: string;
  cv_url?: string;
  current_location?: any;
  rating?: number;
  total_deliveries?: number;
  user?: UserProfile;
  profile?: UserProfile;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id?: string;
  email?: string;
  name?: string;
  surname?: string;
  phone?: string;
}

export interface FetchmanAssignment {
  id: string;
  fetchman_id: string;
  entity_id: string;
  entity_type: string;
  start_date: string;
  end_date: string;
  status: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  assigned_by?: string;
  notification_sent?: boolean;
  brief_url?: string;
}
