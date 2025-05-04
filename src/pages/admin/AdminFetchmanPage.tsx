import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAllFetchmanProfiles } from "@/hooks/useAllFetchmanProfiles";
import { useAllFetchmanAssignments } from "@/hooks/useFetchmanAssignments";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  Check,
  XCircle,
  Ban,
  User,
  Calendar,
  FileText,
  Upload,
  Trash2,
  Shield,
  Clock,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  Send,
  MessageSquare
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminFetchmanPage() {
  const [selectedFetchman, setSelectedFetchman] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showBlacklistDialog, setShowBlacklistDialog] = useState(false);
  const [showPromoteDialog, setShowPromoteDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState("");
  const [promotionData, setPromotionData] = useState({ newRole: "team_leader", notes: "" });
  const [assignmentData, setAssignmentData] = useState({
    entityType: "event" as "event" | "vendor" | "host",
    entityId: "",
    entityName: "",
    startDate: "",
    endDate: "",
    notes: ""
  });
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageText, setMessageText] = useState("");

  const statusFilter = activeTab !== "all" ? { status: activeTab } : undefined;
  
  const { 
    fetchmen, 
    isLoading: isLoadingFetchmen, 
    refetch, 
    updateStatus, 
    isUpdatingStatus,
    promote,
    isPromoting,
    createAssignment,
    isCreatingAssignment
  } = useAllFetchmanProfiles(statusFilter);

  const { 
    data: assignments, 
    isLoading: isLoadingAssignments
  } = useAllFetchmanAssignments({ entityType: assignmentData.entityType });

  const handleBlacklist = async () => {
    if (selectedFetchman) {
      await updateStatus({
        fetchmanId: selectedFetchman.id,
        action: "blacklist",
        reason: blacklistReason
      });
      setShowBlacklistDialog(false);
      setBlacklistReason("");
    }
  };

  const handlePromote = async () => {
    if (selectedFetchman) {
      await promote({
        fetchmanId: selectedFetchman.id,
        newRole: promotionData.newRole,
        notes: promotionData.notes
      });
      setShowPromoteDialog(false);
      setPromotionData({ newRole: "team_leader", notes: "" });
    }
  };

  const handleCreateAssignment = async () => {
    if (selectedFetchman) {
      await createAssignment({
        fetchmanId: selectedFetchman.id,
        entityType: assignmentData.entityType,
        entityId: assignmentData.entityId,
        startDate: assignmentData.startDate,
        endDate: assignmentData.endDate,
        notes: assignmentData.notes
      });
      setShowAssignDialog(false);
      setAssignmentData({
        entityType: "event",
        entityId: "",
        entityName: "",
        startDate: "",
        endDate: "",
        notes: ""
      });
    }
  };

  const handleSendMessage = () => {
    // Implement message sending logic here
    console.log("Sending message:", messageText);
    setShowMessageDialog(false);
    setMessageText("");
  };

  const statusBadges: Record<string, JSX.Element> = {
    active: <Badge className="bg-green-500">Active</Badge>,
    suspended: <Badge className="bg-yellow-500">Suspended</Badge>,
    pending: <Badge className="bg-blue-500">Pending</Badge>,
    blacklisted: <Badge className="bg-red-500">Blacklisted</Badge>,
  };

  if (isLoadingFetchmen) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-venu-orange mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading Fetchman profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fetchman Management</h1>
        <p className="text-gray-500">Manage fetchmen, their assignments, and promotions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fetchman List Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Fetchmen</CardTitle>
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="suspended">Suspended</TabsTrigger>
                <TabsTrigger value="blacklisted">Blacklisted</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {fetchmen.length > 0 ? (
                  fetchmen.map((fetchman) => (
                    <div
                      key={fetchman.id}
                      className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedFetchman?.id === fetchman.id ? "border-venu-orange bg-venu-orange/5" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedFetchman(fetchman)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{fetchman.user?.email || "No email"}</h3>
                          <p className="text-sm text-gray-500">
                            {fetchman.user?.name || ""} {fetchman.user?.surname || ""}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {statusBadges[fetchman.verification_status] || <Badge>Unknown</Badge>}
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {fetchman.phone_number && (
                          <p>📞 {fetchman.phone_number}</p>
                        )}
                        <p>Role: {fetchman.role || "Fetchman"}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No fetchmen found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Fetchman Detail Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">
              {selectedFetchman ? (
                <div className="flex justify-between items-center">
                  <span>
                    Fetchman Profile: {selectedFetchman.user?.name || ""} {selectedFetchman.user?.surname || ""}
                  </span>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowMessageDialog(true)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" /> Message
                    </Button>
                  </div>
                </div>
              ) : (
                "Select a Fetchman"
              )}
            </CardTitle>
          </CardHeader>

          {!selectedFetchman ? (
            <CardContent className="text-center py-16 text-gray-500">
              <User size={64} className="mx-auto text-gray-300" />
              <p className="mt-4">Select a fetchman from the list to view details</p>
            </CardContent>
          ) : (
            <div>
              <Tabs defaultValue="profile">
                <CardHeader className="px-6 pt-0 pb-2">
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="promotions">Promotions</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                  </TabsList>
                </CardHeader>

                <TabsContent value="profile">
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>First Name</Label>
                            <p className="text-sm">{selectedFetchman.user?.name || "Not provided"}</p>
                          </div>
                          <div>
                            <Label>Last Name</Label>
                            <p className="text-sm">{selectedFetchman.user?.surname || "Not provided"}</p>
                          </div>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <p className="text-sm">{selectedFetchman.user?.email || "Not provided"}</p>
                        </div>
                        <div>
                          <Label>Phone Number</Label>
                          <p className="text-sm">{selectedFetchman.phone_number || "Not provided"}</p>
                        </div>
                        <div>
                          <Label>Address</Label>
                          <p className="text-sm">{selectedFetchman.address || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold">Professional Details</h3>
                        <div>
                          <Label>Current Role</Label>
                          <p className="text-sm font-medium">
                            {selectedFetchman.role || "Fetchman"}
                          </p>
                        </div>
                        <div>
                          <Label>Vehicle Type</Label>
                          <p className="text-sm">
                            {selectedFetchman.vehicle_type || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <Label>Service Area</Label>
                          <p className="text-sm">
                            {selectedFetchman.service_area || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <Label>Work Hours</Label>
                          <p className="text-sm">
                            {selectedFetchman.work_hours || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div className="space-y-2">
                        <h3 className="font-semibold">Mobility & Work Areas</h3>
                        <div>
                          <Label>Has Own Transport</Label>
                          <p className="text-sm">
                            {selectedFetchman.has_own_transport ? "Yes" : "No"}
                          </p>
                        </div>
                        <div>
                          <Label>Mobility Preference</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedFetchman.mobility_preference ? (
                              Object.entries(selectedFetchman.mobility_preference)
                                .filter(([_, value]) => value === true)
                                .map(([key]) => (
                                  <Badge key={key} variant="outline" className="bg-blue-50">
                                    {key.replace('_', ' ')}
                                  </Badge>
                                ))
                            ) : (
                              <span className="text-sm text-gray-500">Not specified</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label>Work Areas</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedFetchman.work_areas && selectedFetchman.work_areas.length > 0 ? (
                              selectedFetchman.work_areas.map((area: string) => (
                                <Badge key={area} variant="outline" className="bg-green-50">
                                  {area}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">Not specified</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold">Emergency Contact</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Name</Label>
                            <p className="text-sm">
                              {selectedFetchman.emergency_contact_name || "Not provided"}
                            </p>
                          </div>
                          <div>
                            <Label>Relationship</Label>
                            <p className="text-sm">
                              {selectedFetchman.emergency_contact_relationship || "Not provided"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <p className="text-sm">
                            {selectedFetchman.emergency_contact_phone || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <p className="text-sm">
                            {selectedFetchman.emergency_contact_email || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-3">Account Control</h3>
                      <div className="flex flex-wrap gap-2">
                        {!selectedFetchman.is_blacklisted && !selectedFetchman.is_suspended && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => updateStatus({
                              fetchmanId: selectedFetchman.id,
                              action: "suspend"
                            })}
                            disabled={isUpdatingStatus}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend Account
                          </Button>
                        )}
                        
                        {selectedFetchman.is_suspended && !selectedFetchman.is_blacklisted && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateStatus({
                              fetchmanId: selectedFetchman.id,
                              action: "reinstate"
                            })}
                            disabled={isUpdatingStatus}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reinstate Account
                          </Button>
                        )}
                        
                        {!selectedFetchman.is_blacklisted && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => setShowBlacklistDialog(true)}
                            disabled={isUpdatingStatus}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Blacklist
                          </Button>
                        )}
                        
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => setShowPromoteDialog(true)}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Promote
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowAssignDialog(true)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Create Assignment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>

                <TabsContent value="assignments">
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">Assignment History</h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowAssignDialog(true)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Create Assignment
                        </Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* This would be populated with actual assignments */}
                          <TableRow>
                            <TableCell>Event</TableCell>
                            <TableCell>Summer Festival</TableCell>
                            <TableCell>2023-06-01</TableCell>
                            <TableCell>2023-06-05</TableCell>
                            <TableCell>
                              <Badge className="bg-green-500">Completed</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Vendor</TableCell>
                            <TableCell>Food Truck Co.</TableCell>
                            <TableCell>2023-05-15</TableCell>
                            <TableCell>2023-05-20</TableCell>
                            <TableCell>
                              <Badge className="bg-green-500">Completed</Badge>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </TabsContent>

                <TabsContent value="documents">
                  <CardContent>
                    <h3 className="font-semibold mb-4">Documents</h3>
                    <div className="space-y-4">
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-3 text-blue-600" />
                            <div>
                              <h4 className="font-medium">Resume.pdf</h4>
                              <p className="text-xs text-gray-500">Uploaded on 2023-05-10</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-500">Approved</Badge>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-3 text-blue-600" />
                            <div>
                              <h4 className="font-medium">Qualification.pdf</h4>
                              <p className="text-xs text-gray-500">Uploaded on 2023-05-12</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-yellow-500">Pending</Badge>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Document
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>

                <TabsContent value="promotions">
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">Promotion History</h3>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => setShowPromoteDialog(true)}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Promote
                        </Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Previous Role</TableHead>
                            <TableHead>New Role</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* This would be populated with actual promotion data */}
                          <TableRow>
                            <TableCell>2023-04-15</TableCell>
                            <TableCell>Fetchman</TableCell>
                            <TableCell>Team Leader</TableCell>
                            <TableCell>Excellent performance during holiday season</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </TabsContent>

                <TabsContent value="messages">
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">Message History</h3>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => setShowMessageDialog(true)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          New Message
                        </Button>
                      </div>
                      <div className="border rounded-md p-4 space-y-4 h-[300px] overflow-y-auto">
                        {/* Admin message */}
                        <div className="flex justify-end">
                          <div className="bg-blue-100 p-3 rounded-lg max-w-[80%]">
                            <p>Hello there! Just checking in about your upcoming assignment.</p>
                            <p className="text-xs text-right text-gray-500 mt-1">
                              Admin - 2023-06-01 10:30
                            </p>
                          </div>
                        </div>
                        
                        {/* Fetchman response */}
                        <div className="flex justify-start">
                          <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                            <p>Hi! Yes, I'm all prepared for it. Looking forward to it!</p>
                            <p className="text-xs text-right text-gray-500 mt-1">
                              Fetchman - 2023-06-01 10:35
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <Input 
                          placeholder="Type your message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                        />
                        <Button onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </Card>
      </div>

      {/* Dialogs */}
      <Dialog open={showBlacklistDialog} onOpenChange={setShowBlacklistDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Blacklist Fetchman</DialogTitle>
            <DialogDescription>
              This action will permanently blacklist this fetchman. They will no longer be able to access the platform or receive assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for blacklisting</Label>
              <Textarea
                id="reason"
                placeholder="Provide a detailed reason for blacklisting this fetchman"
                value={blacklistReason}
                onChange={(e) => setBlacklistReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlacklistDialog(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleBlacklist}
              disabled={blacklistReason.length < 10 || isUpdatingStatus}
            >
              Confirm Blacklist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPromoteDialog} onOpenChange={setShowPromoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promote Fetchman</DialogTitle>
            <DialogDescription>
              Promote this fetchman to a higher role with additional responsibilities.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-role">New Role</Label>
              <Select
                value={promotionData.newRole}
                onValueChange={(value) => setPromotionData({...promotionData, newRole: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team_leader">Team Leader</SelectItem>
                  <SelectItem value="shift_leader">Shift Leader</SelectItem>
                  <SelectItem value="area_leader">Area Leader</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="promotion-notes">Notes</Label>
              <Textarea
                id="promotion-notes"
                placeholder="Add notes about this promotion"
                value={promotionData.notes}
                onChange={(e) => setPromotionData({...promotionData, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPromoteDialog(false)}>Cancel</Button>
            <Button 
              variant="default" 
              onClick={handlePromote}
              disabled={isPromoting}
            >
              Confirm Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Assignment</DialogTitle>
            <DialogDescription>
              Create a new assignment for this fetchman.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="entity-type">Assignment Type</Label>
              <Select
                value={assignmentData.entityType}
                onValueChange={(value: "event" | "vendor" | "host") => 
                  setAssignmentData({...assignmentData, entityType: value})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="host">Host</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entity-id">Select {assignmentData.entityType}</Label>
              <Select
                value={assignmentData.entityId}
                onValueChange={(value) => 
                  setAssignmentData({
                    ...assignmentData, 
                    entityId: value,
                    // This would be replaced with actual name lookup
                    entityName: "Selected Entity Name"
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${assignmentData.entityType}`} />
                </SelectTrigger>
                <SelectContent>
                  {/* This would be populated with actual entities */}
                  <SelectItem value="entity1">Entity 1</SelectItem>
                  <SelectItem value="entity2">Entity 2</SelectItem>
                  <SelectItem value="entity3">Entity 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="datetime-local"
                  value={assignmentData.startDate}
                  onChange={(e) => 
                    setAssignmentData({...assignmentData, startDate: e.target.value})
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="datetime-local"
                  value={assignmentData.endDate}
                  onChange={(e) => 
                    setAssignmentData({...assignmentData, endDate: e.target.value})
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignment-notes">Notes</Label>
              <Textarea
                id="assignment-notes"
                placeholder="Add notes about this assignment"
                value={assignmentData.notes}
                onChange={(e) => 
                  setAssignmentData({...assignmentData, notes: e.target.value})
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
            <Button 
              variant="default" 
              onClick={handleCreateAssignment}
              disabled={
                !assignmentData.entityId || 
                !assignmentData.startDate || 
                !assignmentData.endDate ||
                isCreatingAssignment
              }
            >
              Create Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a direct message to this fetchman.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message-text">Message</Label>
              <Textarea
                id="message-text"
                placeholder="Type your message here"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>Cancel</Button>
            <Button 
              variant="default" 
              onClick={handleSendMessage}
              disabled={messageText.trim().length === 0}
            >
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
