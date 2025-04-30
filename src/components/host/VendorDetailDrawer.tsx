
import React, { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import { VendorProfile, Message } from "@/types/vendor";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import MessageThread from "@/components/messaging/MessageThread";
import { useToast } from "@/components/ui/use-toast";

interface VendorDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId?: string | null;
  vendorUserId?: string | null;
}

export default function VendorDetailDrawer({
  isOpen,
  onClose,
  vendorId,
  vendorUserId,
}: VendorDetailDrawerProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (isOpen && vendorId) {
      fetchVendorDetails();
      fetchRecentMessages();
    }
  }, [isOpen, vendorId]);

  const fetchVendorDetails = async () => {
    if (!vendorId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("id", vendorId)
        .single();

      if (error) {
        throw error;
      }

      setVendor(data as VendorProfile);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      toast({
        title: "Error",
        description: "Failed to load vendor details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentMessages = async () => {
    if (!user || !vendorUserId) return;
    
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .or(`sender_id.eq.${vendorUserId},recipient_id.eq.${vendorUserId}`)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        throw error;
      }

      setRecentMessages(data as Message[]);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || !vendorUserId) return;
    
    try {
      setSendingMessage(true);
      
      const newMessage = {
        sender_id: user.id,
        recipient_id: vendorUserId,
        sender_role: 'host',
        recipient_role: 'vendor',
        content,
        is_read: false
      };
      
      const { error } = await supabase
        .from("messages")
        .insert(newMessage);

      if (error) {
        throw error;
      }

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully",
      });
      
      // Refresh messages
      fetchRecentMessages();
      setMessageDialogOpen(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };
  
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    invited: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    paused: "bg-gray-100 text-gray-800",
  };

  const getSetupStageText = (stage?: string) => {
    switch (stage) {
      case "welcome":
        return "Welcome";
      case "profile":
        return "Profile Setup";
      case "services":
        return "Services Setup";
      case "pricing":
        return "Pricing Setup";
      case "live":
        return "Live";
      default:
        return "Onboarding";
    }
  };

  const getSetupProgress = (stage?: string) => {
    switch (stage) {
      case "welcome":
        return 10;
      case "profile":
        return 30;
      case "services":
        return 60;
      case "pricing":
        return 90;
      case "live":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-[95%] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Vendor Details</SheetTitle>
          <SheetDescription>View vendor information and interactions</SheetDescription>
        </SheetHeader>
        
        {loading ? (
          <div className="space-y-4 mt-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : vendor ? (
          <div className="mt-6 space-y-6">
            {/* Profile Summary */}
            <div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-4 rounded-full">
                  <Store className="h-8 w-8 text-venu-orange" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-xl">
                        {vendor.business_name || vendor.company_name || "Unnamed Vendor"}
                      </h3>
                      <p className="text-gray-500">
                        {vendor.business_category || "Miscellaneous"}
                      </p>
                    </div>
                    <Badge className={statusColors[vendor.status] || "bg-gray-100"}>
                      {vendor.status?.charAt(0).toUpperCase() + vendor.status?.slice(1) || "Unknown"}
                    </Badge>
                  </div>
                  
                  {vendor.description && (
                    <p className="mt-3 text-sm text-gray-700">
                      {vendor.description}
                    </p>
                  )}
                  
                  <div className="mt-4 space-y-2 text-sm">
                    {vendor.address && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {vendor.address}
                        {vendor.city && `, ${vendor.city}`}
                        {vendor.state && `, ${vendor.state}`}
                      </div>
                    )}
                    {vendor.contact_phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {vendor.contact_phone}
                      </div>
                    )}
                    {vendor.contact_email && (
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {vendor.contact_email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Setup Status */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Setup Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{getSetupStageText(vendor.setup_stage)}</span>
                  <span>{getSetupProgress(vendor.setup_stage)}%</span>
                </div>
                <Progress value={getSetupProgress(vendor.setup_stage)} className="h-2" />
              </div>
            </div>
            
            {/* Recent Interactions */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Recent Interactions</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex items-center"
                  onClick={() => setMessageDialogOpen(true)}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  View All
                </Button>
              </div>
              
              {recentMessages.length > 0 ? (
                <div className="space-y-3">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="border rounded-md p-3 text-sm bg-white">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>
                              {message.sender_role === "host" ? "H" : "V"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {message.sender_role === "host" ? "You" : vendor.company_name || "Vendor"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700 truncate">
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border rounded-md bg-white">
                  <MessageSquare className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No recent messages</p>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => setMessageDialogOpen(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>Vendor not found or no longer available.</p>
          </div>
        )}
      </SheetContent>
      
      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Messages with {vendor?.business_name || vendor?.company_name || "Vendor"}
            </DialogTitle>
          </DialogHeader>
          {user && vendorUserId && (
            <div className="h-full mt-4">
              <MessageThread
                messages={recentMessages}
                currentUserId={user.id}
                currentUserRole="host"
                contactName={vendor?.business_name || vendor?.company_name || "Vendor"}
                onSendMessage={sendMessage}
                isLoading={sendingMessage}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
