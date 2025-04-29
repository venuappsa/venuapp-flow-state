
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PlanTypeSelector from "@/components/analytics/PlanTypeSelector";
import { PlanType } from "@/utils/pricingUtils";
import { Building, CalendarPlus } from "lucide-react";

export default function SubscriptionStatusDisplay() {
  const navigate = useNavigate();
  const { subscribed, subscription_tier, subscription_status } = useSubscription();
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType>("venue");

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-amber-100 text-amber-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "trial":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubscribe = () => {
    navigate(`/#pricing?type=${selectedPlanType}`);
  };

  return (
    <Card className="border-dashed border-gray-300 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">Subscription Status</h4>
          <Badge className={getStatusColor(subscription_status)}>
            {subscription_status || "None"}
          </Badge>
        </div>
        
        <PlanTypeSelector
          selectedPlanType={selectedPlanType}
          onChange={setSelectedPlanType}
          className="mb-2"
        />
        
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-sm font-medium">
              {selectedPlanType === "venue" ? "Venue Plan:" : "Event Plan:"}
            </p>
            <p className="text-xs text-gray-500">
              {subscription_tier || "Free Plan"}
            </p>
          </div>
          <Button 
            size="sm" 
            className="whitespace-nowrap"
            onClick={handleSubscribe}
          >
            {subscribed ? "Upgrade Plan" : "Subscribe"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
