
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import EventCreationForm from "@/components/event/EventCreationForm";

export default function EventEditPage() {
  return (
    <HostPanelLayout>
      <div className="max-w-5xl mx-auto">
        <EventCreationForm />
      </div>
    </HostPanelLayout>
  );
}
