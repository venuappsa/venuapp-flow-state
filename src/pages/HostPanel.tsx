
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useSubscription } from "@/hooks/useSubscription";
import { useBreakpoint } from "@/hooks/useResponsive";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import UnifiedDashboard from "@/components/host/UnifiedDashboard";
import VenuesTab from "@/components/host/VenuesTab";
import EventsTab from "@/components/host/EventsTab";
import MerchantManagement from "@/components/host/MerchantManagement";
import VendorsTab from "@/components/host/VendorsTab";
import FinanceTab from "@/components/host/FinanceTab";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";

export default function HostPanel() {
  const { user } = useUser();
  const { data: roles = [], isLoading: rolesLoading } = useUserRoles(user?.id);
  const { subscribed, subscription_tier, isLoading: subLoading } = useSubscription();
  const [activeTab, setActiveTab] = useState('dashboard');
  const breakpoint = useBreakpoint();

  return (
    <HostPanelLayout>
      {rolesLoading ? (
        <div className="max-w-7xl mx-auto py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Host Dashboard</h1>
            <div className="flex justify-between items-center mt-4">
              {!subscribed && breakpoint !== "xs" && (
                <Link to="/subscribe">
                  <Button variant="outline" className="border-venu-orange text-venu-orange hover:bg-venu-orange/10">
                    Upgrade to Premium
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="venues">Venues</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="merchants">Merchants</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="mt-6">
              <UnifiedDashboard />
            </TabsContent>
            
            <TabsContent value="venues" className="mt-6">
              <VenuesTab />
            </TabsContent>
            
            <TabsContent value="merchants" className="mt-6">
              <MerchantManagement />
            </TabsContent>
            
            <TabsContent value="events" className="mt-6">
              <EventsTab />
            </TabsContent>
            
            <TabsContent value="finance" className="mt-6">
              <FinanceTab />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Analytics</h2>
                <p>Advanced analytics will be available based on your subscription tier.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Settings</h2>
                <p>Configure your host settings, rules, and notification preferences.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </HostPanelLayout>
  );
}
