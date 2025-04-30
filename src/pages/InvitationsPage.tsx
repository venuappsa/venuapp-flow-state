
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import VendorInvitations from "@/components/host/VendorInvitations";

export default function InvitationsPage() {
  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-4">
          Vendor Invitations
        </h1>
        <VendorInvitations />
      </div>
    </HostPanelLayout>
  );
}
