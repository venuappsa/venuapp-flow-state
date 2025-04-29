
import React, { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useSubscription } from "@/hooks/useSubscription";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Lock, UserPlus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { getTierLevel } from "@/utils/pricingUtils";

export default function GuestPage() {
  const { user } = useUser();
  const { subscription_tier } = useSubscription();
  const currentTierLevel = getTierLevel(subscription_tier || "Free Plan");
  
  const hasGuestAnalyticsAccess = currentTierLevel >= 1;
  const hasDetailedGuestAnalyticsAccess = currentTierLevel >= 2;
  
  useEffect(() => {
    // Load guest data based on subscription tier
    if (hasGuestAnalyticsAccess) {
      console.log("Loading guest analytics data");
      // Actual data loading would happen here
    }
  }, [hasGuestAnalyticsAccess]);

  const handleUpgradeClick = () => {
    toast({
      title: "Upgrade Required",
      description: "Please upgrade your plan to access guest analytics.",
    });
  };

  if (!hasGuestAnalyticsAccess) {
    return (
      <div className="container max-w-7xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <Lock className="h-16 w-16 text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold mb-2">Guest Analytics Locked</h1>
          <p className="text-gray-500 mb-8 max-w-md">
            Guest analytics are available on Starter plan and higher. Upgrade your subscription to unlock this feature.
          </p>
          <Link to="/subscribe">
            <Button size="lg">Upgrade Subscription</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Guest Analytics</h1>
      
      {/* Guest Analytics content would go here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5" /> Attendance Overview
          </h2>
          {/* Attendance data visualization would go here */}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <UserPlus className="mr-2 h-5 w-5" /> Guest Registration
          </h2>
          {/* Guest registration data would go here */}
        </Card>
      </div>
    </div>
  );
}
