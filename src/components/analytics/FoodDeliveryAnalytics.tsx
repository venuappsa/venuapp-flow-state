
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Clock, ShoppingBag, TrendingUp, Map, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { generateMockAnalyticsData, generateDetailedFoodDeliveryData } from "@/data/analyticsData";
import { getTierLevel } from "@/utils/pricingUtils";

interface FoodDeliveryAnalyticsProps {
  subscriptionTier?: string;
}

export default function FoodDeliveryAnalytics({ subscriptionTier = "Free Plan" }: FoodDeliveryAnalyticsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("sales");
  const { foodDeliveryData } = generateMockAnalyticsData(subscriptionTier);
  const detailedData = generateDetailedFoodDeliveryData();
  const tierLevel = getTierLevel(subscriptionTier);
  
  const formatTime = (minutes: number) => {
    return `${minutes} min`;
  };
  
  return (
    <div className="space-y-6">
      <DashboardSection 
        title="Food Delivery Overview" 
        description="Key metrics for your food delivery operations"
        gradient
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <StatCard
            title="Average Delivery Time"
            value={formatTime(foodDeliveryData.orderFulfillment.averageTotalTime)}
            description="From order to delivery"
            icon={<Clock className="h-5 w-5" />}
            change={"-2 min"}
            changeType="positive"
          />
          <StatCard
            title="Most Popular Item"
            value={foodDeliveryData.popularItems[0].name}
            description={`${foodDeliveryData.popularItems[0].sales} orders this month`}
            icon={<ShoppingBag className="h-5 w-5" />}
            gradient
          />
          <StatCard
            title="On-Time Delivery Rate"
            value={`${foodDeliveryData.orderFulfillment.onTimeDeliveryRate}%`}
            description="Orders delivered on time"
            icon={<TrendingUp className="h-5 w-5" />}
            change={"+2%"}
            changeType="positive"
          />
          <StatCard
            title="Busiest Delivery Zone"
            value={foodDeliveryData.deliveryZones[0].name}
            description={`${foodDeliveryData.deliveryZones[0].orders} orders this month`}
            icon={<Map className="h-5 w-5" />}
            gradient
          />
        </div>
      </DashboardSection>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="items">Item Performance</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Metrics</TabsTrigger>
          <TabsTrigger value="preferences">Customer Preferences</TabsTrigger>
        </TabsList>
        
        {/* Sales Analytics Tab */}
        <TabsContent value="sales" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Orders by Hour</CardTitle>
                <CardDescription>Daily order distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      orders: {
                        label: "Orders",
                        theme: {
                          light: "#ff6b00",
                          dark: "#ff6b00"
                        },
                      },
                      avgDeliveryTime: {
                        label: "Avg. Delivery Time",
                        theme: {
                          light: "#60a5fa",
                          dark: "#60a5fa" 
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={foodDeliveryData.ordersByHour}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="hour" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" unit=" min" />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          yAxisId="left"
                          dataKey="orders" 
                          fill="#ff6b00" 
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="avgDeliveryTime" 
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
                <CardTitle className="text-base">Sales by Food Category</CardTitle>
                <CardDescription>Category performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      sales: {
                        label: "Sales",
                        theme: {
                          light: "#22c55e",
                          dark: "#22c55e"
                        },
                      },
                      preference: {
                        label: "Customer Preference",
                        theme: {
                          light: "#8b5cf6",
                          dark: "#8b5cf6"
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={foodDeliveryData.foodCategories}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="sales" fill="#22c55e" />
                        <Line yAxisId="right" type="monotone" dataKey="preference" stroke="#8b5cf6" strokeWidth={2} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Sales Trends</CardTitle>
              <CardDescription>Order volume and average value by day</CardDescription>
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
                    orders: {
                      label: "Orders",
                      theme: {
                        light: "#3b82f6",
                        dark: "#3b82f6"
                      },
                    },
                    averageOrderValue: {
                      label: "Avg Order Value",
                      theme: {
                        light: "#22c55e",
                        dark: "#22c55e"
                      },
                    }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={detailedData.weeklySalesTrends}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip formatter={(value, name) => [`R${value}`, name]}/>
                      <Legend />
                      <Bar yAxisId="left" dataKey="sales" fill="#ff6b00" />
                      <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="averageOrderValue" stroke="#22c55e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Item Performance Tab */}
        <TabsContent value="items" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Selling Items</CardTitle>
                <CardDescription>Items by sales volume</CardDescription>
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
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={foodDeliveryData.popularItems}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#ff6b00" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Average Preparation Time</CardTitle>
                <CardDescription>Time to prepare each item</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      avgPreparationTime: {
                        label: "Preparation Time",
                        theme: {
                          light: "#3b82f6",
                          dark: "#3b82f6"
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={foodDeliveryData.popularItems}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" unit=" min" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip formatter={(value) => [`${value} min`, "Prep Time"]}/>
                        <Bar dataKey="avgPreparationTime" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Time to Sell</CardTitle>
                <CardDescription>Average time between orders of same item</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      avgTimeToSell: {
                        label: "Avg Time to Sell",
                        theme: {
                          light: "#8b5cf6",
                          dark: "#8b5cf6"
                        },
                      },
                      peakHourTimeToSell: {
                        label: "Peak Hour Time",
                        theme: {
                          light: "#ec4899",
                          dark: "#ec4899"
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={foodDeliveryData.productTimeEfficiency}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis unit=" min" />
                        <Tooltip formatter={(value) => [`${value} min`, "Time"]}/>
                        <Legend />
                        <Bar dataKey="avgTimeToSell" fill="#8b5cf6" />
                        <Bar dataKey="peakHourTimeToSell" fill="#ec4899" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Reorder Rate</CardTitle>
                <CardDescription>Percentage of customers who reorder the item</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      reorderRate: {
                        label: "Reorder Rate",
                        theme: {
                          light: "#22c55e",
                          dark: "#22c55e"
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={foodDeliveryData.reorderRates}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis unit="%" domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, "Reorder Rate"]}/>
                        <Bar dataKey="reorderRate" fill="#22c55e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preparation Time by Hour</CardTitle>
              <CardDescription>How preparation time varies throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    burgers: {
                      label: "Burgers",
                      theme: {
                        light: "#ff6b00",
                        dark: "#ff6b00"
                      },
                    },
                    pizza: {
                      label: "Pizza",
                      theme: {
                        light: "#3b82f6",
                        dark: "#3b82f6"
                      },
                    },
                    salads: {
                      label: "Salads",
                      theme: {
                        light: "#22c55e",
                        dark: "#22c55e"
                      },
                    },
                    desserts: {
                      label: "Desserts",
                      theme: {
                        light: "#ec4899",
                        dark: "#ec4899"
                      },
                    }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={detailedData.preparationTimeByHour}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="hour" />
                      <YAxis unit=" min" />
                      <Tooltip formatter={(value) => [`${value} min`, "Prep Time"]}/>
                      <Legend />
                      <Line type="monotone" dataKey="burgers" stroke="#ff6b00" strokeWidth={2} />
                      <Line type="monotone" dataKey="pizza" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="salads" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="desserts" stroke="#ec4899" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Delivery Metrics Tab */}
        <TabsContent value="delivery" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery Time by Zone</CardTitle>
                <CardDescription>Average delivery time in each zone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      avgDeliveryTime: {
                        label: "Delivery Time",
                        theme: {
                          light: "#ff6b00",
                          dark: "#ff6b00"
                        },
                      },
                      orders: {
                        label: "Order Volume",
                        theme: {
                          light: "#3b82f6",
                          dark: "#3b82f6"
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={foodDeliveryData.deliveryZones}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" unit=" min" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip formatter={(value, name) => name === "avgDeliveryTime" ? [`${value} min`, name] : [value, name]}/>
                        <Legend />
                        <Bar yAxisId="left" dataKey="avgDeliveryTime" fill="#ff6b00" />
                        <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Fulfillment Breakdown</CardTitle>
                <CardDescription>Time spent in each stage of delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      time: {
                        label: "Time (minutes)",
                        theme: {
                          light: "#3b82f6",
                          dark: "#3b82f6"
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={detailedData.deliveryTimeBreakdown}
                        margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" unit=" min" />
                        <YAxis dataKey="stage" type="category" width={80} />
                        <Tooltip formatter={(value) => [`${value} min`, "Time"]}/>
                        <Bar dataKey="time" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Driver Performance</CardTitle>
                <CardDescription>Delivery times and ratings by driver</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      deliveries: {
                        label: "Deliveries",
                        theme: {
                          light: "#22c55e",
                          dark: "#22c55e"
                        },
                      },
                      avgTime: {
                        label: "Avg Time",
                        theme: {
                          light: "#ff6b00",
                          dark: "#ff6b00"
                        },
                      },
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
                        data={detailedData.driverPerformance}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="time" orientation="right" unit=" min" />
                        <YAxis yAxisId="rating" orientation="right" hide={true} domain={[0, 5]} />
                        <Tooltip formatter={(value, name) => name === "avgTime" ? [`${value} min`, name] : name === "rating" ? [`${value}/5`, name] : [value, name]}/>
                        <Legend />
                        <Bar yAxisId="left" dataKey="deliveries" fill="#22c55e" />
                        <Bar yAxisId="time" dataKey="avgTime" fill="#ff6b00" />
                        <Line yAxisId="rating" type="monotone" dataKey="rating" stroke="#8b5cf6" strokeWidth={2} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Completion Rates</CardTitle>
                <CardDescription>Completed vs. cancelled orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      completed: {
                        label: "Completed",
                        theme: {
                          light: "#22c55e",
                          dark: "#22c55e"
                        },
                      },
                      cancelled: {
                        label: "Cancelled",
                        theme: {
                          light: "#ef4444",
                          dark: "#ef4444"
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={foodDeliveryData.orderCompletionByDay}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" fill="#22c55e" />
                        <Bar dataKey="cancelled" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sales by Location</CardTitle>
              <CardDescription>Order volume by city</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    sales: {
                      label: "Sales",
                      theme: {
                        light: "#3b82f6",
                        dark: "#3b82f6"
                      },
                    }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={detailedData.salesByLocation}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="city" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R${value}`, "Sales"]}/>
                      <Bar dataKey="sales" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Customer Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Food Category Preferences</CardTitle>
                <CardDescription>Popularity of each category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      preference: {
                        label: "Preference",
                        theme: {
                          light: "#ff6b00",
                          dark: "#ff6b00"
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={foodDeliveryData.foodCategories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="preference"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {foodDeliveryData.foodCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#ff6b00', '#3b82f6', '#22c55e', '#8b5cf6', '#ec4899'][index % 5]} />
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
                <CardTitle className="text-base">Order Value Distribution</CardTitle>
                <CardDescription>Number of orders by value range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      count: {
                        label: "Orders",
                        theme: {
                          light: "#8b5cf6",
                          dark: "#8b5cf6"
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={detailedData.orderValueDistribution}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hourly Sales by Food Type</CardTitle>
                <CardDescription>Food preferences throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      burgers: {
                        label: "Burgers",
                        theme: {
                          light: "#ff6b00",
                          dark: "#ff6b00"
                        },
                      },
                      pizza: {
                        label: "Pizza",
                        theme: {
                          light: "#3b82f6",
                          dark: "#3b82f6"
                        },
                      },
                      salads: {
                        label: "Salads",
                        theme: {
                          light: "#22c55e",
                          dark: "#22c55e"
                        },
                      },
                      desserts: {
                        label: "Desserts",
                        theme: {
                          light: "#ec4899",
                          dark: "#ec4899"
                        },
                      },
                      drinks: {
                        label: "Drinks",
                        theme: {
                          light: "#8b5cf6",
                          dark: "#8b5cf6"
                        },
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={detailedData.hourlySalesByType}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="burgers" stroke="#ff6b00" strokeWidth={2} />
                        <Line type="monotone" dataKey="pizza" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="salads" stroke="#22c55e" strokeWidth={2} />
                        <Line type="monotone" dataKey="desserts" stroke="#ec4899" strokeWidth={2} />
                        <Line type="monotone" dataKey="drinks" stroke="#8b5cf6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Menu Item Trends</CardTitle>
                <CardDescription>Category popularity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      burgers: {
                        label: "Burgers",
                        theme: {
                          light: "#ff6b00",
                          dark: "#ff6b00"
                        },
                      },
                      pizza: {
                        label: "Pizza",
                        theme: {
                          light: "#3b82f6",
                          dark: "#3b82f6"
                        },
                      },
                      salads: {
                        label: "Salads",
                        theme: {
                          light: "#22c55e",
                          dark: "#22c55e"
                        },
                      },
                      desserts: {
                        label: "Desserts",
                        theme: {
                          light: "#ec4899",
                          dark: "#ec4899"
                        },
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={foodDeliveryData.menuItemTrends}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorBurgers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ff6b00" stopOpacity={0.2}/>
                          </linearGradient>
                          <linearGradient id="colorPizza" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          </linearGradient>
                          <linearGradient id="colorSalads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2}/>
                          </linearGradient>
                          <linearGradient id="colorDesserts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="burgers" stroke="#ff6b00" fillOpacity={1} fill="url(#colorBurgers)" />
                        <Area type="monotone" dataKey="pizza" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPizza)" />
                        <Area type="monotone" dataKey="salads" stroke="#22c55e" fillOpacity={1} fill="url(#colorSalads)" />
                        <Area type="monotone" dataKey="desserts" stroke="#ec4899" fillOpacity={1} fill="url(#colorDesserts)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer Preference Heatmap</CardTitle>
              <CardDescription>Food preferences by time of day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-w-full">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border border-gray-200 bg-gray-50">Time Slot</th>
                      <th className="px-4 py-2 border border-gray-200 bg-gray-50">Burgers</th>
                      <th className="px-4 py-2 border border-gray-200 bg-gray-50">Pizza</th>
                      <th className="px-4 py-2 border border-gray-200 bg-gray-50">Asian</th>
                      <th className="px-4 py-2 border border-gray-200 bg-gray-50">Salads</th>
                      <th className="px-4 py-2 border border-gray-200 bg-gray-50">Desserts</th>
                      <th className="px-4 py-2 border border-gray-200 bg-gray-50">Drinks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedData.preferenceHeatMap.map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 border border-gray-200 font-medium">{row.timeSlot}</td>
                        <td className="px-4 py-2 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <span>{row.Burgers}%</span>
                            <div 
                              className="w-full ml-2 h-4 bg-red-100 rounded"
                              style={{
                                background: `linear-gradient(90deg, rgba(255, 107, 0, ${row.Burgers / 100}) 0%, rgba(255, 107, 0, 0) 100%)`
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <span>{row.Pizza}%</span>
                            <div 
                              className="w-full ml-2 h-4 bg-blue-100 rounded"
                              style={{
                                background: `linear-gradient(90deg, rgba(59, 130, 246, ${row.Pizza / 100}) 0%, rgba(59, 130, 246, 0) 100%)`
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <span>{row.Asian}%</span>
                            <div 
                              className="w-full ml-2 h-4 bg-yellow-100 rounded"
                              style={{
                                background: `linear-gradient(90deg, rgba(250, 204, 21, ${row.Asian / 100}) 0%, rgba(250, 204, 21, 0) 100%)`
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <span>{row.Salads}%</span>
                            <div 
                              className="w-full ml-2 h-4 bg-green-100 rounded"
                              style={{
                                background: `linear-gradient(90deg, rgba(34, 197, 94, ${row.Salads / 100}) 0%, rgba(34, 197, 94, 0) 100%)`
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <span>{row.Desserts}%</span>
                            <div 
                              className="w-full ml-2 h-4 bg-pink-100 rounded"
                              style={{
                                background: `linear-gradient(90deg, rgba(236, 72, 153, ${row.Desserts / 100}) 0%, rgba(236, 72, 153, 0) 100%)`
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <span>{row.Drinks}%</span>
                            <div 
                              className="w-full ml-2 h-4 bg-purple-100 rounded"
                              style={{
                                background: `linear-gradient(90deg, rgba(139, 92, 246, ${row.Drinks / 100}) 0%, rgba(139, 92, 246, 0) 100%)`
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
