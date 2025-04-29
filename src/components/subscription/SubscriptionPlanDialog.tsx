
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useSubscription } from "@/hooks/useSubscription";
import { PlanType } from "@/utils/pricingUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle } from "lucide-react";
import PlanTypeSelector from "@/components/analytics/PlanTypeSelector";

// Import pricing plans
import { venuePricingPlans } from "@/data/venuePricingPlans";
import { eventPricingPlans } from "@/data/eventPricingPlans";

interface SubscriptionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPlanType?: PlanType;
}

export default function SubscriptionPlanDialog({
  open,
  onOpenChange,
  defaultPlanType = "venue"
}: SubscriptionPlanDialogProps) {
  const navigate = useNavigate();
  const { user } = useUser();
  const { subscribed, subscription_tier, createCheckout } = useSubscription();
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType>(defaultPlanType);

  const plans = selectedPlanType === "venue" ? venuePricingPlans : eventPricingPlans;

  const handleSubscribe = (planId: string, planName: string) => {
    if (!user) {
      navigate("/auth?redirect=/subscription-management");
      onOpenChange(false);
      return;
    }

    createCheckout(planId, planName, selectedPlanType);
    onOpenChange(false);
  };

  const getRecommendedPlan = () => {
    return plans.find(plan => plan.recommended);
  };

  const getPlanFeatures = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.features : [];
  };

  const isPlanCurrent = (planId: string) => {
    if (!subscribed) return false;
    const plan = plans.find(p => p.id === planId);
    return plan && plan.name === subscription_tier;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select the plan that best fits your needs. You can change or cancel anytime.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <PlanTypeSelector 
            selectedPlanType={selectedPlanType} 
            onChange={setSelectedPlanType} 
            className="mb-6"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = isPlanCurrent(plan.id);
              return (
                <div
                  key={plan.id}
                  className={`border rounded-xl overflow-hidden ${
                    plan.recommended ? "border-venu-orange shadow-lg" : ""
                  } ${isCurrent ? "border-green-500 ring-2 ring-green-200" : ""}`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      {plan.recommended && (
                        <Badge className="bg-venu-orange">Recommended</Badge>
                      )}
                      {isCurrent && (
                        <Badge className="bg-green-100 text-green-800">Current Plan</Badge>
                      )}
                    </div>

                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        R{plan.monthlyPrice}
                      </span>
                      <span className="text-gray-500">/month</span>
                    </div>

                    <div className="mt-6">
                      <ul className="space-y-3">
                        {getPlanFeatures(plan.id).map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full mt-6"
                      variant={plan.recommended ? "default" : "outline"}
                      onClick={() => handleSubscribe(plan.id, plan.name)}
                      disabled={isCurrent}
                    >
                      {isCurrent ? "Current Plan" : subscribed ? "Switch Plan" : "Subscribe"}
                    </Button>

                    {plan.footnote && (
                      <p className="text-xs text-gray-500 mt-4 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {plan.footnote}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-gray-50 p-4 rounded-lg text-sm">
            <p className="flex items-center text-gray-700">
              <AlertCircle className="h-4 w-4 mr-2 text-venu-orange" />
              All plans include a 14-day free trial. Cancel anytime without being charged.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
