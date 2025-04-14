
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VenuePricingPlans = [
  {
    name: "Free Plan",
    price: "R0",
    eventPrice: "R0",
    description: "Perfect for trying out the platform",
    features: {
      "Per Event Fee": "R0",
      "Per Month Fee": "N/A",
      "Merchant Allowed": "1",
      "Fetchman Access": "2",
      "Admin Team Users": "1",
      "Product Load": "10",
      "Sales Dashboard & Analytics": "Limited",
      "Customer Support Priority": "Limited",
      "Onboarding & Training": "N/A"
    },
    highlighted: false
  },
  {
    name: "Starter",
    price: "R950",
    eventPrice: "R250.00",
    description: "For small venues just getting started",
    features: {
      "Per Event Fee": "R250.00",
      "Per Month Fee": "R950.00",
      "Merchant Allowed": "3",
      "Fetchman Access": "5",
      "Admin Team Users": "3",
      "Product Load": "30",
      "Sales Dashboard & Analytics": "Basic",
      "Customer Support Priority": "Standard",
      "Onboarding & Training": "N/A"
    },
    highlighted: false
  },
  {
    name: "Growth",
    price: "R1,850",
    eventPrice: "R500.00",
    description: "For growing venues with regular events",
    features: {
      "Per Event Fee": "R500.00",
      "Per Month Fee": "R1,850.00",
      "Merchant Allowed": "7",
      "Fetchman Access": "10",
      "Admin Team Users": "7",
      "Product Load": "75",
      "Sales Dashboard & Analytics": "Standard",
      "Customer Support Priority": "High",
      "Onboarding & Training": "Virtual"
    },
    highlighted: true
  },
  {
    name: "Pro",
    price: "R3,000",
    eventPrice: "R800.00",
    description: "For established venues with high traffic",
    features: {
      "Per Event Fee": "R800.00",
      "Per Month Fee": "R3,000.00",
      "Merchant Allowed": "10",
      "Fetchman Access": "20",
      "Admin Team Users": "15",
      "Product Load": "200",
      "Sales Dashboard & Analytics": "Advanced",
      "Customer Support Priority": "Priority",
      "Onboarding & Training": "Virtual"
    },
    highlighted: false
  },
  {
    name: "Enterprise",
    price: "Custom",
    eventPrice: "Custom",
    description: "For large-scale venues with unique needs",
    features: {
      "Per Event Fee": "Custom",
      "Per Month Fee": "Custom",
      "Merchant Allowed": "Unlimited",
      "Fetchman Access": "Unlimited",
      "Admin Team Users": "Unlimited",
      "Product Load": "Unlimited",
      "Sales Dashboard & Analytics": "Full Suite",
      "Customer Support Priority": "24/7 Dedicated Manager",
      "Onboarding & Training": "Venue-based & Ongoing Support"
    },
    highlighted: false
  }
];

const EventPricingPlans = [
  {
    name: "Free Plan",
    price: "R0",
    eventPrice: "R0",
    description: "Perfect for small, one-time events",
    features: {
      "Per Event Fee": "R0",
      "Per Month Fee": "N/A",
      "Merchant Allowed": "1",
      "Fetchman Access": "2",
      "Admin Team Users": "1",
      "Product Load": "10",
      "Sales Dashboard & Analytics": "Limited",
      "Customer Support Priority": "Limited",
      "Onboarding & Training": "N/A"
    },
    highlighted: false
  },
  {
    name: "Starter",
    price: "R650",
    eventPrice: "R650.00",
    description: "For small to medium events",
    features: {
      "Per Event Fee": "R650.00",
      "Per Month Fee": "N/A",
      "Merchant Allowed": "3",
      "Fetchman Access": "6",
      "Admin Team Users": "3",
      "Product Load": "60",
      "Sales Dashboard & Analytics": "Basic",
      "Customer Support Priority": "Standard",
      "Onboarding & Training": "N/A"
    },
    highlighted: false
  },
  {
    name: "Growth",
    price: "R1,070",
    eventPrice: "R1,070.00",
    description: "For larger events with multiple vendors",
    features: {
      "Per Event Fee": "R1,070.00",
      "Per Month Fee": "N/A",
      "Merchant Allowed": "7",
      "Fetchman Access": "14",
      "Admin Team Users": "7",
      "Product Load": "140",
      "Sales Dashboard & Analytics": "Standard",
      "Customer Support Priority": "High",
      "Onboarding & Training": "Virtual"
    },
    highlighted: true
  },
  {
    name: "Pro",
    price: "R2,160",
    eventPrice: "R2,160.00",
    description: "For major events with high attendance",
    features: {
      "Per Event Fee": "R2,160.00",
      "Per Month Fee": "N/A",
      "Merchant Allowed": "10",
      "Fetchman Access": "30",
      "Admin Team Users": "30",
      "Product Load": "300",
      "Sales Dashboard & Analytics": "Advanced",
      "Customer Support Priority": "Priority",
      "Onboarding & Training": "Venue-based"
    },
    highlighted: false
  },
  {
    name: "Enterprise",
    price: "Custom",
    eventPrice: "Custom",
    description: "For festivals and large-scale events",
    features: {
      "Per Event Fee": "Custom",
      "Per Month Fee": "N/A",
      "Merchant Allowed": "Unlimited",
      "Fetchman Access": "Unlimited",
      "Admin Team Users": "Unlimited",
      "Product Load": "Unlimited",
      "Sales Dashboard & Analytics": "Full Suite",
      "Customer Support Priority": "24/7 Dedicated Manager",
      "Onboarding & Training": "Venue-based & Ongoing Support"
    },
    highlighted: false
  }
];

const PricingCard = ({ plan, isHighlighted }) => {
  // Filter out "Post-Event Sales Access" feature completely
  const allFeatures = Object.keys(plan.features).filter(name => name !== "Post-Event Sales Access");
  const featureNames = allFeatures.slice(0, 5);
  const moreFeatures = allFeatures.slice(5);

  return (
    <Card className={`flex flex-col h-full ${isHighlighted ? 'border-2 border-venu-orange shadow-lg relative' : ''}`}>
      {isHighlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-venu-orange text-white text-sm px-4 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-sm">{plan.description}</CardDescription>
        <div className="mt-2">
          <span className="text-3xl font-bold">{plan.eventPrice}</span>
          {plan.price !== "Custom" && plan.name !== "Free Plan" && (
            <span className="text-sm text-muted-foreground">/event</span>
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
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-venu-black">
            Flexible <span className="text-venu-orange">Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan that fits your venue's needs or select an event-based package for one-time experiences.
          </p>
        </div>

        <Tabs defaultValue="venues" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="venues" className="text-lg py-3">Venue Packages</TabsTrigger>
              <TabsTrigger value="events" className="text-lg py-3">Event Packages</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="venues" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {VenuePricingPlans.map((plan, index) => (
                <PricingCard key={index} plan={plan} isHighlighted={plan.highlighted} />
              ))}
            </div>
            <div className="text-center mt-10">
              <p className="text-gray-600 mb-4">Need a customized solution for your specific venue needs?</p>
              <Button variant="outline" className="border-venu-orange text-venu-orange hover:bg-venu-orange/10">
                Contact Sales
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {EventPricingPlans.map((plan, index) => (
                <PricingCard key={index} plan={plan} isHighlighted={plan.highlighted} />
              ))}
            </div>
            <div className="text-center mt-10">
              <p className="text-gray-600 mb-4">Planning a large-scale event? Let's discuss your custom requirements.</p>
              <Button variant="outline" className="border-venu-orange text-venu-orange hover:bg-venu-orange/10">
                Contact Sales
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Pricing;
