
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface MerchantPricingProps {
  venueId?: string;
  eventId?: string;
}

interface PricingTier {
  id: string;
  name: string;
  price: number;
  priceUnit: string;
  description: string;
  features: {
    name: string;
    included: boolean;
    description?: string;
  }[];
}

export default function MerchantPricing({ venueId, eventId }: MerchantPricingProps) {
  const [pricingType, setPricingType] = useState<'venue' | 'event'>('venue');

  // Sample pricing tiers
  const venuePricingTiers: PricingTier[] = [
    {
      id: 'basic-stall',
      name: 'Basic Stall',
      price: 500,
      priceUnit: 'per day',
      description: 'Essential stall for small merchants with basic needs',
      features: [
        { name: 'Stall Space (2x2m)', included: true },
        { name: 'Access to Power', included: true },
        { name: 'Table & Chair', included: true },
        { name: 'Signage', included: true },
        { name: 'Wi-Fi Access', included: true },
        { name: 'Storage Space', included: false },
        { name: 'Premium Location', included: false },
        { name: 'Marketing Inclusion', included: false },
      ]
    },
    {
      id: 'premium-stall',
      name: 'Premium Stall',
      price: 1200,
      priceUnit: 'per day',
      description: 'Enhanced visibility with better positioning and amenities',
      features: [
        { name: 'Stall Space (3x3m)', included: true },
        { name: 'Access to Power', included: true },
        { name: 'Table & 2 Chairs', included: true },
        { name: 'Premium Signage', included: true },
        { name: 'Wi-Fi Access', included: true },
        { name: 'Storage Space', included: true },
        { name: 'Premium Location', included: true },
        { name: 'Marketing Inclusion', included: false },
      ]
    },
    {
      id: 'exclusive-stall',
      name: 'Exclusive Stall',
      price: 2500,
      priceUnit: 'per day',
      description: 'Premium placement with maximum visibility and all amenities',
      features: [
        { name: 'Stall Space (4x4m)', included: true },
        { name: 'Access to Power', included: true },
        { name: 'Custom Furniture', included: true },
        { name: 'Custom Branding', included: true },
        { name: 'Wi-Fi Access', included: true },
        { name: 'Dedicated Storage', included: true },
        { name: 'VIP Location', included: true },
        { name: 'Marketing Package', included: true },
      ]
    }
  ];

  const eventPricingTiers: PricingTier[] = [
    {
      id: 'event-basic',
      name: 'Event Basic',
      price: 750,
      priceUnit: 'flat fee',
      description: 'Single event participation with basic amenities',
      features: [
        { name: 'Stall Space (2x2m)', included: true },
        { name: 'Event Day Only', included: true },
        { name: 'Table & Chair', included: true },
        { name: 'Access to Power', included: true },
        { name: 'Event Badge', included: true },
        { name: 'Wi-Fi Access', included: false },
        { name: 'Premium Location', included: false },
        { name: 'Event Marketing', included: false },
      ]
    },
    {
      id: 'event-premium',
      name: 'Event Premium',
      price: 1500,
      priceUnit: 'flat fee',
      description: 'Enhanced event participation with better positioning',
      features: [
        { name: 'Stall Space (3x3m)', included: true },
        { name: 'Setup Day + Event Day', included: true },
        { name: 'Premium Furniture', included: true },
        { name: 'Access to Power', included: true },
        { name: 'VIP Event Badges', included: true },
        { name: 'Wi-Fi Access', included: true },
        { name: 'Premium Location', included: true },
        { name: 'Event Marketing', included: false },
      ]
    },
    {
      id: 'event-exclusive',
      name: 'Event Exclusive',
      price: 3000,
      priceUnit: 'flat fee',
      description: 'Premium event participation with maximum visibility',
      features: [
        { name: 'Stall Space (4x4m)', included: true },
        { name: 'Full Event Access', included: true },
        { name: 'Custom Furniture', included: true },
        { name: 'Dedicated Power Circuit', included: true },
        { name: 'All Access Passes', included: true },
        { name: 'Priority Wi-Fi', included: true },
        { name: 'VIP Location', included: true },
        { name: 'Featured Marketing', included: true },
      ]
    }
  ];

  const pricingTiers = pricingType === 'venue' ? venuePricingTiers : eventPricingTiers;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Merchant Pricing</h2>
          <p className="text-gray-500">Stall and space pricing for merchants</p>
        </div>

        <Tabs value={pricingType} onValueChange={(v) => setPricingType(v as 'venue' | 'event')} className="mt-4 sm:mt-0">
          <TabsList>
            <TabsTrigger value="venue">Venue Pricing</TabsTrigger>
            <TabsTrigger value="event">Event Pricing</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingTiers.map((tier) => (
          <Card key={tier.id} className={tier.name.includes("Exclusive") ? "border-venu-orange shadow-lg" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{tier.name}</CardTitle>
                {tier.name.includes("Exclusive") && (
                  <Badge className="bg-venu-orange">Best Value</Badge>
                )}
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold">R{tier.price}</span>
                <span className="text-sm text-gray-500"> {tier.priceUnit}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead className="text-right">Included</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tier.features.map((feature) => (
                    <TableRow key={feature.name}>
                      <TableCell className="font-medium">{feature.name}</TableCell>
                      <TableCell className="text-right">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-600 ml-auto" />
                        ) : (
                          <X className="h-4 w-4 text-gray-300 ml-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button className="w-full mt-6">Select Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mt-8">
        <h3 className="font-semibold text-lg mb-2">Additional Information</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="bg-green-100 text-green-800 p-1 rounded mr-2">•</span>
            <span>All merchant stalls must be booked at least 7 days in advance.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-green-100 text-green-800 p-1 rounded mr-2">•</span>
            <span>50% deposit required to secure your stall space.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-green-100 text-green-800 p-1 rounded mr-2">•</span>
            <span>Cancellations within 72 hours forfeit deposit.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-green-100 text-green-800 p-1 rounded mr-2">•</span>
            <span>Custom stall requirements available upon request.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
