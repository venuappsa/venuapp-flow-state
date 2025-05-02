
import React from "react";
import FetchmanPanelLayout from "@/components/layouts/FetchmanPanelLayout";
import UniversalMessagingModule from "@/components/messaging/UniversalMessagingModule";

export default function FetchmanMessagesPage() {
  return (
    <FetchmanPanelLayout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <UniversalMessagingModule />
      </div>
    </FetchmanPanelLayout>
  );
}
