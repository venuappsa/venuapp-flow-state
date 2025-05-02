import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Store, Plus, Filter, ChevronRight, QrCode, Share2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { dummyVendors } from "@/data/hostDummyData";
import VendorDiscovery from "@/components/VendorDiscovery";
import { Input } from "@/components/ui/input";
import VendorInviteQR from "@/components/VendorInviteQR";

const pricePlans = [
  { id: "basic-stall", name: "Basic Stall", price: "R500 per day" },
  { id: "premium-stall", name: "Premium Stall", price: "R1200 per day" },
  { id: "exclusive-stall", name: "Exclusive Stall", price: "R2500 per day" }
];

export default function VendorsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my-vendors");
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState(pricePlans[0].id);
  const [selectedPriceName, setSelectedPriceName] = useState(pricePlans[0].name);

  const filteredVendors = dummyVendors.filter(
    vendor => vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePriceChange = (priceId: string) => {
    setSelectedPriceId(priceId);
    const selectedPlan = pricePlans.find(plan => plan.id === priceId);
    if (selectedPlan) {
      setSelectedPriceName(selectedPlan.name);
    }
  };

  const handleGenerateLink = () => {
    const priceParam = selectedPriceId ? `&price=${selectedPriceId}` : '';
    const inviteLink = `https://venuapp.co.za/vendor-invite/venue-${Date.now()}${priceParam}`;
    
    navigator.clipboard.writeText(inviteLink).then(
      () => {
        toast({
          title: "Link copied",
          description: "Vendor invitation link copied to clipboard",
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Vendor Management</h2>
          <p className="text-gray-500">Manage vendors for your venues and events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setQrDialogOpen(true)}>
            <QrCode className="h-4 w-4 mr-2" />
            Invitation QR
          </Button>
          <Button variant="outline" onClick={handleGenerateLink}>
            <Share2 className="h-4 w-4 mr-2" />
            Generate Link
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="my-vendors" className="flex gap-1">
            <Store className="h-4 w-4" />
            <span>My Vendors</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex gap-1">
            <Store className="h-4 w-4" />
            <span>Applications</span>
          </TabsTrigger>
          <TabsTrigger value="discover" className="flex gap-1">
            <Store className="h-4 w-4" />
            <span>Discover Vendors</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-vendors">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search vendors..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVendors.map((vendor) => (
                <Card 
                  key={vendor.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => toast({
                    title: "Vendor Details",
                    description: `View details for ${vendor.name}`,
                  })}
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-3 rounded-full">
                          <Store className="h-5 w-5 text-venu-orange" />
                        </div>
                        <div>
                          <h3 className="font-medium">{vendor.name}</h3>
                          <p className="text-sm text-gray-500">{vendor.category}</p>
                        </div>
                      </div>
                      <Badge className={`${vendor.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {vendor.status === 'approved' ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 text-sm">
                      <p className="text-gray-600">{vendor.contact}</p>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No vendors found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? `No vendors match your search "${searchQuery}"` 
                  : "You don't have any vendors yet. Add your first vendor or browse the marketplace."}
              </p>
              <Button>Add Your First Vendor</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="applications">
          <div className="p-12 bg-gray-50 text-center rounded-lg">
            <Store className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Applications</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You don't have any pending vendor applications. Share your venue link to receive applications.
            </p>
            <Button>Generate Venue Link</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="discover">
          <VendorDiscovery />
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
                {pricePlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    <span className="font-medium">{plan.name}</span>
                    <span className="text-gray-500 ml-2">- {plan.price}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <VendorInviteQR 
            title="Your Business" 
            priceId={selectedPriceId}
            priceName={selectedPriceName}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
