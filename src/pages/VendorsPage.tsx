
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import VendorManagement from "@/components/host/VendorManagement";
import VendorDiscovery from "@/components/VendorDiscovery";
import VendorPricingManager from "@/components/host/VendorPricingManager";
import { Store, Search, QrCode, Share2 } from "lucide-react";
import VendorInviteQR from "@/components/VendorInviteQR";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export default function VendorsPage() {
  const [activeTab, setActiveTab] = useState("manage");
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState("");
  const [selectedPriceName, setSelectedPriceName] = useState("");
  const [pricingPlans, setPricingPlans] = useState([]);
  const location = useLocation();
  const { user } = useUser();

  // Set price plan based on selection
  const handlePriceChange = (priceId: string) => {
    setSelectedPriceId(priceId);
    const selectedPlan = pricingPlans.find(plan => plan.id === priceId);
    if (selectedPlan) {
      setSelectedPriceName(selectedPlan.name);
    }
  };

  // Load pricing plans from database
  const loadPricingPlans = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('vendor_pricing_plans')
        .select('*')
        .eq('plan_type', 'venue')
        .order('price', { ascending: true });

      if (error) throw error;
      
      setPricingPlans(data || []);
      
      // Set default selection to first plan if available
      if (data && data.length > 0 && !selectedPriceId) {
        setSelectedPriceId(data[0].id);
        setSelectedPriceName(data[0].name);
      }
    } catch (error) {
      console.error('Error loading pricing plans:', error);
      toast({
        title: "Error",
        description: "Failed to load pricing plans",
        variant: "destructive"
      });
    }
  };

  // Load pricing plans on component mount
  useEffect(() => {
    loadPricingPlans();
  }, [user]);

  // Handle plans update from the pricing manager
  const handlePlanChange = (newPlans) => {
    setPricingPlans(newPlans);
    // Update selected plan if needed
    if (newPlans.length > 0) {
      if (!selectedPriceId || !newPlans.some(plan => plan.id === selectedPriceId)) {
        setSelectedPriceId(newPlans[0].id);
        setSelectedPriceName(newPlans[0].name);
      }
    } else {
      setSelectedPriceId("");
      setSelectedPriceName("");
    }
  };

  // Check if we have a venueId passed in state when redirecting from venue page
  useEffect(() => {
    if (location.state?.venueId) {
      // Could set filter by venue here
    }
  }, [location.state]);

  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Vendor Management</h1>
            <p className="text-gray-500">Manage and discover vendors for your venues and events</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={() => setQrDialogOpen(true)}>
              <QrCode className="h-4 w-4 mr-2" />
              Invitation QR
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="manage" className="flex items-center gap-1">
              <Store className="h-4 w-4" />
              <span>Manage</span>
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-1">
              <Search className="h-4 w-4" />
              <span>Discover</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span>Pricing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage">
            <VendorManagement />
          </TabsContent>

          <TabsContent value="discover">
            <VendorDiscovery />
          </TabsContent>
          
          <TabsContent value="pricing">
            <VendorPricingManager onPlanChange={handlePlanChange} />
          </TabsContent>
        </Tabs>
        
        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Vendor Invitation</DialogTitle>
              <DialogDescription>
                Share this QR code or link with vendors to apply to your venue or event
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-2">
              <label htmlFor="price-plan" className="block text-sm font-medium mb-2">
                Select a price plan for vendors
              </label>
              <Select value={selectedPriceId} onValueChange={handlePriceChange}>
                <SelectTrigger id="price-plan" className="w-full">
                  <SelectValue placeholder="Select a price plan" />
                </SelectTrigger>
                <SelectContent>
                  {pricingPlans && pricingPlans.length > 0 ? (
                    pricingPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id || `plan-${plan.name}`}>
                        <span className="font-medium">{plan.name}</span>
                        <span className="text-gray-500 ml-2">- R{plan.price} {plan.price_unit}</span>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-plans">No pricing plans available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {pricingPlans.length === 0 && (
                <div className="mt-2 text-sm text-amber-600">
                  Please create pricing plans in the Pricing tab
                </div>
              )}
            </div>
            
            <VendorInviteQR 
              title="Your Business" 
              priceId={selectedPriceId}
              priceName={selectedPriceName}
            />
          </DialogContent>
        </Dialog>
      </div>
    </HostPanelLayout>
  );
}
