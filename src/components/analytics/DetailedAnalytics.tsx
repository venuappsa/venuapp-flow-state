
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { generateDetailedAnalyticsData } from "@/data/analyticsData";

interface DetailedAnalyticsProps {
  subscriptionTier?: string;
}

export default function DetailedAnalytics({ subscriptionTier = "Free" }: DetailedAnalyticsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("salesByTime");
  const data = generateDetailedAnalyticsData(subscriptionTier);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Detailed Analytics</h3>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="salesByTime">Sales By Time</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="feedback">Customer Feedback</TabsTrigger>
        </TabsList>
        
        {/* Sales By Time Tab */}
        <TabsContent value="salesByTime" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sales by Hour of Day</CardTitle>
                <CardDescription>Average sales distribution by hour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      sales: {
                        label: "Sales",
                        theme: {
                          light: "#ff6b00",
                          dark: "#ff6b00"
                        },
                      },
                      traffic: {
                        label: "Guest Traffic",
                        theme: {
                          light: "#60a5fa",
                          dark: "#60a5fa" 
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data.hourlyData}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="hour" />
                        <YAxis yAxisId="left" tickFormatter={(value) => `R${value}`} />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip formatter={(value, name) => name === "sales" ? `R${value}` : value} />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#ff6b00" 
                          strokeWidth={2} 
                          activeDot={{ r: 8 }}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="traffic" 
                          stroke="#60a5fa" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sales by Day of Week</CardTitle>
                <CardDescription>Revenue patterns across weekdays</CardDescription>
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
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.weekdayData}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis tickFormatter={(value) => `R${value}`} />
                        <Tooltip formatter={(value) => `R${value}`} />
                        <Bar dataKey="revenue" fill="#ff6b00" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly Sales Trends</CardTitle>
              <CardDescription>Year-to-date monthly performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    thisYear: {
                      label: "This Year",
                      theme: {
                        light: "#ff6b00",
                        dark: "#ff6b00"
                      },
                    },
                    lastYear: {
                      label: "Last Year",
                      theme: {
                        light: "#a0a0a0",
                        dark: "#a0a0a0"
                      }
                    }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.monthlyTrendsData}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#ff6b00" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `R${value}`} />
                      <Tooltip formatter={(value) => `R${value}`} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="thisYear" 
                        stroke="#ff6b00" 
                        fillOpacity={1}
                        fill="url(#colorThisYear)" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lastYear" 
                        stroke="#a0a0a0" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Selling Products</CardTitle>
                <CardDescription>By revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        theme: {
                          light: "#22c55e",
                          dark: "#22c55e"
                        },
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.topProductsData}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" tickFormatter={(value) => `R${value}`} />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip formatter={(value) => `R${value}`} />
                        <Bar dataKey="revenue" fill="#22c55e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue by Category</CardTitle>
                <CardDescription>Distribution across product types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Value",
                        theme: {
                          light: "#8b5cf6",
                          dark: "#8b5cf6"
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.categoryDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.categoryDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `R${value}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Performance Over Time</CardTitle>
              <CardDescription>Trending products by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    food: {
                      label: "Food",
                      theme: {
                        light: "#22c55e",
                        dark: "#22c55e"
                      },
                    },
                    drinks: {
                      label: "Drinks",
                      theme: {
                        light: "#3b82f6",
                        dark: "#3b82f6"
                      },
                    },
                    merchandise: {
                      label: "Merchandise",
                      theme: {
                        light: "#8b5cf6",
                        dark: "#8b5cf6"
                      },
                    }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.productTrendsData}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `R${value}`} />
                      <Tooltip formatter={(value) => `R${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="food" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="drinks" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="merchandise" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Vendor Commission Structure</CardTitle>
                <CardDescription>Revenue share by vendor type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      hostRevenue: {
                        label: "Host Revenue",
                        theme: {
                          light: "#ff6b00",
                          dark: "#ff6b00"
                        },
                      },
                      vendorRevenue: {
                        label: "Vendor Revenue",
                        theme: {
                          light: "#3b82f6",
                          dark: "#3b82f6"
                        },
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.vendorCommissionData}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `R${value}`} />
                        <Tooltip formatter={(value) => `R${value}`} />
                        <Legend />
                        <Bar dataKey="hostRevenue" stackId="a" fill="#ff6b00" />
                        <Bar dataKey="vendorRevenue" stackId="a" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Vendor Performance Comparison</CardTitle>
                <CardDescription>Revenue vs customer satisfaction</CardDescription>
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
                      satisfaction: {
                        label: "Satisfaction",
                        theme: {
                          light: "#22c55e", 
                          dark: "#22c55e"
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data.vendorPerformanceComparisonData}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" tickFormatter={(value) => `R${value}`} />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                        <Tooltip formatter={(value, name) => name === "revenue" ? `R${value}` : `${value}/5`} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="revenue" fill="#ff6b00" />
                        <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#22c55e" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vendor Activity Timeline</CardTitle>
              <CardDescription>Sales activity by hour and vendor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    food: {
                      label: "Food Vendors",
                      theme: {
                        light: "#22c55e",
                        dark: "#22c55e"
                      },
                    },
                    drinks: {
                      label: "Drink Vendors",
                      theme: {
                        light: "#3b82f6",
                        dark: "#3b82f6"
                      },
                    },
                    merchandise: {
                      label: "Merchandise Vendors",
                      theme: {
                        light: "#8b5cf6",
                        dark: "#8b5cf6"
                      },
                    }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.vendorActivityData}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDrinks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorMerchandise" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="food" stroke="#22c55e" fillOpacity={1} fill="url(#colorFood)" />
                      <Area type="monotone" dataKey="drinks" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDrinks)" />
                      <Area type="monotone" dataKey="merchandise" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMerchandise)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Customer Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Satisfaction Scores</CardTitle>
                <CardDescription>Average ratings by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      rating: {
                        label: "Rating",
                        theme: {
                          light: "#8b5cf6",
                          dark: "#8b5cf6"
                        },
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.satisfactionScoresData}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="category" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip formatter={(value) => `${value}/5`} />
                        <Bar dataKey="rating" fill="#8b5cf6">
                          {data.satisfactionScoresData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.rating >= 4.5 ? "#22c55e" : entry.rating >= 3.5 ? "#eab308" : "#ef4444"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Feedback Trends</CardTitle>
                <CardDescription>Monthly satisfaction over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      overall: {
                        label: "Overall",
                        theme: {
                          light: "#8b5cf6",
                          dark: "#8b5cf6"
                        },
                      },
                      venue: {
                        label: "Venue",
                        theme: {
                          light: "#3b82f6",
                          dark: "#3b82f6"
                        },
                      },
                      vendor: {
                        label: "Vendors",
                        theme: {
                          light: "#22c55e",
                          dark: "#22c55e"
                        },
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data.feedbackTrendsData}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip formatter={(value) => `${value}/5`} />
                        <Legend />
                        <Line type="monotone" dataKey="overall" stroke="#8b5cf6" strokeWidth={2} />
                        <Line type="monotone" dataKey="venue" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="vendor" stroke="#22c55e" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Feedback Analysis</CardTitle>
              <CardDescription>Common themes from customer reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    positive: {
                      label: "Positive",
                      theme: {
                        light: "#22c55e",
                        dark: "#22c55e"
                      },
                    },
                    negative: {
                      label: "Negative",
                      theme: {
                        light: "#ef4444",
                        dark: "#ef4444"
                      },
                    }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.feedbackAnalysisData}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="theme" type="category" width={80} />
                      <Tooltip formatter={(value, name) => [`${value} mentions`, name]} />
                      <Legend />
                      <Bar dataKey="positive" fill="#22c55e" />
                      <Bar dataKey="negative" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
