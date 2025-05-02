
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { AlertCircle, Calendar, FileUp, FileCheck, X, Check } from "lucide-react";
import { VendorInvite, RequiredDocument, Event, DocumentType } from "@/types/vendor";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for vendor invites
const mockInvites: VendorInvite[] = [
  {
    id: "inv1",
    vendor_id: "v1",
    host_id: "host1",
    event_id: "event-1",
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    required_documents: [
      {
        id: "doc1",
        invite_id: "inv1",
        document_type: "business_registration",
        name: "Business Registration Documents",
        description: "CIPC Certificate or equivalent document",
        is_required: true,
        status: "pending",
      },
      {
        id: "doc2",
        invite_id: "inv1",
        document_type: "tax_clearance",
        name: "Tax Clearance Certificate",
        description: "SARS Good Standing Certificate",
        is_required: true,
        status: "pending",
      }
    ],
    invitation_message: "We'd love to have your catering services at our Summer Music Festival. Please provide the required documents to confirm your participation.",
  },
  {
    id: "inv2",
    vendor_id: "v2",
    host_id: "host2",
    event_id: "event-3",
    status: "pending",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    required_documents: [
      {
        id: "doc3",
        invite_id: "inv2",
        document_type: "business_registration",
        name: "Business Registration Documents",
        description: "CIPC Certificate or equivalent document",
        is_required: true,
        status: "uploaded",
        file_name: "business_reg.pdf",
        upload_date: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "doc4",
        invite_id: "inv2",
        document_type: "public_liability",
        name: "Public Liability Insurance",
        description: "Valid insurance certificate with coverage details",
        is_required: true,
        status: "pending",
      },
      {
        id: "doc5",
        invite_id: "inv2",
        document_type: "custom",
        name: "Technical Specifications",
        description: "Please provide technical specifications for your sound equipment",
        is_required: true,
        status: "pending",
      }
    ],
    invitation_message: "We need your sound equipment for the wedding expo. Please submit the required documents as soon as possible.",
  }
];

// Mock event data
const mockEvents: Event[] = [
  {
    id: "event-1",
    name: "Summer Music Festival",
    date: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days from now
    endDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    description: "Annual summer music festival featuring local and international artists.",
    status: "upcoming",
    capacity: 500,
    venueId: "venue-1",
    venueName: "Central Park Amphitheater"
  },
  {
    id: "event-3",
    name: "Wedding Expo",
    date: new Date(Date.now() + 86400000 * 39).toISOString(), // 39 days from now
    endDate: new Date(Date.now() + 86400000 * 39).toISOString(),
    description: "Wedding expo showcasing vendors and services for couples planning their big day.",
    status: "upcoming",
    capacity: 200,
    venueId: "venue-2",
    venueName: "Grand Hotel Conference Center"
  }
];

// Mock host data
const mockHosts = [
  {
    id: "host1",
    name: "Event Masters Inc.",
    logo: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1400&auto=format&fit=crop"
  },
  {
    id: "host2",
    name: "Wedding Planners Co.",
    logo: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1400&auto=format&fit=crop"
  }
];

export default function VendorInvitationsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [invites, setInvites] = useState<VendorInvite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeInvite, setActiveInvite] = useState<VendorInvite | null>(null);
  const [uploadDocModalOpen, setUploadDocModalOpen] = useState<boolean>(false);
  const [documentToUpload, setDocumentToUpload] = useState<RequiredDocument | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  useEffect(() => {
    const loadInvites = async () => {
      setLoading(true);
      
      // Simulate API fetch delay
      setTimeout(() => {
        // Filter invites for current vendor (in real app, this would be server-side)
        // For the mock, we'll just return all
        setInvites(mockInvites);
        setLoading(false);
      }, 1000);
    };
    
    loadInvites();
  }, [user]);
  
  const getHostDetails = (hostId: string) => {
    return mockHosts.find(host => host.id === hostId) || { name: "Unknown Host", logo: "" };
  };
  
  const getEventDetails = (eventId: string) => {
    return mockEvents.find(event => event.id === eventId);
  };
  
  const handleUploadDocument = (invite: VendorInvite, document: RequiredDocument) => {
    setActiveInvite(invite);
    setDocumentToUpload(document);
    setUploadDocModalOpen(true);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleSubmitDocument = () => {
    if (!selectedFile || !documentToUpload || !activeInvite) {
      toast({
        title: "Missing File",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    // Mock file upload process
    setTimeout(() => {
      // Update the document in the invite
      const updatedInvites = invites.map(invite => {
        if (invite.id === activeInvite.id) {
          const updatedDocs = invite.required_documents.map(doc => {
            if (doc.id === documentToUpload.id) {
              return {
                ...doc,
                status: "uploaded",
                file_name: selectedFile.name,
                upload_date: new Date().toISOString()
              };
            }
            return doc;
          });
          
          return {
            ...invite,
            required_documents: updatedDocs
          };
        }
        return invite;
      });
      
      setInvites(updatedInvites);
      setUploadDocModalOpen(false);
      setDocumentToUpload(null);
      setSelectedFile(null);
      setSubmitting(false);
      
      toast({
        title: "Document Uploaded",
        description: `${documentToUpload.name} has been successfully uploaded.`
      });
    }, 1500);
  };
  
  const allDocumentsUploaded = (invite: VendorInvite) => {
    return invite.required_documents.every(doc => doc.status === "uploaded");
  };
  
  const handleAcceptInvite = (invite: VendorInvite) => {
    if (!allDocumentsUploaded(invite)) {
      toast({
        title: "Documents Required",
        description: "Please upload all required documents before accepting the invitation",
        variant: "destructive"
      });
      return;
    }
    
    // Update invite status
    const updatedInvites = invites.map(inv => {
      if (inv.id === invite.id) {
        return {
          ...inv,
          status: "accepted",
          updated_at: new Date().toISOString()
        };
      }
      return inv;
    });
    
    setInvites(updatedInvites);
    
    toast({
      title: "Invitation Accepted",
      description: "You have accepted the invitation. The host will review your documents."
    });
  };
  
  const handleRejectInvite = (invite: VendorInvite) => {
    // Update invite status
    const updatedInvites = invites.map(inv => {
      if (inv.id === invite.id) {
        return {
          ...inv,
          status: "rejected",
          updated_at: new Date().toISOString()
        };
      }
      return inv;
    });
    
    setInvites(updatedInvites);
    
    toast({
      title: "Invitation Rejected",
      description: "You have declined the invitation."
    });
  };
  
  return (
    <VendorPanelLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Event Invitations</h1>
            <p className="text-gray-500">Manage invitations from hosts to participate in their events</p>
          </div>
        </div>
        
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {loading ? (
              <div className="grid gap-4">
                {[1, 2].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="bg-gray-200 h-6 w-2/3 rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6">
                {invites.filter(invite => invite.status === "pending").length > 0 ? (
                  invites.filter(invite => invite.status === "pending").map(invite => {
                    const host = getHostDetails(invite.host_id);
                    const event = getEventDetails(invite.event_id);
                    
                    return (
                      <Card key={invite.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {host.logo && (
                                <img
                                  src={host.logo}
                                  alt={host.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              )}
                              <div>
                                <CardTitle>Invitation from {host.name}</CardTitle>
                                <CardDescription>
                                  Received {new Date(invite.created_at).toLocaleDateString()}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge>Pending</Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          {event && (
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                              <div>
                                <h3 className="font-medium">{event.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {new Date(event.date).toLocaleDateString()} at {event.venueName}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {invite.invitation_message && (
                            <div className="px-3">
                              <p className="text-gray-700">{invite.invitation_message}</p>
                            </div>
                          )}
                          
                          <div className="border-t pt-4">
                            <h3 className="font-medium mb-3">Required Documents</h3>
                            <div className="space-y-3">
                              {invite.required_documents.map(document => (
                                <div key={document.id} className="flex items-center justify-between">
                                  <div className="flex items-start gap-3">
                                    {document.status === "uploaded" ? (
                                      <FileCheck className="w-5 h-5 text-green-500 mt-0.5" />
                                    ) : (
                                      <FileUp className="w-5 h-5 text-amber-500 mt-0.5" />
                                    )}
                                    <div>
                                      <h4 className="font-medium">{document.name}</h4>
                                      <p className="text-sm text-gray-600">{document.description}</p>
                                      {document.status === "uploaded" && (
                                        <p className="text-sm text-green-600 mt-1">
                                          Uploaded: {document.file_name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {document.status === "uploaded" ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUploadDocument(invite, document)}
                                    >
                                      Replace
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      onClick={() => handleUploadDocument(invite, document)}
                                    >
                                      Upload
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            onClick={() => handleRejectInvite(invite)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject Invitation
                          </Button>
                          <Button 
                            onClick={() => handleAcceptInvite(invite)}
                            disabled={!allDocumentsUploaded(invite)}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Accept & Submit
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">No Pending Invitations</h3>
                    <p className="text-gray-500 mt-1">You don't have any pending event invitations at the moment.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="accepted">
            <div className="grid gap-6">
              {invites.filter(invite => invite.status === "accepted").length > 0 ? (
                invites.filter(invite => invite.status === "accepted").map(invite => {
                  const host = getHostDetails(invite.host_id);
                  const event = getEventDetails(invite.event_id);
                  
                  return (
                    <Card key={invite.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {host.logo && (
                              <img
                                src={host.logo}
                                alt={host.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <CardTitle>Invitation from {host.name}</CardTitle>
                              <CardDescription>
                                {event?.name} - {new Date(event?.date || "").toLocaleDateString()}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="mb-4">Your documents have been submitted and are being reviewed by the host.</p>
                        <div className="bg-blue-50 p-3 rounded-md text-blue-800 text-sm">
                          <p>You'll receive a notification once the review is complete.</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No Accepted Invitations</h3>
                  <p className="text-gray-500 mt-1">You haven't accepted any event invitations yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="rejected">
            <div className="grid gap-6">
              {invites.filter(invite => invite.status === "rejected").length > 0 ? (
                invites.filter(invite => invite.status === "rejected").map(invite => {
                  const host = getHostDetails(invite.host_id);
                  const event = getEventDetails(invite.event_id);
                  
                  return (
                    <Card key={invite.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <CardTitle>Invitation from {host.name}</CardTitle>
                              <CardDescription>
                                {event?.name} - {new Date(event?.date || "").toLocaleDateString()}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant="destructive">Rejected</Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-gray-600">You declined this invitation.</p>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No Rejected Invitations</h3>
                  <p className="text-gray-500 mt-1">You haven't rejected any event invitations.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="confirmed">
            <div className="grid gap-6">
              {invites.filter(invite => invite.status === "confirmed" || invite.status === "paid").length > 0 ? (
                invites.filter(invite => invite.status === "confirmed" || invite.status === "paid").map(invite => {
                  const host = getHostDetails(invite.host_id);
                  const event = getEventDetails(invite.event_id);
                  
                  return (
                    <Card key={invite.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <CardTitle>Invitation from {host.name}</CardTitle>
                              <CardDescription>
                                {event?.name} - {new Date(event?.date || "").toLocaleDateString()}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {invite.status === "confirmed" ? "Confirmed" : "Paid"}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {invite.status === "confirmed" ? (
                          <div>
                            <p className="mb-4">Your documents have been approved! To confirm your participation, please pay the stall fee.</p>
                            <div className="bg-amber-50 p-4 rounded-md mb-4">
                              <h4 className="font-medium mb-2">Payment Required</h4>
                              <p className="text-amber-800">Stall Fee: R{invite.payment_amount || 250}</p>
                            </div>
                            <Button>Make Payment</Button>
                          </div>
                        ) : (
                          <div className="bg-green-50 p-4 rounded-md">
                            <h4 className="font-medium mb-2">Payment Completed</h4>
                            <p className="text-green-800">Your participation is confirmed. See you at the event!</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No Confirmed Invitations</h3>
                  <p className="text-gray-500 mt-1">You don't have any confirmed event invitations yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Document Upload Modal */}
      <Dialog open={uploadDocModalOpen} onOpenChange={setUploadDocModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{documentToUpload?.name || "Upload Document"}</DialogTitle>
            <DialogDescription>
              {documentToUpload?.description || "Please upload the required document"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="document-upload">Document</Label>
              <Input 
                id="document-upload" 
                type="file" 
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <p className="text-xs text-gray-500">
                Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max: 10MB)
              </p>
            </div>
            
            {selectedFile && (
              <div className="bg-blue-50 p-3 rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800">{selectedFile.name}</span>
                </div>
                <span className="text-sm text-blue-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDocModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitDocument} 
              disabled={!selectedFile || submitting}
            >
              {submitting ? "Uploading..." : "Upload Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </VendorPanelLayout>
  );
}
