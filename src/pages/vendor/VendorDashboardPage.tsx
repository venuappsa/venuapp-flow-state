
import React from "react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";

export default function VendorDashboardPage() {
  return (
    <VendorPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-4">
          Vendor Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium mb-2">Active Bookings</h3>
            <p className="text-3xl font-bold text-venu-orange">12</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium mb-2">Upcoming Events</h3>
            <p className="text-3xl font-bold text-venu-orange">5</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-venu-orange">R34,500</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium mb-2">New Inquiries</h3>
            <p className="text-3xl font-bold text-venu-orange">7</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
            <div className="divide-y">
              {[1, 2, 3].map(i => (
                <div key={i} className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Wedding Expo 2025</h4>
                      <p className="text-gray-500 text-sm">June 15, 2025</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Latest Messages</h2>
            <div className="divide-y">
              {[1, 2, 3].map(i => (
                <div key={i} className="py-3">
                  <p className="font-medium">Wedding Coordinator</p>
                  <p className="text-sm text-gray-600 truncate">Hi there, can we discuss the setup for...</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </VendorPanelLayout>
  );
}
