
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
  Building,
  Map,
} from "lucide-react";
import { dummyVenues } from "@/data/hostDummyData";
import { toast } from "@/components/ui/use-toast";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import VenueOverviewTab from "@/components/venue/VenueOverviewTab";
import VenueMerchantsTab from "@/components/venue/VenueMerchantsTab";
import VenueMapTab from "@/components/venue/VenueMapTab";
import VenueScheduleTab from "@/components/venue/VenueScheduleTab";
import VenueStaffTab from "@/components/venue/VenueStaffTab";
import VenueFetchmenTab from "@/components/venue/VenueFetchmenTab";
import VenueFinancesTab from "@/components/venue/VenueFinancesTab";

export default function VenueManagementPage() {
  const { venueId } = useParams<{ venueId: string }>();
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    setTimeout(() => {
      const foundVenue = dummyVenues.find((v) => v.id === venueId);
      if (foundVenue) {
        setVenue(foundVenue);
      }
      setLoading(false);
    }, 300);
  }, [venueId]);

  const handleShareVenue = () => {
    if (!venue) return;
    
    const shareableLink = `https://venuapp.co.za/venues/${venue.id}`;
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        toast({
          title: "Link copied",
          description: `Shareable link for ${venue.name} copied to clipboard`,
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

  if (!venue) {
    return (
      <HostPanelLayout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Venue not found</h2>
          <p className="mb-6">The venue you're looking for doesn't exist or has been removed.</p>
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
                to="/host/venues"
                className="text-sm text-gray-500 hover:text-venu-orange"
              >
                Venues
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-sm font-medium">{venue.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{venue.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center ml-1 text-sm text-gray-500">
                <Map className="h-4 w-4 mr-1" />
                <span>{venue.location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleShareVenue}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
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
            <TabsTrigger value="merchants">Merchants</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="fetchmen">Fetchmen</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <VenueOverviewTab venueData={venue} />
          </TabsContent>

          <TabsContent value="merchants">
            <VenueMerchantsTab venueId={venue.id} />
          </TabsContent>

          <TabsContent value="map">
            <VenueMapTab venueData={venue} />
          </TabsContent>

          <TabsContent value="schedule">
            <VenueScheduleTab venueId={venue.id} />
          </TabsContent>
          
          <TabsContent value="staff">
            <VenueStaffTab venueId={venue.id} />
          </TabsContent>

          <TabsContent value="fetchmen">
            <VenueFetchmenTab venueData={venue} />
          </TabsContent>
          
          <TabsContent value="finances">
            <VenueFinancesTab venueId={venue.id} venueData={venue} />
          </TabsContent>
        </Tabs>
      </div>
    </HostPanelLayout>
  );
}
