
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Create a Supabase client with the service role key
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

    // Parse request body to get plan details
    const { planId, planName, billingMode = "subscription" } = await req.json();
    if (!planId || !planName) {
      throw new Error("Missing plan information");
    }
    logStep("Received plan details", { planId, planName, billingMode });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer already exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { customerId });
    } else {
      // Create a new customer
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = newCustomer.id;
      logStep("Created new Stripe customer", { customerId });
    }

    // Get user role to determine if they're a host
    const { data: userRoles } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const isHost = userRoles?.some(r => r.role === "host");
    if (!isHost) {
      throw new Error("User is not a host. Only hosts can subscribe to plans.");
    }

    // Create Stripe Checkout session
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      mode: billingMode === "one-time" ? "payment" : "subscription",
      success_url: `${origin}/host/subscription?subscription=success`,
      cancel_url: `${origin}/subscribe?subscription=canceled`,
      metadata: {
        user_id: user.id,
        plan_name: planName,
      },
      subscription_data: billingMode === "subscription" ? {
        metadata: {
          user_id: user.id,
          plan_name: planName,
        }
      } : undefined
    });

    logStep("Checkout session created", { sessionId: session.id });

    // Record the transaction in the database
    const { data: transaction, error: transactionError } = await supabaseClient
      .from("subscription_transactions")
      .insert({
        host_id: user.id,
        stripe_session_id: session.id,
        stripe_customer_id: customerId,
        plan_name: planName,
        status: "pending",
        amount: 0, // Will be updated when payment is completed
      });

    if (transactionError) {
      logStep("Error recording transaction", { error: transactionError.message });
    } else {
      logStep("Transaction recorded", { transactionId: transaction });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[CREATE-CHECKOUT] ERROR:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
