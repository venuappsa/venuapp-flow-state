
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Calendar, Filter } from "lucide-react";

export default function HostAnalyticsPage() {
  const monthlyData = [
    { name: 'Jan', events: 4, revenue: 35000, guests: 120 },
    { name: 'Feb', events: 6, revenue: 48000, guests: 180 },
    { name: 'Mar', events: 5, revenue: 42000, guests: 150 },
    { name: 'Apr', events: 8, revenue: 65000, guests: 220 },
    { name: 'May', events: 10, revenue: 78000, guests: 280 },
    { name: 'Jun', events: 12, revenue: 95000, guests: 350 }
  ];

  const sourceData = [
    { name: 'Direct', value: 45 },
    { name: 'Social', value: 25 },
    { name: 'Search', value: 15 },
    { name: 'Referral', value: 10 },
    { name: 'Other', value: 5 }
  ];

  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-6">
          Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Events</CardDescription>
              <CardTitle className="text-2xl">45</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+12%</span> from last month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-2xl">R363,000</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+18%</span> from last month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Guests</CardDescription>
              <CardTitle className="text-2xl">1,300</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+15%</span> from last month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Conversion Rate</CardDescription>
              <CardTitle className="text-2xl">24.8%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+3%</span> from last month
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg">Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue for the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (R)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg">Events & Guests</CardTitle>
              <CardDescription>Monthly events and guest count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="events" fill="#8884d8" name="Events" />
                    <Bar yAxisId="right" dataKey="guests" fill="#82ca9d" name="Guests" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Performance Analysis</CardTitle>
                  <CardDescription>Detailed metrics and KPIs</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date Range
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="audience">Audience</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Top Performing Event</h3>
                      <p className="text-lg font-bold">Wedding Expo 2025</p>
                      <p className="text-sm text-muted-foreground">R85,000 revenue, 320 guests</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Most Popular Venue</h3>
                      <p className="text-lg font-bold">Grand Ballroom</p>
                      <p className="text-sm text-muted-foreground">8 events, 95% satisfaction</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Top Vendor</h3>
                      <p className="text-lg font-bold">Elegant Events & Catering</p>
                      <p className="text-sm text-muted-foreground">12 bookings, 4.9/5 rating</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Growth Rate</h3>
                      <p className="text-lg font-bold">+24% YoY</p>
                      <p className="text-sm text-muted-foreground">Revenue increased by 24% year-over-year</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="events">
                  <p className="text-center py-8 text-muted-foreground">
                    Detailed event analytics will appear here.
                  </p>
                </TabsContent>
                
                <TabsContent value="audience">
                  <p className="text-center py-8 text-muted-foreground">
                    Audience demographics and behavior analytics will appear here.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Traffic Sources</CardTitle>
              <CardDescription>Where your guests are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sourceData.map((source) => (
                  <div key={source.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{source.name}</span>
                      <span className="text-sm text-muted-foreground">{source.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-venu-orange h-2 rounded-full" 
                        style={{ width: `${source.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button variant="outline" size="sm" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HostPanelLayout>
  );
}
