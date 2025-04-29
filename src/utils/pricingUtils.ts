import { UnifiedPricingPlans } from "@/data/unifiedPricingPlans";

// Keep for backward compatibility during transition
export type PlanType = "venue" | "event";

export interface PricingFeature {
  name: string;
  includedInTiers: string[];
  description: string;
}

export interface SubscriptionLimits {
  eventsPerMonth: number;
  merchantsPerEvent: number;
  adminUsers: number;
  fetchmenPerEvent: number;
  productsPerEvent: number;
  dataRetentionDays: number;
}

export const tierLevels = {
  "Free Plan": 0,
  "Starter": 1,
  "Growth": 2,
  "Pro": 3,
  "Enterprise": 4,
  "Custom": 4
};

export const tierColors = {
  "Free Plan": "gray",
  "Starter": "green",
  "Growth": "blue", 
  "Pro": "purple",
  "Enterprise": "amber"
};

export const subscriptionLimits: Record<string, SubscriptionLimits> = {
  "Free Plan": {
    eventsPerMonth: 2,
    merchantsPerEvent: 1,
    adminUsers: 1,
    fetchmenPerEvent: 2,
    productsPerEvent: 10,
    dataRetentionDays: 7
  },
  "Starter": {
    eventsPerMonth: 5,
    merchantsPerEvent: 3,
    adminUsers: 3,
    fetchmenPerEvent: 6,
    productsPerEvent: 60,
    dataRetentionDays: 30
  },
  "Growth": {
    eventsPerMonth: 15,
    merchantsPerEvent: 7,
    adminUsers: 10,
    fetchmenPerEvent: 20,
    productsPerEvent: 200,
    dataRetentionDays: 90
  },
  "Pro": {
    eventsPerMonth: 30,
    merchantsPerEvent: 15,
    adminUsers: 20, 
    fetchmenPerEvent: 40,
    productsPerEvent: 500,
    dataRetentionDays: 180
  },
  "Enterprise": {
    eventsPerMonth: -1, // Unlimited
    merchantsPerEvent: -1, // Unlimited
    adminUsers: -1, // Unlimited
    fetchmenPerEvent: -1, // Unlimited
    productsPerEvent: -1, // Unlimited
    dataRetentionDays: 365
  }
};

export const getTierLevel = (subscriptionTier: string): number => {
  return tierLevels[subscriptionTier as keyof typeof tierLevels] || 0;
};

export const getTierLimit = (tier: string, limitKey: keyof SubscriptionLimits): number => {
  const limits = subscriptionLimits[tier] || subscriptionLimits["Free Plan"];
  return limits[limitKey];
};

export const isLimitExceeded = (tier: string, limitKey: keyof SubscriptionLimits, currentUsage: number): boolean => {
  const limit = getTierLimit(tier, limitKey);
  // -1 indicates unlimited
  return limit !== -1 && currentUsage >= limit;
};

export const getAnalyticsFeaturesForTier = (tier: string): PricingFeature[] => {
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
      description: "Access to historical data"
    },
    {
      name: "Comparative Analytics",
      includedInTiers: ["Pro", "Enterprise"],
      description: "Compare performance across events or time periods"
    },
    // Food Delivery specific features
    {
      name: "Food Delivery Metrics",
      includedInTiers: ["Free Plan", "Starter", "Growth", "Pro", "Enterprise"],
      description: "Basic food delivery performance metrics"
    },
    {
      name: "Delivery Time Analytics",
      includedInTiers: ["Starter", "Growth", "Pro", "Enterprise"],
      description: "Track and analyze delivery times"
    },
    {
      name: "Item Performance Tracking",
      includedInTiers: ["Starter", "Growth", "Pro", "Enterprise"],
      description: "Analyze performance of menu items"
    },
    {
      name: "Customer Preference Analysis",
      includedInTiers: ["Growth", "Pro", "Enterprise"],
      description: "Track customer food preferences and trends"
    },
    {
      name: "Preparation Time Analytics",
      includedInTiers: ["Growth", "Pro", "Enterprise"],
      description: "Analyze time to prepare and deliver items"
    },
    {
      name: "Driver Performance Metrics",
      includedInTiers: ["Pro", "Enterprise"],
      description: "Detailed delivery driver performance analytics"
    },
    {
      name: "Food Preference Heatmap",
      includedInTiers: ["Pro", "Enterprise"],
      description: "Visual analytics of customer preferences by time"
    }
  ];
  
  return features.filter(feature => {
    const lowestTierWithFeature = feature.includedInTiers[0];
    return getTierLevel(lowestTierWithFeature) <= tierLevel;
  });
};

export const getDataWindowForTier = (tier: string): number => {
  return subscriptionLimits[tier]?.dataRetentionDays || 7;
};

export const getPricingPlans = () => {
  return UnifiedPricingPlans;
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
    // Food delivery features
    { name: "Food Delivery Analytics", minTier: 0 },
    { name: "Item Performance", minTier: 1 },
    { name: "Delivery Metrics", minTier: 1 },
    { name: "Customer Preferences", minTier: 2 },
    { name: "Driver Performance", minTier: 2 }
  ];
  
  const feature = allFeatures.find(f => f.name === featureName);
  if (!feature) return true; // If feature not found, treat as premium
  
  return getTierLevel(tier) < feature.minTier;
};

// Format numeric values to display unlimited when value is -1
export const formatLimit = (value: number): string => {
  return value === -1 ? "Unlimited" : value.toString();
};

// Get percentage of usage for a specific limit
export const getUsagePercent = (current: number, limit: number): number => {
  if (limit === -1) return 0; // Unlimited
  return Math.min(100, Math.round((current / limit) * 100));
};

// Check if usage is approaching the limit (80% or more)
export const isApproachingLimit = (current: number, limit: number): boolean => {
  if (limit === -1) return false; // Unlimited
  return (current / limit) >= 0.8;
};

// Get text color class based on usage percentage
export const getUsageColorClass = (usagePercent: number): string => {
  if (usagePercent >= 90) return 'text-red-500';
  if (usagePercent >= 80) return 'text-amber-500';
  return 'text-green-500';
};

// Get background color class based on usage percentage
export const getUsageBgClass = (usagePercent: number): string => {
  if (usagePercent >= 90) return 'bg-red-500';
  if (usagePercent >= 80) return 'bg-amber-500';
  return 'bg-green-500';
};

// Get border color class based on tier
export const getTierBorderClass = (tier: string): string => {
  const color = tierColors[tier as keyof typeof tierColors] || 'gray';
  return `border-${color}-500`;
};

// Get text color class based on tier
export const getTierTextClass = (tier: string): string => {
  const color = tierColors[tier as keyof typeof tierColors] || 'gray';
  return `text-${color}-600`;
};

// Get background color class based on tier
export const getTierBgClass = (tier: string): string => {
  const color = tierColors[tier as keyof typeof tierColors] || 'gray';
  return `bg-${color}-100 text-${color}-800`;
};
