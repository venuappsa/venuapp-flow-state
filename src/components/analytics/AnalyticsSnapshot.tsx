import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, Lock, ArrowRight, BarChart as BarChartIcon, Users } from "lucide-react";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { toast } from "@/components/ui/use-toast";
import { generateMockAnalyticsData } from "@/data/analyticsData";
import DetailedAnalytics from "./DetailedAnalytics";
import AnalyticsFeaturesList from "./AnalyticsFeaturesList";
import { getTierLevel, isPremiumFeature, getPricingPlans } from "@/utils/pricingUtils";

interface AnalyticsSnapshotProps {
  subscriptionTier?: string;
  subscriptionStatus?: string;
  className?: string;
}

export default function AnalyticsSnapshot({ subscriptionTier = "Free Plan", subscriptionStatus = "active", className = "" }: AnalyticsSnapshotProps) {
  const [selectedTab, setSelectedTab] = useState<string>("revenue");
  const navigate = useNavigate();
  const data = generateMockAnalyticsData(subscriptionTier);
  
  const currentTierLevel = getTierLevel(subscriptionTier);
  
  const handleTabClick = (tab: string) => {
    if (currentTierLevel < 1 && tab !== "revenue") {
      handleLockedFeatureClick();
      return;
    }
    
    setSelectedTab(tab);
    
    switch(tab) {
      case "revenue":
        navigate("/host/finance");
        break;
      case "guests":
      case "guestDetails":
        navigate("/host/guests");
        break;
      case "vendors":
        navigate("/host/vendors");
        break;
      case "forecasts":
        navigate("/host/events");
        break;
      default:
        break;
    }
  };

  const handleLockedFeatureClick = () => {
    toast({
      title: "Premium Feature",
      description: "Upgrade your subscription to access this analytics feature.",
      action: (
        <Link to="/subscribe">
          <Button variant="outline" size="sm">Upgrade</Button>
        </Link>
      ),
    });
  };

  const navigateToGuestAnalytics = () => {
    navigate('/host/guests');
  };

  const getDataWindowLabel = () => {
    switch (currentTierLevel) {
      case 0: return "Last 7 days";
      case 1: return "Last 30 days";
      case 2: return "Last 90 days";
      case 3:
      case 4: return "Last 12 months";
      default: return "Last 7 days";
    }
  };

  const getPlanDescription = () => {
    switch (subscriptionTier) {
      case "Free Plan": return "Basic metrics available on free plan";
      case "Starter": return "30-day data window with basic metrics";
      case "Growth": return "90-day data window with standard analytics";
      case "Pro": return "1-year data window with advanced metrics";
      case "Enterprise": return "Full analytics suite with unlimited history";
      default: return "Basic analytics package";
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Analytics {currentTierLevel < 1 && "(Limited)"}</h2>
          <p className="text-sm text-gray-500">
            {getPlanDescription()}
          </p>
        </div>
        {currentTierLevel < 4 && (
          <Link to="/subscribe">
            <Button variant="outline" size="sm" className="text-sm gap-1">
              <TrendingUp className="h-4 w-4" />
              Upgrade Analytics
            </Button>
          </Link>
        )}
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full bg-white border border-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="revenue" 
            className="flex-1"
            onClick={() => handleTabClick("revenue")}
          >
            Revenue
          </TabsTrigger>
          <TabsTrigger 
            value="guests" 
            className="flex-1" 
            disabled={currentTierLevel < 1}
            onClick={() => handleTabClick("guests")}
          >
            {currentTierLevel < 1 ? (
              <div className="flex items-center gap-1" onClick={handleLockedFeatureClick}>
                Guests <Lock className="h-3 w-3" />
              </div>
            ) : (
              "Guests"
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="guestDetails" 
            className="flex-1" 
            disabled={currentTierLevel < 2}
            onClick={() => handleTabClick("guestDetails")}
          >
            {currentTierLevel < 2 ? (
              <div className="flex items-center gap-1" onClick={handleLockedFeatureClick}>
                Guest Details <Lock className="h-3 w-3" />
              </div>
            ) : (
              "Guest Details"
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="vendors" 
            className="flex-1" 
            disabled={currentTierLevel < 2}
            onClick={() => handleTabClick("vendors")}
          >
            {currentTierLevel < 2 ? (
              <div className="flex items-center gap-1" onClick={handleLockedFeatureClick}>
                Vendors <Lock className="h-3 w-3" />
              </div>
            ) : (
              "Vendors"
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="forecasts" 
            className="flex-1" 
            disabled={currentTierLevel < 3}
            onClick={() => handleTabClick("forecasts")}
          >
            {currentTierLevel < 3 ? (
              <div className="flex items-center gap-1" onClick={handleLockedFeatureClick}>
                Forecasts <Lock className="h-3 w-3" />
              </div>
            ) : (
              "Forecasts"
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Revenue Overview</CardTitle>
              <CardDescription>
                {currentTierLevel === 0 && "Last 7 days"}
                {currentTierLevel === 1 && "Last 30 days"}
                {currentTierLevel === 2 && "Last 90 days"}
                {currentTierLevel >= 3 && "Last 12 months"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      theme: {
                        light: "#ff6b00",
                        dark: "#ff6b00"
                      },
                    },
                    target: {
                      label: "Target",
                      theme: {
                        light: "#a0a0a0",
                        dark: "#a0a0a0"
                      },
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.revenueData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#ff6b00" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }} 
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => {
                          if (currentTierLevel >= 3) {
                            return value.substring(0, 3); // Show month abbreviation for yearly data
                          }
                          return value;
                        }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `R${value}`}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        width={60}
                      />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip 
                        formatter={(value: number) => [`R${value.toLocaleString()}`, 'Revenue']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#ff6b00" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                      {currentTierLevel >= 1 && (
                        <Line 
                          type="monotone" 
                          dataKey="target" 
                          stroke="#a0a0a0" 
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              <div className="mt-4">
                <ChartLegend>
                  <ChartLegendContent />
                </ChartLegend>
              </div>
              
              <div className="mt-4 text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-venu-orange"
                  onClick={() => navigate("/host/finance")}
                >
                  View Detailed Revenue Analysis <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {currentTierLevel >= 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Revenue By Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ChartContainer
                      config={{
                        tickets: {
                          label: "Ticket Sales",
                          theme: {
                            light: "#ff6b00",
                            dark: "#ff6b00"
                          },
                        },
                        vendors: {
                          label: "Vendor Fees",
                          theme: {
                            light: "#ffa040",
                            dark: "#ffa040"
                          },
                        },
                        food: {
                          label: "Food & Drinks",
                          theme: {
                            light: "#ffc880",
                            dark: "#ffc880"
                          },
                        },
                        other: {
                          label: "Other",
                          theme: {
                            light: "#ffeccc",
                            dark: "#ffeccc"
                          },
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data.revenueBySourceData}
                          margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 20,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={(value) => `R${value}`} tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(value: number) => `R${value.toLocaleString()}`} />
                          <Bar dataKey="tickets" stackId="a" fill="#ff6b00" />
                          <Bar dataKey="vendors" stackId="a" fill="#ffa040" />
                          <Bar dataKey="food" stackId="a" fill="#ffc880" />
                          <Bar dataKey="other" stackId="a" fill="#ffeccc" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.recentTransactions.slice(0, 4).map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between pb-2 border-b">
                        <div>
                          <div className="font-medium text-sm">{transaction.description}</div>
                          <div className="text-xs text-gray-500">{transaction.date}</div>
                        </div>
                        <Badge 
                          variant={transaction.type === 'income' ? 'outline' : 'secondary'}
                          className={transaction.type === 'income' ? 'text-green-600 border-green-200' : ''}
                        >
                          {transaction.type === 'income' ? '+' : '-'} R{transaction.amount.toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full text-venu-orange">
                      View All Transactions <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {currentTierLevel < 1 && (
            <Card className="border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-6 text-center">
                <Lock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <h3 className="font-medium mb-1">Unlock Detailed Revenue Analytics</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Upgrade to our Starter plan or higher to access revenue breakdown by source,
                  transaction history, and longer historical data.
                </p>
                <Link to="/subscribe">
                  <Button>Upgrade Plan</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="guests" className="space-y-4">
          {currentTierLevel >= 1 ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Guest Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ChartContainer
                      config={{
                        attendance: {
                          label: "Attendance",
                          theme: {
                            light: "#22c55e",
                            dark: "#22c55e"
                          },
                        },
                        capacity: {
                          label: "Capacity",
                          theme: {
                            light: "#a0a0a0",
                            dark: "#a0a0a0"
                          },
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={data.guestAttendanceData}
                          margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="attendance" stroke="#22c55e" strokeWidth={2} />
                          <Line type="monotone" dataKey="capacity" stroke="#a0a0a0" strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              {currentTierLevel >= 2 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Guest Demographics</CardTitle>
                    <CardDescription>Distribution of attendees by age group</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ChartContainer
                        config={{
                          "18-24": {
                            label: "18-24",
                            theme: {
                              light: "#22c55e",
                              dark: "#22c55e"
                            },
                          },
                          "25-34": {
                            label: "25-34",
                            theme: {
                              light: "#16a34a",
                              dark: "#16a34a"
                            },
                          },
                          "35-44": {
                            label: "35-44",
                            theme: {
                              light: "#15803d",
                              dark: "#15803d"
                            },
                          },
                          "45-54": {
                            label: "45-54",
                            theme: {
                              light: "#166534",
                              dark: "#166534"
                            },
                          },
                          "55+": {
                            label: "55+",
                            theme: {
                              light: "#14532d",
                              dark: "#14532d"
                            },
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={data.demographicsData}
                            margin={{
                              top: 5,
                              right: 10,
                              left: 10,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="18-24" fill="#22c55e" />
                            <Bar dataKey="25-34" fill="#16a34a" />
                            <Bar dataKey="35-44" fill="#15803d" />
                            <Bar dataKey="45-54" fill="#166534" />
                            <Bar dataKey="55+" fill="#14532d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-6 text-center">
                <Lock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <h3 className="font-medium mb-1">Guest Analytics Unavailable</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Guest analytics are available on Starter plan and above.
                </p>
                <Link to="/subscribe">
                  <Button>Upgrade Plan</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="guestDetails" className="space-y-4">
          {currentTierLevel >= 2 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Guest Demographics</CardTitle>
                    <CardDescription>Breakdown of attendees by age group and gender</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer config={{}}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "18-24", value: 28, color: "#22c55e" },
                                { name: "25-34", value: 35, color: "#16a34a" },
                                { name: "35-44", value: 22, color: "#15803d" },
                                { name: "45-54", value: 10, color: "#166534" },
                                { name: "55+", value: 5, color: "#14532d" }
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {[
                                { name: "18-24", value: 28, color: "#22c55e" },
                                { name: "25-34", value: 35, color: "#16a34a" },
                                { name: "35-44", value: 22, color: "#15803d" },
                                { name: "45-54", value: 10, color: "#166534" },
                                { name: "55+", value: 5, color: "#14532d" }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Regional Distribution</CardTitle>
                    <CardDescription>Where your guests are coming from</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer config={{}}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={[
                              { region: "Johannesburg", value: 35 },
                              { region: "Pretoria", value: 22 },
                              { region: "Cape Town", value: 15 },
                              { region: "Durban", value: 12 },
                              { region: "Port Elizabeth", value: 8 },
                              { region: "Other", value: 8 }
                            ]}
                            margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="region" type="category" width={80} />
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Bar dataKey="value" fill="#ff6b00" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Guest Behavior</CardTitle>
                    <CardDescription>Attendance patterns by day of week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer config={{}}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { day: "Monday", attendance: 450 },
                              { day: "Tuesday", attendance: 380 },
                              { day: "Wednesday", attendance: 510 },
                              { day: "Thursday", attendance: 720 },
                              { day: "Friday", attendance: 950 },
                              { day: "Saturday", attendance: 1200 },
                              { day: "Sunday", attendance: 880 }
                            ]}
                            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="attendance" fill="#22c55e" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {currentTierLevel >= 3 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Guest Retention</CardTitle>
                      <CardDescription>First-time vs. returning guests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ChartContainer config={{}}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "First-time", value: 65, color: "#3b82f6" },
                                  { name: "Returning", value: 35, color: "#8b5cf6" }
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {[
                                  { name: "First-time", value: 65, color: "#3b82f6" },
                                  { name: "Returning", value: 35, color: "#8b5cf6" }
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}%`} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-dashed border-gray-300 bg-gray-50">
                    <CardContent className="p-6 text-center">
                      <Lock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <h3 className="font-medium mb-1">Guest Retention Analytics</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Upgrade to our Pro plan to access insights on first-time vs returning guests,
                        retention rate trends, and loyalty metrics.
                      </p>
                      <Link to="/subscribe">
                        <Button>Upgrade to Pro</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Guest Satisfaction Ratings</CardTitle>
                  <CardDescription>Average ratings across categories (out of 5)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer config={{}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { category: "Overall Experience", rating: 4.2 },
                            { category: "Event Quality", rating: 4.5 },
                            { category: "Food & Beverage", rating: 3.9 },
                            { category: "Staff Service", rating: 4.3 },
                            { category: "Value for Money", rating: 3.8 },
                            { category: "Venue Facilities", rating: 4.1 }
                          ]}
                          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="category" />
                          <YAxis domain={[0, 5]} />
                          <Tooltip formatter={(value) => `${value}/5`} />
                          <Bar dataKey="rating" fill="#ff6b00">
                            {[
                              { category: "Overall Experience", rating: 4.2 },
                              { category: "Event Quality", rating: 4.5 },
                              { category: "Food & Beverage", rating: 3.9 },
                              { category: "Staff Service", rating: 4.3 },
                              { category: "Value for Money", rating: 3.8 },
                              { category: "Venue Facilities", rating: 4.1 }
                            ].map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.rating > 4.2 ? "#22c55e" : entry.rating > 3.8 ? "#f59e0b" : "#ef4444"} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-6 text-center">
                <Lock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <h3 className="font-medium mb-1">Detailed Guest Analytics Unavailable</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Detailed guest analytics are available on Growth plan and above.
                </p>
                <Link to="/subscribe">
                  <Button>Upgrade Plan</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="vendors" className="space-y-4">
          {currentTierLevel >= 2 ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Vendor Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ChartContainer
                      config={{
                        sales: {
                          label: "Sales",
                          theme: {
                            light: "#3b82f6",
                            dark: "#3b82f6"
                          },
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data.vendorPerformanceData}
                          layout="vertical"
                          margin={{
                            top: 5,
                            right: 30,
                            left: 80,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" tickFormatter={(value) => `R${value}`} />
                          <YAxis dataKey="name" type="category" width={80} />
                          <Tooltip formatter={(value) => `R${value.toLocaleString()}`} />
                          <Bar dataKey="sales" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              {currentTierLevel >= 3 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Vendor Category Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex justify-center">
                      <ChartContainer
                        config={{
                          food: {
                            label: "Food",
                            theme: {
                              light: "#3b82f6",
                              dark: "#3b82f6"
                            },
                          },
                          drinks: {
                            label: "Drinks",
                            theme: {
                              light: "#60a5fa",
                              dark: "#60a5fa"
                            },
                          },
                          merchandise: {
                            label: "Merchandise",
                            theme: {
                              light: "#93c5fd",
                              dark: "#93c5fd"
                            },
                          },
                          services: {
                            label: "Services",
                            theme: {
                              light: "#bfdbfe",
                              dark: "#bfdbfe"
                            },
                          },
                          other: {
                            label: "Other",
                            theme: {
                              light: "#dbeafe",
                              dark: "#dbeafe"
                            },
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={data.vendorCategoryData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-6 text-center">
                <Lock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <h3 className="font-medium mb-1">Vendor Analytics Unavailable</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Vendor analytics are available on Growth plan and above.
                </p>
                <Link to="/subscribe">
                  <Button>Upgrade Plan</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="forecasts" className="space-y-4">
          {currentTierLevel >= 3 ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Revenue Forecast</CardTitle>
                  <CardDescription>Next 6 months projected revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ChartContainer
                      config={{
                        actual: {
                          label: "Actual",
                          theme: {
                            light: "#8b5cf6",
                            dark: "#8b5cf6"
                          },
                        },
                        forecast: {
                          label: "Forecast",
                          theme: {
                            light: "#c4b5fd",
                            dark: "#c4b5fd"
                          },
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={data.forecastData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => `R${value}`} />
                          <Tooltip formatter={(value) => `R${value.toLocaleString()}`} />
                          <Legend />
                          <Line type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={2} />
                          <Line type="monotone" dataKey="forecast" stroke="#c4b5fd" strokeWidth={2} strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  
                  <div className="mt-4 p-3 bg-purple-50 rounded-md border border-purple-100">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-purple-700">
                        <strong>Insight:</strong> Our AI forecasting model predicts a {data.forecastGrowth > 0 ? 'growth' : 'decline'} of {Math.abs(data.forecastGrowth)}% in revenue over the next 6 months based on your historical data and seasonal trends.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {currentTierLevel >= 4 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Opportunity Analysis</CardTitle>
                    <CardDescription>Potential revenue opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.opportunities.map((opportunity, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-md border">
                          <div className="flex items-start gap-2">
                            <div>
                              <h4 className="font-medium text-sm">{opportunity.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{opportunity.description}</p>
                              <div className="mt-2">
                                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                  Potential: R{opportunity.potential.toLocaleString()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-6 text-center">
                <Lock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <h3 className="font-medium mb-1">Forecasting Analytics Unavailable</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Revenue forecasting and opportunity analysis are available on Pro plan and above.
                </p>
                <Link to="/subscribe">
                  <Button>Upgrade Plan</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <AnalyticsFeaturesList tier={subscriptionTier} />
      </div>

      <div className="mt-8 flex justify-end">
        <Button 
          variant="outline" 
          className="gap-2 text-venu-orange border-venu-orange hover:bg-venu-orange/10"
          onClick={navigateToGuestAnalytics}
        >
          <BarChartIcon className="h-4 w-4" />
          View Detailed Guest Analytics
        </Button>
      </div>

      {currentTierLevel >= 2 && (
        <div className="mt-8">
          <DetailedAnalytics subscriptionTier={subscriptionTier} />
        </div>
      )}
    </div>
  );
}
