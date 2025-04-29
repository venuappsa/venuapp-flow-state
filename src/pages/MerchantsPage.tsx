
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import MerchantManagement from "@/components/host/MerchantManagement";
import MerchantDiscovery from "@/components/MerchantDiscovery";
import { Store, Search, QrCode, Share2 } from "lucide-react";
import MerchantInviteQR from "@/components/MerchantInviteQR";

// Sample price plans to choose from
const pricePlans = [
  { id: "basic-stall", name: "Basic Stall", price: "R500 per day" },
  { id: "premium-stall", name: "Premium Stall", price: "R1200 per day" },
  { id: "exclusive-stall", name: "Exclusive Stall", price: "R2500 per day" }
];

export default function MerchantsPage() {
  const [activeTab, setActiveTab] = useState("manage");
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState(pricePlans[0].id);
  const [selectedPriceName, setSelectedPriceName] = useState(pricePlans[0].name);
  const location = useLocation();

  // Set price plan based on selection
  const handlePriceChange = (priceId: string) => {
    setSelectedPriceId(priceId);
    const selectedPlan = pricePlans.find(plan => plan.id === priceId);
    if (selectedPlan) {
      setSelectedPriceName(selectedPlan.name);
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
            <h1 className="text-2xl font-bold">Merchant Management</h1>
            <p className="text-gray-500">Manage and discover merchants for your venues and events</p>
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
          </TabsList>

          <TabsContent value="manage">
            <MerchantManagement />
          </TabsContent>

          <TabsContent value="discover">
            <MerchantDiscovery />
          </TabsContent>
        </Tabs>
        
        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Merchant Invitation</DialogTitle>
              <DialogDescription>
                Share this QR code or link with merchants to apply to your venue or event
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-2">
              <label htmlFor="price-plan" className="block text-sm font-medium mb-2">
                Select a price plan for merchants
              </label>
              <Select value={selectedPriceId} onValueChange={handlePriceChange}>
                <SelectTrigger id="price-plan" className="w-full">
                  <SelectValue placeholder="Select a price plan" />
                </SelectTrigger>
                <SelectContent>
                  {pricePlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      <span className="font-medium">{plan.name}</span>
                      <span className="text-gray-500 ml-2">- {plan.price}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <MerchantInviteQR 
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
