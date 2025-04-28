
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { PlanType } from "@/utils/pricingUtils";

export interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  subscription_status?: "active" | "paused" | "expired" | "trial" | "none";
  isLoading: boolean;
  error: string | null;
}

export function useSubscription() {
  const { user } = useUser();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: undefined,
    subscription_end: undefined,
    subscription_status: undefined,
    isLoading: true,
    error: null,
  });

  const checkSubscription = async () => {
    if (!user) {
      setSubscriptionData(prev => ({
        ...prev,
        isLoading: false,
        error: "User not authenticated"
      }));
      return;
    }

    try {
      setSubscriptionData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        setSubscriptionData(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
        return;
      }
      
      setSubscriptionData({
        subscribed: data.subscribed,
        subscription_tier: data.subscription_tier,
        subscription_end: data.subscription_end,
        subscription_status: data.subscription_status,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.error("Exception checking subscription:", err);
      setSubscriptionData(prev => ({
        ...prev,
        isLoading: false,
        error: err.message
      }));
    }
  };

  const createCheckout = async (planId: string, planName: string, planType: PlanType = "venue") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { planId, planName, planType },
      });

      if (error) {
        console.error("Error creating checkout:", error);
        toast({
          title: "Checkout Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error("Exception creating checkout:", err);
      toast({
        title: "Checkout Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  return {
    ...subscriptionData,
    checkSubscription,
    createCheckout,
  };
}
