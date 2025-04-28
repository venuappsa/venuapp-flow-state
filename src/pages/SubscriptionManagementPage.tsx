
import React from "react";
import { SubscriptionManagement } from "@/components/subscription/SubscriptionManagement";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";

export default function SubscriptionManagementPage() {
  return (
    <HostPanelLayout>
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Subscription Management</h1>
          <p className="text-gray-600 mt-2">Manage your subscription settings and billing</p>
        </div>

        <SubscriptionManagement />
      </div>
    </HostPanelLayout>
  );
}
