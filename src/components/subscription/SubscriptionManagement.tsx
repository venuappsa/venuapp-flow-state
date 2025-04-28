
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

export function SubscriptionManagement() {
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    subscription_status, 
    isLoading,
    checkSubscription,
    createCheckout
  } = useSubscription();
  
  const [pauseHistory, setPauseHistory] = useState<any[]>([]);
  const [isPauseLoading, setIsPauseLoading] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType>("venue");
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
  
  // For this quarter's pause metrics
  const [currentQuarterUsed, setCurrentQuarterUsed] = useState(0);
  const [canPause, setCanPause] = useState(false);
  const [remainingPauseDays, setRemainingPauseDays] = useState(0);
  
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

  // Create plan feature lists
  const venuePlans = [
    {
      name: "Standard",
      price: "R499",
      period: "/month",
      description: "For smaller venues",
      features: [
        "Up to 3 venues",
        "Up to 5 events per venue monthly",
        "Basic analytics",
        "Standard support",
        "5% commission on transactions",
        "0.4% marketing rebate",
        "Up to 3 merchants allowed"
      ],
      priceId: "price_1OT7NbGVnlGQn0rKkm5MNuMp"
    },
    {
      name: "Pro",
      price: "R999",
      period: "/month",
      description: "For growing businesses",
      features: [
        "Up to 10 venues",
        "Unlimited events",
        "Advanced analytics and reporting",
        "Priority support",
        "3.5% commission on transactions",
        "0.4% marketing rebate",
        "Up to 6 merchants allowed",
        "Fetchman access"
      ],
      popular: true,
      priceId: "price_1OT7NuGVnlGQn0rKYTeHQsrE"
    },
    {
      name: "Enterprise",
      price: "R2499",
      period: "/month",
      description: "For large organizations",
      features: [
        "Unlimited venues",
        "Unlimited events with premium features",
        "Enterprise analytics with custom reports",
        "Dedicated account manager",
        "2% commission on transactions",
        "0.4% marketing rebate",
        "Unlimited merchants allowed",
        "Priority fetchman access"
      ],
      priceId: "price_1OT7OPGVnlGQn0rKqTNCYLhc"
    },
    {
      name: "Pay-As-You-Go",
      price: "R199",
      period: "/venue/month",
      description: "For occasional venue usage",
      features: [
        "Pay only for venues you use",
        "Basic event features",
        "Standard analytics",
        "Email support",
        "6% commission on transactions",
        "0.4% marketing rebate",
        "Up to 2 merchants allowed"
      ],
      priceId: "price_venue_payg"
    },
    {
      name: "Free",
      price: "R0",
      period: "",
      description: "Limited trial access",
      features: [
        "1 venue only",
        "Up to 2 events",
        "Basic analytics",
        "Email support only",
        "8% commission on transactions",
        "0.4% marketing rebate",
        "1 merchant allowed"
      ],
      priceId: "price_free_tier"
    }
  ];

  const eventPlans = [
    {
      name: "Standard",
      price: "R250",
      period: "/event",
      description: "For smaller events",
      features: [
        "Single event use",
        "Up to 3 merchants allowed",
        "Basic analytics",
        "Standard support",
        "5% commission on transactions",
        "0.7% marketing rebate"
      ],
      priceId: "price_1OT7NbGVnlGQn0rKkm5MNuMq"
    },
    {
      name: "Pro",
      price: "R650",
      period: "/event",
      description: "For medium-sized events",
      features: [
        "Single event use",
        "Up to 6 merchants allowed",
        "Advanced analytics and reporting",
        "Priority support",
        "3.5% commission on transactions",
        "0.7% marketing rebate",
        "Fetchman access"
      ],
      popular: true,
      priceId: "price_1OT7NuGVnlGQn0rKYTeHQsrF"
    },
    {
      name: "Enterprise",
      price: "R1070",
      period: "/event",
      description: "For large-scale events",
      features: [
        "Single event use",
        "Up to 10 merchants allowed",
        "Enterprise analytics with custom reports",
        "Dedicated event manager",
        "2% commission on transactions",
        "0.7% marketing rebate",
        "Priority fetchman access"
      ],
      priceId: "price_1OT7OPGVnlGQn0rKqTNCYLhd"
    },
    {
      name: "Pay-As-You-Go",
      price: "R75",
      period: "/merchant/day",
      description: "For small single-merchant events",
      features: [
        "Pay only for merchants used",
        "Basic event features",
        "Standard analytics",
        "Email support",
        "6% commission on transactions",
        "0.7% marketing rebate"
      ],
      priceId: "price_event_payg"
    },
    {
      name: "Free",
      price: "R0",
      period: "",
      description: "Limited trial access",
      features: [
        "1 event only",
        "Up to 2 merchants",
        "Basic analytics",
        "Email support only",
        "8% commission on transactions",
        "0.7% marketing rebate"
      ],
      priceId: "price_free_tier_event"
    }
  ];

  useEffect(() => {
    if (subscription_status === 'active') {
      fetchPauseHistory();
    }
  }, [subscription_status]);

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
          <p className="text-gray-600">
            To access subscription management features, you need to subscribe to a plan first.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <a href="/subscribe">View Plans</a>
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
      </div>

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
          className="mb-8"
        />

        <Tabs value={selectedPlanType} onValueChange={(v) => setSelectedPlanType(v as PlanType)}>
          <TabsContent value="venue" className="mt-6 space-y-8">
            <div>
              <div className="flex items-center mb-6">
                <h3 className="text-lg font-semibold">Venue-Based Packages</h3>
                <Separator className="flex-grow ml-4" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {venuePlans.map((plan, index) => (
                  <Card key={index} className={`flex flex-col ${plan.popular ? 'border-venu-orange shadow-lg' : ''}`}>
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-center">
                        <CardTitle>{plan.name}</CardTitle>
                        {plan.popular && (
                          <Badge variant="outline" className="border-venu-orange text-venu-orange">Popular</Badge>
                        )}
                        {subscription_tier === plan.name.toLowerCase() && (
                          <Badge className="bg-venu-orange">Current</Badge>
                        )}
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-gray-500 ml-2">{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="mb-4">
                        <h4 className="font-medium flex items-center justify-between cursor-pointer" 
                            onClick={() => toggleFeatures(`venue-${plan.name}`)}>
                          Features
                          {expandedFeatures[`venue-${plan.name}`] ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                          }
                        </h4>
                      </div>
                      
                      {expandedFeatures[`venue-${plan.name}`] && (
                        <ul className="space-y-3 mt-3">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className={`w-full ${plan.popular && !subscription_tier ? 'bg-venu-orange hover:bg-venu-orange/90' : ''}`}
                        variant={subscription_tier === plan.name.toLowerCase() ? "outline" : "default"}
                        disabled={subscription_tier === plan.name.toLowerCase()}
                        onClick={() => createCheckout(plan.priceId, plan.name, "venue")}
                      >
                        {subscription_tier === plan.name.toLowerCase() ? "Current Plan" : "Select Plan"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="event" className="mt-6 space-y-8">
            <div>
              <div className="flex items-center mb-6">
                <h3 className="text-lg font-semibold">Event-Based Packages</h3>
                <Separator className="flex-grow ml-4" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {eventPlans.map((plan, index) => (
                  <Card key={index} className={`flex flex-col ${plan.popular ? 'border-venu-orange shadow-lg' : ''}`}>
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-center">
                        <CardTitle>{plan.name}</CardTitle>
                        {plan.popular && (
                          <Badge variant="outline" className="border-venu-orange text-venu-orange">Popular</Badge>
                        )}
                        {subscription_tier === plan.name.toLowerCase() && (
                          <Badge className="bg-venu-orange">Current</Badge>
                        )}
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-gray-500 ml-2">{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="mb-4">
                        <h4 className="font-medium flex items-center justify-between cursor-pointer" 
                            onClick={() => toggleFeatures(`event-${plan.name}`)}>
                          Features
                          {expandedFeatures[`event-${plan.name}`] ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                          }
                        </h4>
                      </div>
                      
                      {expandedFeatures[`event-${plan.name}`] && (
                        <ul className="space-y-3 mt-3">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className={`w-full ${plan.popular && !subscription_tier ? 'bg-venu-orange hover:bg-venu-orange/90' : ''}`}
                        variant={subscription_tier === plan.name.toLowerCase() ? "outline" : "default"}
                        disabled={subscription_tier === plan.name.toLowerCase()}
                        onClick={() => createCheckout(plan.priceId, plan.name, "event")}
                      >
                        {subscription_tier === plan.name.toLowerCase() ? "Current Plan" : "Select Plan"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
