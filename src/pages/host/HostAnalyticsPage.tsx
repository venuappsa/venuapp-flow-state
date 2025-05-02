
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HostAnalyticsPage() {
  // Mock data for analytics
  const mockData = [
    { name: "Jan", guests: 400, revenue: 2400 },
    { name: "Feb", guests: 300, revenue: 1398 },
    { name: "Mar", guests: 520, revenue: 3800 },
    { name: "Apr", guests: 270, revenue: 2908 },
    { name: "May", guests: 580, revenue: 4800 },
    { name: "Jun", guests: 690, revenue: 3800 },
    { name: "Jul", guests: 490, revenue: 4300 },
  ];

  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-6">
          Analytics Dashboard
        </h1>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="guests">Guest Analytics</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
            <TabsTrigger value="vendors">Vendor Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Guest Attendance</CardTitle>
                  <CardDescription>Monthly guest attendance for your events</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={mockData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="guests" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>Monthly revenue from your events</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={mockData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Key metrics from all your events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Total Events</p>
                    <p className="text-2xl font-bold text-venu-purple">24</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Total Guests</p>
                    <p className="text-2xl font-bold text-venu-purple">3,245</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-venu-purple">R 234,500</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Avg. Satisfaction</p>
                    <p className="text-2xl font-bold text-venu-purple">92%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="guests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Guest Analytics</CardTitle>
                <CardDescription>Detailed guest analytics content</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Detailed guest analytics will be shown here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Detailed revenue analytics content</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Detailed revenue analytics will be shown here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vendors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Performance</CardTitle>
                <CardDescription>Analytics of vendor performance at your events</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Vendor performance analytics will be shown here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HostPanelLayout>
  );
}
