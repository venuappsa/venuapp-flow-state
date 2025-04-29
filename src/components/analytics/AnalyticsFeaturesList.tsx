
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { getAnalyticsFeaturesForTier } from "@/utils/pricingUtils";

interface AnalyticsFeaturesListProps {
  tier: string;
}

export default function AnalyticsFeaturesList({ tier }: AnalyticsFeaturesListProps) {
  const features = getAnalyticsFeaturesForTier(tier);
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium text-sm mb-4">Available Analytics Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start p-2 border border-gray-100 rounded-md bg-gray-50"
            >
              <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{feature.name}</p>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
