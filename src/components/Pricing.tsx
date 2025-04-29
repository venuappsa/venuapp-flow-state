
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedPricingPlans } from "@/data/unifiedPricingPlans";
import { useState } from "react";

type PricingPlan = {
  name: string;
  price: string;
  eventPrice: string; // Required property
  description: string;
  features: Record<string, string>;
  highlighted: boolean;
  billingType: string;
};

const ComparisonTable = ({ plans, billingType }: { plans: PricingPlan[]; billingType: string }) => {
  // Get all unique feature names across all plans
  const allFeatures = Array.from(
    new Set(
      plans.flatMap(plan => Object.keys(plan.features))
    )
  ).sort();

  return (
    <div className="overflow-x-auto mt-12 mb-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left">
            <th className="px-4 py-2 bg-gray-50 border-b-2 border-gray-200">Features</th>
            {plans.map((plan) => (
              <th 
                key={plan.name} 
                className={`px-4 py-2 bg-gray-50 border-b-2 ${plan.highlighted ? 'border-venu-orange bg-orange-50' : 'border-gray-200'}`}
              >
                <span className="font-bold text-lg">{plan.name}</span>
                <div className="text-sm text-gray-600 font-normal">
                  {plan.price === "Custom" ? "Custom" : `${plan.price}/month`}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allFeatures.map((feature) => (
            <tr key={feature} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{feature}</td>
              {plans.map((plan) => (
                <td 
                  key={`${plan.name}-${feature}`} 
                  className={`px-4 py-3 ${plan.highlighted ? 'bg-orange-50' : ''}`}
                >
                  {plan.features[feature] === "N/A" ? (
                    <span className="text-red-500 flex items-center">
                      <X className="h-4 w-4 mr-1" />
                      <span className="text-gray-400">Not available</span>
                    </span>
                  ) : (
                    <span className="text-green-600 flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      {plan.features[feature]}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PricingCard = ({ plan, isHighlighted, billingType }: { 
  plan: PricingPlan; 
  isHighlighted: boolean; 
  billingType: string;
}) => {
  // Filter out certain features to display
  const allFeatures = Object.keys(plan.features).filter(name => name !== "Post-Event Sales Access");
  const featureNames = allFeatures.slice(0, 5);
  const moreFeatures = allFeatures.slice(5);

  return (
    <Card className={`flex flex-col h-full hover:shadow-md transition-shadow ${isHighlighted ? 'border-2 border-venu-orange shadow-lg relative' : 'border border-gray-200'}`}>
      {isHighlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-venu-orange text-white text-sm px-4 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-sm">{plan.description}</CardDescription>
        <div className="mt-2">
          <span className="text-3xl font-bold">
            {plan.price}
          </span>
          {plan.price !== "Custom" && plan.name !== "Free Plan" && (
            <span className="text-sm text-muted-foreground">
              /month
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {featureNames.map((feature) => (
            <li key={feature} className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-venu-orange shrink-0 mt-0.5" />
              <span className="text-sm">
                <span className="font-medium">{feature}:</span> {plan.features[feature]}
              </span>
            </li>
          ))}
        </ul>
        
        <div className="mt-6">
          <p className="text-sm font-medium mb-2">Additional features:</p>
          <ul className="space-y-2">
            {moreFeatures.map((feature) => (
              <li key={feature} className="flex items-start">
                {plan.features[feature] === "N/A" ? (
                  <X className="h-5 w-5 mr-2 text-gray-400 shrink-0 mt-0.5" />
                ) : (
                  <Check className="h-5 w-5 mr-2 text-venu-orange shrink-0 mt-0.5" />
                )}
                <span className="text-sm">
                  <span className="font-medium">{feature}:</span> {plan.features[feature]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className={`w-full ${isHighlighted ? 'bg-venu-orange hover:bg-venu-orange/90' : ''}`}>
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  const [showComparison, setShowComparison] = useState(false);
  const [billingType, setBillingType] = useState<"monthly" | "event">("monthly");
  
  // Add eventPrice to each plan for type compatibility
  const plans = UnifiedPricingPlans.map(plan => ({
    ...plan,
    eventPrice: plan.price // Set event price to be the same as regular price for now
  }));

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-venu-black">
            Flexible <span className="text-venu-orange">Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan that fits your needs with flexible pricing options.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-lg bg-gray-100">
            <Button 
              variant="ghost" 
              className={`px-6 rounded-md ${!showComparison ? 'bg-white shadow text-venu-orange' : ''}`}
              onClick={() => setShowComparison(false)}
            >
              Card View
            </Button>
            <Button 
              variant="ghost" 
              className={`px-6 rounded-md ${showComparison ? 'bg-white shadow text-venu-orange' : ''}`}
              onClick={() => setShowComparison(true)}
            >
              Comparison View
            </Button>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <Tabs defaultValue="monthly" value={billingType} onValueChange={(value) => setBillingType(value as "monthly" | "event")} className="w-full max-w-md">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="monthly" className="text-lg py-3">
                <div className="flex flex-col items-center">
                  <span>Monthly</span>
                  <span className="text-xs text-gray-500 mt-1">Subscription billing</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="event" className="text-lg py-3">
                <div className="flex flex-col items-center">
                  <span>Per Event</span>
                  <span className="text-xs text-gray-500 mt-1">One-time billing</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {showComparison ? (
          <ComparisonTable plans={plans} billingType={billingType} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {plans.map((plan, index) => (
              <PricingCard key={index} plan={plan} isHighlighted={plan.highlighted} billingType={billingType} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4">Need a customized solution for your specific needs?</p>
          <Button variant="outline" className="border-venu-orange text-venu-orange hover:bg-venu-orange/10">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
