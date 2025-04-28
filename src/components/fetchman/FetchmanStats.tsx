
import React from "react";
import { Users, Clock, BadgePercent, Calendar } from "lucide-react";

interface FetchmanStatsProps {
  fetchmenCount: number;
  hours: number;
  rate: number;
  totalCost: number;
  hasOvertime: boolean;
}

export default function FetchmanStats({
  fetchmenCount,
  hours,
  rate,
  totalCost,
  hasOvertime,
}: FetchmanStatsProps) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-md shadow-sm">
          <Users className="h-6 w-6 text-venu-orange mb-2" />
          <p className="text-sm text-gray-500">Fetchmen Required</p>
          <p className="text-2xl font-bold">{fetchmenCount}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-md shadow-sm">
          <Clock className="h-6 w-6 text-venu-orange mb-2" />
          <p className="text-sm text-gray-500">Total Hours</p>
          <p className="text-2xl font-bold">{hours}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-md shadow-sm">
          <BadgePercent className="h-6 w-6 text-venu-orange mb-2" />
          <p className="text-sm text-gray-500">Hourly Rate</p>
          <p className="text-2xl font-bold">R{rate}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-md shadow-sm">
          <Calendar className="h-6 w-6 text-venu-orange mb-2" />
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-2xl font-bold">R{totalCost.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
