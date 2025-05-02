
import React from "react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VendorAnalyticsPage() {
  // Mock data for analytics
  const bookingData = [
    { month: "Jan", bookings: 5, revenue: 8500 },
    { month: "Feb", bookings: 7, revenue: 12000 },
    { month: "Mar", bookings: 10, revenue: 18500 },
    { month: "Apr", bookings: 8, revenue: 15000 },
    { month: "May", bookings: 12, revenue: 21300 },
    { month: "Jun", bookings: 15, revenue: 25800 },
  ];

  const viewData = [
    { month: "Jan", views: 120, inquiries: 12 },
    { month: "Feb", views: 180, inquiries: 18 },
    { month: "Mar", views: 250, inquiries: 25 },
    { month: "Apr", views: 210, inquiries: 22 },
    { month: "May", views: 280, inquiries: 30 },
    { month: "Jun", views: 320, inquiries: 34 },
  ];

  const serviceData = [
    { name: "Catering", bookings: 22, revenue: 45000 },
    { name: "Photography", bookings: 18, revenue: 36000 },
    { name: "Décor", bookings: 15, revenue: 30000 },
    { name: "Sound System", bookings: 12, revenue: 24000 },
    { name: "Lighting", bookings: 8, revenue: 16000 },
  ];

  return (
    <VendorPanelLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          
          <div className="flex items-center gap-2">
            <Select defaultValue="6months">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Bookings</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">57</p>
              <p className="text-sm text-green-600">↑ 15% from previous period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Revenue</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 101,100</p>
              <p className="text-sm text-green-600">↑ 22% from previous period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Profile Views</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,360</p>
              <p className="text-sm text-green-600">↑ 32% from previous period</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Bookings & Revenue</TabsTrigger>
            <TabsTrigger value="views">Views & Inquiries</TabsTrigger>
            <TabsTrigger value="services">Service Performance</TabsTrigger>
            <TabsTrigger value="clients">Client Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bookings Over Time</CardTitle>
                  <CardDescription>Number of bookings per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={bookingData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="bookings" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Over Time</CardTitle>
                  <CardDescription>Revenue generated per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={bookingData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`R ${value}`, 'Revenue']} />
                        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="views">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Views</CardTitle>
                  <CardDescription>Number of profile views per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={viewData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Inquiries</CardTitle>
                  <CardDescription>Number of inquiries received per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={viewData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="inquiries" stroke="#82ca9d" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="services">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Performance</CardTitle>
                  <CardDescription>Bookings and revenue by service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={serviceData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        barSize={40}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" scale="point" padding={{ left: 20, right: 20 }} />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Bar yAxisId="left" dataKey="bookings" fill="#8884d8" name="Bookings" />
                        <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue (R)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Top Performing Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">Catering</p>
                    <p className="text-sm text-muted-foreground">22 Bookings • R 45,000</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Average Booking Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">R 1,772</p>
                    <p className="text-sm text-green-600">↑ 5% from previous period</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">9.3%</p>
                    <p className="text-sm text-green-600">↑ 1.2% from previous period</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Client Analytics</CardTitle>
                <CardDescription>Data on client demographics and behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Client analytics content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </VendorPanelLayout>
  );
}
