
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download } from "lucide-react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminAnalyticsPage() {
  // Mock data for user growth
  const userGrowthData = [
    { month: "Jan", hosts: 10, vendors: 24, customers: 150 },
    { month: "Feb", hosts: 15, vendors: 32, customers: 220 },
    { month: "Mar", hosts: 22, vendors: 45, customers: 320 },
    { month: "Apr", hosts: 28, vendors: 52, customers: 410 },
    { month: "May", hosts: 35, vendors: 64, customers: 510 },
    { month: "Jun", hosts: 42, vendors: 72, customers: 590 },
    { month: "Jul", hosts: 48, vendors: 80, customers: 650 },
    { month: "Aug", hosts: 55, vendors: 88, customers: 720 },
    { month: "Sep", hosts: 62, vendors: 94, customers: 810 },
    { month: "Oct", hosts: 70, vendors: 102, customers: 890 },
  ];

  // Mock data for revenue
  const revenueData = [
    { month: "Jan", subscriptions: 15000, commissions: 8500, total: 23500 },
    { month: "Feb", subscriptions: 17500, commissions: 9200, total: 26700 },
    { month: "Mar", subscriptions: 21000, commissions: 12000, total: 33000 },
    { month: "Apr", subscriptions: 24500, commissions: 13800, total: 38300 },
    { month: "May", subscriptions: 26000, commissions: 15500, total: 41500 },
    { month: "Jun", subscriptions: 28500, commissions: 17200, total: 45700 },
    { month: "Jul", subscriptions: 31000, commissions: 18900, total: 49900 },
    { month: "Aug", subscriptions: 32500, commissions: 20100, total: 52600 },
    { month: "Sep", subscriptions: 35000, commissions: 22800, total: 57800 },
    { month: "Oct", subscriptions: 38500, commissions: 25400, total: 63900 },
  ];

  // Mock data for user types
  const userTypesData = [
    { name: "Hosts", value: 85, color: "#8884d8" },
    { name: "Vendors", value: 175, color: "#82ca9d" },
    { name: "Customers", value: 890, color: "#ffc658" },
    { name: "Fetchmen", value: 45, color: "#ff7300" },
  ];

  // Mock data for events
  const eventsData = [
    { month: "Jan", total: 28, completed: 22, cancelled: 6 },
    { month: "Feb", total: 35, completed: 30, cancelled: 5 },
    { month: "Mar", total: 42, completed: 38, cancelled: 4 },
    { month: "Apr", total: 50, completed: 45, cancelled: 5 },
    { month: "May", total: 60, completed: 55, cancelled: 5 },
    { month: "Jun", total: 72, completed: 68, cancelled: 4 },
    { month: "Jul", total: 80, completed: 75, cancelled: 5 },
    { month: "Aug", total: 88, completed: 82, cancelled: 6 },
    { month: "Sep", total: 95, completed: 90, cancelled: 5 },
    { month: "Oct", total: 105, completed: 98, cancelled: 7 },
  ];

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-500">Track platform performance metrics</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Select defaultValue="this-year">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Custom Range
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Users</CardTitle>
              <CardDescription>Platform-wide</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,195</p>
              <p className="text-sm text-green-600">↑ 12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Revenue</CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 63,900</p>
              <p className="text-sm text-green-600">↑ 10.5% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Events</CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">105</p>
              <p className="text-sm text-green-600">↑ 9.4% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Growth</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>User Growth Over Time</CardTitle>
                  <CardDescription>Tracking user acquisition by role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={userGrowthData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="hosts" name="Hosts" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="vendors" name="Vendors" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="customers" name="Customers" stroke="#ffc658" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>Breakdown by user type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userTypesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {userTypesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="subscriptions" name="Subscription Revenue" fill="#8884d8" />
                      <Bar dataKey="commissions" name="Commission Revenue" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Events Overview</CardTitle>
                <CardDescription>Monthly events statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={eventsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" name="Completed Events" fill="#82ca9d" />
                      <Bar dataKey="cancelled" name="Cancelled Events" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Feature engagement metrics</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-20">
                <p className="text-gray-500">Engagement analytics coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPanelLayout>
  );
}
