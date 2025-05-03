
import React from "react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";

export default function VendorProfilePage() {
  return (
    <VendorPanelLayout>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Vendor Profile</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Business Name</p>
                <p className="font-medium">Delicious Food Truck</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Contact Name</p>
                <p className="font-medium">John Smith</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">contact@deliciousfoodtruck.com</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-2">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Business Type</p>
                <p className="font-medium">Food & Beverage</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Business ID</p>
                <p className="font-medium">FT-12345</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Year Established</p>
                <p className="font-medium">2018</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Cuisine Type</p>
                <p className="font-medium">Mexican Fusion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VendorPanelLayout>
  );
}
