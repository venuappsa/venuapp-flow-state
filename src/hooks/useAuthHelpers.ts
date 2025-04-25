
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
