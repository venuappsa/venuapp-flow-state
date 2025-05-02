
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-application-name",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Create a Supabase client using the service role to bypass RLS
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

    // Check if we already have subscriber information in the database
    const { data: subscribers, error: subscriberError } = await supabaseClient
      .from("subscribers")
      .select("*")
      .eq("user_id", user.id)
      .limit(1);

    if (subscriberError) {
      logStep("Error fetching subscribers", { error: subscriberError.message });
      throw new Error(`Database error: ${subscriberError.message}`);
    }

    // If we have subscriber data, return it directly
    if (subscribers && subscribers.length > 0) {
      const subscriber = subscribers[0];
      logStep("Found existing subscriber record", {
        subscribed: subscriber.subscribed,
        tier: subscriber.subscription_tier,
        gateway: subscriber.payment_gateway
      });

      return new Response(JSON.stringify({
        subscribed: subscriber.subscribed,
        subscription_tier: subscriber.subscription_tier,
        subscription_end: subscriber.subscription_end,
        subscription_status: subscriber.subscription_status,
        payment_gateway: subscriber.payment_gateway
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // If we don't have subscriber data, try to check with Stripe first
    try {
      const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
      if (stripeKey) {
        logStep("Stripe key found, checking Stripe subscription");

        const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
        
        // Find the customer by email
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        
        if (customers.data.length === 0) {
          logStep("No Stripe customer found");
        } else {
          const customerId = customers.data[0].id;
          logStep("Found Stripe customer", { customerId });

          const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "active",
            limit: 1,
          });
          
          const hasActiveSub = subscriptions.data.length > 0;
          let subscriptionTier = null;
          let subscriptionEnd = null;
          let subscriptionStatus = "none";

          if (hasActiveSub) {
            const subscription = subscriptions.data[0];
            subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
            subscriptionStatus = "active";
            logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
            
            // Determine subscription tier from price
            const priceId = subscription.items.data[0].price.id;
            const price = await stripe.prices.retrieve(priceId);
            const amount = price.unit_amount || 0;
            
            if (amount <= 999) {
              subscriptionTier = "Basic";
            } else if (amount <= 1999) {
              subscriptionTier = "Premium";
            } else {
              subscriptionTier = "Enterprise";
            }
            
            logStep("Determined subscription tier", { priceId, amount, subscriptionTier });
            
            // Update database with subscription info
            await supabaseClient.from("subscribers").insert({
              email: user.email,
              user_id: user.id,
              stripe_customer_id: customerId,
              subscribed: true,
              subscription_tier: subscriptionTier,
              subscription_end: subscriptionEnd,
              subscription_status: subscriptionStatus,
              payment_gateway: "stripe",
              updated_at: new Date().toISOString(),
            });
            
            return new Response(JSON.stringify({
              subscribed: true,
              subscription_tier: subscriptionTier,
              subscription_end: subscriptionEnd,
              subscription_status: subscriptionStatus,
              payment_gateway: "stripe"
            }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            });
          }
        }
      } else {
        logStep("No Stripe key found, skipping Stripe check");
      }
    } catch (stripeErr) {
      logStep("Error checking Stripe subscription", { error: stripeErr.message });
    }

    // Check for Paystack subscription info in transactions
    try {
      const { data: transactions, error: transactionsError } = await supabaseClient
        .from("subscription_transactions")
        .select("*")
        .eq("host_id", user.id)
        .eq("payment_gateway", "paystack")
        .eq("status", "completed")
        .order("transaction_date", { ascending: false })
        .limit(1);
      
      if (!transactionsError && transactions && transactions.length > 0) {
        const transaction = transactions[0];
        logStep("Found Paystack transaction", { transactionId: transaction.id });
        
        // Calculate subscription end date (1 month from transaction date)
        const transactionDate = new Date(transaction.transaction_date);
        const subscriptionEnd = new Date(transactionDate);
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
        
        // Determine if subscription is active
        const now = new Date();
        const isActive = subscriptionEnd > now;
        const subscriptionStatus = isActive ? "active" : "expired";
        
        await supabaseClient.from("subscribers").insert({
          email: user.email,
          user_id: user.id,
          paystack_customer_code: transaction.paystack_customer_code,
          subscribed: isActive,
          subscription_tier: transaction.plan_name,
          subscription_end: subscriptionEnd.toISOString(),
          subscription_status: subscriptionStatus,
          payment_gateway: "paystack",
          updated_at: new Date().toISOString(),
        });
        
        return new Response(JSON.stringify({
          subscribed: isActive,
          subscription_tier: transaction.plan_name,
          subscription_end: subscriptionEnd.toISOString(),
          subscription_status: subscriptionStatus,
          payment_gateway: "paystack"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    } catch (paystackErr) {
      logStep("Error checking Paystack subscription", { error: paystackErr.message });
    }

    // If no subscription found through any method, create a non-subscribed record
    await supabaseClient.from("subscribers").insert({
      email: user.email,
      user_id: user.id,
      subscribed: false,
      subscription_status: "none",
      updated_at: new Date().toISOString(),
    });
    
    logStep("No subscription found, created non-subscribed record");
    
    return new Response(JSON.stringify({ subscribed: false, subscription_status: "none" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[CHECK-SUBSCRIPTION] ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
