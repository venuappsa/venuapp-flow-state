
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-application-name",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAYSTACK-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const paystackKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackKey) throw new Error("PAYSTACK_SECRET_KEY is not set");
    logStep("Paystack key verified");

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
    const { planId, planName, billingMode = "subscription", amount } = await req.json();
    if (!planId || !planName || !amount) {
      throw new Error("Missing plan information or amount");
    }
    logStep("Received plan details", { planId, planName, billingMode, amount });

    // Get user role to determine if they're a host
    const { data: userRoles } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const isHost = userRoles?.some(r => r.role === "host");
    if (!isHost) {
      throw new Error("User is not a host. Only hosts can subscribe to plans.");
    }

    // Create Paystack Checkout session
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const metadata = {
      user_id: user.id,
      plan_name: planName,
      billing_mode: billingMode
    };

    // Paystack API request to initialize transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: user.email,
        amount: Math.round(parseFloat(amount) * 100), // Convert to kobo (or smallest currency unit)
        callback_url: `${origin}/host/subscription?subscription=success`,
        metadata: metadata
      })
    });

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json();
      throw new Error(`Paystack API error: ${errorData.message || "Failed to create checkout session"}`);
    }

    const { data: paystackData } = await paystackResponse.json();
    logStep("Paystack checkout session created", { reference: paystackData.reference });

    // Record the transaction in the database
    const { data: transaction, error: transactionError } = await supabaseClient
      .from("subscription_transactions")
      .insert({
        host_id: user.id,
        stripe_session_id: null,
        stripe_customer_id: null,
        paystack_reference: paystackData.reference,
        plan_name: planName,
        status: "pending",
        amount: parseFloat(amount),
        payment_gateway: "paystack",
        billing_mode: billingMode
      });

    if (transactionError) {
      logStep("Error recording transaction", { error: transactionError.message });
    } else {
      logStep("Transaction recorded", { transactionId: transaction });
    }

    return new Response(JSON.stringify({ url: paystackData.authorization_url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[PAYSTACK-CHECKOUT] ERROR:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
