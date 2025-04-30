
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  Store, 
  MessageSquare, 
  PersonStanding, 
  Clock,
  ShoppingBag,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { VendorMetrics } from "@/types/vendor";

export default function VendorMetricsDashboard() {
  const { user } = useUser();
  const [metrics, setMetrics] = useState<VendorMetrics>({
    total_hosts: 0,
    active_hosts: 0,
    messages_this_week: 0,
    response_rate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMetrics();
    }
  }, [user]);

  const fetchMetrics = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // For now, use mock data
      const mockData: VendorMetrics = {
        total_hosts: 5,
        active_hosts: 3,
        messages_this_week: 14,
        response_rate: 0.9
      };
      
      setMetrics(mockData);
    } catch (error) {
      console.error("Error fetching vendor metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate response rate percentage for display
  const responseRatePercentage = Math.round(metrics.response_rate * 100);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Hosts Connected"
          value={metrics.total_hosts}
          description={`${metrics.active_hosts} active`}
          icon={<PersonStanding size={20} />}
          loading={loading}
        />
        <StatCard
          title="Active Listings"
          value={metrics.active_hosts}
          icon={<ShoppingBag size={20} />}
          loading={loading}
        />
        <StatCard
          title="Messages This Week"
          value={metrics.messages_this_week}
          icon={<MessageSquare size={20} />}
          loading={loading}
        />
        <StatCard
          title="Response Rate"
          value={`${responseRatePercentage}%`}
          description="Last 30 days"
          icon={<Clock size={20} />}
          loading={loading}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Host Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="rounded-full bg-blue-100 p-4 mb-4">
                <PersonStanding className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold">{metrics.total_hosts}</h3>
              <p className="text-gray-500 mt-1">Total Hosts Connected</p>
              
              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <div className="text-center p-4 border rounded-md">
                  <p className="text-sm text-gray-500 mb-1">Active</p>
                  <p className="text-xl font-semibold">{metrics.active_hosts}</p>
                </div>
                <div className="text-center p-4 border rounded-md">
                  <p className="text-sm text-gray-500 mb-1">Inactive</p>
                  <p className="text-xl font-semibold">{metrics.total_hosts - metrics.active_hosts}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Communication Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Response Rate</p>
                <h3 className="text-2xl font-bold">{responseRatePercentage}%</h3>
                <p className="text-xs text-gray-500 mt-1">Average response time</p>
              </div>
              <div className="h-16 w-16 rounded-full flex items-center justify-center border-4" 
                  style={{
                    borderColor: `${responseRatePercentage >= 80 ? 'rgb(34, 197, 94)' : 
                                  responseRatePercentage >= 60 ? 'rgb(59, 130, 246)' : 
                                  responseRatePercentage >= 40 ? 'rgb(245, 158, 11)' : 
                                  'rgb(239, 68, 68)'}`
                  }}>
                <Clock className="h-8 w-8" 
                    style={{
                      color: `${responseRatePercentage >= 80 ? 'rgb(34, 197, 94)' : 
                              responseRatePercentage >= 60 ? 'rgb(59, 130, 246)' : 
                              responseRatePercentage >= 40 ? 'rgb(245, 158, 11)' : 
                              'rgb(239, 68, 68)'}`
                    }}/>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Messages Summary</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>This Week</span>
                  <span className="font-medium">{metrics.messages_this_week}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg. Per Host</span>
                  <span className="font-medium">
                    {metrics.total_hosts > 0 
                      ? (metrics.messages_this_week / metrics.total_hosts).toFixed(1) 
                      : "0"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
