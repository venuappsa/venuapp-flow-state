
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Progress } from "@/components/ui/progress";
import { 
  Store, 
  MessageSquare, 
  Clock, 
  BarChart4,
  Users,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { HostMetrics } from "@/types/vendor";

export default function VendorMetricsDashboard() {
  const { user } = useUser();
  const [metrics, setMetrics] = useState<HostMetrics>({
    total_vendors: 0,
    live_vendors: 0,
    avg_engagement_score: 0,
    avg_response_time_minutes: 0,
    message_activity_week: 0
  });
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    invited: 0,
    active: 0,
    paused: 0,
    rejected: 0
  });

  useEffect(() => {
    if (user) {
      fetchMetrics();
      fetchStatusDistribution();
    }
  }, [user]);

  const fetchMetrics = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .rpc('get_host_metrics', { host_user_id: user.id });
        
      if (error) throw error;
      
      if (data) {
        setMetrics(data as HostMetrics);
      }
    } catch (error) {
      console.error("Error fetching host metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusDistribution = async () => {
    if (!user) return;
    
    try {
      // First get the host profile ID
      const { data: hostData, error: hostError } = await supabase
        .from("host_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (hostError) throw hostError;
      
      // Then get all vendor relationships and count by status
      const { data, error } = await supabase
        .from("vendor_host_relationships")
        .select("status")
        .eq("host_id", hostData.id);
        
      if (error) throw error;
      
      const counts = {
        invited: 0,
        active: 0,
        paused: 0,
        rejected: 0
      };
      
      data.forEach(rel => {
        if (counts.hasOwnProperty(rel.status)) {
          counts[rel.status as keyof typeof counts]++;
        }
      });
      
      setStatusCounts(counts);
    } catch (error) {
      console.error("Error fetching status distribution:", error);
    }
  };

  // Calculate live vendor percentage
  const liveVendorPercentage = metrics.total_vendors > 0
    ? Math.round((metrics.live_vendors / metrics.total_vendors) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Vendor Performance Metrics</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vendors"
          value={metrics.total_vendors}
          icon={<Store size={20} />}
          loading={loading}
        />
        <StatCard
          title="Live Vendors"
          value={metrics.live_vendors}
          description={`${liveVendorPercentage}% of total`}
          icon={<Users size={20} />}
          loading={loading}
        />
        <StatCard
          title="Avg. Response Time"
          value={`${metrics.avg_response_time_minutes} min`}
          icon={<Clock size={20} />}
          loading={loading}
        />
        <StatCard
          title="Messages This Week"
          value={metrics.message_activity_week}
          icon={<MessageSquare size={20} />}
          loading={loading}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vendor Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Active</span>
                  <span className="font-medium">{statusCounts.active}</span>
                </div>
                <Progress 
                  value={metrics.total_vendors > 0 ? (statusCounts.active / metrics.total_vendors) * 100 : 0} 
                  className="h-2 bg-gray-100" 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Invited</span>
                  <span className="font-medium">{statusCounts.invited}</span>
                </div>
                <Progress 
                  value={metrics.total_vendors > 0 ? (statusCounts.invited / metrics.total_vendors) * 100 : 0} 
                  className="h-2 bg-gray-100" 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Paused</span>
                  <span className="font-medium">{statusCounts.paused}</span>
                </div>
                <Progress 
                  value={metrics.total_vendors > 0 ? (statusCounts.paused / metrics.total_vendors) * 100 : 0} 
                  className="h-2 bg-gray-100" 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Rejected</span>
                  <span className="font-medium">{statusCounts.rejected}</span>
                </div>
                <Progress 
                  value={metrics.total_vendors > 0 ? (statusCounts.rejected / metrics.total_vendors) * 100 : 0} 
                  className="h-2 bg-gray-100" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vendor Engagement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Average Engagement Score</p>
                <h3 className="text-2xl font-bold">{Math.round(metrics.avg_engagement_score)}/100</h3>
              </div>
              <div className="h-16 w-16 rounded-full flex items-center justify-center border-4" 
                  style={{
                    borderColor: `${metrics.avg_engagement_score >= 75 ? 'rgb(34, 197, 94)' : 
                                  metrics.avg_engagement_score >= 50 ? 'rgb(59, 130, 246)' : 
                                  metrics.avg_engagement_score >= 25 ? 'rgb(245, 158, 11)' : 
                                  'rgb(239, 68, 68)'}`
                  }}>
                <BarChart4 className="h-8 w-8" 
                    style={{
                      color: `${metrics.avg_engagement_score >= 75 ? 'rgb(34, 197, 94)' : 
                              metrics.avg_engagement_score >= 50 ? 'rgb(59, 130, 246)' : 
                              metrics.avg_engagement_score >= 25 ? 'rgb(245, 158, 11)' : 
                              'rgb(239, 68, 68)'}`
                    }}/>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Engagement Breakdown</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Messages</span>
                  <span className="font-medium">{metrics.message_activity_week} this week</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Response Time</span>
                  <span className="font-medium">{metrics.avg_response_time_minutes} minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Rate</span>
                  <span className="font-medium">{liveVendorPercentage}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
