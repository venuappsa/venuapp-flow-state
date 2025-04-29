
import { useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Check, X, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { Badge } from "@/components/ui/badge";
import { getTierBgClass, formatLimit, subscriptionLimits } from "@/utils/pricingUtils";
import { PlanType } from "@/utils/pricingUtils";

interface PlanFeatureComparisonProps {
  planType?: PlanType;
  onPlanSelect?: (planId: string, planName: string, planType: PlanType) => void;
}

const PlanFeatureComparison = ({ 
  planType = "venue",
  onPlanSelect 
}: PlanFeatureComparisonProps) => {
  const { subscription_tier, subscription_plan_type } = useSubscription();
  const [displayType, setDisplayType] = useState<"monthly" | "annual">("monthly");

  // Price multipliers and discount text
  const annualMultiplier = 0.85; // 15% discount
  const annualDiscountText = "Save 15%";

  // Define plans with pricing info
  const plans = [
    {
      id: "free_plan",
      name: "Free Plan",
      description: "For testing and small events",
      monthlyPrice: 0,
      limits: subscriptionLimits["Free Plan"]
    },
    {
      id: planType === "venue" ? "price_1OT7NbGVnlGQn0rKkm5MNuMp" : "price_1OT7NbGVnlGQn0rKkm5MNuMq",
      name: "Starter",
      description: "For small venues and events",
      monthlyPrice: planType === "venue" ? 499 : 250,
      limits: subscriptionLimits["Starter"]
    },
    {
      id: planType === "venue" ? "price_1OT7NuGVnlGQn0rKYTeHQsrE" : "price_1OT7NuGVnlGQn0rKYTeHQsrF",
      name: "Growth",
      description: "For growing businesses with multiple events",
      monthlyPrice: planType === "venue" ? 999 : 650,
      limits: subscriptionLimits["Growth"],
      highlighted: true
    },
    {
      id: planType === "venue" ? "price_1OT7OPGVnlGQn0rKqTNCYLhc" : "price_1OT7OPGVnlGQn0rKqTNCYLhd",
      name: "Enterprise",
      description: "For large organizations with high volume",
      monthlyPrice: planType === "venue" ? 2499 : 1070,
      limits: subscriptionLimits["Enterprise"]
    }
  ];

  // Features to display in the comparison table
  const features = [
    { key: "eventsPerMonth", label: "Events Per Month" },
    { key: "merchantsPerEvent", label: "Merchants Per Event" },
    { key: "adminUsers", label: "Admin Users" },
    { key: "fetchmenPerEvent", label: "Fetchmen Per Event" },
    { key: "productsPerEvent", label: "Products Per Event" },
    { key: "dataRetentionDays", label: "Data Retention (Days)" }
  ];

  // Support levels per plan
  const supportFeatures = {
    "Free Plan": "Email Only",
    "Starter": "Email + Basic Chat",
    "Growth": "Priority Support",
    "Enterprise": "Dedicated Account Manager"
  };

  // Analytics features per plan
  const analyticsFeatures = {
    "Free Plan": "Basic",
    "Starter": "Standard",
    "Growth": "Advanced",
    "Enterprise": "Enterprise"
  };

  const formatCurrency = (amount: number): string => {
    if (amount === 0) return "Free";
    return `R${amount.toFixed(2)}`;
  };

  const getPrice = (plan: typeof plans[0]): string => {
    if (plan.monthlyPrice === 0) return "Free";
    
    const price = displayType === "annual" 
      ? plan.monthlyPrice * 12 * annualMultiplier 
      : plan.monthlyPrice;
      
    return `${formatCurrency(price)}${displayType === "monthly" ? "/mo" : "/year"}`;
  };

  const handlePlanSelection = (planId: string, planName: string) => {
    if (onPlanSelect) {
      onPlanSelect(planId, planName, planType);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Plan Comparison</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={displayType === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setDisplayType("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={displayType === "annual" ? "default" : "outline"}
              size="sm"
              onClick={() => setDisplayType("annual")}
            >
              Annual {annualDiscountText && <span className="ml-1 text-xs text-emerald-600">{annualDiscountText}</span>}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Features</TableHead>
                {plans.map((plan) => (
                  <TableHead 
                    key={plan.name}
                    className={`text-center ${plan.highlighted ? 'bg-blue-50' : ''}`}
                  >
                    <div className="font-medium">
                      {plan.name}
                      {subscription_tier === plan.name.toLowerCase() && subscription_plan_type === planType && (
                        <Badge className="ml-2 bg-green-100 text-green-800 border-green-300">Current</Badge>
                      )}
                    </div>
                    <div className="text-lg font-bold">{getPrice(plan)}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature.key}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1">
                      {feature.label}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">
                              {feature.key === "dataRetentionDays" 
                                ? "How long your data is stored and accessible" 
                                : `Maximum number of ${feature.label.toLowerCase()} allowed`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  {plans.map((plan) => (
                    <TableCell key={`${plan.name}-${feature.key}`} className={`text-center ${plan.highlighted ? 'bg-blue-50' : ''}`}>
                      {formatLimit(plan.limits[feature.key as keyof typeof plan.limits])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Support Level */}
              <TableRow>
                <TableCell className="font-medium">Support Level</TableCell>
                {plans.map((plan) => (
                  <TableCell key={`${plan.name}-support`} className={`text-center ${plan.highlighted ? 'bg-blue-50' : ''}`}>
                    {supportFeatures[plan.name as keyof typeof supportFeatures]}
                  </TableCell>
                ))}
              </TableRow>

              {/* Analytics Features */}
              <TableRow>
                <TableCell className="font-medium">Analytics</TableCell>
                {plans.map((plan) => (
                  <TableCell key={`${plan.name}-analytics`} className={`text-center ${plan.highlighted ? 'bg-blue-50' : ''}`}>
                    {analyticsFeatures[plan.name as keyof typeof analyticsFeatures]}
                  </TableCell>
                ))}
              </TableRow>

              {/* Action buttons */}
              <TableRow>
                <TableCell></TableCell>
                {plans.map((plan) => (
                  <TableCell key={`${plan.name}-action`} className={`text-center ${plan.highlighted ? 'bg-blue-50' : ''}`}>
                    <Button
                      onClick={() => handlePlanSelection(plan.id, plan.name)}
                      className={`w-full ${plan.highlighted ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                      variant={subscription_tier === plan.name.toLowerCase() && subscription_plan_type === planType ? "outline" : "default"}
                      disabled={subscription_tier === plan.name.toLowerCase() && subscription_plan_type === planType}
                    >
                      {subscription_tier === plan.name.toLowerCase() && subscription_plan_type === planType
                        ? "Current Plan"
                        : "Select"}
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanFeatureComparison;
