
import React, { useState } from "react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart } from "@/components/ui/chart";
import { 
  Search, 
  Download, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Star, 
  Calendar, 
  DollarSign, 
  ThumbsUp, 
  ThumbsDown,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminVendorPerformancePage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for vendor performance
  const vendors = [
    {
      id: "1",
      name: "Elegant Catering Co.",
      category: "Catering",
      bookingRate: 82,
      responseRate: 95,
      avgRating: 4.8,
      reviews: 68,
      events: 42,
      revenue: 84500,
      trend: "up"
    },
    {
      id: "2",
      name: "Dynamic Sound Systems",
      category: "Audio/Visual",
      bookingRate: 76,
      responseRate: 88,
      avgRating: 4.6,
      reviews: 53,
      events: 37,
      revenue: 55200,
      trend: "up"
    },
    {
      id: "3",
      name: "Floral Fantasy Designs",
      category: "Decor & Flowers",
      bookingRate: 90,
      responseRate: 97,
      avgRating: 4.9,
      reviews: 92,
      events: 60,
      revenue: 72800,
      trend: "up"
    },
    {
      id: "4",
      name: "Snap Memories Photography",
      category: "Photography",
      bookingRate: 65,
      responseRate: 82,
      avgRating: 4.2,
      reviews: 41,
      events: 28,
      revenue: 42600,
      trend: "down"
    },
    {
      id: "5",
      name: "Sweet Celebrations Bakery",
      category: "Bakery",
      bookingRate: 89,
      responseRate: 94,
      avgRating: 4.7,
      reviews: 77,
      events: 45,
      revenue: 63400,
      trend: "up"
    },
    {
      id: "6",
      name: "Premier Event Staffing",
      category: "Staff",
      bookingRate: 72,
      responseRate: 86,
      avgRating: 4.4,
      reviews: 32,
      events: 24,
      revenue: 36800,
      trend: "down"
    }
  ];

  // Mock data for charts
  const monthlyRevenueData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString('default', { month: 'short' });
    return {
      month,
      revenue: Math.floor(Math.random() * 50000) + 25000
    };
  });

  const categoryPerformanceData = [
    { category: "Catering", avgRating: 4.7, bookingRate: 85 },
    { category: "Audio/Visual", avgRating: 4.5, bookingRate: 75 },
    { category: "Decor & Flowers", avgRating: 4.8, bookingRate: 88 },
    { category: "Photography", avgRating: 4.4, bookingRate: 72 },
    { category: "Bakery", avgRating: 4.6, bookingRate: 82 },
    { category: "Staff", avgRating: 4.2, bookingRate: 68 }
  ];

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportData = (dataType: string) => {
    toast({
      title: "Export initiated",
      description: `${dataType} data is being exported to CSV`
    });
  };

  const handleViewVendor = (id: string, name: string) => {
    toast({
      title: "Viewing vendor details",
      description: `Navigating to ${name} performance details`
    });
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Vendor Performance</h1>
            <p className="text-gray-500">Track and analyze vendor metrics</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" onClick={() => handleExportData("Vendor Performance")}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Key vendor performance metrics</CardDescription>
              </div>
              <Tabs 
                defaultValue="overview" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">
                    <BarChartIcon className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="category">
                    <LineChartIcon className="h-4 w-4 mr-2" />
                    By Category
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="overview" className="mt-0 h-[350px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Monthly Revenue by Vendors</h3>
                <Button variant="outline" size="sm" onClick={() => handleExportData("Monthly Revenue")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <BarChart
                data={monthlyRevenueData}
                index="month"
                categories={["revenue"]}
                colors={["#8B5CF6"]}
                valueFormatter={(value) => `$${value.toLocaleString()}`}
                showXAxis
                showYAxis
                showLegend={false}
                showTooltip
                showGridLines
                className="h-[300px]"
              />
            </TabsContent>
            <TabsContent value="category" className="mt-0 h-[350px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Category Performance</h3>
                <Button variant="outline" size="sm" onClick={() => handleExportData("Category Performance")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <LineChart
                data={categoryPerformanceData}
                index="category"
                categories={["avgRating", "bookingRate"]}
                colors={["#10B981", "#F59E0B"]}
                valueFormatter={(value, category) => 
                  category === "avgRating" ? `${value} stars` : `${value}%`
                }
                showXAxis
                showYAxis
                showLegend
                showTooltip
                showGridLines
                className="h-[300px]"
              />
            </TabsContent>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Metrics</CardTitle>
            <CardDescription>Detailed vendor performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex items-center">
                  <Star className="h-8 w-8 text-yellow-500 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">4.6</p>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center">
                  <Calendar className="h-8 w-8 text-blue-500 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">79%</p>
                    <p className="text-sm text-muted-foreground">Booking Rate</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">$355K</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center">
                  <ThumbsUp className="h-8 w-8 text-purple-500 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">90%</p>
                    <p className="text-sm text-muted-foreground">Response Rate</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search vendors..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Avg. Rating</TableHead>
                    <TableHead>Booking Rate</TableHead>
                    <TableHead>Response Rate</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.length > 0 ? (
                    filteredVendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{vendor.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{vendor.avgRating}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({vendor.reviews})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{vendor.bookingRate}%</TableCell>
                        <TableCell>{vendor.responseRate}%</TableCell>
                        <TableCell>${vendor.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          {vendor.trend === "up" ? (
                            <div className="flex items-center text-green-600">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              <span>Up</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                              <span>Down</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewVendor(vendor.id, vendor.name)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <ThumbsDown className="h-12 w-12 mb-2 text-gray-300" />
                          <p className="text-lg font-medium">No vendors found</p>
                          <p className="text-sm">
                            {searchTerm ? "Try adjusting your search term" : "No vendor data available"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPanelLayout>
  );
}
