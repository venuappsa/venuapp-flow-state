
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  Calendar,
  Share2,
  FileText,
} from "lucide-react";
import { dummyEvents } from "@/data/hostDummyData";
import { toast } from "@/components/ui/use-toast";
import FetchmanEstimation from "@/components/FetchmanEstimation";
import { 
  calculateFetchmanAllocation,
  FetchmanAllocationResult
} from "@/utils/fetchmanCalculator";
import OverviewTab from "@/components/event/OverviewTab";
import VendorsTab from "@/components/event/VendorsTab";
import MapTab from "@/components/event/MapTab";
import TicketsTab from "@/components/event/TicketsTab";
import ScheduleTab from "@/components/event/ScheduleTab";
import StaffTab from "@/components/event/StaffTab";
import FinancesTab from "@/components/event/FinancesTab";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";

export default function EventManagementPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [fetchmanAllocation, setFetchmanAllocation] = useState<FetchmanAllocationResult | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const foundEvent = dummyEvents.find((e) => e.id === eventId);
      if (foundEvent) {
        const eventWithDefaults = {
          ...foundEvent,
          floorArea: foundEvent.floorArea || 1000,
          multiLevel: foundEvent.multiLevel || false,
        };
        
        setEvent(eventWithDefaults);
        
        const allocation = calculateFetchmanAllocation(
          eventWithDefaults.capacity, 
          eventWithDefaults.floorArea, 
          eventWithDefaults.multiLevel
        );
        setFetchmanAllocation(allocation);
      }
      setLoading(false);
    }, 300);
  }, [eventId]);

  const handleShareEvent = () => {
    if (!event) return;
    
    const shareableLink = `https://venuapp.co.za/events/${event.id}`;
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        toast({
          title: "Link copied",
          description: `Shareable link for ${event.name} copied to clipboard`,
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: "Error",
          description: "Could not copy link to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  const handleFetchmanUpdate = (data: {fetchmenCount: number, cost: number, allocation: FetchmanAllocationResult}) => {
    setFetchmanAllocation(data.allocation);
  };

  if (loading) {
    return (
      <HostPanelLayout>
        <div className="container mx-auto py-8 px-4">
          <Skeleton className="h-10 w-1/2 mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </HostPanelLayout>
    );
  }

  if (!event) {
    return (
      <HostPanelLayout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/host">Return to Dashboard</Link>
          </Button>
        </div>
      </HostPanelLayout>
    );
  }

  return (
    <HostPanelLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                to="/host"
                className="text-sm text-gray-500 hover:text-venu-orange"
              >
                Dashboard
              </Link>
              <span className="text-gray-500">/</span>
              <Link
                to="/host/events"
                className="text-sm text-gray-500 hover:text-venu-orange"
              >
                Events
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-sm font-medium">{event.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{event.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center ml-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {new Date(event.date).toLocaleDateString("en-ZA", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleShareEvent}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Reschedule
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="fetchmen">Fetchmen</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab eventData={event} />
          </TabsContent>

          <TabsContent value="vendors">
            <VendorsTab eventId={event.id} />
          </TabsContent>

          <TabsContent value="map">
            <MapTab eventData={event} />
          </TabsContent>

          <TabsContent value="tickets">
            <TicketsTab eventId={event.id} />
          </TabsContent>
          
          <TabsContent value="schedule">
            <ScheduleTab eventId={event.id} />
          </TabsContent>
          
          <TabsContent value="staff">
            <StaffTab eventId={event.id} />
          </TabsContent>

          <TabsContent value="fetchmen" className="space-y-6">
            <FetchmanEstimation 
              capacity={event.capacity} 
              vendors={event.vendors || 12} 
              hours={event.durationHours || 5}
              venueName={event.venueName}
              floorArea={event.floorArea || 1000}
              onUpdate={handleFetchmanUpdate}
            />
          </TabsContent>
          
          <TabsContent value="finances">
            <FinancesTab eventId={event.id} eventData={event} />
          </TabsContent>
        </Tabs>
      </div>
    </HostPanelLayout>
  );
}
