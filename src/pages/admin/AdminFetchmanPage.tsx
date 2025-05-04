
import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAllFetchmanProfiles } from "@/hooks/useAllFetchmanProfiles";
import { useAllFetchmanAssignments } from "@/hooks/useFetchmanAssignments";
import { format } from "date-fns";
import {
  Ban,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Filter,
  FileText,
  Layers,
  MapPin,
  MessageSquare,
  PlusCircle,
  RefreshCcw,
  Search,
  ShieldAlert,
  Trash2,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFetchmanMessages } from "@/hooks/useFetchmanMessages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

// Component for Fetchman Profile Tab
function FetchmanProfileTab({ fetchman, onUpdate }: { fetchman: any, onUpdate: () => void }) {
  const { toast } = useToast();
  const { updateStatus } = useAllFetchmanProfiles();
  const [isBlacklistDialogOpen, setIsBlacklistDialogOpen] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState("");
  
  const handleStatusChange = async (action: 'suspend' | 'reinstate') => {
    updateStatus({ fetchmanId: fetchman.id, action });
  };
  
  const handleBlacklist = async () => {
    if (!blacklistReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for blacklisting",
        variant: "destructive"
      });
      return;
    }
    
    updateStatus({
      fetchmanId: fetchman.id,
      action: 'blacklist',
      reason: blacklistReason
    });
    setIsBlacklistDialogOpen(false);
    setBlacklistReason("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Status</p>
                {fetchman.is_blacklisted ? (
                  <Badge variant="destructive" className="mt-1">Blacklisted</Badge>
                ) : fetchman.is_suspended ? (
                  <Badge variant="destructive" className="mt-1">Suspended</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-100 text-green-800 mt-1">Active</Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Account Controls</p>
                <div className="flex flex-col space-y-2">
                  {!fetchman.is_suspended && !fetchman.is_blacklisted ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="justify-start" 
                      onClick={() => handleStatusChange('suspend')}
                    >
                      <Ban className="mr-2 h-4 w-4" /> Suspend Account
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="justify-start"
                      onClick={() => handleStatusChange('reinstate')}
                    >
                      <UserCheck className="mr-2 h-4 w-4" /> Reinstate Account
                    </Button>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="justify-start">
                        <ShieldAlert className="mr-2 h-4 w-4" /> Blacklist Fetchman
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Blacklist Fetchman</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will permanently blacklist the fetchman. They will no longer be able to receive assignments.
                          Please provide a reason for blacklisting.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-2 py-4">
                        <Label htmlFor="blacklist-reason">Reason for Blacklisting</Label>
                        <Textarea 
                          id="blacklist-reason"
                          value={blacklistReason}
                          onChange={(e) => setBlacklistReason(e.target.value)}
                          placeholder="Enter a detailed reason for blacklisting this fetchman"
                          className="h-32"
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBlacklist}>Blacklist Fetchman</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p>{fetchman.profiles?.name || '-'} {fetchman.profiles?.surname || ''}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{fetchman.profiles?.email || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p>{fetchman.phone_number || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">ID Number</p>
                <p>{fetchman.identity_number || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p>{fetchman.address || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Verification Status</p>
                <Badge className="mt-1">
                  {fetchman.verification_status || 'Pending'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Fetchman Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Vehicle Type</p>
                <p className="capitalize">{fetchman.vehicle_type || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Work Hours</p>
                <p className="capitalize">{fetchman.work_hours?.replace('_', ' ') || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Service Area</p>
                <p className="capitalize">{fetchman.service_area || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Has Own Transport</p>
                <p>{fetchman.has_own_transport ? 'Yes' : 'No'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Reachable Work Areas</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {fetchman.work_areas && fetchman.work_areas.length > 0 ? (
                    fetchman.work_areas.map((area: string) => (
                      <Badge key={area} variant="outline" className="capitalize">
                        {area}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500">None specified</span>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Mobility Preference</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {fetchman.mobility_preference ? (
                    Object.entries(fetchman.mobility_preference)
                      .filter(([_, value]) => value === true)
                      .map(([key]) => (
                        <Badge key={key} variant="outline" className="capitalize">
                          {key.replace('_', ' ')}
                        </Badge>
                      ))
                  ) : (
                    <span className="text-gray-500">None specified</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p>{fetchman.emergency_contact_name || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Relationship</p>
                <p className="capitalize">{fetchman.emergency_contact_relationship || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{fetchman.emergency_contact_phone || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{fetchman.emergency_contact_email || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Banking Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Bank Name</p>
              <p className="capitalize">{fetchman.bank_name?.replace('_', ' ') || '-'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Account Number</p>
              <p>{fetchman.bank_account_number || '-'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Branch Code</p>
              <p>{fetchman.branch_code || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchman.cv_url ? (
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center border p-3 rounded-md">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">CV / Resume</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(fetchman.cv_url, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" /> View
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No documents uploaded</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Component for Assignments Management Tab
function AssignmentsTab({ fetchman }: { fetchman: any }) {
  const { data: assignments, isLoading, refetch } = useFetchmanAssignments(fetchman.id);
  const { createAssignment } = useAllFetchmanProfiles();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    entityType: "event" as "event" | "vendor" | "host",
    entityId: "",
    startDate: "",
    endDate: "",
    notes: "",
    briefFile: null as File | null
  });
  
  const [events, setEvents] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [hosts, setHosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState({
    events: false,
    vendors: false,
    hosts: false
  });
  
  const loadEntities = async (type: 'event' | 'vendor' | 'host') => {
    setIsLoading(prev => ({ ...prev, [type + 's']: true }));
    
    try {
      let data;
      
      if (type === 'event') {
        const { data: eventsData, error } = await supabase
          .from('events')
          .select('id, name')
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (error) throw error;
        data = eventsData;
        setEvents(data);
      } 
      else if (type === 'vendor') {
        const { data: vendorsData, error } = await supabase
          .from('vendor_profiles')
          .select('id, company_name')
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (error) throw error;
        data = vendorsData;
        setVendors(data);
      }
      else if (type === 'host') {
        const { data: hostsData, error } = await supabase
          .from('host_profiles')
          .select('id, company_name')
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (error) throw error;
        data = hostsData;
        setHosts(data);
      }
    } catch (error) {
      console.error(`Error loading ${type}s:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${type} data.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [type + 's']: false }));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewAssignment(prev => ({
        ...prev,
        briefFile: e.target.files![0]
      }));
    }
  };
  
  const handleInputChange = (field: string, value: any) => {
    setNewAssignment(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If entity type changes, load the corresponding entities
    if (field === 'entityType') {
      loadEntities(value);
    }
  };
  
  const handleCreateAssignment = async () => {
    const { entityType, entityId, startDate, endDate, notes, briefFile } = newAssignment;
    
    if (!entityType || !entityId || !startDate || !endDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    let briefUrl;
    
    // Upload brief file if provided
    if (briefFile) {
      const fileExt = briefFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `assignments/${fetchman.id}/${fileName}`;
      
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('fetchman_documents')
          .upload(filePath, briefFile);
          
        if (uploadError) {
          console.error("Error uploading brief:", uploadError);
          toast({
            title: "Upload Failed",
            description: "Failed to upload brief document",
            variant: "destructive"
          });
          return;
        }
        
        // Get public URL
        const { data: urlData } = await supabase.storage
          .from('fetchman_documents')
          .getPublicUrl(filePath);
          
        briefUrl = urlData.publicUrl;
      } catch (error) {
        console.error("Error in file upload:", error);
        toast({
          title: "Upload Error",
          description: "An error occurred during file upload",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Create the assignment
    createAssignment({
      fetchmanId: fetchman.id,
      entityType,
      entityId,
      startDate,
      endDate,
      notes,
      briefUrl
    });
    
    // Reset form and close dialog
    setNewAssignment({
      entityType: "event",
      entityId: "",
      startDate: "",
      endDate: "",
      notes: "",
      briefFile: null
    });
    
    setIsCreateDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Assignment Management</h3>
        <div className="flex gap-2">
          <Button onClick={() => refetch()}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Assignment
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Assignment History</CardTitle>
          <CardDescription>
            All assignments for this fetchman
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">Loading assignments...</p>
            </div>
          ) : assignments?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Brief</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map(assignment => (
                  <TableRow key={assignment.id}>
                    <TableCell className="capitalize">
                      {assignment.entity_type}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">
                          {format(new Date(assignment.start_date), 'dd MMM')} - {format(new Date(assignment.end_date), 'dd MMM yyyy')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          assignment.status === 'completed' ? 'outline' : 
                          assignment.status === 'active' ? 'default' : 
                          'secondary'
                        }
                      >
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {assignment.notes || '-'}
                    </TableCell>
                    <TableCell>
                      {assignment.brief_url ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(assignment.brief_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">No assignments found</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Create Assignment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Assign this fetchman to an event, vendor, or host
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="entity-type">Assignment Type</Label>
              <Select 
                value={newAssignment.entityType}
                onValueChange={(value) => handleInputChange('entityType', value)}
              >
                <SelectTrigger id="entity-type">
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="host">Host</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entity-id">
                {newAssignment.entityType === 'event' ? 'Select Event' : 
                 newAssignment.entityType === 'vendor' ? 'Select Vendor' : 'Select Host'}
              </Label>
              <Select 
                disabled={!newAssignment.entityType}
                value={newAssignment.entityId}
                onValueChange={(value) => handleInputChange('entityId', value)}
              >
                <SelectTrigger id="entity-id">
                  <SelectValue placeholder={`Select ${newAssignment.entityType}`} />
                </SelectTrigger>
                <SelectContent>
                  {newAssignment.entityType === 'event' && 
                   events.map(event => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                   ))
                  }
                  {newAssignment.entityType === 'vendor' && 
                   vendors.map(vendor => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.company_name || `Vendor ${vendor.id.slice(0, 8)}`}
                    </SelectItem>
                   ))
                  }
                  {newAssignment.entityType === 'host' && 
                   hosts.map(host => (
                    <SelectItem key={host.id} value={host.id}>
                      {host.company_name || `Host ${host.id.slice(0, 8)}`}
                    </SelectItem>
                   ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input 
                  id="start-date" 
                  type="datetime-local" 
                  value={newAssignment.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input 
                  id="end-date" 
                  type="datetime-local"
                  value={newAssignment.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Assignment Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any special instructions or details"
                value={newAssignment.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brief-file">Upload Brief (Optional)</Label>
              <Input 
                id="brief-file" 
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <p className="text-xs text-gray-500">Max file size: 5MB. Supported formats: PDF, DOC, DOCX</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAssignment}>
              Create Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Component for Direct Messaging Tab
function MessagingTab({ fetchman }: { fetchman: any }) {
  const { messages, isLoading, sendMessage, markAsRead } = useFetchmanMessages(fetchman.id);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Mark all admin messages as read
    const unreadMessages = messages
      .filter(m => m.sender_role === 'fetchman' && !m.read)
      .map(m => m.id);
      
    if (unreadMessages.length > 0) {
      markAsRead(unreadMessages);
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    sendMessage({ message: newMessage });
    setNewMessage("");
  };
  
  // Format the conversation into grouped threads
  const messagesByDate = messages.reduce((groups: any, message: any) => {
    const date = new Date(message.sent_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  return (
    <div className="space-y-4">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle>Direct Messages</CardTitle>
          <CardDescription>
            Communicate directly with this fetchman
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col h-full">
          <ScrollArea className="flex-1 pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-8">
                {Object.entries(messagesByDate).map(([date, msgs]) => (
                  <div key={date} className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-gray-500">
                          {date === new Date().toLocaleDateString() ? 'Today' : date}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {(msgs as any[]).map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`
                              max-w-[80%] rounded-lg p-3 
                              ${message.sender_role === 'admin' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-secondary border border-gray-200'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {message.sender_role === 'fetchman' && (
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {fetchman.profiles?.name?.[0]}{fetchman.profiles?.surname?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <span className="text-xs font-medium">
                                {message.sender_role === 'admin' ? 'You' : 'Fetchman'}
                              </span>
                              <span className="text-xs opacity-70">
                                {format(new Date(message.sent_at), 'HH:mm')}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap">{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                <h3 className="font-medium">No messages yet</h3>
                <p className="text-gray-500">Start a conversation with this fetchman</p>
              </div>
            )}
          </ScrollArea>
          
          <div className="mt-auto pt-4 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Component for Promotion History Tab
function PromotionsTab({ fetchman }: { fetchman: any }) {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPromoting, setIsPromoting] = useState(false);
  const [promotionDetails, setPromotionDetails] = useState({
    role: "",
    notes: ""
  });
  const { toast } = useToast();
  const { promote } = useAllFetchmanProfiles();
  
  React.useEffect(() => {
    fetchPromotions();
  }, [fetchman.id]);
  
  const fetchPromotions = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('fetchman_promotions')
        .select('*')
        .eq('fetchman_id', fetchman.id)
        .order('promotion_date', { ascending: false });
        
      if (error) throw error;
      
      setPromotions(data || []);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast({
        title: "Error",
        description: "Failed to load promotion history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePromote = async () => {
    if (!promotionDetails.role) {
      toast({
        title: "Missing Role",
        description: "Please select a role for promotion",
        variant: "destructive"
      });
      return;
    }
    
    setIsPromoting(true);
    
    try {
      await promote({
        fetchmanId: fetchman.id,
        newRole: promotionDetails.role,
        notes: promotionDetails.notes
      });
      
      // Reset form
      setPromotionDetails({
        role: "",
        notes: ""
      });
      
      // Refresh promotions
      fetchPromotions();
    } finally {
      setIsPromoting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Promote Fetchman</CardTitle>
          <CardDescription>
            Promote this fetchman to a new role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="promotion-role">New Role</Label>
              <Select
                value={promotionDetails.role}
                onValueChange={(value) => setPromotionDetails(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger id="promotion-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team_leader">Team Leader</SelectItem>
                  <SelectItem value="shift_leader">Shift Leader</SelectItem>
                  <SelectItem value="area_leader">Area Leader</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="promotion-notes">Notes</Label>
              <Textarea
                id="promotion-notes"
                placeholder="Promotion reason or additional notes"
                value={promotionDetails.notes}
                onChange={(e) => setPromotionDetails(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            
            <div className="md:col-span-2">
              <Button onClick={handlePromote} disabled={isPromoting}>
                {isPromoting ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Promote Fetchman
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Promotion History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">Loading promotion history...</p>
            </div>
          ) : promotions.length > 0 ? (
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
                {promotions.map(promotion => (
                  <TableRow key={promotion.id}>
                    <TableCell>
                      {format(new Date(promotion.promotion_date), 'PPP')}
                    </TableCell>
                    <TableCell className="capitalize">
                      {promotion.previous_role?.replace('_', ' ') || 'Fetchman'}
                    </TableCell>
                    <TableCell className="capitalize">
                      {promotion.new_role.replace('_', ' ')}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {promotion.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">No promotion history found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminFetchmanPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFetchman, setSelectedFetchman] = useState<any>(null);
  const { fetchmen, isLoading, refetch } = useAllFetchmanProfiles();
  
  const filteredFetchmen = React.useMemo(() => {
    if (!searchQuery.trim()) return fetchmen;
    
    return fetchmen.filter(fetchman => {
      const name = `${fetchman.profiles?.name || ''} ${fetchman.profiles?.surname || ''}`.toLowerCase();
      const email = fetchman.profiles?.email?.toLowerCase() || '';
      const phone = fetchman.phone_number?.toLowerCase() || '';
      
      const query = searchQuery.toLowerCase();
      
      return name.includes(query) || 
             email.includes(query) || 
             phone.includes(query);
    });
  }, [fetchmen, searchQuery]);
  
  const viewFetchmanProfile = (fetchman: any) => {
    setSelectedFetchman(fetchman);
    setActiveTab("profile");
  };
  
  const handleBackToList = () => {
    setActiveTab("list");
    setSelectedFetchman(null);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Fetchman Management</h1>
          <p className="text-gray-500">Manage all fetchmen and their assignments</p>
        </div>
        
        {activeTab === "list" ? (
          <Button onClick={() => refetch()}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        ) : (
          <Button variant="outline" onClick={handleBackToList}>
            <Users className="mr-2 h-4 w-4" /> Back to List
          </Button>
        )}
      </div>
      
      {activeTab === "list" ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search fetchmen by name, email, or phone..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Fetchmen</DropdownMenuItem>
                <DropdownMenuItem>Active</DropdownMenuItem>
                <DropdownMenuItem>Suspended</DropdownMenuItem>
                <DropdownMenuItem>Blacklisted</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Service Area</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading fetchmen...
                      </TableCell>
                    </TableRow>
                  ) : filteredFetchmen.length > 0 ? (
                    filteredFetchmen.map(fetchman => (
                      <TableRow key={fetchman.id}>
                        <TableCell>
                          <div className="font-medium">
                            {fetchman.profiles?.name} {fetchman.profiles?.surname}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {fetchman.id.slice(0, 8)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{fetchman.profiles?.email}</div>
                          <div className="text-sm text-gray-500">
                            {fetchman.phone_number || 'No phone'}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">
                          {fetchman.service_area || '-'}
                        </TableCell>
                        <TableCell>
                          {fetchman.is_blacklisted ? (
                            <Badge variant="destructive">Blacklisted</Badge>
                          ) : fetchman.is_suspended ? (
                            <Badge variant="destructive">Suspended</Badge>
                          ) : (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewFetchmanProfile(fetchman)}
                          >
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        {searchQuery 
                          ? 'No fetchmen match your search query' 
                          : 'No fetchmen found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        selectedFetchman && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold">
                {selectedFetchman.profiles?.name} {selectedFetchman.profiles?.surname}
              </h2>
              {selectedFetchman.is_blacklisted ? (
                <Badge variant="destructive">Blacklisted</Badge>
              ) : selectedFetchman.is_suspended ? (
                <Badge variant="destructive">Suspended</Badge>
              ) : (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              )}
            </div>
            
            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="messaging">Messaging</TabsTrigger>
                <TabsTrigger value="promotions">Promotions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <FetchmanProfileTab fetchman={selectedFetchman} onUpdate={refetch} />
              </TabsContent>
              <TabsContent value="assignments">
                <AssignmentsTab fetchman={selectedFetchman} />
              </TabsContent>
              <TabsContent value="messaging">
                <MessagingTab fetchman={selectedFetchman} />
              </TabsContent>
              <TabsContent value="promotions">
                <PromotionsTab fetchman={selectedFetchman} />
              </TabsContent>
            </Tabs>
          </div>
        )
      )}
    </div>
  );
}
