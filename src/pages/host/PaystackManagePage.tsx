
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle, 
  CreditCard, 
  RefreshCcw,
  ArrowLeft
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function PaystackManagePage() {
  const navigate = useNavigate();
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    subscription_status,
    payment_gateway,
    isLoading,
    checkSubscription,
    createPaystackCheckout
  } = useSubscription();

  // Paystack plan prices
  const planPrices = {
    Basic: "499",
    Premium: "999", 
    Enterprise: "2499"
  };

  useEffect(() => {
    if (!isLoading && (!subscribed || payment_gateway !== "paystack")) {
      toast({
        title: "No Paystack Subscription",
        description: "You don't have an active Paystack subscription.",
        variant: "destructive"
      });
      navigate("/host/subscription");
    }
  }, [isLoading, subscribed, payment_gateway, navigate]);

  const handleRenew = (planName: string) => {
    if (!planName) return;
    const amount = planPrices[planName as keyof typeof planPrices];
    if (amount) {
      createPaystackCheckout(planName, amount);
    }
  };

  if (isLoading) {
    return (
      <HostPanelLayout>
        <div className="max-w-4xl mx-auto py-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-48 w-full" />
        </div>
      </HostPanelLayout>
    );
  }

  return (
    <HostPanelLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/host/subscription")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Paystack Subscription Management</h1>
            <p className="text-gray-600 mt-1">Manage your Paystack subscription settings</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Your active Paystack subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Plan</span>
                  <Badge className="bg-green-100 text-green-800">
                    {subscription_tier || "Free Plan"} Plan
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status</span>
                  <div className="flex items-center">
                    {subscription_status === "active" ? (
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    )}
                    <span className={subscription_status === "active" ? "text-green-600 capitalize" : "text-amber-500 capitalize"}>
                      {subscription_status || "Unknown"}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Payment Gateway</span>
                  <Badge variant="outline">
                    Paystack
                  </Badge>
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
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => checkSubscription()}
                disabled={isLoading}
                size="sm"
              >
                <RefreshCcw className="h-3 w-3 mr-2" />
                <span>Refresh Status</span>
              </Button>
              
              {subscription_status !== "active" && subscription_tier && (
                <Button 
                  onClick={() => handleRenew(subscription_tier)}
                  size="sm"
                >
                  <CreditCard className="h-3 w-3 mr-2" />
                  <span>Renew Subscription</span>
                </Button>
              )}
            </CardFooter>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Managing Paystack Subscriptions</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Paystack subscriptions are managed differently than Stripe subscriptions. To make changes to your
                subscription, you'll need to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Let your current subscription expire if you want to switch plans</li>
                <li>Subscribe to a new plan once your current subscription expires</li>
                <li>Contact support if you need immediate assistance with your subscription</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your recent Paystack transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Your payment history will appear here.</p>
                <p className="mt-2 text-sm">If you've just subscribed, it may take a moment to appear.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HostPanelLayout>
  );
}
