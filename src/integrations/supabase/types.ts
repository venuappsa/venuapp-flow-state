export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      event_vendors: {
        Row: {
          created_at: string
          decline_reason: string | null
          event_id: string
          fee: number | null
          id: string
          invitation_date: string
          notes: string | null
          response_date: string | null
          response_deadline: string | null
          status: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          decline_reason?: string | null
          event_id: string
          fee?: number | null
          id?: string
          invitation_date?: string
          notes?: string | null
          response_date?: string | null
          response_deadline?: string | null
          status?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          decline_reason?: string | null
          event_id?: string
          fee?: number | null
          id?: string
          invitation_date?: string
          notes?: string | null
          response_date?: string | null
          response_deadline?: string | null
          status?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string
          description: string | null
          end_date: string
          host_id: string
          id: string
          is_public: boolean | null
          name: string
          start_date: string
          status: string
          updated_at: string
          venue_id: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          end_date: string
          host_id: string
          id?: string
          is_public?: boolean | null
          name: string
          start_date: string
          status?: string
          updated_at?: string
          venue_id?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          end_date?: string
          host_id?: string
          id?: string
          is_public?: boolean | null
          name?: string
          start_date?: string
          status?: string
          updated_at?: string
          venue_id?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          content: string
          created_at: string
          feedback_type: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          feedback_type: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          feedback_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      fetchman_assignments: {
        Row: {
          assigned_by: string | null
          brief_url: string | null
          created_at: string | null
          end_date: string
          entity_id: string
          entity_type: string
          fetchman_id: string | null
          id: string
          notes: string | null
          notification_sent: boolean | null
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_by?: string | null
          brief_url?: string | null
          created_at?: string | null
          end_date: string
          entity_id: string
          entity_type: string
          fetchman_id?: string | null
          id?: string
          notes?: string | null
          notification_sent?: boolean | null
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string | null
          brief_url?: string | null
          created_at?: string | null
          end_date?: string
          entity_id?: string
          entity_type?: string
          fetchman_id?: string | null
          id?: string
          notes?: string | null
          notification_sent?: boolean | null
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fetchman_assignments_fetchman_id_fkey"
            columns: ["fetchman_id"]
            isOneToOne: false
            referencedRelation: "fetchman_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fetchman_blacklist: {
        Row: {
          blacklist_date: string
          blacklisted_by: string
          created_at: string
          fetchman_id: string
          id: string
          reason: string
        }
        Insert: {
          blacklist_date?: string
          blacklisted_by: string
          created_at?: string
          fetchman_id: string
          id?: string
          reason: string
        }
        Update: {
          blacklist_date?: string
          blacklisted_by?: string
          created_at?: string
          fetchman_id?: string
          id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "fetchman_blacklist_fetchman_id_fkey"
            columns: ["fetchman_id"]
            isOneToOne: true
            referencedRelation: "fetchman_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fetchman_deliveries: {
        Row: {
          completion_time: string | null
          created_at: string
          dropoff_location: string
          event_id: string | null
          fee: number
          fetchman_id: string | null
          id: string
          items: Json | null
          notes: string | null
          pickup_location: string
          rating: number | null
          scheduled_time: string
          status: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          completion_time?: string | null
          created_at?: string
          dropoff_location: string
          event_id?: string | null
          fee: number
          fetchman_id?: string | null
          id?: string
          items?: Json | null
          notes?: string | null
          pickup_location: string
          rating?: number | null
          scheduled_time: string
          status?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          completion_time?: string | null
          created_at?: string
          dropoff_location?: string
          event_id?: string | null
          fee?: number
          fetchman_id?: string | null
          id?: string
          items?: Json | null
          notes?: string | null
          pickup_location?: string
          rating?: number | null
          scheduled_time?: string
          status?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fetchman_deliveries_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fetchman_deliveries_fetchman_id_fkey"
            columns: ["fetchman_id"]
            isOneToOne: false
            referencedRelation: "fetchman_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      fetchman_documents: {
        Row: {
          created_at: string | null
          document_type: string
          fetchman_id: string | null
          file_name: string
          file_url: string
          id: string
          status: string
          updated_at: string | null
          uploaded_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          fetchman_id?: string | null
          file_name: string
          file_url: string
          id?: string
          status?: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          fetchman_id?: string | null
          file_name?: string
          file_url?: string
          id?: string
          status?: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fetchman_documents_fetchman_id_fkey"
            columns: ["fetchman_id"]
            isOneToOne: false
            referencedRelation: "fetchman_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fetchman_messages: {
        Row: {
          admin_id: string | null
          fetchman_id: string | null
          id: string
          message: string
          parent_id: string | null
          read: boolean | null
          sender_role: string
          sent_at: string | null
        }
        Insert: {
          admin_id?: string | null
          fetchman_id?: string | null
          id?: string
          message: string
          parent_id?: string | null
          read?: boolean | null
          sender_role: string
          sent_at?: string | null
        }
        Update: {
          admin_id?: string | null
          fetchman_id?: string | null
          id?: string
          message?: string
          parent_id?: string | null
          read?: boolean | null
          sender_role?: string
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fetchman_messages_fetchman_id_fkey"
            columns: ["fetchman_id"]
            isOneToOne: false
            referencedRelation: "fetchman_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fetchman_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "fetchman_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      fetchman_profiles: {
        Row: {
          address: string | null
          bank_account_number: string
          bank_name: string
          branch_code: string
          created_at: string
          current_location: Json | null
          cv_url: string | null
          emergency_contact_email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          has_own_transport: boolean
          id: string
          identity_number: string
          is_blacklisted: boolean | null
          is_suspended: boolean | null
          mobility_preference: Json | null
          phone_number: string
          rating: number | null
          role: string | null
          service_area: string
          total_deliveries: number | null
          updated_at: string
          user_id: string
          vehicle_type: string
          verification_status: string
          work_areas: Json | null
          work_hours: string
        }
        Insert: {
          address?: string | null
          bank_account_number: string
          bank_name: string
          branch_code: string
          created_at?: string
          current_location?: Json | null
          cv_url?: string | null
          emergency_contact_email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          has_own_transport?: boolean
          id?: string
          identity_number: string
          is_blacklisted?: boolean | null
          is_suspended?: boolean | null
          mobility_preference?: Json | null
          phone_number: string
          rating?: number | null
          role?: string | null
          service_area: string
          total_deliveries?: number | null
          updated_at?: string
          user_id: string
          vehicle_type: string
          verification_status?: string
          work_areas?: Json | null
          work_hours: string
        }
        Update: {
          address?: string | null
          bank_account_number?: string
          bank_name?: string
          branch_code?: string
          created_at?: string
          current_location?: Json | null
          cv_url?: string | null
          emergency_contact_email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          has_own_transport?: boolean
          id?: string
          identity_number?: string
          is_blacklisted?: boolean | null
          is_suspended?: boolean | null
          mobility_preference?: Json | null
          phone_number?: string
          rating?: number | null
          role?: string | null
          service_area?: string
          total_deliveries?: number | null
          updated_at?: string
          user_id?: string
          vehicle_type?: string
          verification_status?: string
          work_areas?: Json | null
          work_hours?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_fetchman_profiles_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fetchman_promotions: {
        Row: {
          created_at: string
          fetchman_id: string
          id: string
          new_role: string
          notes: string | null
          previous_role: string | null
          promoted_by: string
          promotion_date: string
        }
        Insert: {
          created_at?: string
          fetchman_id: string
          id?: string
          new_role: string
          notes?: string | null
          previous_role?: string | null
          promoted_by: string
          promotion_date?: string
        }
        Update: {
          created_at?: string
          fetchman_id?: string
          id?: string
          new_role?: string
          notes?: string | null
          previous_role?: string | null
          promoted_by?: string
          promotion_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "fetchman_promotions_fetchman_id_fkey"
            columns: ["fetchman_id"]
            isOneToOne: false
            referencedRelation: "fetchman_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      host_profiles: {
        Row: {
          company_name: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          is_suspended: boolean
          subscription_renewal: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_suspended?: boolean
          subscription_renewal?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_suspended?: boolean
          subscription_renewal?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      host_wallets: {
        Row: {
          balance: number
          created_at: string
          host_id: string
          id: string
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          host_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          host_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "host_wallets_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "host_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          surname: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          phone?: string | null
          surname?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          surname?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          payment_gateway: string | null
          paystack_customer_code: string | null
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          payment_gateway?: string | null
          paystack_customer_code?: string | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          payment_gateway?: string | null
          paystack_customer_code?: string | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_pauses: {
        Row: {
          created_at: string
          end_date: string
          id: string
          start_date: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          start_date?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_transactions: {
        Row: {
          amount: number
          billing_mode: string | null
          host_id: string
          id: string
          payment_gateway: string | null
          paystack_reference: string | null
          plan_name: string
          status: string
          stripe_customer_id: string | null
          stripe_session_id: string | null
          transaction_date: string
        }
        Insert: {
          amount: number
          billing_mode?: string | null
          host_id: string
          id?: string
          payment_gateway?: string | null
          paystack_reference?: string | null
          plan_name: string
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          transaction_date?: string
        }
        Update: {
          amount?: number
          billing_mode?: string | null
          host_id?: string
          id?: string
          payment_gateway?: string | null
          paystack_reference?: string | null
          plan_name?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          transaction_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_transactions_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "host_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_announcements: {
        Row: {
          content: string
          created_at: string
          id: string
          is_public: boolean
          publish_date: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_public?: boolean
          publish_date?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean
          publish_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_availability: {
        Row: {
          created_at: string
          date: string
          id: string
          is_available: boolean | null
          notes: string | null
          time_end: string | null
          time_start: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          time_end?: string | null
          time_start?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          time_end?: string | null
          time_start?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_availability_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      vendor_pricing_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json
          host_id: string
          id: string
          is_highlighted: boolean
          name: string
          plan_type: string
          price: number
          price_unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json
          host_id: string
          id?: string
          is_highlighted?: boolean
          name: string
          plan_type: string
          price: number
          price_unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json
          host_id?: string
          id?: string
          is_highlighted?: boolean
          name?: string
          plan_type?: string
          price?: number
          price_unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendor_profiles: {
        Row: {
          company_name: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          documents_uploaded: boolean | null
          id: string
          is_suspended: boolean
          review_requested_at: string | null
          subscription_renewal: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          documents_uploaded?: boolean | null
          id?: string
          is_suspended?: boolean
          review_requested_at?: string | null
          subscription_renewal?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          documents_uploaded?: boolean | null
          id?: string
          is_suspended?: boolean
          review_requested_at?: string | null
          subscription_renewal?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      vendor_types: {
        Row: {
          category_id: string
          created_at: string
          id: string
          vendor_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          vendor_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_types_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vendor_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_types_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_vendor_rules: {
        Row: {
          allowed_categories: string[]
          capacity_limit: number | null
          created_at: string
          host_id: string
          id: string
          max_price: number | null
          min_price: number | null
          operating_hours_end: string | null
          operating_hours_start: string | null
          other_requirements: string | null
          required_licenses: string[] | null
          updated_at: string
          venue_name: string
        }
        Insert: {
          allowed_categories?: string[]
          capacity_limit?: number | null
          created_at?: string
          host_id: string
          id?: string
          max_price?: number | null
          min_price?: number | null
          operating_hours_end?: string | null
          operating_hours_start?: string | null
          other_requirements?: string | null
          required_licenses?: string[] | null
          updated_at?: string
          venue_name: string
        }
        Update: {
          allowed_categories?: string[]
          capacity_limit?: number | null
          created_at?: string
          host_id?: string
          id?: string
          max_price?: number | null
          min_price?: number | null
          operating_hours_end?: string | null
          operating_hours_start?: string | null
          other_requirements?: string | null
          required_licenses?: string[] | null
          updated_at?: string
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_vendor_rules_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "host_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_fetchman_with_profile: {
        Args: { fetchman_id: string }
        Returns: {
          id: string
          user_id: string
          phone_number: string
          address: string
          vehicle_type: string
          service_area: string
          work_hours: string
          verification_status: string
          is_suspended: boolean
          is_blacklisted: boolean
          role: string
          has_own_transport: boolean
          name: string
          surname: string
          email: string
          profile_phone: string
          bank_name: string
          bank_account_number: string
          branch_code: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "host" | "merchant" | "customer" | "fetchman"
      subscription_status: "active" | "expired" | "trial" | "none"
      verification_status:
        | "pending"
        | "verified"
        | "declined"
        | "ready_for_review"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "host", "merchant", "customer", "fetchman"],
      subscription_status: ["active", "expired", "trial", "none"],
      verification_status: [
        "pending",
        "verified",
        "declined",
        "ready_for_review",
      ],
    },
  },
} as const
