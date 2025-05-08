import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart, PieArcSeries, PieArc } from "@/components/ui/recharts";
import { 
  Download, 
  Calendar, 
  BarChart4, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type ChartData = {
  date: string;
  value: number;
}[];

export default function AdminReportsPage() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30");
  
  const currentDate = new Date();
  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);

  // Mock data for various reports
  const userRegistrationData: ChartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 20) + 5
    };
  });

  const eventCreationData: ChartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 12) + 2
    };
  });

  const revenueData: ChartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 1000) + 500
    };
  });

  const userTypesData = [
    { name: "Hosts", value: 35 },
    { name: "Vendors", value: 45 },
    { name: "Regular Users", value: 20 }
  ];

  const eventCategoriesData = [
    { name: "Weddings", value: 32 },
    { name: "Corporate", value: 28 },
    { name: "Birthdays", value: 15 },
    { name: "Conferences", value: 25 }
  ];

  const revenueSourcesData = [
    { name: "Subscriptions", value: 65 },
    { name: "Transaction Fees", value: 25 },
    { name: "Premium Features", value: 10 }
  ];

  const handleExportReport = (reportType: string) => {
    toast({
      title: "Export initiated",
      description: `${reportType} report is being exported`
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Data refreshed",
      description: "Report data has been refreshed"
    });
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500">View detailed reports and platform analytics</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,245</div>
            <p className="text-sm text-emerald-600 mt-1">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">342</div>
            <p className="text-sm text-emerald-600 mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Platform revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$24,580</div>
            <p className="text-sm text-emerald-600 mt-1">+5.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Growth Metrics</CardTitle>
              <CardDescription>Key platform growth indicators</CardDescription>
            </div>
            <Tabs defaultValue="users" className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users">
                  <BarChart4 className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="events">
                  <LineChartIcon className="h-4 w-4 mr-2" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="revenue">
                  <PieChartIcon className="h-4 w-4 mr-2" />
                  Revenue
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="users" className="h-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">User Registrations</h3>
              <Button variant="outline" size="sm" onClick={() => handleExportReport("User Registrations")}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <LineChart
              data={userRegistrationData}
              index="date"
              categories={["value"]}
              colors={["#8B5CF6"]}
              valueFormatter={(value) => `${value} users`}
              showXAxis
              showYAxis
              showLegend={false}
              showTooltip
              showGridLines
              startEndOnly
              tickGap={4}
              className="h-[300px]"
              areaOpacity={0.3}
              xAxisFormatter={formatDate}
            />
          </TabsContent>
          <TabsContent value="events" className="h-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Event Creation</h3>
              <Button variant="outline" size="sm" onClick={() => handleExportReport("Event Creation")}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <BarChart
              data={eventCreationData}
              index="date"
              categories={["value"]}
              colors={["#10B981"]}
              valueFormatter={(value) => `${value} events`}
              showXAxis
              showYAxis
              showLegend={false}
              showTooltip
              showGridLines
              startEndOnly
              tickGap={4}
              className="h-[300px]"
              xAxisFormatter={formatDate}
            />
          </TabsContent>
          <TabsContent value="revenue" className="h-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Revenue Growth</h3>
              <Button variant="outline" size="sm" onClick={() => handleExportReport("Revenue Growth")}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <LineChart
              data={revenueData}
              index="date"
              categories={["value"]}
              colors={["#F59E0B"]}
              valueFormatter={(value) => `$${value}`}
              showXAxis
              showYAxis
              showLegend={false}
              showTooltip
              showGridLines
              startEndOnly
              tickGap={4}
              className="h-[300px]"
              xAxisFormatter={formatDate}
            />
          </TabsContent>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>User types on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button variant="ghost" size="sm" onClick={() => handleExportReport("User Distribution")}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <div className="h-[300px]">
              <PieChart
                data={userTypesData}
                index="name"
                category="value"
                colors={["#8B5CF6", "#10B981", "#F59E0B"]}
                valueFormatter={(value) => `${value}%`}
                showTooltip
                showLegend
                className="h-[300px]"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Event Categories</CardTitle>
            <CardDescription>Distribution of event types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button variant="ghost" size="sm" onClick={() => handleExportReport("Event Categories")}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <div className="h-[300px]">
              <PieChart
                data={eventCategoriesData}
                index="name"
                category="value"
                colors={["#F59E0B", "#10B981", "#8B5CF6", "#3B82F6"]}
                valueFormatter={(value) => `${value}%`}
                showTooltip
                showLegend
                className="h-[300px]"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
            <CardDescription>Breakdown of revenue streams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button variant="ghost" size="sm" onClick={() => handleExportReport("Revenue Sources")}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <div className="h-[300px]">
              <PieChart
                data={revenueSourcesData}
                index="name"
                category="value"
                colors={["#3B82F6", "#10B981", "#F59E0B"]}
                valueFormatter={(value) => `${value}%`}
                showTooltip
                showLegend
                className="h-[300px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
