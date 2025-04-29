
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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

  // Updated to remove planType parameter
  const createCheckout = async (planId: string, planName: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { planId, planName }
      });
      
      if (error) {
        console.error("Error creating checkout:", error);
        toast({
          title: "Checkout Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error("Exception creating checkout:", err);
      toast({
        title: "Checkout Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  // Redirect to main site pricing page instead of checkout
  const redirectToPricing = (planId: string, planName: string) => {
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
    createCheckout: createCheckout,
  };
}
