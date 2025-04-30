
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { BookingTrend } from '@/utils/vendorAnalyticsData';

interface BookingTrendsChartProps {
  weeklyData: BookingTrend[];
  monthlyData: BookingTrend[];
  loading?: boolean;
}

const BookingTrendsChart = ({ weeklyData, monthlyData, loading = false }: BookingTrendsChartProps) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [dataType, setDataType] = useState<'bookings' | 'revenue'>('bookings');

  // Custom tooltip formatter
  const formatTooltip = (value: number, name: string) => {
    if (name === 'revenue') return `$${value.toLocaleString()}`;
    return value;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking Trends</CardTitle>
        </CardHeader>
        <CardContent className="p-6 h-80 animate-pulse bg-gray-100"></CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <CardTitle>Booking Trends</CardTitle>
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="weekly" className="w-[200px]">
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={formatTooltip} />
                      <Legend />
                      {dataType === 'bookings' ? 
                        <Line type="monotone" dataKey="bookings" stroke="#8884d8" activeDot={{ r: 8 }} name="Bookings" /> :
                        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" activeDot={{ r: 8 }} name="Revenue" />
                      }
                    </LineChart>
                  ) : (
                    <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={formatTooltip} />
                      <Legend />
                      {dataType === 'bookings' ? 
                        <Bar dataKey="bookings" fill="#8884d8" name="Bookings" /> :
                        <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                      }
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="monthly">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={formatTooltip} />
                      <Legend />
                      {dataType === 'bookings' ? 
                        <Line type="monotone" dataKey="bookings" stroke="#8884d8" activeDot={{ r: 8 }} name="Bookings" /> :
                        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" activeDot={{ r: 8 }} name="Revenue" />
                      }
                    </LineChart>
                  ) : (
                    <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={formatTooltip} />
                      <Legend />
                      {dataType === 'bookings' ? 
                        <Bar dataKey="bookings" fill="#8884d8" name="Bookings" /> :
                        <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                      }
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <div className="flex justify-end space-x-2 mb-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setDataType('bookings')} 
              className={`px-3 py-1 rounded text-sm ${dataType === 'bookings' ? 'bg-primary text-primary-foreground' : 'bg-gray-100'}`}
            >
              Bookings
            </button>
            <button 
              onClick={() => setDataType('revenue')} 
              className={`px-3 py-1 rounded text-sm ${dataType === 'revenue' ? 'bg-primary text-primary-foreground' : 'bg-gray-100'}`}
            >
              Revenue
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setChartType('line')} 
              className={`px-3 py-1 rounded text-sm ${chartType === 'line' ? 'bg-primary text-primary-foreground' : 'bg-gray-100'}`}
            >
              Line
            </button>
            <button 
              onClick={() => setChartType('bar')} 
              className={`px-3 py-1 rounded text-sm ${chartType === 'bar' ? 'bg-primary text-primary-foreground' : 'bg-gray-100'}`}
            >
              Bar
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingTrendsChart;
