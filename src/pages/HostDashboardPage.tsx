
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import UnifiedDashboard from "@/components/host/UnifiedDashboard";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionStatusBar from "@/components/subscription/SubscriptionStatusBar";

export default function HostDashboardPage() {
  const { subscribed } = useSubscription();
  
  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-4">
          Host Dashboard
        </h1>
        
        {subscribed ? null : <SubscriptionStatusBar className="mb-6" />}
        
        <UnifiedDashboard />
      </div>
    </HostPanelLayout>
  );
}
