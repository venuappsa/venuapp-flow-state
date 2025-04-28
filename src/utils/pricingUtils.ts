
import { EventPricingPlans } from "@/data/eventPricingPlans";
import { VenuePricingPlans } from "@/data/venuePricingPlans";

export type PlanType = "venue" | "event";

export interface PricingFeature {
  name: string;
  includedInTiers: string[];
  description: string;
}

export const tierLevels = {
  "Free Plan": 0,
  "Starter": 1,
  "Growth": 2,
  "Pro": 3,
  "Enterprise": 4,
  "Custom": 4
};

export const getTierLevel = (subscriptionTier: string): number => {
  return tierLevels[subscriptionTier as keyof typeof tierLevels] || 0;
};

export const getAnalyticsFeaturesForTier = (tier: string, planType: PlanType): PricingFeature[] => {
  const tierLevel = getTierLevel(tier);
  
  const features: PricingFeature[] = [
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
      description: planType === "venue" ? "Access to 30/90/365 days of data" : "Access to previous event data"
    },
    {
      name: "Comparative Analytics",
      includedInTiers: ["Pro", "Enterprise"],
      description: "Compare performance across events or time periods"
    }
  ];
  
  return features.filter(feature => {
    const lowestTierWithFeature = feature.includedInTiers[0];
    return getTierLevel(lowestTierWithFeature) <= tierLevel;
  });
};

export const getDataWindowForTier = (tier: string): number => {
  const tierLevel = getTierLevel(tier);
  
  switch(tierLevel) {
    case 0: return 7; // 7 days for Free tier
    case 1: return 30; // 30 days for Starter
    case 2: return 90; // 90 days for Growth
    case 3:
    case 4: return 365; // 365 days for Pro/Enterprise
    default: return 7;
  }
};

export const getPricingPlans = (planType: PlanType) => {
  return planType === "venue" ? VenuePricingPlans : EventPricingPlans;
};

export const isPremiumFeature = (featureName: string, tier: string): boolean => {
  const allFeatures = [
    { name: "Revenue Analytics", minTier: 0 },
    { name: "Guest Analytics", minTier: 1 },
    { name: "Vendor Analytics", minTier: 2 },
    { name: "Forecast Analytics", minTier: 3 },
    { name: "Demographics", minTier: 2 },
    { name: "Attendance Patterns", minTier: 1 },
    { name: "Guest Satisfaction", minTier: 2 },
    { name: "Guest Retention", minTier: 3 },
  ];
  
  const feature = allFeatures.find(f => f.name === featureName);
  if (!feature) return true; // If feature not found, treat as premium
  
  return getTierLevel(tier) < feature.minTier;
};
