
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ArrowRight, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { getTierLevel } from "@/utils/pricingUtils";

interface DetailedAnalyticsProps {
  subscriptionTier: string;
}

export default function DetailedAnalytics({ subscriptionTier }: DetailedAnalyticsProps) {
  const currentTierLevel = getTierLevel(subscriptionTier);
  
  const mockData = [
    { name: "Mon", guests: 120, vendors: 8 },
    { name: "Tue", guests: 150, vendors: 10 },
    { name: "Wed", guests: 180, vendors: 12 },
    { name: "Thu", guests: 250, vendors: 15 },
    { name: "Fri", guests: 310, vendors: 20 },
    { name: "Sat", guests: 370, vendors: 22 },
    { name: "Sun", guests: 290, vendors: 18 }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Additional Analytics</h2>
        <Link to="/host/analytics">
          <Button variant="outline" size="sm">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Users className="h-4 w-4 mr-2" /> 
              Guest Attendance by Day
            </CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ChartContainer
                config={{
                  guests: {
                    label: "Guests",
                    theme: {
                      light: "#22c55e",
                      dark: "#22c55e"
                    },
                  }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockData}
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
                    <Bar dataKey="guests" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            <div className="mt-4 text-center">
              <Link to="/host/guests">
                <Button variant="ghost" size="sm" className="text-green-600">
                  View Detailed Guest Analytics <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" /> 
              Vendor Performance
            </CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ChartContainer
                config={{
                  vendors: {
                    label: "Vendors",
                    theme: {
                      light: "#3b82f6",
                      dark: "#3b82f6"
                    },
                  }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockData}
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
                    <Bar dataKey="vendors" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            <div className="mt-4 text-center">
              <Link to="/host/vendors">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View Detailed Vendor Analytics <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
