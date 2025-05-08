
import React from "react";
import UniversalMessagingModule from "@/components/messaging/UniversalMessagingModule";

export default function AdminMessagesPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <UniversalMessagingModule />
    </div>
  );
}
