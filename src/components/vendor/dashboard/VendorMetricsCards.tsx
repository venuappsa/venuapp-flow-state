
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BadgeDollarSign, Calendar, Star, UserCheck } from "lucide-react";
import { Progress } from '@/components/ui/progress';
import { VendorMetric } from '@/utils/vendorAnalyticsData';

interface VendorMetricsCardsProps {
  metrics: VendorMetric[];
  loading?: boolean;
}

const VendorMetricsCards = ({ metrics, loading = false }: VendorMetricsCardsProps) => {
  const iconMap = {
    'Total Revenue': <BadgeDollarSign className="h-5 w-5 text-emerald-500" />,
    'Upcoming Bookings': <Calendar className="h-5 w-5 text-blue-500" />,
    'Average Rating': <Star className="h-5 w-5 text-amber-500" />,
    'Profile Completion': <UserCheck className="h-5 w-5 text-violet-500" />
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-32"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                
                {metric.label === 'Profile Completion' ? (
                  <div className="mt-2 mb-1">
                    <Progress 
                      value={typeof metric.value === 'string' ? parseInt(metric.value) : Number(metric.value)} 
                      className="h-1.5" 
                    />
                  </div>
                ) : null}
                
                <p className={`text-xs mt-1 flex items-center ${
                  metric.changeType === 'positive' ? 'text-green-600' :
                  metric.changeType === 'negative' ? 'text-red-600' :
                  'text-gray-500'
                }`}>
                  {metric.change}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center">
                {metric.label in iconMap ? iconMap[metric.label as keyof typeof iconMap] : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VendorMetricsCards;
