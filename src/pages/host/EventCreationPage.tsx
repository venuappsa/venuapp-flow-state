
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import EventCreationForm from "@/components/event/EventCreationForm";

export default function EventCreationPage() {
  return (
    <HostPanelLayout>
      <div className="max-w-5xl mx-auto">
        <EventCreationForm />
      </div>
    </HostPanelLayout>
  );
}
