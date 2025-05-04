import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Ban,
  CheckCircle,
  ChevronUp,
  MessageCircle,
  Search,
  Shield,
  Trash2,
  UserCog,
  UserX,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Fetchman {
  id: string;
  user_id: string;
  profile?: {
    name: string;
    email: string;
  };
  phone_number: string;
  service_area: string;
  vehicle_type: string;
  rating: number;
  total_deliveries: number;
  role: string;
  is_suspended: boolean;
  is_blacklisted: boolean;
  verification_status: string;
}

interface Promotion {
  id: string;
  fetchman_id: string;
  fetchman_name?: string;
  admin_name?: string;
  promoted_by: string;
  new_role: string;
  previous_role: string | null;
  promotion_date: string;
  notes: string | null;
}

export default function AdminFetchmanPage() {
  const { user } = useUser();
  const { data: userRoles, refetch: refetchRoles, isLoading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  
  const [fetchmen, setFetchmen] = useState<Fetchman[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState({
    fetchmen: true,
    promotions: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const [selectedFetchman, setSelectedFetchman] = useState<Fetchman | null>(null);
  const [promotionRole, setPromotionRole] = useState("");
  const [promotionNotes, setPromotionNotes] = useState("");
  const [blacklistReason, setBlacklistReason] = useState("");
  const [selfTestResults, setSelfTestResults] = useState<Array<{action: string; status: string; message: string}>>([]);
  
  const [openPromotionDialog, setOpenPromotionDialog] = useState(false);
  const [openBlacklistDialog, setOpenBlacklistDialog] = useState(false);
  const [openSelfTestDialog, setOpenSelfTestDialog] = useState(false);
  
  const [isAdminConfirmed, setIsAdminConfirmed] = useState(false);
  const [adminCheckAttempts, setAdminCheckAttempts] = useState(0);
  const MAX_ADMIN_CHECK_ATTEMPTS = 3;
  
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (userRoles?.includes("admin")) {
        console.log("AdminFetchmanPage: Admin role confirmed from hook data");
        setIsAdminConfirmed(true);
        return;
      }
      
      if (!rolesLoading && adminCheckAttempts < MAX_ADMIN_CHECK_ATTEMPTS) {
        try {
          setAdminCheckAttempts(prev => prev + 1);
          console.log(`AdminFetchmanPage: Checking admin status directly (attempt ${adminCheckAttempts + 1})`);
          
          const { data: isAdmin, error } = await supabase.rpc('is_admin');
          
          if (error) {
            console.error("AdminFetchmanPage: Error checking admin status:", error);
            
            const { data } = await supabase.auth.refreshSession();
            if (data.session) {
              refetchRoles();
            }
            
            if (adminCheckAttempts >= MAX_ADMIN_CHECK_ATTEMPTS - 1) {
              handleAccessDenied();
            }
            return;
          }
          
          if (isAdmin) {
            console.log("AdminFetchmanPage: Admin access confirmed via direct check");
            setIsAdminConfirmed(true);
            refetchRoles();
          } else {
            console.log("AdminFetchmanPage: User is not admin according to direct check");
            handleAccessDenied();
          }
        } catch (error) {
          console.error("AdminFetchmanPage: Exception checking admin status:", error);
          if (adminCheckAttempts >= MAX_ADMIN_CHECK_ATTEMPTS - 1) {
            handleAccessDenied();
          }
        }
      } else if (!isAdminConfirmed && !rolesLoading && adminCheckAttempts >= MAX_ADMIN_CHECK_ATTEMPTS) {
        handleAccessDenied();
      }
    };
    
    const handleAccessDenied = () => {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page. If you believe this is an error, try logging out and back in.",
        variant: "destructive",
      });
      navigate("/");
    };
    
    if (user) {
      checkAdminAccess();
    }
  }, [user, userRoles, navigate, adminCheckAttempts, rolesLoading, refetchRoles, isAdminConfirmed]);
  
  useEffect(() => {
    if (isAdminConfirmed) {
      fetchFetchmen();
      fetchPromotions();
    }
  }, [isAdminConfirmed]);

  const fetchFetchmen = async () => {
    try {
      setLoading(prev => ({ ...prev, fetchmen: true }));
      
      const { data: fetchmenData, error: fetchmenError } = await supabase
        .from("fetchman_profiles")
        .select("*");
        
      if (fetchmenError) throw fetchmenError;
      
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, email");
        
      if (profilesError) throw profilesError;
      
      const enrichedFetchmen = fetchmenData.map((fetchman: Fetchman) => {
        const profile = profilesData.find((p: any) => p.id === fetchman.user_id);
        return {
          ...fetchman,
          profile,
        };
      });
      
      setFetchmen(enrichedFetchmen);
    } catch (error) {
      console.error("Error fetching fetchmen:", error);
      toast({
        title: "Error",
        description: "Failed to load fetchmen data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, fetchmen: false }));
    }
  };

  const fetchPromotions = async () => {
    try {
      setLoading(prev => ({ ...prev, promotions: true }));
      
      const { data: promotionsData, error: promotionsError } = await supabase
        .from("fetchman_promotions")
        .select("*")
        .order("promotion_date", { ascending: false });
        
      if (promotionsError) throw promotionsError;
      
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, email");
        
      if (profilesError) throw profilesError;
      
      const { data: fetchmenData, error: fetchmenError } = await supabase
        .from("fetchman_profiles")
        .select("id, user_id");
        
      if (fetchmenError) throw fetchmenError;
      
      const enrichedPromotions = promotionsData.map((promotion: Promotion) => {
        const fetchman = fetchmenData.find((f: any) => f.id === promotion.fetchman_id);
        const fetchmanProfile = fetchman ? profilesData.find((p: any) => p.id === fetchman.user_id) : null;
        const adminProfile = profilesData.find((p: any) => p.id === promotion.promoted_by);
        
        return {
          ...promotion,
          fetchman_name: fetchmanProfile?.name || "Unknown",
          admin_name: adminProfile?.name || "Unknown Admin",
        };
      });
      
      setPromotions(enrichedPromotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast({
        title: "Error",
        description: "Failed to load promotion history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, promotions: false }));
    }
  };

  const handleSuspendFetchman = async (fetchman: Fetchman) => {
    try {
      const { error } = await supabase
        .from("fetchman_profiles")
        .update({ is_suspended: !fetchman.is_suspended })
        .eq("id", fetchman.id);
        
      if (error) throw error;
      
      toast({
        title: fetchman.is_suspended ? "Fetchman Unsuspended" : "Fetchman Suspended",
        description: `${fetchman.profile?.name || 'Fetchman'} has been ${fetchman.is_suspended ? 'unsuspended' : 'suspended'} successfully.`,
      });
      
      fetchFetchmen();
    } catch (error) {
      console.error("Error suspending/unsuspending fetchman:", error);
      toast({
        title: "Error",
        description: "Failed to update fetchman status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBlacklistFetchman = async () => {
    if (!selectedFetchman || !blacklistReason.trim()) return;
    
    try {
      const { error: blacklistError } = await supabase
        .from("fetchman_blacklist")
        .insert({
          fetchman_id: selectedFetchman.id,
          blacklisted_by: user?.id,
          reason: blacklistReason,
        });
        
      if (blacklistError) throw blacklistError;
      
      const { error: updateError } = await supabase
        .from("fetchman_profiles")
        .update({ 
          is_blacklisted: true,
          is_suspended: true
        })
        .eq("id", selectedFetchman.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Fetchman Blacklisted",
        description: `${selectedFetchman.profile?.name || 'Fetchman'} has been permanently blacklisted.`,
      });
      
      setBlacklistReason("");
      setOpenBlacklistDialog(false);
      setSelectedFetchman(null);
      
      fetchFetchmen();
    } catch (error) {
      console.error("Error blacklisting fetchman:", error);
      toast({
        title: "Error",
        description: "Failed to blacklist fetchman. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePromoteFetchman = async () => {
    if (!selectedFetchman || !promotionRole) return;
    
    try {
      const previousRole = selectedFetchman.role;
      
      const { error: promotionError } = await supabase
        .from("fetchman_promotions")
        .insert({
          fetchman_id: selectedFetchman.id,
          promoted_by: user?.id,
          new_role: promotionRole,
          previous_role: previousRole,
          notes: promotionNotes,
        });
        
      if (promotionError) throw promotionError;
      
      const { error: updateError } = await supabase
        .from("fetchman_profiles")
        .update({ role: promotionRole })
        .eq("id", selectedFetchman.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Fetchman Promoted",
        description: `${selectedFetchman.profile?.name || 'Fetchman'} has been promoted to ${promotionRole}.`,
      });
      
      setPromotionRole("");
      setPromotionNotes("");
      setOpenPromotionDialog(false);
      setSelectedFetchman(null);
      
      fetchFetchmen();
      fetchPromotions();
    } catch (error) {
      console.error("Error promoting fetchman:", error);
      toast({
        title: "Error",
        description: "Failed to promote fetchman. Please try again.",
        variant: "destructive",
      });
    }
  };

  const initiateChat = (fetchman: Fetchman) => {
    toast({
      title: "Chat Initiated",
      description: `You can now message ${fetchman.profile?.name || 'Fetchman'}.`,
    });
    
    navigate(`/admin/messages?recipient=${fetchman.user_id}`);
  };

  const runSelfTest = async () => {
    setSelfTestResults([]);
    
    try {
      const testResults = [];
      
      const start1 = performance.now();
      const { data: fetchmenTest, error: fetchmenError } = await supabase
        .from("fetchman_profiles")
        .select("*")
        .limit(1);
        
      const duration1 = performance.now() - start1;
      
      testResults.push({
        action: "Fetch Fetchmen",
        status: fetchmenError ? "Failed" : "Success",
        message: fetchmenError 
          ? `Error: ${fetchmenError.message}` 
          : `Successfully fetched data in ${duration1.toFixed(0)}ms`,
      });
      
      const start2 = performance.now();
      const { data: promotionsTest, error: promotionsError } = await supabase
        .from("fetchman_promotions")
        .select("*")
        .limit(1);
        
      const duration2 = performance.now() - start2;
      
      testResults.push({
        action: "Fetch Promotions",
        status: promotionsError ? "Failed" : "Success",
        message: promotionsError 
          ? `Error: ${promotionsError.message}` 
          : `Successfully fetched data in ${duration2.toFixed(0)}ms`,
      });
      
      const { data: testData, error: testError } = await supabase.rpc('is_admin');
      
      testResults.push({
        action: "Check Admin Permissions",
        status: testError ? "Failed" : testData ? "Success" : "Failed",
        message: testError 
          ? `Error: ${testError.message}` 
          : testData 
            ? "Successfully verified admin permissions" 
            : "User does not have admin permissions",
      });
      
      setSelfTestResults(testResults);
    } catch (error: any) {
      console.error("Self-test error:", error);
      setSelfTestResults([{
        action: "Self Test",
        status: "Failed",
        message: `Unexpected error: ${error.message || 'Unknown error'}`,
      }]);
    }
  };

  const filteredFetchmen = fetchmen.filter(fetchman => {
    const matchesSearch = searchQuery === "" || 
      (fetchman.profile?.name && fetchman.profile.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (fetchman.profile?.email && fetchman.profile.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      fetchman.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fetchman.service_area.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRole = roleFilter === null || fetchman.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'team_leader':
        return "bg-blue-100 text-blue-800";
      case 'shift_leader':
        return "bg-purple-100 text-purple-800";
      case 'area_leader':
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminPanelLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Fetchman Management</h1>
            <p className="text-muted-foreground">
              Manage, monitor, and communicate with your delivery staff
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpenSelfTestDialog(true);
                runSelfTest();
              }}
            >
              <Shield className="mr-2 h-4 w-4" />
              Run Self-Test
            </Button>
          </div>
        </div>

        <Tabs defaultValue="fetchmen" className="space-y-4">
          <TabsList>
            <TabsTrigger value="fetchmen">Fetchmen List</TabsTrigger>
            <TabsTrigger value="promotions">Promotion History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fetchmen" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Fetchmen</CardTitle>
                <CardDescription>
                  View and manage all registered fetchmen
                </CardDescription>
                <div className="flex flex-col md:flex-row gap-2 mt-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, phone..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select 
                    value={roleFilter || ""} 
                    onValueChange={(value) => setRoleFilter(value || null)}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Roles</SelectItem>
                      <SelectItem value="fetchman">Fetchman</SelectItem>
                      <SelectItem value="team_leader">Team Leader</SelectItem>
                      <SelectItem value="shift_leader">Shift Leader</SelectItem>
                      <SelectItem value="area_leader">Area Leader</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Service Area</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading.fetchmen ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            Loading fetchmen data...
                          </TableCell>
                        </TableRow>
                      ) : filteredFetchmen.length > 0 ? (
                        filteredFetchmen.map((fetchman) => (
                          <TableRow key={fetchman.id}>
                            <TableCell className="font-medium">
                              {fetchman.profile?.name || "Unknown"}
                            </TableCell>
                            <TableCell>
                              <div>{fetchman.profile?.email}</div>
                              <div className="text-sm text-muted-foreground">
                                {fetchman.phone_number}
                              </div>
                            </TableCell>
                            <TableCell>{fetchman.service_area}</TableCell>
                            <TableCell>
                              <Badge className={getRoleBadgeColor(fetchman.role)}>
                                {fetchman.role === "fetchman" ? "Fetchman" : 
                                  fetchman.role === "team_leader" ? "Team Leader" : 
                                  fetchman.role === "shift_leader" ? "Shift Leader" : 
                                  fetchman.role === "area_leader" ? "Area Leader" : 
                                  fetchman.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="font-medium">{fetchman.rating || 0}</span>
                                <span className="text-muted-foreground text-sm ml-1">/ 5</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {fetchman.is_blacklisted ? (
                                <Badge variant="destructive">Blacklisted</Badge>
                              ) : fetchman.is_suspended ? (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                  Suspended
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Active
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => initiateChat(fetchman)}
                                  disabled={fetchman.is_blacklisted}
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedFetchman(fetchman);
                                    setOpenPromotionDialog(true);
                                  }}
                                  disabled={fetchman.is_blacklisted}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant={fetchman.is_suspended ? "outline" : "ghost"}
                                  size="icon"
                                  onClick={() => handleSuspendFetchman(fetchman)}
                                  disabled={fetchman.is_blacklisted}
                                >
                                  {fetchman.is_suspended ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <XCircle className="h-4 w-4" />
                                  )}
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedFetchman(fetchman);
                                    setOpenBlacklistDialog(true);
                                  }}
                                  disabled={fetchman.is_blacklisted}
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No fetchmen found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="promotions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Promotion History</CardTitle>
                <CardDescription>
                  View all fetchmen promotions and role changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fetchman Name</TableHead>
                        <TableHead>New Role</TableHead>
                        <TableHead>Previous Role</TableHead>
                        <TableHead>Promoted By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading.promotions ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            Loading promotion history...
                          </TableCell>
                        </TableRow>
                      ) : promotions.length > 0 ? (
                        promotions.map((promotion) => (
                          <TableRow key={promotion.id}>
                            <TableCell className="font-medium">
                              {promotion.fetchman_name}
                            </TableCell>
                            <TableCell>
                              <Badge className={getRoleBadgeColor(promotion.new_role)}>
                                {promotion.new_role === "team_leader" ? "Team Leader" : 
                                 promotion.new_role === "shift_leader" ? "Shift Leader" : 
                                 promotion.new_role === "area_leader" ? "Area Leader" : 
                                 promotion.new_role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {promotion.previous_role ? (
                                <Badge className={getRoleBadgeColor(promotion.previous_role)} variant="outline">
                                  {promotion.previous_role === "team_leader" ? "Team Leader" : 
                                   promotion.previous_role === "shift_leader" ? "Shift Leader" : 
                                   promotion.previous_role === "area_leader" ? "Area Leader" : 
                                   promotion.previous_role}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">None</span>
                              )}
                            </TableCell>
                            <TableCell>{promotion.admin_name}</TableCell>
                            <TableCell>
                              {new Date(promotion.promotion_date).toLocaleDateString("en-ZA", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </TableCell>
                            <TableCell>
                              {promotion.notes || <span className="text-muted-foreground">No notes</span>}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No promotion history found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={openPromotionDialog} onOpenChange={setOpenPromotionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Promote Fetchman</DialogTitle>
            <DialogDescription>
              Assign a new role to {selectedFetchman?.profile?.name || 'this fetchman'}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Select New Role
              </label>
              <Select value={promotionRole} onValueChange={setPromotionRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team_leader">Team Leader</SelectItem>
                  <SelectItem value="shift_leader">Shift Leader</SelectItem>
                  <SelectItem value="area_leader">Area Leader</SelectItem>
                  <SelectItem value="fetchman">Fetchman (Demote)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </label>
              <Textarea
                id="notes"
                placeholder="Add notes about this promotion"
                value={promotionNotes}
                onChange={(e) => setPromotionNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenPromotionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePromoteFetchman} disabled={!promotionRole}>
              Promote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={openBlacklistDialog} onOpenChange={setOpenBlacklistDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Blacklist Fetchman</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently blacklist {selectedFetchman?.profile?.name || 'this fetchman'}.
              Blacklisted fetchmen cannot be unsuspended or promoted and will be removed from active duty.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason (Required)
              </label>
              <Textarea
                id="reason"
                placeholder="Provide a reason for blacklisting"
                value={blacklistReason}
                onChange={(e) => setBlacklistReason(e.target.value)}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenBlacklistDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlacklistFetchman}
              disabled={!blacklistReason.trim()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Blacklist
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={openSelfTestDialog} onOpenChange={setOpenSelfTestDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>System Self-Test</DialogTitle>
            <DialogDescription>
              Testing backend communication and core functionality.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              {selfTestResults.length === 0 ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Running tests...</p>
                </div>
              ) : (
                selfTestResults.map((result, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 border rounded-md"
                  >
                    {result.status === "Success" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{result.action}</p>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenSelfTestDialog(false)}>
              Close
            </Button>
            <Button onClick={runSelfTest}>
              Run Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPanelLayout>
  );
}
