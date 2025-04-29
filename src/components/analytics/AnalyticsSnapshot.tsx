
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/useUser";
import { useSubscription } from "@/hooks/useSubscription";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AnalyticsSnapshotProps {
  subscriptionTier?: string;
  subscriptionStatus?: "active" | "expired" | "trial" | "none" | "paused";
  className?: string;
}

export const AnalyticsSnapshot = ({ 
  subscriptionTier, 
  subscriptionStatus,
  className = ""
}: AnalyticsSnapshotProps) => {
  const { user } = useUser();
  const { subscribed, subscription_tier = "Free Plan", subscription_status } = useSubscription();
  const navigate = useNavigate();
  
  // Use provided values or fallback to the ones from the hook
  const activeTier = subscriptionTier || subscription_tier;
  const activeStatus = subscriptionStatus || subscription_status;
  
  // Calculate available analytics features based on subscription tier
  const analyticsFeatures = {
    sales: true, // Available in all tiers
    customers: activeTier !== "Free Plan",
    products: activeTier !== "Free Plan",
    advanced: activeTier === "premium" || activeTier === "enterprise",
    predictive: activeTier === "enterprise"
  };
  
  return (
    <div className={`space-y-8 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-gray-500">
            View insights and performance metrics for your venues and events
          </p>
        </div>
        
        {(!subscribed && activeStatus !== "active") && (
          <Card className="w-full max-w-md bg-amber-50 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-amber-800">
                <Info className="h-5 w-5 mr-2" />
                Limited Analytics Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-700 mb-4">
                You're currently on the free plan with limited analytics. 
                Upgrade to access comprehensive analytics features.
              </p>
              <Button 
                onClick={() => navigate("/subscribe")} 
                variant="outline"
                className="border-amber-500 text-amber-600 hover:bg-amber-50"
              >
                View Subscription Options
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsFeatures.sales && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Sales Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Track revenue, transaction volume, and payment methods.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => navigate("/host/analytics/sales")}
              >
                View Sales Data
              </Button>
            </CardContent>
          </Card>
        )}
        
        {analyticsFeatures.customers && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Customer Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Understand visitor demographics, repeat rates, and spending habits.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => navigate("/host/analytics/customers")}
              >
                View Customer Data
              </Button>
            </CardContent>
          </Card>
        )}
        
        {analyticsFeatures.products && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Product Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Discover top-selling products, inventory turnover, and profit margins.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => navigate("/host/analytics/products")}
              >
                View Product Data
              </Button>
            </CardContent>
          </Card>
        )}
        
        {analyticsFeatures.advanced && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Access cross-referencing data, trend analysis, and benchmark comparisons.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => navigate("/host/analytics/advanced")}
              >
                View Advanced Analytics
              </Button>
            </CardContent>
          </Card>
        )}
        
        {analyticsFeatures.predictive && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Predictive Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Get AI-powered forecasts, optimizations, and strategic recommendations.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => navigate("/host/analytics/predictive")}
              >
                View Predictions
              </Button>
            </CardContent>
          </Card>
        )}
        
        {(!subscribed && activeStatus !== "active") && (
          <Card className="bg-gray-50 hover:shadow-md transition-shadow border-dashed border-gray-300">
            <CardHeader>
              <CardTitle className="text-lg">Upgrade for More</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Access advanced analytics features by upgrading your subscription plan.
              </p>
              <Button 
                className="mt-4 w-full bg-venu-orange hover:bg-venu-orange/90"
                onClick={() => navigate("/subscribe")}
              >
                View Plans
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalyticsSnapshot;
