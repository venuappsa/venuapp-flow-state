
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, Enums } from "@/integrations/supabase/types";

export async function createProfileAndRole({
  userId,
  name,
  surname,
  email,
  phone,
  role,
}: {
  userId: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: Enums<"app_role">; // restrict to allowed enum
}) {
  let { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: userId, name, surname, email, phone });
  if (profileError) throw profileError;

  // Use Supabase types for the insert and restrict role
  let { error: roleError } = await supabase
    .from("user_roles")
    .insert({
      user_id: userId,
      role: role as Enums<"app_role">,
    } as TablesInsert<"user_roles">);
  if (roleError) throw roleError;

  // If the role is 'host', create a host profile
  if (role === 'host') {
    try {
      const { error: hostProfileError } = await supabase
        .from("host_profiles")
        .insert({
          user_id: userId,
          contact_name: `${name} ${surname}`.trim(),
          contact_email: email,
          contact_phone: phone,
          subscription_status: "none",
        });
      
      if (hostProfileError) console.error("Failed to create host profile:", hostProfileError);
    } catch (err) {
      console.error("Exception creating host profile:", err);
    }
  }

  // If the role is 'merchant', create a vendor profile
  if (role === 'merchant') {
    try {
      const { error: vendorProfileError } = await supabase
        .from("vendor_profiles")
        .insert({
          user_id: userId,
          contact_name: `${name} ${surname}`.trim(),
          contact_email: email,
          contact_phone: phone,
          subscription_status: "none",
        });
      
      if (vendorProfileError) console.error("Failed to create vendor profile:", vendorProfileError);
    } catch (err) {
      console.error("Exception creating vendor profile:", err);
    }
  }
}

export async function sendOtp({
  email,
  code,
  toast,
}: {
  email: string;
  code: string;
  toast: (opts: { title: string; description: string }) => void;
}) {
  // In production, send real email. For now, just toast.
  toast({
    title: "OTP sent!",
    description: "A 6-digit code was sent to your e-mail.",
  });
}
