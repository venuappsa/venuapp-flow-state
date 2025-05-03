
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Service for managing event-related functionality
 */
export const EventService = {
  /**
   * Create a new event
   */
  createEvent: async (
    eventData: {
      name: string;
      description?: string;
      start_date: string;
      end_date: string;
      venue_id?: string;
      capacity?: number;
      is_public: boolean;
      host_id: string;
    }
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        console.error("Error creating event:", error);
        return { 
          success: false, 
          error: error.message || "Failed to create event. Please try again." 
        };
      }

      return { 
        success: true, 
        data 
      };
    } catch (err: any) {
      console.error("Exception during event creation:", err);
      return { 
        success: false, 
        error: err.message || "An unexpected error occurred. Please try again." 
      };
    }
  },

  /**
   * Update an existing event
   */
  updateEvent: async (
    eventId: string,
    eventData: {
      name?: string;
      description?: string;
      start_date?: string;
      end_date?: string;
      venue_id?: string;
      capacity?: number;
      is_public?: boolean;
      status?: string;
    }
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        console.error("Error updating event:", error);
        return { 
          success: false, 
          error: error.message || "Failed to update event. Please try again." 
        };
      }

      return { 
        success: true, 
        data 
      };
    } catch (err: any) {
      console.error("Exception during event update:", err);
      return { 
        success: false, 
        error: err.message || "An unexpected error occurred. Please try again." 
      };
    }
  },

  /**
   * Get an event by its ID
   */
  getEventById: async (
    eventId: string
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_vendors (
            *,
            vendor_profiles (
              *,
              user_id
            )
          )
        `)
        .eq('id', eventId)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
        return { 
          success: false, 
          error: error.message || "Failed to fetch event data. Please try again." 
        };
      }

      return { 
        success: true, 
        data 
      };
    } catch (err: any) {
      console.error("Exception fetching event:", err);
      return { 
        success: false, 
        error: err.message || "An unexpected error occurred. Please try again." 
      };
    }
  },

  /**
   * Get all events for a host
   */
  getHostEvents: async (
    hostId: string
  ): Promise<{ success: boolean; data?: any[]; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('host_id', hostId)
        .order('start_date', { ascending: false });

      if (error) {
        console.error("Error fetching host events:", error);
        return { 
          success: false, 
          error: error.message || "Failed to fetch events. Please try again." 
        };
      }

      return { 
        success: true, 
        data 
      };
    } catch (err: any) {
      console.error("Exception fetching host events:", err);
      return { 
        success: false, 
        error: err.message || "An unexpected error occurred. Please try again." 
      };
    }
  },

  /**
   * Invite a vendor to an event
   */
  inviteVendorToEvent: async (
    eventId: string,
    vendorId: string,
    invitationData: {
      fee?: number;
      notes?: string;
      response_deadline?: string;
    }
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      // Check if invitation already exists
      const { data: existingInvitation, error: checkError } = await supabase
        .from('event_vendors')
        .select('*')
        .eq('event_id', eventId)
        .eq('vendor_id', vendorId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing invitation:", checkError);
        return { 
          success: false, 
          error: checkError.message || "Failed to check for existing invitation. Please try again." 
        };
      }

      if (existingInvitation) {
        return { 
          success: false, 
          error: "This vendor has already been invited to this event." 
        };
      }

      // Create the invitation
      const { data, error } = await supabase
        .from('event_vendors')
        .insert({
          event_id: eventId,
          vendor_id: vendorId,
          fee: invitationData.fee,
          notes: invitationData.notes,
          response_deadline: invitationData.response_deadline,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error("Error inviting vendor:", error);
        return { 
          success: false, 
          error: error.message || "Failed to invite vendor. Please try again." 
        };
      }

      return { 
        success: true, 
        data 
      };
    } catch (err: any) {
      console.error("Exception inviting vendor:", err);
      return { 
        success: false, 
        error: err.message || "An unexpected error occurred. Please try again." 
      };
    }
  },

  /**
   * Respond to a vendor invitation
   */
  respondToVendorInvitation: async (
    invitationId: string,
    response: 'accepted' | 'declined',
    reason?: string
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const updateData: any = {
        status: response,
        response_date: new Date().toISOString()
      };

      if (response === 'declined' && reason) {
        updateData.decline_reason = reason;
      }

      const { data, error } = await supabase
        .from('event_vendors')
        .update(updateData)
        .eq('id', invitationId)
        .select()
        .single();

      if (error) {
        console.error("Error responding to invitation:", error);
        return { 
          success: false, 
          error: error.message || "Failed to respond to invitation. Please try again." 
        };
      }

      return { 
        success: true, 
        data 
      };
    } catch (err: any) {
      console.error("Exception responding to invitation:", err);
      return { 
        success: false, 
        error: err.message || "An unexpected error occurred. Please try again." 
      };
    }
  },

  /**
   * Get all vendor invitations for an event
   */
  getEventVendors: async (
    eventId: string
  ): Promise<{ success: boolean; data?: any[]; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('event_vendors')
        .select(`
          *,
          vendor_profiles (
            *,
            user_id
          )
        `)
        .eq('event_id', eventId);

      if (error) {
        console.error("Error fetching event vendors:", error);
        return { 
          success: false, 
          error: error.message || "Failed to fetch vendors. Please try again." 
        };
      }

      return { 
        success: true, 
        data 
      };
    } catch (err: any) {
      console.error("Exception fetching event vendors:", err);
      return { 
        success: false, 
        error: err.message || "An unexpected error occurred. Please try again." 
      };
    }
  },

  /**
   * Get all event invitations for a vendor
   */
  getVendorInvitations: async (
    vendorId: string
  ): Promise<{ success: boolean; data?: any[]; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('event_vendors')
        .select(`
          *,
          events (
            *
          )
        `)
        .eq('vendor_id', vendorId);

      if (error) {
        console.error("Error fetching vendor invitations:", error);
        return { 
          success: false, 
          error: error.message || "Failed to fetch invitations. Please try again." 
        };
      }

      return { 
        success: true, 
        data 
      };
    } catch (err: any) {
      console.error("Exception fetching vendor invitations:", err);
      return { 
        success: false, 
        error: err.message || "An unexpected error occurred. Please try again." 
      };
    }
  }
};
