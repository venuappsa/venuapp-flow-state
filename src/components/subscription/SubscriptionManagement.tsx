
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, CheckCircle, Clock, ExternalLink, Pause, RefreshCcw, ChevronDown, ChevronUp } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanType } from "@/utils/pricingUtils";
import PlanTypeSelector from "@/components/analytics/PlanTypeSelector";
import PlanFeatureComparison from "@/components/subscription/PlanFeatureComparison";
import SubscriptionUsage from "@/components/subscription/SubscriptionUsage";

export function SubscriptionManagement() {
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    subscription_status,
    subscription_plan_type,
    isLoading,
    checkSubscription,
    createCheckout
  } = useSubscription();
  
  const [pauseHistory, setPauseHistory] = useState<any[]>([]);
  const [isPauseLoading, setIsPauseLoading] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType>(subscription_plan_type || "venue");
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
  
  // For this quarter's pause metrics
  const [currentQuarterUsed, setCurrentQuarterUsed] = useState(0);
  const [canPause, setCanPause] = useState(false);
  const [remainingPauseDays, setRemainingPauseDays] = useState(0);
  
  // Mock usage data - in a real application, these would come from the database
  const [usageData, setUsageData] = useState({
    eventsUsed: 1,
    merchantsUsed: 2,
    adminsUsed: 1,
    fetchmenUsed: 3,
    productsUsed: 15
  });
  
  // Since the subscription_pauses table doesn't exist yet, we'll just show a temporary placeholder
  // This would normally be filled with data from the database
  const fetchPauseHistory = async () => {
    setIsPauseLoading(true);
    try {
      // Temporarily use empty array until the table is created
      const data: any[] = [];
      
      setPauseHistory(data || []);
      
      // Calculate current quarter metrics
      const now = new Date();
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const currentYear = now.getFullYear();
      
      // Assume the user hasn't used any pause days yet
      const daysUsed = 0;
      
      setCurrentQuarterUsed(daysUsed);
      setRemainingPauseDays(Math.max(0, 14 - daysUsed));
      
      // Can pause if they haven't used all 14 days and don't have an active pause
      const hasActivePause = false;
      setCanPause(subscription_status === 'active');
      
    } catch (err) {
      console.error("Error fetching pause history:", err);
      toast({
        title: "Error fetching pause data",
        description: "Unable to load your subscription pause history",
        variant: "destructive"
      });
    } finally {
      setIsPauseLoading(false);
    }
  };
  
  const handlePauseSubscription = async (days: number) => {
    if (!canPause || days <= 0 || days > remainingPauseDays) return;
    
    setIsPausing(true);
    try {
      // In a production app, this would call the pause-subscription edge function
      toast({
        title: "Coming Soon",
        description: "Subscription pausing will be available soon.",
      });
    } catch (err) {
      console.error("Error pausing subscription:", err);
      toast({
        title: "Error pausing subscription",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsPausing(false);
    }
  };
  
  const openCustomerPortal = async () => {
    setIsPortalLoading(true);
    try {
      // In a production app, this would call the customer-portal edge function
      toast({
        title: "Coming Soon",
        description: "Customer portal will be available soon.",
      });
    } catch (err) {
      console.error("Error opening customer portal:", err);
      toast({
        title: "Error opening customer portal",
        description: "Unable to access your subscription settings",
        variant: "destructive"
      });
    } finally {
      setIsPortalLoading(false);
    }
  };

  const toggleFeatures = (planName: string) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [planName]: !prev[planName]
    }));
  };

  useEffect(() => {
    if (subscription_status === 'active') {
      fetchPauseHistory();
    }
  }, [subscription_status]);
  
  // Update selected plan type based on current subscription when component mounts
  useEffect(() => {
    if (subscription_plan_type) {
      setSelectedPlanType(subscription_plan_type);
    }
  }, [subscription_plan_type]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    );
  }

  if (!subscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Required</CardTitle>
          <CardDescription>You don't have an active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            To access subscription management features, you need to subscribe to a plan first.
          </p>
          
          {/* Show plan comparison for non-subscribers */}
          <PlanFeatureComparison 
            planType={selectedPlanType} 
            onPlanSelect={createCheckout}
          />
        </CardContent>
        <CardFooter>
          <Button asChild>
            <a href="/subscribe">View All Plans</a>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your active subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Plan</span>
                <Badge className="bg-green-100 text-green-800">
                  {subscription_tier || "Standard"} Plan
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Plan Type</span>
                <Badge variant="outline">
                  {subscription_plan_type === "venue" ? "Monthly Venue" : "Event-based"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Status</span>
                <div className="flex items-center">
                  {subscription_status === "active" ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                  )}
                  <span className={subscription_status === "active" ? "text-green-600 capitalize" : "text-amber-500 capitalize"}>
                    {subscription_status || "Unknown"}
                  </span>
                </div>
              </div>
              
              {subscription_end && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Renewal Date</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{new Date(subscription_end).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button 
              variant="outline"
              onClick={() => checkSubscription()}
              disabled={isLoading}
              size="sm"
            >
              <RefreshCcw className="h-3 w-3 mr-2" />
              <span>Refresh</span>
            </Button>
            
            <Button 
              onClick={openCustomerPortal}
              disabled={isPortalLoading}
              size="sm"
            >
              <ExternalLink className="h-3 w-3 mr-2" />
              <span>Manage Billing</span>
            </Button>
          </CardFooter>
        </Card>
        
        <SubscriptionUsage {...usageData} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Subscription Pause</CardTitle>
          <CardDescription>Temporarily pause your subscription</CardDescription>
        </CardHeader>
        <CardContent>
          {isPauseLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between items-center">
                  <span className="font-medium text-sm">Pause Days Used This Quarter</span>
                  <span className="text-sm">0/14 days</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Coming Soon</AlertTitle>
                <AlertDescription>
                  Subscription pausing will be available in a future update.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full flex gap-2">
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => handlePauseSubscription(7)}
              disabled={true}
            >
              <Pause className="h-4 w-4 mr-2" />
              <span>Pause 7 Days</span>
            </Button>
            
            <Button 
              className="flex-1"
              onClick={() => handlePauseSubscription(14)}
              disabled={true}
            >
              <Pause className="h-4 w-4 mr-2" />
              <span>Pause 14 Days</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pause History</CardTitle>
          <CardDescription>Record of your subscription pauses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>You haven't paused your subscription yet.</p>
            <p className="mt-2 text-sm">Subscription pausing will be available in a future update.</p>
          </div>
        </CardContent>
      </Card>

      {/* Plan Options Section */}
      <div className="space-y-6 pt-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Available Plans</h2>
          <p className="text-gray-600">You can upgrade or change your plan anytime</p>
        </div>

        <PlanTypeSelector
          selectedPlanType={selectedPlanType}
          onChange={setSelectedPlanType}
          className="mb-4"
        />

        <PlanFeatureComparison 
          planType={selectedPlanType}
          onPlanSelect={createCheckout}
        />
      </div>
    </div>
  );
}
