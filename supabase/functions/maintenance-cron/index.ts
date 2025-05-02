
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.1.0'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const currentTime = new Date().toISOString()
    
    console.log(`[MAINTENANCE-CRON] Starting scheduled maintenance at ${currentTime}`)
    
    // 1. Archive past events (events with end_date in the past)
    const { data: archivedEvents, error: archiveError } = await supabase
      .from('events')
      .update({ status: 'archived' })
      .lt('end_date', currentTime)
      .neq('status', 'archived')
      .neq('status', 'cancelled')
      .select()
    
    if (archiveError) {
      throw new Error(`Error archiving events: ${archiveError.message}`)
    }
    
    console.log(`[MAINTENANCE-CRON] Archived ${archivedEvents?.length || 0} events`)
    
    // 2. Mark vendor invites as expired if past deadline
    const { data: expiredInvites, error: expiryError } = await supabase
      .from('event_vendors')
      .update({ status: 'expired' })
      .lt('response_deadline', currentTime)
      .eq('status', 'pending')
      .select()
    
    if (expiryError) {
      throw new Error(`Error updating expired invites: ${expiryError.message}`)
    }
    
    console.log(`[MAINTENANCE-CRON] Marked ${expiredInvites?.length || 0} invites as expired`)
    
    // 3. Check for vendors ready for automatic approval (if 72 hours passed since review request)
    const threeBusinessDaysAgo = new Date()
    threeBusinessDaysAgo.setDate(threeBusinessDaysAgo.getDate() - 3)
    
    const { data: autoApprovedVendors, error: autoApprovalError } = await supabase
      .from('vendor_profiles')
      .update({ 
        verification_status: 'verified',
        updated_at: new Date().toISOString()
      })
      .eq('verification_status', 'ready_for_review')
      .lt('review_requested_at', threeBusinessDaysAgo.toISOString())
      .select()
    
    if (autoApprovalError) {
      throw new Error(`Error auto-approving vendors: ${autoApprovalError.message}`)
    }
    
    console.log(`[MAINTENANCE-CRON] Auto-approved ${autoApprovedVendors?.length || 0} vendors`)
    
    // Return a summary of the maintenance actions
    return new Response(
      JSON.stringify({
        success: true,
        timestamp: currentTime,
        actions: {
          archivedEvents: archivedEvents?.length || 0,
          expiredInvites: expiredInvites?.length || 0,
          autoApprovedVendors: autoApprovedVendors?.length || 0
        }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('[MAINTENANCE-CRON] Error:', error.message)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})
