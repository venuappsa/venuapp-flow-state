
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardTab from "@/components/host/DashboardTab";
import EventsTab from "@/components/host/EventsTab";
import FinanceTab from "@/components/host/FinanceTab";
import VenuesTab from "@/components/host/VenuesTab";
import VendorMetricsDashboard from "@/components/host/VendorMetricsDashboard";

export default function Dashboard() {
  return (
    <Tabs defaultValue="dashboard">
      <TabsList>
        <TabsTrigger value="dashboard">Overview</TabsTrigger>
        <TabsTrigger value="venues">Venues</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="vendors">Vendors</TabsTrigger>
        <TabsTrigger value="finance">Finance</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard">
        <DashboardTab />
      </TabsContent>
      <TabsContent value="venues">
        <VenuesTab />
      </TabsContent>
      <TabsContent value="events">
        <EventsTab />
      </TabsContent>
      <TabsContent value="vendors">
        <VendorMetricsDashboard />
      </TabsContent>
      <TabsContent value="finance">
        <FinanceTab />
      </TabsContent>
    </Tabs>
  );
}
