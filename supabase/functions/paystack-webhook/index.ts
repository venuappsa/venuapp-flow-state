
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-application-name",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAYSTACK-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook function started");

    const paystackKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackKey) throw new Error("PAYSTACK_SECRET_KEY is not set");

    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify that this is a legitimate Paystack request
    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      throw new Error("Missing Paystack signature header");
    }

    // Get the request body as text
    const body = await req.json();
    logStep("Received webhook data", { event: body.event });

    // Process the event
    if (body.event === "charge.success") {
      const { data: paymentData } = body;
      const reference = paymentData.reference;
      
      logStep("Processing successful charge", { reference });
      
      // Find the transaction in our database
      const { data: transactions, error: findError } = await supabaseClient
        .from("subscription_transactions")
        .select("*")
        .eq("paystack_reference", reference)
        .limit(1);
      
      if (findError || !transactions || transactions.length === 0) {
        logStep("Error finding transaction", { error: findError?.message || "No transaction found" });
        return new Response(JSON.stringify({ status: "error", message: "Transaction not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      
      const transaction = transactions[0];
      logStep("Found transaction", { transactionId: transaction.id });
      
      // Calculate subscription end date (1 month from now for subscriptions)
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      
      // Update transaction status
      await supabaseClient
        .from("subscription_transactions")
        .update({
          status: "completed",
          amount: paymentData.amount / 100, // Convert from kobo to currency unit
        })
        .eq("id", transaction.id);
      
      // Find user in subscribers table or create a new entry
      const { data: subscriber, error: subscriberError } = await supabaseClient
        .from("subscribers")
        .select("*")
        .eq("user_id", transaction.host_id)
        .limit(1);
      
      const subscriptionData = {
        email: paymentData.customer.email,
        user_id: transaction.host_id,
        paystack_customer_code: paymentData.customer.customer_code,
        subscribed: true,
        subscription_tier: transaction.plan_name,
        subscription_status: "active",
        subscription_end: endDate.toISOString(),
        payment_gateway: "paystack",
        updated_at: new Date().toISOString(),
      };
      
      // Upsert subscriber record
      if (!subscriber || subscriber.length === 0) {
        await supabaseClient.from("subscribers").insert([subscriptionData]);
      } else {
        await supabaseClient
          .from("subscribers")
          .update(subscriptionData)
          .eq("user_id", transaction.host_id);
      }
      
      logStep("Updated subscription status to active", { userId: transaction.host_id });
    }
    
    return new Response(JSON.stringify({ status: "success" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[PAYSTACK-WEBHOOK] ERROR:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
