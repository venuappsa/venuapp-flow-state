
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import EventVendorManager from "@/components/event/EventVendorManager";

export default function EventVendorsPage() {
  return (
    <HostPanelLayout>
      <div className="max-w-6xl mx-auto">
        <EventVendorManager />
      </div>
    </HostPanelLayout>
  );
}
