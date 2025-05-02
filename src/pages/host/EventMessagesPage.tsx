
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import EventMessaging from "@/components/event/EventMessaging";

export default function EventMessagesPage() {
  return (
    <HostPanelLayout>
      <div className="max-w-6xl mx-auto">
        <EventMessaging />
      </div>
    </HostPanelLayout>
  );
}
