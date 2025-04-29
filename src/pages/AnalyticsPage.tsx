
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, Users, ShoppingBag, Calendar, PieChart, BarChart3, UtensilsCrossed } from "lucide-react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { useSubscription } from "@/hooks/useSubscription";
import { isPremiumFeature, getAnalyticsFeaturesForTier } from "@/utils/pricingUtils";
import AnalyticsSnapshot from "@/components/analytics/AnalyticsSnapshot";
import FoodDeliveryAnalytics from "@/components/analytics/FoodDeliveryAnalytics";

export default function AnalyticsPage() {
  const [analyticsType, setAnalyticsType] = useState("revenue");
  const { subscription_tier = "Free", subscribed, subscription_status } = useSubscription();
  
  // Update this line to only pass one parameter
  const features = getAnalyticsFeaturesForTier(subscription_tier || "Free Plan");
  
  const availableFeatures = features;
  
  const premiumNote = (
    <Alert className="bg-amber-50 mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Subscription Required</AlertTitle>
      <AlertDescription>
        Advanced analytics features are available on higher subscription tiers.
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/host/subscription"}>
            Upgrade Subscription
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
  
  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-gray-600 mt-2">View detailed metrics and insights for your business</p>
        </div>
        
        <AnalyticsSnapshot 
          subscriptionTier={subscription_tier} 
          subscriptionStatus={subscription_status}
          className="mb-8" 
        />
        
        <Tabs value={analyticsType} onValueChange={setAnalyticsType} className="w-full">
          <TabsList className="bg-gray-50 mb-6">
            <TabsTrigger value="revenue">
              <TrendingUp className="h-4 w-4 mr-2" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="guests" disabled={isPremiumFeature("Guest Analytics", subscription_tier)}>
              <Users className="h-4 w-4 mr-2" />
              Guests
            </TabsTrigger>
            <TabsTrigger value="vendors" disabled={isPremiumFeature("Vendor Analytics", subscription_tier)}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Vendors
            </TabsTrigger>
            <TabsTrigger value="forecast" disabled={isPremiumFeature("Forecast Analytics", subscription_tier)}>
              <Calendar className="h-4 w-4 mr-2" />
              Forecast
            </TabsTrigger>
            <TabsTrigger value="foodDelivery" disabled={isPremiumFeature("Food Delivery Analytics", subscription_tier)}>
              <UtensilsCrossed className="h-4 w-4 mr-2" />
              Food Delivery
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Revenue</CardTitle>
                  <CardDescription>All time revenue across all events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R 45,750.00</div>
                  <div className="text-sm text-green-600 font-medium mt-2">↑ 12.5% from previous period</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Monthly Revenue</CardTitle>
                  <CardDescription>Revenue for the current month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R 8,230.00</div>
                  <div className="text-sm text-green-600 font-medium mt-2">↑ 5.2% from last month</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Revenue per Event</CardTitle>
                  <CardDescription>Average revenue per event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R 9,150.00</div>
                  <div className="text-sm text-red-600 font-medium mt-2">↓ 3.1% from previous period</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-venu-orange" />
                    Revenue Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    <PieChart className="h-12 w-12 mb-2 mx-auto text-gray-400" />
                    <p>Revenue trend chart visualization</p>
                    <p className="text-sm mt-1">(Data visualization will appear here)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="guests" className="space-y-8">
            {isPremiumFeature("Guest Analytics", subscription_tier) ? (
              premiumNote
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Guests</CardTitle>
                    <CardDescription>All time guest count across all events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2,450</div>
                    <div className="text-sm text-green-600 font-medium mt-2">↑ 18.3% from previous period</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Monthly Guests</CardTitle>
                    <CardDescription>Guest count for the current month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">386</div>
                    <div className="text-sm text-green-600 font-medium mt-2">↑ 8.7% from last month</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Returning Guests</CardTitle>
                    <CardDescription>Guests who have attended multiple events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">32%</div>
                    <div className="text-sm text-green-600 font-medium mt-2">↑ 5.4% from previous period</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="vendors" className="space-y-8">
            {isPremiumFeature("Vendor Analytics", subscription_tier) ? (
              premiumNote
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Vendors</CardTitle>
                    <CardDescription>All active vendors across all events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">24</div>
                    <div className="text-sm text-green-600 font-medium mt-2">↑ 4 new vendors this month</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Average Sales</CardTitle>
                    <CardDescription>Average vendor sales per event</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">R 3,850</div>
                    <div className="text-sm text-green-600 font-medium mt-2">↑ 7.2% from last period</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Top Vendor Category</CardTitle>
                    <CardDescription>Most successful vendor category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">Food & Beverage</div>
                    <div className="text-sm text-gray-600 font-medium mt-2">58% of total vendor revenue</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="forecast" className="space-y-8">
            {isPremiumFeature("Forecast Analytics", subscription_tier) ? (
              premiumNote
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Projected Revenue</CardTitle>
                    <CardDescription>Forecasted revenue for next 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">R 12,850</div>
                    <div className="text-sm text-green-600 font-medium mt-2">↑ 15.3% from current month</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Expected Guests</CardTitle>
                    <CardDescription>Projected attendance next 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">425</div>
                    <div className="text-sm text-green-600 font-medium mt-2">↑ 10.1% from current month</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Growth Trend</CardTitle>
                    <CardDescription>6-month business growth forecast</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">+22%</div>
                    <div className="text-sm text-green-600 font-medium mt-2">Strong positive outlook</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="foodDelivery" className="space-y-8">
            {isPremiumFeature("Food Delivery Analytics", subscription_tier) ? (
              premiumNote
            ) : (
              <FoodDeliveryAnalytics subscriptionTier={subscription_tier} />
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="font-semibold text-lg mb-4">Available Analytics Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border flex items-start">
                <div className="bg-green-100 p-1.5 rounded-full mr-3 text-green-800">
                  <CheckIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">{feature.name}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HostPanelLayout>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
