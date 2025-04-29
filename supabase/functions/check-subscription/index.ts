
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use the service role key to perform reads and writes in Supabase
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if the user is a host
    const { data: userRoles, error: rolesError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
      
    if (rolesError) throw new Error(`Error fetching roles: ${rolesError.message}`);
    
    const isHost = userRoles?.some(r => r.role === "host");
    if (!isHost) {
      logStep("User is not a host", { roles: userRoles?.map(r => r.role) });
      return new Response(JSON.stringify({ subscribed: false, message: "User is not a host" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get the host profile
    const { data: hostProfile, error: profileError } = await supabaseClient
      .from("host_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    
    if (profileError && profileError.code !== "PGRST116") { // PGRST116 is "no rows returned" which is fine
      throw new Error(`Error fetching host profile: ${profileError.message}`);
    }

    // If no host profile exists, create one
    if (!hostProfile) {
      const { error: insertError } = await supabaseClient
        .from("host_profiles")
        .insert({
          user_id: user.id,
          subscription_status: "none",
        });
        
      if (insertError) throw new Error(`Error creating host profile: ${insertError.message}`);
      logStep("Created new host profile");
      
      return new Response(JSON.stringify({ 
        subscribed: false, 
        subscription_status: "none", 
        subscription_end: null,
        subscription_tier: "Free Plan"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check if there's an active pause
    const { data: activePause } = await supabaseClient
      .from("subscription_pauses")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // If there's an active pause, return the subscription as paused
    if (activePause) {
      logStep("Found active subscription pause", { pauseId: activePause.id });
      
      return new Response(JSON.stringify({
        subscribed: true,
        subscription_tier: hostProfile.subscription_tier || "Free Plan",
        subscription_end: hostProfile.subscription_renewal,
        subscription_status: "paused",
        pause_ends_at: activePause.end_date
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      // Update host profile if needed
      if (hostProfile.subscription_status !== "none") {
        await supabaseClient
          .from("host_profiles")
          .update({
            subscription_status: "none",
            subscription_renewal: null,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", user.id);
      }
      
      return new Response(JSON.stringify({ 
        subscribed: false, 
        subscription_status: "none", 
        subscription_end: null,
        subscription_tier: hostProfile.subscription_tier || "Free Plan"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = "Free Plan";
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      
      // Check if subscription is in pause collection mode
      const isPaused = subscription.pause_collection !== null;
      
      // Determine subscription tier from price
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const productId = price.product as string;
      const product = await stripe.products.retrieve(productId);
      
      subscriptionTier = product.metadata.tier || "Free Plan";
      logStep("Determined subscription details", { 
        priceId, 
        tier: subscriptionTier,
        isPaused 
      });
      
      // Update host profile with subscription info
      await supabaseClient
        .from("host_profiles")
        .update({
          subscription_status: isPaused ? "paused" : "active",
          subscription_tier: subscriptionTier,
          subscription_renewal: subscriptionEnd,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);
    } else {
      logStep("No active subscription found");
      
      // Update host profile if needed
      if (hostProfile.subscription_status !== "none") {
        await supabaseClient
          .from("host_profiles")
          .update({
            subscription_status: "expired",
            updated_at: new Date().toISOString()
          })
          .eq("user_id", user.id);
      }
    }

    logStep("Subscription check complete", { 
      subscribed: hasActiveSub, 
      tier: subscriptionTier,
      end: subscriptionEnd
    });
    
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      subscription_status: hasActiveSub ? (hostProfile.subscription_status || "active") : (hostProfile.subscription_status || "none")
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
