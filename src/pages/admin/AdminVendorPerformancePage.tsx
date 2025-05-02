
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminVendorPerformancePage() {
  // Mock data for vendor performance metrics
  const performanceData = [
    { category: "Catering", bookings: 124, revenue: 78500, vendors: 15, avgRating: 4.7 },
    { category: "Photography", bookings: 92, revenue: 55000, vendors: 20, avgRating: 4.8 },
    { category: "Venues", bookings: 67, revenue: 150000, vendors: 12, avgRating: 4.5 },
    { category: "Music", bookings: 88, revenue: 42000, vendors: 18, avgRating: 4.6 },
    { category: "Decor", bookings: 112, revenue: 67000, vendors: 24, avgRating: 4.4 },
    { category: "Florists", bookings: 75, revenue: 38000, vendors: 16, avgRating: 4.7 },
    { category: "Transport", bookings: 45, revenue: 28000, vendors: 8, avgRating: 4.3 },
  ];

  // Mock top-performing vendors
  const topVendors = [
    { name: "Gourmet Catering Co.", category: "Catering", bookings: 34, revenue: 28500, rating: 4.9 },
    { name: "Elite Photography", category: "Photography", bookings: 28, revenue: 22000, rating: 4.9 },
    { name: "Elegant Venues", category: "Venues", bookings: 15, revenue: 85000, rating: 4.8 },
    { name: "Sound Masters", category: "Music", bookings: 22, revenue: 15000, rating: 4.8 },
    { name: "Bloom Floral Design", category: "Florists", bookings: 25, revenue: 18500, rating: 4.8 },
  ];

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Vendor Performance Analytics</h1>
          <p className="text-gray-500">Monitor and analyze vendor performance metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Vendors</CardTitle>
              <CardDescription>Platform-wide</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">113</p>
              <p className="text-sm text-green-600">↑ 12% from last quarter</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Bookings</CardTitle>
              <CardDescription>All vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">603</p>
              <p className="text-sm text-green-600">↑ 8% from last quarter</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Platform Revenue</CardTitle>
              <CardDescription>Commission from bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 42,850</p>
              <p className="text-sm text-green-600">↑ 15% from last quarter</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bookings by Vendor Category</CardTitle>
                <CardDescription>Total bookings across different vendor categories</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Vendor Category</CardTitle>
                <CardDescription>Total revenue generated across different vendor categories</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (R)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ratings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Average Ratings by Vendor Category</CardTitle>
                <CardDescription>Customer satisfaction across different vendor categories</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Bar dataKey="avgRating" fill="#f59e0b" name="Average Rating" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
            <CardDescription>Vendors with the highest bookings and ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left text-sm font-medium">Vendor Name</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Category</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Bookings</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Revenue (R)</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {topVendors.map((vendor, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4 text-sm font-medium">{vendor.name}</td>
                      <td className="py-3 px-4 text-sm">{vendor.category}</td>
                      <td className="py-3 px-4 text-sm">{vendor.bookings}</td>
                      <td className="py-3 px-4 text-sm">{vendor.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm">{vendor.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPanelLayout>
  );
}
