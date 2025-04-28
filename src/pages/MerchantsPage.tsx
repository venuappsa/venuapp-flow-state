
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import MerchantManagement from "@/components/host/MerchantManagement";
import MerchantDiscovery from "@/components/MerchantDiscovery";
import { Store, Search } from "lucide-react";

export default function MerchantsPage() {
  const [activeTab, setActiveTab] = useState("manage");
  const location = useLocation();

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
      </div>
    </HostPanelLayout>
  );
}
