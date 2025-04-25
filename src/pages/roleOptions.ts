
import type { Enums } from "@/integrations/supabase/types";

export const ROLE_OPTIONS: { value: Enums<"app_role">; label: string }[] = [
  { value: "customer", label: "Customer" },
  { value: "host", label: "Host/Event Organizer" },
  { value: "merchant", label: "Merchant/Vendor" },
  { value: "fetchman", label: "Fetchman" },
  { value: "admin", label: "Admin" },
];
