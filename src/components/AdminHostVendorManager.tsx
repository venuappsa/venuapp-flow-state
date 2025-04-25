
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgeCheck, Ban, Shield, Users, Building, ShoppingCart } from "lucide-react";
import { useState } from "react";

type RoleType = "host" | "vendor";

type RecordType = {
  id: string;
  user_id: string;
  company_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  verification_status: "pending" | "verified" | "declined";
  is_suspended: boolean;
  subscription_status: "active" | "expired" | "trial" | "none";
  subscription_renewal: string | null;
  created_at: string;
  updated_at: string;
};

type AugmentedRecord = RecordType & { type: RoleType };

async function fetchProfiles() {
  const hostPromise = supabase
    .from("host_profiles")
    .select("*")
    .then(({ data, error }) => {
      if (error) throw error;
      return (data ?? []).map((r: RecordType) => ({ ...r, type: "host" as RoleType }));
    });

  const vendorPromise = supabase
    .from("vendor_profiles")
    .select("*")
    .then(({ data, error }) => {
      if (error) throw error;
      return (data ?? []).map((r: RecordType) => ({ ...r, type: "vendor" as RoleType }));
    });

  const [hosts, vendors] = await Promise.all([hostPromise, vendorPromise]);
  return hosts.concat(vendors);
}

const TYPE_DISPLAY = {
  host: { label: "Host", icon: Building },
  vendor: { label: "Vendor", icon: ShoppingCart },
};

const VERIFICATION_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  verified: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-700",
};

const SUBSCRIPTION_COLOR: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-700",
  trial: "bg-blue-100 text-blue-700",
  none: "bg-gray-100 text-gray-700",
};

export default function AdminHostVendorManager() {
  const [roleFilter, setRoleFilter] = useState<RoleType | "all">("all");
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["host-vendor-profiles"],
    queryFn: fetchProfiles,
    refetchOnWindowFocus: false,
  });

  const filtered =
    roleFilter === "all"
      ? data
      : (data ?? []).filter((r) => r.type === roleFilter);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
            <Users className="inline h-6 w-6 text-venu-orange" /> Host & Vendor Management
          </h2>
          <div className="text-sm text-gray-600">
            Review, search and filter registered hosts and vendors. (Read-only for now)
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setRoleFilter("all")}
            className={`px-3 py-1 rounded border text-xs ${
              roleFilter === "all"
                ? "bg-venu-orange text-white"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setRoleFilter("host")}
            className={`px-3 py-1 rounded border text-xs flex items-center gap-1 ${
              roleFilter === "host"
                ? "bg-orange-100 text-venu-orange border-orange-300"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            <Building className="h-3 w-3" /> Host
          </button>
          <button
            onClick={() => setRoleFilter("vendor")}
            className={`px-3 py-1 rounded border text-xs flex items-center gap-1 ${
              roleFilter === "vendor"
                ? "bg-blue-100 text-blue-700 border-blue-300"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            <ShoppingCart className="h-3 w-3" /> Vendor
          </button>
        </div>
      </div>
      {isLoading && <div className="text-gray-500">Loading profiles...</div>}
      {error && <div className="text-red-600 text-sm">Error loading profiles</div>}
      {filtered && filtered.length === 0 && (
        <div className="text-gray-500 mt-4">No records found for this filter.</div>
      )}
      {filtered && filtered.length > 0 && (
        <div className="overflow-x-auto bg-white rounded shadow border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact Name</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Contact Phone</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Suspended</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Renewal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const Icon = TYPE_DISPLAY[p.type].icon;
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-semibold flex items-center gap-1">
                      <Icon className="inline h-4 w-4" /> {TYPE_DISPLAY[p.type].label}
                    </TableCell>
                    <TableCell>{p.company_name}</TableCell>
                    <TableCell>{p.contact_name}</TableCell>
                    <TableCell>{p.contact_email}</TableCell>
                    <TableCell>{p.contact_phone}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${VERIFICATION_COLOR[p.verification_status]}`}>
                        {p.verification_status.charAt(0).toUpperCase() + p.verification_status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {p.is_suspended ? (
                        <span className="flex gap-1 items-center text-red-600 font-semibold">
                          <Ban className="h-4 w-4" /> Suspended
                        </span>
                      ) : (
                        <span className="flex gap-1 items-center text-green-600 font-semibold">
                          <Shield className="h-4 w-4" /> Active
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${SUBSCRIPTION_COLOR[p.subscription_status]}`}>
                        {p.subscription_status.charAt(0).toUpperCase() + p.subscription_status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {p.subscription_renewal
                        ? new Date(p.subscription_renewal).toLocaleDateString()
                        : <span className="text-xs text-gray-400">—</span>
                      }
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
