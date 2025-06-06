
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Check, X, Eye, AlertCircle } from "lucide-react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Define interfaces for clarity
interface ProfileData {
  id: string;
  name?: string | null;
  surname?: string | null;
  email?: string | null;
}

interface VerificationItem {
  id: string;
  name: string;
  email: string;
  type: 'host' | 'vendor' | 'fetchman';
  documentType: string;
  submissionDate: string;
  status: 'pending' | 'verified' | 'declined' | 'ready_for_review';
  originalData: any;
  rejectionReason: string | null;
}

export default function AdminVerificationCenterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [accountType, setAccountType] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch verification data from supabase
  const { data: verificationData, isLoading, error } = useQuery({
    queryKey: ['verifications'],
    queryFn: async () => {
      try {
        // First fetch all profiles to have user data available
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, name, surname, email");
        
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          throw profilesError;
        }
        
        // Create a map of profiles for easy lookup
        const profilesMap: Record<string, ProfileData> = {};
        if (profilesData && Array.isArray(profilesData)) {
          profilesData.forEach(profile => {
            if (profile && profile.id) {
              profilesMap[profile.id] = profile;
            }
          });
        } else {
          console.warn("Profiles data is not an array or is undefined");
        }

        // Now fetch the different profile types
        const hostPromise = supabase
          .from("host_profiles")
          .select("*, user_id")
          .eq("verification_status", "pending");
          
        const vendorPromise = supabase
          .from("vendor_profiles")
          .select("*, user_id")
          .eq("verification_status", "pending");

        const fetchmanPromise = supabase
          .from("fetchman_profiles")
          .select("*, user_id")
          .eq("verification_status", "pending");

        const [{ data: hostData, error: hostError }, 
               { data: vendorData, error: vendorError },
               { data: fetchmanData, error: fetchmanError }] = await Promise.all([
                hostPromise, 
                vendorPromise,
                fetchmanPromise
              ]);

        if (hostError) console.error("Error fetching host verifications:", hostError);
        if (vendorError) console.error("Error fetching vendor verifications:", vendorError);
        if (fetchmanError) console.error("Error fetching fetchman verifications:", fetchmanError);
        
        // Transform the data to a common format using the profiles map
        const transformedHostData = (hostData || []).map(h => {
          // Safely access the profile data with fallbacks
          const profile = (h.user_id && profilesMap[h.user_id]) ? profilesMap[h.user_id] : {} as ProfileData;
          const fullName = profile.name && profile.surname 
            ? `${profile.name} ${profile.surname}`
            : h.contact_name || 'Unknown';
          
          return {
            id: h.id,
            name: fullName,
            email: profile.email || h.contact_email || 'Unknown',
            type: 'host' as const,
            documentType: 'Business Registration',
            submissionDate: h.created_at,
            status: h.verification_status,
            originalData: h,
            rejectionReason: null // Add this field even for pending items
          };
        });

        const transformedVendorData = (vendorData || []).map(v => {
          // Safely access the profile data with fallbacks
          const profile = (v.user_id && profilesMap[v.user_id]) ? profilesMap[v.user_id] : {} as ProfileData;
          const fullName = profile.name && profile.surname 
            ? `${profile.name} ${profile.surname}`
            : v.contact_name || 'Unknown';
          
          return {
            id: v.id,
            name: fullName,
            email: profile.email || v.contact_email || 'Unknown',
            type: 'vendor' as const,
            documentType: 'Business License',
            submissionDate: v.created_at,
            status: v.verification_status,
            originalData: v,
            rejectionReason: null // Add this field even for pending items
          };
        });

        const transformedFetchmanData = (fetchmanData || []).map(f => {
          // Safely access the profile data with fallbacks
          const profile = (f.user_id && profilesMap[f.user_id]) ? profilesMap[f.user_id] : {} as ProfileData;
          const fullName = profile.name && profile.surname 
            ? `${profile.name} ${profile.surname}`
            : 'Unknown Fetchman';
          
          return {
            id: f.id,
            name: fullName,
            email: profile.email || 'Unknown',
            type: 'fetchman' as const,
            documentType: 'ID Verification',
            submissionDate: f.created_at,
            status: f.verification_status,
            originalData: f,
            rejectionReason: null // Add this field even for pending items
          };
        });

        return [...transformedHostData, ...transformedVendorData, ...transformedFetchmanData];
      } catch (error) {
        console.error("Error fetching verifications:", error);
        return [];
      }
    },
    refetchOnWindowFocus: false
  });

  // Fetch approved and rejected verification data
  const { data: processedVerificationData } = useQuery({
    queryKey: ['processed-verifications'],
    queryFn: async () => {
      try {
        // First fetch all profiles to have user data available
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, name, surname, email");
          
        if (profilesError) {
          console.error("Error fetching profiles for processed items:", profilesError);
          throw profilesError;
        }
        
        // Create a map of profiles for easy lookup
        const profilesMap: Record<string, ProfileData> = {};
        if (profilesData && Array.isArray(profilesData)) {
          profilesData.forEach(profile => {
            if (profile && profile.id) {
              profilesMap[profile.id] = profile;
            }
          });
        } else {
          console.warn("Profiles data is not an array or is undefined for processed items");
        }
        
        const hostPromise = supabase
          .from("host_profiles")
          .select("*, user_id")
          .in("verification_status", ["verified", "declined"]);
          
        const vendorPromise = supabase
          .from("vendor_profiles")
          .select("*, user_id")
          .in("verification_status", ["verified", "declined"]);

        const fetchmanPromise = supabase
          .from("fetchman_profiles")
          .select("*, user_id")
          .in("verification_status", ["verified", "declined"]);

        const [{ data: hostData, error: hostError }, 
               { data: vendorData, error: vendorError },
               { data: fetchmanData, error: fetchmanError }] = await Promise.all([
                hostPromise, 
                vendorPromise,
                fetchmanPromise
              ]);

        if (hostError) console.error("Error fetching processed host verifications:", hostError);
        if (vendorError) console.error("Error fetching processed vendor verifications:", vendorError);
        if (fetchmanError) console.error("Error fetching processed fetchman verifications:", fetchmanError);
        
        // Transform the data to a common format using the profiles map
        const transformedHostData = (hostData || []).map(h => {
          // Safely access the profile data with fallbacks
          const profile = (h.user_id && profilesMap[h.user_id]) ? profilesMap[h.user_id] : {} as ProfileData;
          const fullName = profile.name && profile.surname 
            ? `${profile.name} ${profile.surname}`
            : h.contact_name || 'Unknown';
          
          return {
            id: h.id,
            name: fullName,
            email: profile.email || h.contact_email || 'Unknown',
            type: 'host' as const,
            documentType: 'Business Registration',
            submissionDate: h.created_at,
            status: h.verification_status,
            originalData: h,
            // Don't try to access decline_reason directly since it might not exist in the schema
            rejectionReason: h.verification_status === 'declined' ? 'No reason specified' : null
          };
        });

        const transformedVendorData = (vendorData || []).map(v => {
          // Safely access the profile data with fallbacks
          const profile = (v.user_id && profilesMap[v.user_id]) ? profilesMap[v.user_id] : {} as ProfileData;
          const fullName = profile.name && profile.surname 
            ? `${profile.name} ${profile.surname}`
            : v.contact_name || 'Unknown';
          
          return {
            id: v.id,
            name: fullName,
            email: profile.email || v.contact_email || 'Unknown',
            type: 'vendor' as const,
            documentType: 'Business License',
            submissionDate: v.created_at,
            status: v.verification_status,
            originalData: v,
            // Don't try to access decline_reason directly since it might not exist in the schema
            rejectionReason: v.verification_status === 'declined' ? 'No reason specified' : null
          };
        });

        const transformedFetchmanData = (fetchmanData || []).map(f => {
          // Safely access the profile data with fallbacks
          const profile = (f.user_id && profilesMap[f.user_id]) ? profilesMap[f.user_id] : {} as ProfileData;
          const fullName = profile.name && profile.surname 
            ? `${profile.name} ${profile.surname}`
            : 'Unknown Fetchman';
          
          return {
            id: f.id,
            name: fullName,
            email: profile.email || 'Unknown',
            type: 'fetchman' as const,
            documentType: 'ID Verification',
            submissionDate: f.created_at,
            status: f.verification_status,
            originalData: f,
            rejectionReason: f.verification_status === 'declined' ? 'No reason specified' : null
          };
        });

        return [...transformedHostData, ...transformedVendorData, ...transformedFetchmanData];
      } catch (error) {
        console.error("Error fetching processed verifications:", error);
        return [];
      }
    },
    refetchOnWindowFocus: false
  });

  // Handle approve/reject mutations
  const updateVerificationStatus = useMutation({
    mutationFn: async ({ id, type, status, reason }: { id: string; type: string; status: string; reason?: string }) => {
      const table = type === "host" 
        ? "host_profiles" 
        : type === "vendor" 
          ? "vendor_profiles" 
          : "fetchman_profiles";
          
      // For now, we'll only update the verification_status field since decline_reason may not exist
      // To add a decline_reason field, we would need to first add it to the database schema
      const updateData = { verification_status: status };
          
      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq("id", id);
      
      if (error) throw error;
      
      return { id, status };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] });
      queryClient.invalidateQueries({ queryKey: ['processed-verifications'] });
      
      toast({
        title: `Verification ${data.status === "verified" ? "approved" : "rejected"}`,
        description: `The profile has been ${data.status === "verified" ? "approved" : "rejected"} successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update verification status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleApprove = (id: string, type: string) => {
    updateVerificationStatus.mutate({ id, type, status: "verified" });
  };

  const handleReject = (id: string, type: string) => {
    // We can still pass a reason here, but we won't try to store it in the database yet
    const reason = "Application rejected by admin";
    updateVerificationStatus.mutate({ id, type, status: "declined", reason });
  };

  const filterVerifications = (status: string) => {
    let data = status === "pending" ? verificationData : processedVerificationData;
    
    if (!data) return [];
    
    if (status !== "pending") {
      data = data.filter(v => v.status === status);
    }
    
    // Apply search filter
    let filtered = data.filter(v => 
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Apply account type filter
    if (accountType !== "all") {
      filtered = filtered.filter(v => v.type === accountType);
    }
    
    return filtered;
  };

  const getAccountTypeBadge = (type: string) => {
    switch (type) {
      case "host":
        return <Badge className="bg-blue-100 text-blue-800">Host</Badge>;
      case "vendor":
        return <Badge className="bg-green-100 text-green-800">Vendor</Badge>;
      case "fetchman":
        return <Badge className="bg-purple-100 text-purple-800">Fetchman</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "declined":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Verification Center</h1>
            <p className="text-gray-500">Approve or reject user verification documents</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Document Verifications</CardTitle>
            <CardDescription>Review submitted verification documents</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4 md:mb-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search verifications..."
                    className="pl-9 w-full sm:w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={accountType} onValueChange={setAccountType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Account Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="host">Host</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="fetchman">Fetchman</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-x-2">
                <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['verifications'] })}>
                  Refresh
                </Button>
                <Button variant="outline">
                  Export
                </Button>
              </div>
            </div>

            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending ({filterVerifications("pending").length})
                </TabsTrigger>
                <TabsTrigger value="verified">
                  Approved ({filterVerifications("verified").length})
                </TabsTrigger>
                <TabsTrigger value="declined">
                  Rejected ({filterVerifications("declined").length})
                </TabsTrigger>
              </TabsList>
              
              {["pending", "verified", "declined"].map((status) => (
                <TabsContent key={status} value={status}>
                  <div className="rounded-md border mt-4">
                    <Table>
                      <TableCaption>List of {status} verification requests</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Account Type</TableHead>
                          <TableHead>Document Type</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Status</TableHead>
                          {status === "declined" && <TableHead>Reason</TableHead>}
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={status === "declined" ? 7 : 6} className="text-center py-8">
                              Loading verification requests...
                            </TableCell>
                          </TableRow>
                        ) : error ? (
                          <TableRow>
                            <TableCell colSpan={status === "declined" ? 7 : 6} className="text-center py-8 text-red-500">
                              Error loading verification requests.
                            </TableCell>
                          </TableRow>
                        ) : filterVerifications(status).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={status === "declined" ? 7 : 6} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <AlertCircle className="h-8 w-8 mb-2" />
                                <p>No {status} verification requests found.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filterVerifications(status).map((verification) => (
                            <TableRow key={`${verification.type}-${verification.id}`}>
                              <TableCell className="font-medium">
                                <div>
                                  {verification.name}
                                  <div className="text-xs text-gray-500">
                                    {verification.email}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{getAccountTypeBadge(verification.type)}</TableCell>
                              <TableCell>{verification.documentType}</TableCell>
                              <TableCell>{new Date(verification.submissionDate).toLocaleDateString()}</TableCell>
                              <TableCell>{getStatusBadge(verification.status)}</TableCell>
                              {status === "declined" && (
                                <TableCell>{verification.rejectionReason || 'No reason specified'}</TableCell>
                              )}
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  
                                  {status === "pending" && (
                                    <>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => handleApprove(verification.id, verification.type)}
                                      >
                                        <Check className="h-4 w-4 text-green-500" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => handleReject(verification.id, verification.type)}
                                      >
                                        <X className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminPanelLayout>
  );
}
