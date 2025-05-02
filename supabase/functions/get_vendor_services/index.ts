
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-application-name",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData = await req.json();
    const { vendor_user_id, action, service_id, service_data } = requestData;

    if (!vendor_user_id) {
      return new Response(
        JSON.stringify({ error: "Vendor user ID is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create a Supabase client with the auth role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Perform appropriate action based on the 'action' parameter
    switch (action) {
      case "update":
        if (!service_id || !service_data) {
          return new Response(
            JSON.stringify({ error: "Service ID and service data are required for updates" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        const { data: updateData, error: updateError } = await supabaseClient
          .from("vendor_services")
          .update(service_data)
          .eq("id", service_id)
          .eq("vendor_id", vendor_user_id);

        if (updateError) {
          console.error("Error updating service:", updateError);
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: updateData }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );

      case "create":
        if (!service_data) {
          return new Response(
            JSON.stringify({ error: "Service data is required for creation" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        const { data: createData, error: createError } = await supabaseClient
          .from("vendor_services")
          .insert({ ...service_data, vendor_id: vendor_user_id });

        if (createError) {
          console.error("Error creating service:", createError);
          return new Response(
            JSON.stringify({ error: createError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: createData }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );

      case "delete":
        if (!service_id) {
          return new Response(
            JSON.stringify({ error: "Service ID is required for deletion" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        const { data: deleteData, error: deleteError } = await supabaseClient
          .from("vendor_services")
          .delete()
          .eq("id", service_id)
          .eq("vendor_id", vendor_user_id);

        if (deleteError) {
          console.error("Error deleting service:", deleteError);
          return new Response(
            JSON.stringify({ error: deleteError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: deleteData }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );

      // Default behavior (no action specified): Get vendor services
      default:
        // Get vendor services
        const { data, error } = await supabaseClient
          .from("vendor_services")
          .select("*")
          .eq("vendor_id", vendor_user_id);

        if (error) {
          console.error("Error fetching vendor services:", error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }

        // Return services
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
    }
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
