
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  CalendarPlus, 
  ChevronRight,
  Clock,
  Users,
  MessageSquare,
  Store
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
    if (stat.link) {
      navigate(stat.link);
    } else {
      switch (stat.title.toLowerCase()) {
        case "total revenue":
        case "monthly revenue":
          navigate("/host/finance");
          break;
        case "total guests":
        case "guests this month":
          navigate("/host/guests");
          break;
        case "events":
        case "upcoming events":
          navigate("/host/events");
          break;
        case "vendors":
        case "active vendors":
          navigate("/host/vendors");
          break;
        case "subscription":
        case "growth":
          navigate("/host/subscription");
          break;
        default:
          toast({
            title: stat.title,
            description: `View detailed ${stat.title.toLowerCase()} metrics and analytics`,
          });
      }
    }
  };

  const navigateToEvent = (eventId: string) => {
    navigate(`/host/events/${eventId}`);
  };

  // Calculate stats for dashboard cards
  const activeEventsCount = dummyEvents.filter(event => event.status === 'upcoming').length;
  const pendingQuotesCount = 8; // Mock data
  const upcomingTasksCount = 12; // Mock data
  const vendorsAssignedCount = dummyEvents.reduce((total, event) => total + (event.vendors || 0), 0);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <NoticeBoard />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Host Dashboard</h2>
        <Button 
          onClick={() => navigate("/host/events/new")}
          size={isMobile ? "sm" : "default"}
          className="gap-2"
        >
          <CalendarPlus className="h-4 w-4" />
          <span>Create New Event</span>
        </Button>
      </div>

      {/* Event Planning Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Events Card */}
        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate("/host/events")}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="bg-blue-100 p-2 rounded-full">
                <CalendarPlus className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="font-medium text-gray-500 text-sm">Active Events</h3>
              <div className="text-2xl font-bold mt-1">{activeEventsCount}</div>
              <p className="text-xs text-gray-500 mt-1">Events in planning or live</p>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto mt-2 text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/host/events");
                }}
              >
                <span className="mr-1">View all</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vendors Assigned Card */}
        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate("/host/vendors")}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="bg-green-100 p-2 rounded-full">
                <Store className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="font-medium text-gray-500 text-sm">Vendors Assigned</h3>
              <div className="text-2xl font-bold mt-1">{vendorsAssignedCount}</div>
              <p className="text-xs text-gray-500 mt-1">Total vendors across events</p>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto mt-2 text-green-600"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/host/vendors");
                }}
              >
                <span className="mr-1">Manage vendors</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Quotes Card */}
        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate("/host/events")}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="bg-orange-100 p-2 rounded-full">
                <MessageSquare className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="font-medium text-gray-500 text-sm">Pending Quotes</h3>
              <div className="text-2xl font-bold mt-1">{pendingQuotesCount}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting vendor responses</p>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto mt-2 text-orange-600"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/host/events");
                }}
              >
                <span className="mr-1">Review quotes</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks Card */}
        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate("/host/events")}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="bg-purple-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="font-medium text-gray-500 text-sm">Upcoming Tasks</h3>
              <div className="text-2xl font-bold mt-1">{upcomingTasksCount}</div>
              <p className="text-xs text-gray-500 mt-1">Tasks needing attention</p>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto mt-2 text-purple-600"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/host/events");
                }}
              >
                <span className="mr-1">View tasks</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 mb-28">
        <AnalyticsSnapshot 
          subscriptionTier={subscription_tier || "Free"} 
          subscriptionStatus={subscription_status}
        />
      </div>

      <div className="space-y-4 pt-12 mt-16 border-t-2 border-gray-100">
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
