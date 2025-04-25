
import { supabase } from "@/integrations/supabase/client";

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
  role: string;
}) {
  let { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: userId, name, surname, email, phone });
  if (profileError) throw profileError;

  let { error: roleError } = await supabase
    .from("user_roles")
    .insert({
      user_id: userId,
      role: role,
    });
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
