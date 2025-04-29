
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
import { getTierBgClass, formatLimit, subscriptionLimits, getPricingPlans } from "@/utils/pricingUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlanFeatureComparisonProps {
  onPlanSelect?: (planId: string, planName: string) => void;
}

const PlanFeatureComparison = ({ 
  onPlanSelect 
}: PlanFeatureComparisonProps) => {
  const { subscription_tier } = useSubscription();
  const [billingType, setBillingType] = useState<"monthly" | "per-event" | "annual">("monthly");
  const [displayType, setDisplayType] = useState<"monthly" | "annual">("monthly");

  // Price multipliers and discount text
  const annualMultiplier = 0.85; // 15% discount
  const annualDiscountText = "Save 15%";

  const plans = getPricingPlans().map(plan => ({
    id: plan.name.toLowerCase().replace(' ', '_'),
    name: plan.name,
    description: plan.description,
    monthlyPrice: plan.price === "Custom" ? "Custom" : plan.price,
    eventPrice: plan.eventPrice === "Custom" ? "Custom" : plan.eventPrice,
    limits: subscriptionLimits[plan.name],
    highlighted: plan.highlighted
  }));

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
    "Pro": "Priority Support",
    "Enterprise": "Dedicated Account Manager"
  };

  // Analytics features per plan
  const analyticsFeatures = {
    "Free Plan": "Basic",
    "Starter": "Standard",
    "Growth": "Advanced",
    "Pro": "Advanced",
    "Enterprise": "Enterprise"
  };

  const formatCurrency = (amount: string): string => {
    if (amount === "Free" || amount === "R0" || amount === "Custom") return amount;
    
    // For annual pricing with numbers
    if (displayType === "annual" && amount !== "Custom") {
      // Remove R and any commas, convert to number
      const numericValue = Number(amount.replace('R', '').replace(',', ''));
      if (!isNaN(numericValue)) {
        const annualPrice = numericValue * 12 * annualMultiplier;
        return `R${annualPrice.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`;
      }
    }
    
    return amount;
  };

  const getPrice = (plan: typeof plans[0]): string => {
    if (plan.name === "Free Plan") return "Free";
    if (plan.monthlyPrice === "Custom") return "Custom";
    
    if (billingType === "monthly" || billingType === "annual") {
      const price = formatCurrency(plan.monthlyPrice as string);
      return `${price}${billingType === "monthly" ? "/mo" : "/year"}`;
    } else {
      return `${plan.eventPrice}/event`;
    }
  };

  const handlePlanSelection = (planId: string, planName: string) => {
    if (onPlanSelect) {
      onPlanSelect(planId, planName);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Plan Comparison</CardTitle>
          <div>
            <Tabs value={billingType} onValueChange={(v) => setBillingType(v as "monthly" | "per-event" | "annual")}>
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="per-event">Per Event</TabsTrigger>
                <TabsTrigger value="annual">Annual <span className="ml-1 text-xs text-emerald-600">{annualDiscountText}</span></TabsTrigger>
              </TabsList>
            </Tabs>
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
                      {subscription_tier === plan.name && (
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
                      variant={subscription_tier === plan.name ? "outline" : "default"}
                      disabled={subscription_tier === plan.name}
                    >
                      {subscription_tier === plan.name
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
