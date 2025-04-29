import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Info, X } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  getTierLevel,
  PricingFeature 
} from "@/utils/pricingUtils";

interface AnalyticsFeaturesListProps {
  tier: string;
}

export default function AnalyticsFeaturesList({ tier }: AnalyticsFeaturesListProps) {
  const navigate = useNavigate();
  const currentTierLevel = getTierLevel(tier);
  const availableFeatures = getAnalyticsFeaturesForTier(tier);
  
  // All possible features
  const allFeatures: PricingFeature[] = [
    {
      name: "Basic Revenue Metrics",
      includedInTiers: ["Free Plan", "Starter", "Growth", "Pro", "Enterprise"],
      description: "Basic revenue overview for past 7 days"
    },
    {
      name: "Guest Attendance Tracking",
      includedInTiers: ["Starter", "Growth", "Pro", "Enterprise"],
      description: "Track guest attendance patterns"
    },
    {
      name: "Demographic Analysis",
      includedInTiers: ["Growth", "Pro", "Enterprise"],
      description: "Analyze guest demographics by age, gender, and region"
    },
    {
      name: "Vendor Performance Metrics",
      includedInTiers: ["Growth", "Pro", "Enterprise"],
      description: "Track vendor sales performance"
    },
    {
      name: "Advanced Revenue Breakdown",
      includedInTiers: ["Starter", "Growth", "Pro", "Enterprise"],
      description: "Revenue breakdown by source"
    },
    {
      name: "Revenue Forecasting",
      includedInTiers: ["Pro", "Enterprise"],
      description: "AI-powered revenue predictions"
    },
    {
      name: "Guest Satisfaction Analysis",
      includedInTiers: ["Growth", "Pro", "Enterprise"],
      description: "Track guest satisfaction metrics"
    },
    {
      name: "Guest Retention Tracking",
      includedInTiers: ["Pro", "Enterprise"],
      description: "Analyze first-time vs. returning guests"
    },
    {
      name: "Historical Data Access",
      includedInTiers: ["Starter", "Growth", "Pro", "Enterprise"],
      description: "Access to 30/90/365 days of data"
    },
    {
      name: "Comparative Analytics",
      includedInTiers: ["Pro", "Enterprise"],
      description: "Compare performance across events or time periods"
    }
  ];
  
  const isFeatureAvailable = (feature: PricingFeature): boolean => {
    return availableFeatures.some(f => f.name === feature.name);
  };
  
  const getMinimumTierForFeature = (feature: PricingFeature): string => {
    return feature.includedInTiers[0];
  };

  // Helper function for getAnalyticsFeaturesForTier since we're not importing it directly
  function getAnalyticsFeaturesForTier(tier: string): PricingFeature[] {
    const tierLevel = getTierLevel(tier);
    
    return allFeatures.filter(feature => {
      const lowestTierWithFeature = feature.includedInTiers[0];
      return getTierLevel(lowestTierWithFeature) <= tierLevel;
    });
  }

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <h3 className="text-base font-medium mb-4">Analytics Features in Your Plan</h3>
        <div className="space-y-3">
          {allFeatures.map((feature) => {
            const available = isFeatureAvailable(feature);
            const minTier = getMinimumTierForFeature(feature);
            
            return (
              <div key={feature.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  {available ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <X className="h-5 w-5 text-gray-400 mr-2" />
                  )}
                  <span className={available ? "text-gray-900" : "text-gray-500"}>
                    {feature.name}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">{feature.description}</p>
                        {!available && (
                          <p className="text-xs mt-1 text-gray-500">
                            Available on {minTier} and higher plans
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {!available && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => navigate('/subscribe')}
                  >
                    Upgrade
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
