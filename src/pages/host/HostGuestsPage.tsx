
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Download } from "lucide-react";

export default function HostGuestsPage() {
  const mockGuests = [
    { id: 1, name: "John Smith", email: "john@example.com", phone: "+27 71 234 5678", status: "Confirmed", event: "Wedding Expo 2025" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", phone: "+27 82 345 6789", status: "Pending", event: "Corporate Retreat" },
    { id: 3, name: "Michael Brown", email: "michael@example.com", phone: "+27 63 456 7890", status: "Confirmed", event: "Wedding Expo 2025" },
    { id: 4, name: "Emma Davis", email: "emma@example.com", phone: "+27 74 567 8901", status: "Cancelled", event: "Birthday Celebration" },
    { id: 5, name: "James Wilson", email: "james@example.com", phone: "+27 85 678 9012", status: "Confirmed", event: "Corporate Retreat" },
  ];

  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-6">
          Guest Management
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input placeholder="Search guests..." className="pl-10" />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Guest
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockGuests.map((guest) => (
                  <tr key={guest.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{guest.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{guest.email}</div>
                      <div className="text-sm text-gray-500">{guest.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{guest.event}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${guest.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                          guest.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {guest.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HostPanelLayout>
  );
}
