
import React, { useState } from "react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, LineChart, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell } from "recharts";
import { generateMockAnalyticsData, generateDetailedAnalyticsData } from "@/data/analyticsData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  Building, 
  CalendarDays,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Generate mock data
const analyticsData = generateMockAnalyticsData("Pro");
const detailedData = generateDetailedAnalyticsData("Pro");

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [isLoading, setIsLoading] = useState(false);

  // Switch data based on time range
  const handleTimeRangeChange = (value: string) => {
    setIsLoading(true);
    setTimeRange(value);
    
    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Convert revenue data for charts
  const getActiveVendorsData = () => {
    return analyticsData.vendorPerformanceData.slice(0, 5);
  };

  // Define chart colors
  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#8b5cf6" // Violet
    },
    target: {
      label: "Target",
      color: "#94a3b8" // Gray
    },
    tickets: {
      label: "Tickets",
      color: "#3b82f6" // Blue
    },
    vendors: {
      label: "Vendors",
      color: "#22c55e" // Green
    },
    food: {
      label: "Food",
      color: "#f59e0b" // Yellow
    },
    other: {
      label: "Other",
      color: "#64748b" // Slate
    }
  };

  return (
    <AdminPanelLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-8">
        <SummaryCard 
          title="Total Vendors"
          value="127"
          change="+12%"
          increased={true}
          icon={<Users className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <SummaryCard 
          title="Total Hosts"
          value="56"
          change="+8%"
          increased={true}
          icon={<Building className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <SummaryCard 
          title="Total Events"
          value="342"
          change="-3%"
          increased={false}
          icon={<CalendarDays className="h-5 w-5" />}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 mb-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-muted-foreground" />
                  Revenue Trend
                </div>
              </CardTitle>
            </div>
            <CardDescription>Monthly revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full aspect-[4/3]">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-[4/3]">
                <LineChart 
                  width={500}
                  height={300}
                  data={analyticsData.revenueData}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  {timeRange === "quarter" || timeRange === "year" ? (
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                    />
                  ) : null}
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
          
        {/* Active Vendors Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  Active Vendors This Month
                </div>
              </CardTitle>
            </div>
            <CardDescription>Bookings per vendor</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full aspect-[4/3]">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-[4/3]">
                <BarChart
                  width={500}
                  height={300}
                  data={getActiveVendorsData()}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="sales"
                    name="Sales"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    label={{ position: 'right', fill: '#888', fontSize: 12 }}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Quote Requests Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                  Quote Requests by Category
                </div>
              </CardTitle>
            </div>
            <CardDescription>Distribution across vendor categories</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full aspect-[4/3]">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-[4/3]">
                <PieChart width={500} height={300}>
                  <Pie 
                    data={analyticsData.vendorCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.vendorCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Growth Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Growth Opportunities</CardTitle>
            <CardDescription>Potential revenue increases</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="w-full h-16" />
                <Skeleton className="w-full h-16" />
                <Skeleton className="w-full h-16" />
              </div>
            ) : (
              <div className="space-y-4">
                {analyticsData.opportunities.map((opportunity, i) => (
                  <div key={i} className="flex flex-col space-y-2 bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{opportunity.title}</h4>
                      <span className="text-green-600 font-semibold">+${opportunity.potential.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPanelLayout>
  );
}

// Summary card component for dashboard metrics
const SummaryCard = ({ 
  title, 
  value, 
  change, 
  increased, 
  icon, 
  isLoading 
}: { 
  title: string;
  value: string;
  change: string;
  increased: boolean;
  icon: React.ReactNode;
  isLoading: boolean;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24 mb-1" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <div className="flex items-center pt-1">
              {increased ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-600" />
              )}
              <span className={increased ? "text-green-600" : "text-red-600"}>
                {change}
              </span>
              <span className="text-muted-foreground text-xs ml-2">from last 30 days</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Chart colors
const COLORS = ['#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];
