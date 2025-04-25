
import React from "react";

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Welcome to the Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-venu-orange/5 border-l-4 border-venu-orange p-4 rounded shadow-sm">
          <div className="text-sm font-medium text-venu-orange mb-1">Total Hosts</div>
          <div className="text-2xl font-bold text-gray-900">34</div>
        </div>
        <div className="bg-blue-100 border-l-4 border-blue-400 p-4 rounded shadow-sm">
          <div className="text-sm font-medium text-blue-700 mb-1">Active Events</div>
          <div className="text-2xl font-bold text-gray-900">12</div>
        </div>
        <div className="bg-green-100 border-l-4 border-green-400 p-4 rounded shadow-sm">
          <div className="text-sm font-medium text-green-900 mb-1">Pending Payouts</div>
          <div className="text-2xl font-bold text-gray-900">$1,945</div>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <ul className="divide-y divide-gray-200 text-sm">
          <li className="py-2 flex justify-between">
            <span>Host John Doe registered</span>
            <span className="text-gray-500">10 min ago</span>
          </li>
          <li className="py-2 flex justify-between">
            <span>Event "Summer Gala" created</span>
            <span className="text-gray-500">32 min ago</span>
          </li>
          <li className="py-2 flex justify-between">
            <span>Fetchman payout processed</span>
            <span className="text-gray-500">1 hr ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
