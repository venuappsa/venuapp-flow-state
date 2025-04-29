
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { 
  subscriptionLimits, 
  getUsagePercent, 
  getUsageBgClass,
  getTierBgClass,
  formatLimit
} from "@/utils/pricingUtils";
import { Badge } from "@/components/ui/badge";

interface UsageItemProps {
  label: string;
  current: number;
  limit: number;
  icon?: React.ReactNode;
}

const UsageItem = ({ label, current, limit, icon }: UsageItemProps) => {
  const usagePercent = getUsagePercent(current, limit);
  const isUnlimited = limit === -1;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-500">{icon}</span>}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-sm">
          {isUnlimited ? (
            <span className="text-gray-500">
              {current} / <span className="italic font-medium">Unlimited</span>
            </span>
          ) : (
            <span className={usagePercent >= 80 ? (usagePercent >= 90 ? "text-red-500" : "text-amber-500") : "text-gray-500"}>
              {current} / {limit}
            </span>
          )}
        </div>
      </div>
      {!isUnlimited && (
        <Progress 
          value={usagePercent} 
          className="h-2" 
          indicatorClassName={getUsageBgClass(usagePercent)}
        />
      )}
    </div>
  );
};

interface SubscriptionUsageProps {
  eventsUsed?: number;
  merchantsUsed?: number;
  adminsUsed?: number;
  fetchmenUsed?: number;
  productsUsed?: number;
}

const SubscriptionUsage = ({
  eventsUsed = 0,
  merchantsUsed = 0,
  adminsUsed = 0,
  fetchmenUsed = 0,
  productsUsed = 0
}: SubscriptionUsageProps) => {
  const { subscription_tier } = useSubscription();
  const tier = subscription_tier || "Free Plan";
  const limits = subscriptionLimits[tier] || subscriptionLimits["Free Plan"];

  const isAnyLimitApproaching = 
    getUsagePercent(eventsUsed, limits.eventsPerMonth) >= 80 ||
    getUsagePercent(merchantsUsed, limits.merchantsPerEvent) >= 80 ||
    getUsagePercent(adminsUsed, limits.adminUsers) >= 80 ||
    getUsagePercent(fetchmenUsed, limits.fetchmenPerEvent) >= 80 ||
    getUsagePercent(productsUsed, limits.productsPerEvent) >= 80;

  const isAnyLimitExceeded =
    getUsagePercent(eventsUsed, limits.eventsPerMonth) >= 100 ||
    getUsagePercent(merchantsUsed, limits.merchantsPerEvent) >= 100 ||
    getUsagePercent(adminsUsed, limits.adminUsers) >= 100 ||
    getUsagePercent(fetchmenUsed, limits.fetchmenPerEvent) >= 100 ||
    getUsagePercent(productsUsed, limits.productsPerEvent) >= 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Subscription Usage</CardTitle>
          <Badge className={getTierBgClass(tier)}>{tier}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnyLimitExceeded && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Usage Limit Exceeded</AlertTitle>
            <AlertDescription>
              You've reached one or more usage limits for your current plan. Please upgrade to continue using these features.
            </AlertDescription>
          </Alert>
        )}
        
        {!isAnyLimitExceeded && isAnyLimitApproaching && (
          <Alert variant="warning" className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Approaching Usage Limits</AlertTitle>
            <AlertDescription>
              You're approaching the usage limits for your current plan. Consider upgrading to avoid interruptions.
            </AlertDescription>
          </Alert>
        )}
        
        {!isAnyLimitApproaching && !isAnyLimitExceeded && (
          <Alert variant="default" className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Usage Within Limits</AlertTitle>
            <AlertDescription>
              You're comfortably within your plan's usage limits.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <UsageItem 
            label="Events This Month" 
            current={eventsUsed} 
            limit={limits.eventsPerMonth}
          />
          <UsageItem 
            label="Merchants Per Event" 
            current={merchantsUsed} 
            limit={limits.merchantsPerEvent}
          />
          <UsageItem 
            label="Admin Users" 
            current={adminsUsed} 
            limit={limits.adminUsers}
          />
          <UsageItem 
            label="Fetchmen Per Event" 
            current={fetchmenUsed} 
            limit={limits.fetchmenPerEvent}
          />
          <UsageItem 
            label="Products Per Event" 
            current={productsUsed} 
            limit={limits.productsPerEvent}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionUsage;
