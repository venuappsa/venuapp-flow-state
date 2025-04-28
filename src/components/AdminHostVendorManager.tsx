
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BadgeCheck, Ban, Shield, Users, Building, ShoppingCart, Search, Filter, Check, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";

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

type VerificationDialogData = {
  record: AugmentedRecord;
  action: "approve" | "decline";
};

type SuspensionDialogData = {
  record: AugmentedRecord;
  action: "suspend" | "reactivate";
};

type DetailViewData = AugmentedRecord | null;

// Define subscription status type for better type safety
type SubscriptionStatusType = "active" | "expired" | "trial" | "none";

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
  const [searchQuery, setSearchQuery] = useState("");
  // Fix: Explicitly type this as "all" | "pending" | "verified" | "declined" to match verification_status type
  const [verificationFilter, setVerificationFilter] = useState<"all" | "pending" | "verified" | "declined">("all");
  // Fix: Explicitly type this as "all" | SubscriptionStatusType to match subscription_status type
  const [subscriptionFilter, setSubscriptionFilter] = useState<"all" | SubscriptionStatusType>("all");
  const [suspensionFilter, setSuspensionFilter] = useState<boolean | "all">("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Fix: Make sure verification dialog data is properly typed
  const [verificationDialog, setVerificationDialog] = useState<VerificationDialogData | null>(null);
  const [suspensionDialog, setSuspensionDialog] = useState<SuspensionDialogData | null>(null);
  const [detailView, setDetailView] = useState<DetailViewData>(null);
  const [verificationReason, setVerificationReason] = useState("");
  const [suspensionReason, setSuspensionReason] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["host-vendor-profiles"],
    queryFn: fetchProfiles,
    refetchOnWindowFocus: false,
  });

  const updateVerificationStatus = useMutation({
    mutationFn: async ({ 
      id, 
      type, 
      // Fix: Ensure status is properly typed to match verification_status
      status, 
      reason 
    }: { 
      id: string; 
      type: RoleType; 
      status: "verified" | "declined" | "pending"; 
      reason: string 
    }) => {
      const table = type === "host" ? "host_profiles" : "vendor_profiles";
      const { error } = await supabase
        .from(table)
        .update({ 
          verification_status: status,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
      
      if (error) throw error;
      
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host-vendor-profiles"] });
      const action = verificationDialog?.action === "approve" ? "verified" : "declined";
      toast({
        title: "Verification updated",
        description: `The profile has been ${action} successfully.`,
      });
      setVerificationDialog(null);
      setVerificationReason("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update verification status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateSuspensionStatus = useMutation({
    mutationFn: async ({ id, type, suspended, reason }: { id: string; type: RoleType; suspended: boolean; reason: string }) => {
      const table = type === "host" ? "host_profiles" : "vendor_profiles";
      const { error } = await supabase
        .from(table)
        .update({
          is_suspended: suspended,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
      
      if (error) throw error;
      
      return { id, suspended };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host-vendor-profiles"] });
      const action = suspensionDialog?.action === "suspend" ? "suspended" : "reactivated";
      toast({
        title: "Account status updated",
        description: `The account has been ${action} successfully.`,
      });
      setSuspensionDialog(null);
      setSuspensionReason("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update suspension status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const applyFilters = (data: AugmentedRecord[] | undefined) => {
    if (!data) return [];
    
    return data.filter(record => {
      if (roleFilter !== "all" && record.type !== roleFilter) return false;
      
      if (verificationFilter !== "all" && record.verification_status !== verificationFilter) return false;
      
      if (subscriptionFilter !== "all" && record.subscription_status !== subscriptionFilter) return false;
      
      if (suspensionFilter !== "all" && record.is_suspended !== suspensionFilter) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          (record.company_name?.toLowerCase().includes(query) ?? false) ||
          (record.contact_name?.toLowerCase().includes(query) ?? false) ||
          (record.contact_email?.toLowerCase().includes(query) ?? false) ||
          (record.contact_phone?.toLowerCase().includes(query) ?? false)
        );
      }
      
      return true;
    });
  };

  const filtered = applyFilters(data);
  const totalPages = Math.ceil((filtered?.length || 0) / itemsPerPage);
  
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleVerificationAction = (record: AugmentedRecord, action: "approve" | "decline") => {
    setVerificationDialog({ record, action });
  };

  const handleSuspensionAction = (record: AugmentedRecord, action: "suspend" | "reactivate") => {
    setSuspensionDialog({ record, action });
  };

  const handleSubmitVerification = () => {
    if (!verificationDialog) return;
    
    updateVerificationStatus.mutate({
      id: verificationDialog.record.id,
      type: verificationDialog.record.type,
      // Fix: Ensure status is properly typed as "verified" | "declined" | "pending"
      status: verificationDialog.action === "approve" ? "verified" : "declined",
      reason: verificationReason,
    });
  };

  const handleSubmitSuspension = () => {
    if (!suspensionDialog) return;
    
    updateSuspensionStatus.mutate({
      id: suspensionDialog.record.id,
      type: suspensionDialog.record.type,
      suspended: suspensionDialog.action === "suspend",
      reason: suspensionReason,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
            <Users className="inline h-6 w-6 text-venu-orange" /> Host &amp; Vendor Management
          </h2>
          <div className="text-sm text-gray-600">
            Review, search and filter registered hosts and vendors. Manage verifications and account status.
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

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by name, email, company..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="px-3 py-2 rounded border text-sm bg-white"
            value={verificationFilter}
            onChange={(e) => {
              // Fix: Use type assertion to ensure the value is one of the allowed types
              const value = e.target.value as "all" | "pending" | "verified" | "declined";
              setVerificationFilter(value);
            }}
          >
            <option value="all">All Verifications</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="declined">Declined</option>
          </select>

          <select
            className="px-3 py-2 rounded border text-sm bg-white"
            value={subscriptionFilter}
            onChange={(e) => {
              // Fix: Use type assertion to ensure the value is one of the allowed types
              const value = e.target.value as "all" | SubscriptionStatusType;
              setSubscriptionFilter(value);
            }}
          >
            <option value="all">All Subscriptions</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="expired">Expired</option>
            <option value="none">None</option>
          </select>

          <select
            className="px-3 py-2 rounded border text-sm bg-white"
            value={suspensionFilter === "all" ? "all" : suspensionFilter ? "true" : "false"}
            onChange={(e) => {
              if (e.target.value === "all") {
                setSuspensionFilter("all");
              } else {
                setSuspensionFilter(e.target.value === "true");
              }
            }}
          >
            <option value="all">All Accounts</option>
            <option value="false">Active Only</option>
            <option value="true">Suspended Only</option>
          </select>
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
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((p) => {
                const Icon = TYPE_DISPLAY[p.type].icon;
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-semibold flex items-center gap-1">
                      <Icon className="inline h-4 w-4" /> {TYPE_DISPLAY[p.type].label}
                    </TableCell>
                    <TableCell>{p.company_name || <span className="text-gray-400">—</span>}</TableCell>
                    <TableCell>{p.contact_name || <span className="text-gray-400">—</span>}</TableCell>
                    <TableCell>{p.contact_email || <span className="text-gray-400">—</span>}</TableCell>
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
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setDetailView(p)}
                      >
                        Details
                      </Button>
                      {p.verification_status === "pending" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            onClick={() => handleVerificationAction(p, "approve")}
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => handleVerificationAction(p, "decline")}
                          >
                            <X className="mr-1 h-3 w-3" />
                            Decline
                          </Button>
                        </>
                      )}
                      {p.is_suspended ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => handleSuspensionAction(p, "reactivate")}
                        >
                          <Shield className="mr-1 h-3 w-3" />
                          Reactivate
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handleSuspensionAction(p, "suspend")}
                        >
                          <Ban className="mr-1 h-3 w-3" />
                          Suspend
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    isActive={page === currentPage} 
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Verification Dialog */}
      <Dialog open={!!verificationDialog} onOpenChange={(open) => !open && setVerificationDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {verificationDialog?.action === "approve" 
                ? "Approve Verification" 
                : "Decline Verification"}
            </DialogTitle>
            <DialogDescription>
              {verificationDialog?.action === "approve"
                ? "This will mark the profile as verified."
                : "This will reject the verification request."}
            </DialogDescription>
          </DialogHeader>
          
          {verificationDialog && (
            <div className="py-4">
              <div className="space-y-2 mb-4">
                <div><strong>Company:</strong> {verificationDialog.record.company_name || "N/A"}</div>
                <div><strong>Contact:</strong> {verificationDialog.record.contact_name || "N/A"}</div>
                <div><strong>Email:</strong> {verificationDialog.record.contact_email || "N/A"}</div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Reason for {verificationDialog.action === "approve" ? "approval" : "rejection"}:
                </label>
                <Input
                  placeholder="Enter reason..."
                  value={verificationReason}
                  onChange={(e) => setVerificationReason(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerificationDialog(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitVerification}
              variant={verificationDialog?.action === "approve" ? "default" : "destructive"}
            >
              {verificationDialog?.action === "approve" ? "Approve" : "Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspension Dialog */}
      <Dialog open={!!suspensionDialog} onOpenChange={(open) => !open && setSuspensionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {suspensionDialog?.action === "suspend" 
                ? "Suspend Account" 
                : "Reactivate Account"}
            </DialogTitle>
            <DialogDescription>
              {suspensionDialog?.action === "suspend"
                ? "This will suspend the account and prevent access."
                : "This will reactivate the suspended account."}
            </DialogDescription>
          </DialogHeader>
          
          {suspensionDialog && (
            <div className="py-4">
              <div className="space-y-2 mb-4">
                <div><strong>Company:</strong> {suspensionDialog.record.company_name || "N/A"}</div>
                <div><strong>Contact:</strong> {suspensionDialog.record.contact_name || "N/A"}</div>
                <div><strong>Email:</strong> {suspensionDialog.record.contact_email || "N/A"}</div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Reason for {suspensionDialog.action === "suspend" ? "suspension" : "reactivation"}:
                </label>
                <Input
                  placeholder="Enter reason..."
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspensionDialog(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitSuspension}
              variant={suspensionDialog?.action === "reactivate" ? "default" : "destructive"}
            >
              {suspensionDialog?.action === "suspend" ? "Suspend" : "Reactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog */}
      <Dialog open={!!detailView} onOpenChange={(open) => !open && setDetailView(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
          </DialogHeader>
          
          {detailView && (
            <div className="py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Type</dt>
                        <dd className="flex items-center gap-1 font-medium">
                          {(() => {
                            const Icon = TYPE_DISPLAY[detailView.type].icon;
                            return <Icon className="h-4 w-4" />;
                          })()}
                          {TYPE_DISPLAY[detailView.type].label}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                        <dd>{detailView.company_name || "Not provided"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Created</dt>
                        <dd>{new Date(detailView.created_at).toLocaleDateString()} ({new Date(detailView.created_at).toLocaleTimeString()})</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                        <dd>{new Date(detailView.updated_at).toLocaleDateString()} ({new Date(detailView.updated_at).toLocaleTimeString()})</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                        <dd>{detailView.contact_name || "Not provided"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd>{detailView.contact_email || "Not provided"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd>{detailView.contact_phone || "Not provided"}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Verification Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${VERIFICATION_COLOR[detailView.verification_status]}`}>
                          {detailView.verification_status.charAt(0).toUpperCase() + detailView.verification_status.slice(1)}
                        </span>
                      </div>
                      
                      {detailView.verification_status === "pending" && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setDetailView(null);
                              handleVerificationAction(detailView, "approve");
                            }}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setDetailView(null);
                              handleVerificationAction(detailView, "decline");
                            }}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Subscription Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${SUBSCRIPTION_COLOR[detailView.subscription_status]}`}>
                            {detailView.subscription_status.charAt(0).toUpperCase() + detailView.subscription_status.slice(1)}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Renewal Date</dt>
                        <dd>
                          {detailView.subscription_renewal
                            ? new Date(detailView.subscription_renewal).toLocaleDateString()
                            : "Not set"
                          }
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                        <dd>
                          {detailView.is_suspended ? (
                            <span className="flex gap-1 items-center text-red-600 font-semibold">
                              <Ban className="h-4 w-4" /> Suspended
                            </span>
                          ) : (
                            <span className="flex gap-1 items-center text-green-600 font-semibold">
                              <Shield className="h-4 w-4" /> Active
                            </span>
                          )}
                        </dd>
                      </div>
                      
                      <div className="pt-2">
                        {detailView.is_suspended ? (
                          <Button
                            size="sm" 
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            onClick={() => {
                              setDetailView(null);
                              handleSuspensionAction(detailView, "reactivate");
                            }}
                          >
                            <Shield className="mr-1 h-4 w-4" />
                            Reactivate Account
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setDetailView(null);
                              handleSuspensionAction(detailView, "suspend");
                            }}
                          >
                            <Ban className="mr-1 h-4 w-4" />
                            Suspend Account
                          </Button>
                        )}
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setDetailView(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
