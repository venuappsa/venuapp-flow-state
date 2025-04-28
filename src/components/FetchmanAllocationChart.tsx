
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FetchmanAllocationResult } from "@/utils/fetchmanCalculator";

interface FetchmanAllocationChartProps {
  allocation: FetchmanAllocationResult;
}

export default function FetchmanAllocationChart({ allocation }: FetchmanAllocationChartProps) {
  const data = [
    { name: 'Entrance & Exit', value: allocation.allocation.entranceAndExit, color: '#10B981' },
    { name: 'Vendor Areas', value: allocation.allocation.vendorAreas, color: '#3B82F6' },
    { name: 'General Areas', value: allocation.allocation.generalAreas, color: '#F59E0B' },
    { name: 'Emergency Reserve', value: allocation.allocation.emergencyReserve, color: '#EF4444' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Fetchman Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} Fetchmen`, 'Allocation']} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-2">
          <h4 className="font-medium">Recommendations:</h4>
          <ul className="space-y-1 text-sm">
            {allocation.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
