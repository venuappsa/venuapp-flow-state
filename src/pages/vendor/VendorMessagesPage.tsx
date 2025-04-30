
import React from "react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";

export default function VendorMessagesPage() {
  return (
    <VendorPanelLayout>
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <p className="text-gray-500 mb-6">Communicate with your hosts</p>
        
        {/* Placeholder for vendor messages - will be implemented fully in next phase */}
        <div className="bg-white border rounded-lg p-8 text-center">
          <p className="text-gray-500">Your messages with hosts will appear here.</p>
        </div>
      </div>
    </VendorPanelLayout>
  );
}
