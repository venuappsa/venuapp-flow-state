
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

  // Redirect to main site pricing page instead of checkout
  const redirectToPricing = (planId: string, planName: string, planType: PlanType = "venue") => {
    // Navigate to homepage pricing section
    window.location.href = "/#pricing";
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  return {
    ...subscriptionData,
    checkSubscription,
    createCheckout: redirectToPricing,
  };
}
