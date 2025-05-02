
import React from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  CalendarPlus,
  Check,
  ChartBar,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Store,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  // Fetch user count by role - in a real implementation this would come from Supabase
  const { data: userStats, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["admin-user-stats"],
    queryFn: async () => {
      // In a real implementation, we would fetch this from the database
      // For now, returning mock data
      return {
        total: 1930,
        hosts: 34,
        vendors: 19,
        fetchmen: 11,
        attendees: 1866
      };
    },
    staleTime: 60000, // 1 minute
  });

  // Fetch verification queue
  const { data: verificationQueue, isLoading: isLoadingVerification } = useQuery({
    queryKey: ["admin-verification-queue"],
    queryFn: async () => {
      // In a real implementation, we would fetch this from the database
      // For now, returning mock data
      return {
        pending: 7,
        approved: 42,
        rejected: 3
      };
    },
    staleTime: 60000, // 1 minute
  });

  // Fetch events data
  const { data: eventsData, isLoading: isLoadingEvents } = useQuery({
    queryKey: ["admin-events-data"],
    queryFn: async () => {
      // In a real implementation, we would fetch this from the database
      // For now, returning mock data
      return {
        upcoming: 18,
        past: 34,
        totalAttendees: 5240,
        averageVendors: 8
      };
    },
    staleTime: 60000, // 1 minute
  });

  // Fetch financial data
  const { data: financialData, isLoading: isLoadingFinancial } = useQuery({
    queryKey: ["admin-financial-data"],
    queryFn: async () => {
      // In a real implementation, we would fetch this from the database
      // For now, returning mock data
      return {
        monthlyRevenue: 32000,
        pendingPayouts: 8500,
        subscriptions: {
          active: 27,
          trial: 5,
          expired: 2
        }
      };
    },
    staleTime: 60000, // 1 minute
  });

  // Calculate growth metrics (mock data)
  const growthData = {
    userGrowth: "+12%",
    revenueGrowth: "+8%",
    eventGrowth: "+15%",
    churnRate: "3.2%",
    conversionRate: "6.8%",
    activationRate: "72%"
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="text-muted-foreground">Monitor and manage Venuapp platform performance</p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoadingUsers ? "—" : userStats?.total}</div>
            <div className="text-xs text-emerald-500 mt-1">{growthData.userGrowth} from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R {isLoadingFinancial ? "—" : financialData?.monthlyRevenue.toLocaleString()}</div>
            <div className="text-xs text-emerald-500 mt-1">{growthData.revenueGrowth} from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoadingEvents ? "—" : eventsData?.upcoming}</div>
            <div className="text-xs text-muted-foreground mt-1">{isLoadingEvents ? "—" : eventsData?.past} past events</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verification Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoadingVerification ? "—" : verificationQueue?.pending}</div>
            <div className="text-xs text-muted-foreground mt-1">Pending approval</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="users">User Metrics</TabsTrigger>
          <TabsTrigger value="finance">Financial Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown by role</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="h-32 flex items-center justify-center">Loading user data...</div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Hosts</span>
                        <span className="text-sm font-semibold">{userStats?.hosts}</span>
                      </div>
                      <Progress value={(userStats?.hosts || 0) / (userStats?.total || 1) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Vendors/Merchants</span>
                        <span className="text-sm font-semibold">{userStats?.vendors}</span>
                      </div>
                      <Progress value={(userStats?.vendors || 0) / (userStats?.total || 1) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Fetchmen</span>
                        <span className="text-sm font-semibold">{userStats?.fetchmen}</span>
                      </div>
                      <Progress value={(userStats?.fetchmen || 0) / (userStats?.total || 1) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Attendees</span>
                        <span className="text-sm font-semibold">{userStats?.attendees}</span>
                      </div>
                      <Progress value={(userStats?.attendees || 0) / (userStats?.total || 1) * 100} className="h-2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 text-emerald-500">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Activation Rate</span>
                    </div>
                    <span className="text-sm font-semibold">{growthData.activationRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 text-red-500">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Churn Rate</span>
                    </div>
                    <span className="text-sm font-semibold">{growthData.churnRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 text-blue-500">
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="text-sm">Conversion Rate</span>
                    </div>
                    <span className="text-sm font-semibold">{growthData.conversionRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 text-amber-500">
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="text-sm">User Growth</span>
                    </div>
                    <span className="text-sm font-semibold">{growthData.userGrowth}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Items requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="text-sm">Verification Requests</span>
                    </div>
                    <span className="text-sm font-semibold">{isLoadingVerification ? "—" : verificationQueue?.pending}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">Pending Payouts</span>
                    </div>
                    <span className="text-sm font-semibold">R {isLoadingFinancial ? "—" : financialData?.pendingPayouts.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center">
                      <CalendarPlus className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm">Event Approvals</span>
                    </div>
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <Store className="h-4 w-4 mr-2 text-venu-orange" />
                      <span className="text-sm">Vendor Applications</span>
                    </div>
                    <span className="text-sm font-semibold">5</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>Updated 5 minutes ago</span>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Newly created or updated events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Summer Gala</p>
                      <p className="text-xs text-muted-foreground">Host: John Doe • May 15, 2025</p>
                    </div>
                    <div className="bg-blue-50 text-blue-800 text-xs rounded-full px-2 py-1">Upcoming</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Winter Wonderland Party</p>
                      <p className="text-xs text-muted-foreground">Host: Jane Smith • Jun 3, 2025</p>
                    </div>
                    <div className="bg-amber-50 text-amber-800 text-xs rounded-full px-2 py-1">Draft</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Food Fest</p>
                      <p className="text-xs text-muted-foreground">Host: Amira Naidoo • Jun 10, 2025</p>
                    </div>
                    <div className="bg-green-50 text-green-800 text-xs rounded-full px-2 py-1">Confirmed</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Music Carnival</p>
                      <p className="text-xs text-muted-foreground">Host: Bongani Luthuli • Jun 25, 2025</p>
                    </div>
                    <div className="bg-blue-50 text-blue-800 text-xs rounded-full px-2 py-1">Upcoming</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscription Status</CardTitle>
                <CardDescription>Active subscription overview</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingFinancial ? (
                  <div className="h-48 flex items-center justify-center">Loading subscription data...</div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Subscriptions</span>
                        <span className="text-sm font-semibold">{financialData?.subscriptions.active}</span>
                      </div>
                      <Progress value={(financialData?.subscriptions.active || 0) / ((financialData?.subscriptions.active || 0) + (financialData?.subscriptions.trial || 0) + (financialData?.subscriptions.expired || 0)) * 100} className="h-2 bg-gray-100" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Trial Subscriptions</span>
                        <span className="text-sm font-semibold">{financialData?.subscriptions.trial}</span>
                      </div>
                      <Progress value={(financialData?.subscriptions.trial || 0) / ((financialData?.subscriptions.active || 0) + (financialData?.subscriptions.trial || 0) + (financialData?.subscriptions.expired || 0)) * 100} className="h-2 bg-gray-100" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Expired Subscriptions</span>
                        <span className="text-sm font-semibold">{financialData?.subscriptions.expired}</span>
                      </div>
                      <Progress value={(financialData?.subscriptions.expired || 0) / ((financialData?.subscriptions.active || 0) + (financialData?.subscriptions.trial || 0) + (financialData?.subscriptions.expired || 0)) * 100} className="h-2 bg-gray-100" />
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <span className="text-sm font-medium">Average Subscription Value</span>
                      <span className="text-sm font-semibold">R 1,185 / month</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Acquisition</CardTitle>
              <CardDescription>New user sign-ups over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                <div className="text-center">
                  <ChartBar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">User acquisition chart will render here</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Activity measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Active Users</span>
                    <span className="font-semibold">248</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly Active Users</span>
                    <span className="font-semibold">1,452</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">DAU/MAU Ratio</span>
                    <span className="font-semibold">17.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Session Duration</span>
                    <span className="font-semibold">8m 24s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Funnel</CardTitle>
                <CardDescription>User journey completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sign Up</span>
                      <span className="text-sm font-semibold">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile Completion</span>
                      <span className="text-sm font-semibold">84%</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">First Event/Venue</span>
                      <span className="text-sm font-semibold">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Revenue-generating</span>
                      <span className="text-sm font-semibold">38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="finance" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>By revenue source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Subscriptions</span>
                    <span className="text-sm font-semibold">R 28,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Transaction Fees</span>
                    <span className="text-sm font-semibold">R 2,850</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Service Fees</span>
                    <span className="text-sm font-semibold">R 650</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>R 32,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cost Metrics</CardTitle>
                <CardDescription>Key financial indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CAC (Customer Acquisition Cost)</span>
                    <span className="text-sm font-semibold">R 280</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LTV (Lifetime Value)</span>
                    <span className="text-sm font-semibold">R 4,200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LTV:CAC Ratio</span>
                    <span className="text-sm font-semibold">15:1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payback Period</span>
                    <span className="text-sm font-semibold">2.4 months</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Processing</CardTitle>
                <CardDescription>Payment gateway metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Successful Transactions</span>
                    <span className="text-sm font-semibold">98.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed Transactions</span>
                    <span className="text-sm font-semibold">1.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Refund Rate</span>
                    <span className="text-sm font-semibold">0.4%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg. Processing Time</span>
                    <span className="text-sm font-semibold">1.2s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecast</CardTitle>
              <CardDescription>Projected revenue for next 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                <div className="text-center">
                  <ChartBar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">Revenue forecast chart will render here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
