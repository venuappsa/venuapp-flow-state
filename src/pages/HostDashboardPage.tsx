
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import Dashboard from "@/components/host/Dashboard";

export default function HostDashboardPage() {
  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-4">
          Host Dashboard
        </h1>
        <Dashboard />
      </div>
    </HostPanelLayout>
  );
}
