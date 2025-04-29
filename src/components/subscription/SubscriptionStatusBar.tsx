
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Crown, AlertCircle, ChevronRight } from "lucide-react";
import { getTierBgClass, getTierTextClass, getDataWindowForTier } from "@/utils/pricingUtils";
import { Badge } from "@/components/ui/badge";

const SubscriptionStatusBar = () => {
  const navigate = useNavigate();
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    subscription_status, 
    subscription_plan_type,
    isLoading 
  } = useSubscription();
  
  const tier = subscription_tier || "Free Plan";
  const dataRetention = getDataWindowForTier(tier);
  
  if (isLoading) {
    return <div className="animate-pulse h-12 bg-gray-100 rounded-md"></div>;
  }

  return (
    <div className="py-2 px-4 bg-white border rounded-md shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Crown className={`h-5 w-5 ${getTierTextClass(tier)}`} />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{tier} Plan</span>
            <Badge className={`${getTierBgClass(tier)}`}>
              {subscription_plan_type === "venue" ? "Monthly" : "Per Event"}
            </Badge>
            
            {subscription_status && subscription_status !== "active" && (
              <Badge variant="outline" className="text-amber-500 border-amber-200">
                {subscription_status}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {subscribed ? (
              <>
                Data retention: {dataRetention} days
                {subscription_end && (
                  <> · Renews: {new Date(subscription_end).toLocaleDateString()}</>
                )}
              </>
            ) : (
              <>Free plan with limited features</>
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center">
        {!subscribed && (
          <div className="hidden md:flex items-center mr-3 text-amber-600 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Upgrade to unlock more features</span>
          </div>
        )}
        
        <Button 
          size="sm" 
          onClick={() => navigate("/host/subscription")}
          variant="outline"
          className="flex items-center"
        >
          {subscribed ? "Manage Plan" : "Upgrade"}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionStatusBar;
