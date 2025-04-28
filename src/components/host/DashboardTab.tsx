
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  CalendarPlus, 
  ChevronRight
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubscription } from "@/hooks/useSubscription";
import { dashboardStats, dummyEvents } from "@/data/hostDummyData";
import NoticeBoard from "@/components/NoticeBoard";
import SalesBreakdownDialog from "@/components/SalesBreakdownDialog";
import { generateEventSalesData } from "@/data/salesData";
import AnalyticsSnapshot from "@/components/analytics/AnalyticsSnapshot";

export default function DashboardTab() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { subscribed, subscription_tier, subscription_status } = useSubscription();
  const [salesDialogOpen, setSalesDialogOpen] = useState(false);
  const [selectedSalesData, setSelectedSalesData] = useState<any>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-ZA', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  const handleOpenSalesBreakdown = (eventId: string, eventName: string, revenue: number) => {
    const salesData = generateEventSalesData(eventId, eventName, revenue);
    setSelectedSalesData(salesData);
    setSalesDialogOpen(true);
  };
  
  const handleStatsCardClick = (stat: any) => {
    if (stat.title === "Events") {
      navigate("/host/events");
    } else {
      toast({
        title: stat.title,
        description: `View detailed ${stat.title.toLowerCase()} metrics and analytics`,
      });
    }
  };

  const navigateToEvent = (eventId: string) => {
    navigate(`/host/events/${eventId}`);
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <NoticeBoard />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {dashboardStats.map((stat, index) => (
          <Card 
            key={index} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleStatsCardClick(stat)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="bg-gray-100 p-2 rounded-full">
                  <stat.icon className="h-5 w-5 text-venu-orange" />
                </div>
                <div className={`text-xs px-2 py-1 rounded ${stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : stat.changeType === 'negative' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}>
                  {stat.change}
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-medium text-gray-500 text-sm">{stat.title}</h3>
                <div className="text-2xl font-bold mt-1">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6 mb-12">
        <AnalyticsSnapshot 
          subscriptionTier={subscription_tier || "Free"} 
          subscriptionStatus={subscription_status}
        />
      </div>

      <div className="space-y-4 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Upcoming Events</h2>
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"} 
            className="gap-1"
            onClick={() => navigate("/host/events")}
          >
            <CalendarPlus className="h-4 w-4" />
            <span>View All Events</span>
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Sales</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th scope="col" className="relative px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dummyEvents.filter(event => event.status === 'upcoming').slice(0, 5).map((event) => (
                    <tr 
                      key={event.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigateToEvent(event.id)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{event.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{event.venueName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(event.date)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        <button
                          className="text-blue-600 hover:underline focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSalesBreakdown(event.id, event.name, event.revenue);
                          }}
                        >
                          {event.ticketsSold} / {event.capacity}
                        </button>
                        <div className="w-full mt-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-venu-orange h-1.5 rounded-full" 
                            style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }} 
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        <button
                          className="text-blue-600 hover:underline focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSalesBreakdown(event.id, event.name, event.revenue);
                          }}
                        >
                          R {event.revenue.toLocaleString()}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToEvent(event.id);
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-center p-3">
                <Button 
                  variant="ghost" 
                  className="text-sm text-venu-orange"
                  onClick={() => navigate("/host/events")}
                >
                  View All Events
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SalesBreakdownDialog 
        open={salesDialogOpen} 
        onOpenChange={setSalesDialogOpen} 
        salesData={selectedSalesData} 
      />
    </div>
  );
}
