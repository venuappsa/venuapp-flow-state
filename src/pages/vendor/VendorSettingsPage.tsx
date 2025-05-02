
import React from "react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";

export default function VendorSettingsPage() {
  return (
    <VendorPanelLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Vendor Settings</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-muted-foreground mb-4">
            Configure your vendor account settings, notifications, and preferences.
          </p>
          
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Account Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage your account details, password, and profile information.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Notification Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Configure how and when you receive notifications about bookings, messages, and updates.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Payment Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure your payment methods, payout preferences, and billing details.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Privacy & Security</h3>
              <p className="text-sm text-muted-foreground">
                Manage your privacy settings, data sharing preferences, and security options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </VendorPanelLayout>
  );
}
