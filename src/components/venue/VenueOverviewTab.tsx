
import { Button } from "@/components/ui/button";
import { CalendarPlus, ChevronRight, Users, Tag, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface VenueOverviewTabProps {
  venueData: any;
}

export default function VenueOverviewTab({ venueData }: VenueOverviewTabProps) {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate("/host/events/new", { state: { venueId: venueData.id } });
  };

  const handleViewAllEvents = () => {
    navigate("/host/events", { state: { venueFilter: venueData.id } });
  };

  const handleMerchantManagement = () => {
    navigate(`/host/merchants`, { state: { venueId: venueData.id } });
  };
  
  const upcomingEvents = venueData.upcoming_events || 0;
  const revenue = venueData.revenue || 12500;
  const capacity = venueData.capacity || 250;
  const utilizationRate = venueData.utilizationRate || 78;
  const approvedMerchants = venueData.approvedMerchants || 8;
  const pendingApplications = venueData.pendingApplications || 3;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold">Venue Overview</h2>
        <Button onClick={handleCreateEvent}>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Schedule Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming Events</p>
                <p className="text-3xl font-bold mt-1">{upcomingEvents}</p>
              </div>
              <button 
                className="text-venu-orange hover:text-venu-orange/80"
                onClick={handleViewAllEvents}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 w-full" 
              onClick={handleViewAllEvents}
            >
              View Calendar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue (Last 30 days)</p>
                <p className="text-3xl font-bold mt-1">R {revenue.toLocaleString()}</p>
              </div>
              <button 
                className="text-venu-orange hover:text-venu-orange/80"
                onClick={() => navigate("/host/finance")}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm">Commission</span>
              <span className="text-sm font-medium">R {(revenue * 0.05).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="text-3xl font-bold mt-1">{capacity} people</p>
              </div>
              <div className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                {utilizationRate}% utilized
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Utilization</span>
                <span>{utilizationRate}%</span>
              </div>
              <Progress value={utilizationRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved Merchants</p>
                <p className="text-3xl font-bold mt-1">{approvedMerchants}</p>
                <p className="text-sm text-amber-600 mt-1">{pendingApplications} pending applications</p>
              </div>
              <button 
                className="text-venu-orange hover:text-venu-orange/80"
                onClick={handleMerchantManagement}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 w-full" 
              onClick={handleMerchantManagement}
            >
              Manage Merchants
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="font-medium">Quick Actions</h3>
            <div className="space-y-2 mt-3 flex-grow">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate(`/host/venues/${venueData.id}`, { state: { activeTab: "merchants" } })}
              >
                <Users className="h-4 w-4 mr-2" /> 
                Invite Merchants
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate(`/host/rules?venueId=${venueData.id}`)}
              >
                <Tag className="h-4 w-4 mr-2" />
                Update Vendor Rules
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({
                  title: "Feature Coming Soon",
                  description: "Venue operation hours updating will be available in the next release.",
                })}
              >
                <Clock className="h-4 w-4 mr-2" />
                Update Operation Hours
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium mb-4">Upcoming Events</h3>
        {upcomingEvents > 0 ? (
          <div className="space-y-3">
            {Array.from({ length: Math.min(upcomingEvents, 3) }, (_, i) => (
              <div 
                key={i} 
                className="flex justify-between items-center p-3 bg-white rounded-md hover:shadow-sm cursor-pointer"
                onClick={() => navigate(`/host/events/event-${i + 1}`)}
              >
                <div>
                  <p className="font-medium">{`${venueData.name} ${['Summer Festival', 'Concert Night', 'Food Market'][i]}`}</p>
                  <p className="text-sm text-gray-500">{new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <div className="text-sm mr-4">
                    <span className="text-gray-500">Expected:</span> {150 + i * 50} guests
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No upcoming events scheduled</p>
            <Button className="mt-3" onClick={handleCreateEvent}>
              <CalendarPlus className="h-4 w-4 mr-2" />
              Schedule Event
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
