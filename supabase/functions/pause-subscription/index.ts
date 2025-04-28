
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAUSE-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Initialize Supabase client with the service role key for DB operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body to get pause days
    const { days } = await req.json();
    if (!days || days <= 0 || days > 14) {
      throw new Error("Invalid pause duration. Must be between 1 and 14 days.");
    }
    logStep("Received pause request", { days });

    // Check if user is a host
    const { data: userRoles, error: rolesError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (rolesError) throw new Error(`Error fetching roles: ${rolesError.message}`);
    const isHost = userRoles?.some(r => r.role === "host");
    if (!isHost) {
      throw new Error("Only hosts can pause subscriptions");
    }
    logStep("Verified host role");

    // Check quarterly pause limits
    const now = new Date();
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const currentYear = now.getFullYear();
    const quarterStart = new Date(currentYear, currentQuarter * 3, 1);
    const quarterEnd = new Date(currentYear, (currentQuarter + 1) * 3, 0);

    // Fetch existing pause history for this quarter
    const { data: pauseHistory, error: pauseError } = await supabaseClient
      .from("subscription_pauses")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", quarterStart.toISOString())
      .lte("created_at", quarterEnd.toISOString())
      .not("status", "eq", "canceled");

    if (pauseError) throw new Error(`Error fetching pause history: ${pauseError.message}`);
    
    // Calculate days already used this quarter
    const daysUsed = (pauseHistory || []).reduce((total, pause) => {
      return total + (pause.days_paused || 0);
    }, 0);

    // Check if user has enough pause days left
    const remainingDays = 14 - daysUsed;
    if (remainingDays < days) {
      throw new Error(`You only have ${remainingDays} pause days left this quarter`);
    }
    logStep("Verified pause limits", { daysUsed, remainingDays });

    // Check if there's an active pause
    const hasActivePause = (pauseHistory || []).some(pause => pause.status === "active");
    if (hasActivePause) {
      throw new Error("You already have an active subscription pause");
    }

    // Find Stripe customer
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      throw new Error("No Stripe customer found for this user");
    }
    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Find active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    if (subscriptions.data.length === 0) {
      throw new Error("No active subscription found");
    }
    
    const subscription = subscriptions.data[0];
    logStep("Found active subscription", { subscriptionId: subscription.id });

    // Pause the subscription by updating to pause collection mode
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    // Pause subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      pause_collection: {
        behavior: "void",
        resumes_at: Math.floor(endDate.getTime() / 1000),
      }
    });
    
    logStep("Subscription paused in Stripe", { 
      subscriptionId: updatedSubscription.id,
      pauseEndsAt: new Date(updatedSubscription.pause_collection?.resumes_at! * 1000).toISOString()
    });
    
    // Record pause in database
    const { data: pauseRecord, error: insertError } = await supabaseClient
      .from("subscription_pauses")
      .insert({
        user_id: user.id,
        subscription_id: subscription.id,
        days_paused: days,
        status: "active",
        end_date: endDate.toISOString(),
      })
      .select()
      .single();
      
    if (insertError) throw new Error(`Error recording pause: ${insertError.message}`);
    logStep("Recorded subscription pause", { pauseId: pauseRecord.id });
    
    // Update host profile subscription status
    await supabaseClient
      .from("host_profiles")
      .update({
        subscription_status: "paused",
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user.id);
      
    return new Response(JSON.stringify({ 
      success: true,
      message: "Subscription successfully paused",
      pause: pauseRecord,
      resumes_at: new Date(updatedSubscription.pause_collection?.resumes_at! * 1000).toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in pause-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
