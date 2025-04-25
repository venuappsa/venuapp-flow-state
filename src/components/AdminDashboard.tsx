
import React from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  CalendarPlus,
  Check,
  ChartBar,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Admin Portal: Oversight & Stats</h2>
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border-l-4 border-venu-orange p-4 rounded shadow-sm flex items-center gap-4">
          <div className="bg-venu-orange/10 p-2 rounded-full">
            <Users className="h-6 w-6 text-venu-orange" />
          </div>
          <div>
            <div className="text-sm font-medium text-venu-orange mb-1">Total Users</div>
            <div className="text-2xl font-bold text-gray-900">1,930</div>
          </div>
        </div>
        <div className="bg-white border-l-4 border-blue-400 p-4 rounded shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-blue-600 mb-1">Hosts</div>
            <div className="text-2xl font-bold text-gray-900">34</div>
          </div>
        </div>
        <div className="bg-white border-l-4 border-green-400 p-4 rounded shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-2 rounded-full">
            <Users className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <div className="text-sm font-medium text-green-800 mb-1">Vendors/Merchants</div>
            <div className="text-2xl font-bold text-gray-900">19</div>
          </div>
        </div>
        <div className="bg-white border-l-4 border-gray-400 p-4 rounded shadow-sm flex items-center gap-4">
          <div className="bg-gray-200 p-2 rounded-full">
            <Users className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Fetchmen</div>
            <div className="text-2xl font-bold text-gray-900">11</div>
          </div>
        </div>
      </div>

      {/* Trends and Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Trends */}
        <div className="col-span-1 bg-gradient-to-tr from-venu-orange/10 via-blue-100 to-green-50 border-l-4 border-venu-orange rounded shadow-sm p-5 flex items-center gap-4">
          <TrendingUp className="w-9 h-9 text-venu-orange" />
          <div>
            <div className="text-base font-bold text-venu-orange mb-1">Trends</div>
            <div className="text-gray-800 text-lg">Events up <span className="font-bold text-venu-orange">+8%</span> this week</div>
          </div>
        </div>
        {/* Revenue */}
        <div className="col-span-1 bg-gradient-to-tr from-green-100 via-green-50 to-white border-l-4 border-green-400 rounded shadow-sm p-5 flex items-center gap-4">
          <DollarSign className="w-9 h-9 text-green-700" />
          <div>
            <div className="text-base font-bold text-green-800 mb-1">Revenue from Subscriptions</div>
            <div className="text-gray-900 text-lg font-semibold">R 32,000</div>
            <div className="text-xs text-green-700/70">This month</div>
          </div>
        </div>
        {/* Verification Queue */}
        <div className="col-span-1 bg-gradient-to-tr from-blue-50 via-purple-50 to-white border-l-4 border-blue-400 rounded shadow-sm p-5 flex items-center gap-4">
          <Check className="w-9 h-9 text-blue-700" />
          <div>
            <div className="text-base font-bold text-blue-700 mb-1">Verification Queue</div>
            <div className="text-gray-900 text-lg font-semibold">7 Pending</div>
            <div className="text-xs text-blue-700/60">ID & business checks</div>
          </div>
        </div>
      </div>

      {/* New Event Listings */}
      <div className="bg-white rounded shadow p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CalendarPlus className="h-5 w-5 text-venu-orange" />
          New Event Listings
        </h3>
        <ul className="divide-y divide-gray-200 text-sm">
          <li className="py-2 flex justify-between">
            <span>Summer Gala – Host: John Doe</span>
            <span className="text-gray-500">12 min ago</span>
          </li>
          <li className="py-2 flex justify-between">
            <span>Winter Wonderland Party – Host: Jane Smith</span>
            <span className="text-gray-500">45 min ago</span>
          </li>
          <li className="py-2 flex justify-between">
            <span>Food Fest – Host: Amira Naidoo</span>
            <span className="text-gray-500">1 hr ago</span>
          </li>
          <li className="py-2 flex justify-between">
            <span>Music Carnival – Host: Bongani Luthuli</span>
            <span className="text-gray-500">2 hr ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
