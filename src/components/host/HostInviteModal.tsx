
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, FileCheck, AlertTriangle } from "lucide-react";
import { Event, VendorProfile, DocumentType } from "@/types/vendor";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Mock upcoming events - in a real app, fetch these from your API
import { dummyEvents } from "@/data/hostDummyData";

interface HostInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorProfile: VendorProfile;
}

interface DocumentRequirement {
  type: DocumentType;
  name: string;
  description: string;
  required: boolean;
  customDescription?: string;
}

export default function HostInviteModal({ isOpen, onClose, vendorProfile }: HostInviteModalProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [customDocName, setCustomDocName] = useState<string>("");
  const [customDocDesc, setCustomDocDesc] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Filter for upcoming events only
  const upcomingEvents = dummyEvents.filter(event => 
    event.status === "upcoming" || event.status === "planning"
  );

  // Document requirements configuration
  const [documentRequirements, setDocumentRequirements] = useState<DocumentRequirement[]>([
    {
      type: "business_registration",
      name: "Business Registration Documents",
      description: "CIPC Certificate or equivalent document",
      required: false
    },
    {
      type: "tax_clearance",
      name: "Tax Clearance Certificate",
      description: "SARS Good Standing Certificate",
      required: false
    },
    {
      type: "proof_of_address",
      name: "Proof of Business Address",
      description: "Utility bill or lease agreement not older than 3 months",
      required: false
    },
    {
      type: "health_safety",
      name: "Health & Safety Compliance Certificate",
      description: "For food/health vendors only",
      required: false
    },
    {
      type: "public_liability",
      name: "Public Liability Insurance",
      description: "Valid insurance certificate with coverage details",
      required: false
    },
    {
      type: "bank_letter",
      name: "Bank Account Confirmation Letter",
      description: "Bank issued letter confirming account details",
      required: false
    }
  ]);

  const handleSendInvite = async () => {
    if (!selectedEvent) {
      toast({
        title: "Event Selection Required",
        description: "Please select an event for this invitation",
        variant: "destructive"
      });
      return;
    }

    // Check if at least one document is required
    const hasRequiredDocuments = documentRequirements.some(doc => doc.required);
    
    // For now we allow invitations without document requirements
    // but you could enforce at least one document if needed

    try {
      setIsSubmitting(true);

      // Get selected event details
      const event = upcomingEvents.find(e => e.id === selectedEvent);

      // Gather all document requirements, including custom ones
      const allRequirements = [...documentRequirements];
      
      // Add custom document if description is provided
      if (customDocName && customDocDesc) {
        allRequirements.push({
          type: "custom",
          name: customDocName,
          description: customDocDesc,
          required: true
        });
      }

      // Filter only required documents
      const requiredDocs = allRequirements.filter(doc => doc.required);

      // Mock API call to send invitation
      // In a real app, replace with actual API call
      setTimeout(() => {
        console.log("Sending invitation to vendor:", {
          vendorId: vendorProfile.id,
          hostId: user?.id,
          eventId: selectedEvent,
          event: event?.name,
          message,
          requiredDocuments: requiredDocs
        });

        toast({
          title: "Invitation Sent",
          description: `Invitation sent to ${vendorProfile.business_name || vendorProfile.company_name} for ${event?.name}`,
        });

        setIsSubmitting(false);
        resetForm();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: "There was a problem sending the invitation. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedEvent("");
    setMessage("");
    setCustomDocName("");
    setCustomDocDesc("");
    setDocumentRequirements(documentRequirements.map(doc => ({
      ...doc, 
      required: false
    })));
  };

  const toggleDocumentRequirement = (index: number) => {
    const updatedRequirements = [...documentRequirements];
    updatedRequirements[index].required = !updatedRequirements[index].required;
    setDocumentRequirements(updatedRequirements);
  };

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite Vendor to Event</DialogTitle>
          <DialogDescription>
            {vendorProfile.business_name || vendorProfile.company_name || "Vendor"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event" className="text-right">
              Event
            </Label>
            <Select
              value={selectedEvent}
              onValueChange={setSelectedEvent}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name} - {new Date(event.date).toLocaleDateString()}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-events" disabled>
                    No upcoming events available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="message" className="text-right pt-2">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Add a message for the vendor..."
              className="col-span-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-4">Required Documentation</h3>
            <div className="space-y-4">
              {documentRequirements.map((doc, index) => (
                <div key={doc.type} className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={doc.required}
                        onCheckedChange={() => toggleDocumentRequirement(index)}
                      />
                      <Label htmlFor={`doc-${doc.type}`} className="font-medium">
                        {doc.name}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500 ml-10">{doc.description}</p>
                  </div>
                  {doc.required && (
                    <div className="flex text-sm text-green-600 items-center">
                      <FileCheck className="h-4 w-4 mr-1" />
                      <span>Required</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-4">Custom Document Requirement</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customDocName" className="text-right">
                  Document Name
                </Label>
                <Input
                  id="customDocName"
                  placeholder="e.g. Special Event Permit"
                  className="col-span-3"
                  value={customDocName}
                  onChange={(e) => setCustomDocName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="customDocDesc" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="customDocDesc"
                  placeholder="Describe the required document..."
                  className="col-span-3"
                  value={customDocDesc}
                  onChange={(e) => setCustomDocDesc(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendInvite} 
            disabled={isSubmitting || !selectedEvent}
          >
            {isSubmitting ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
