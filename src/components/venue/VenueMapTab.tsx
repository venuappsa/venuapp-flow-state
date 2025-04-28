
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Store, 
  Users, 
  CalendarDays,
  Clock,
  ImageIcon,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface VenueMapTabProps {
  venueData: any;
}

export default function VenueMapTab({ venueData }: VenueMapTabProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Mock map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateMap = () => {
    toast({
      title: "Coming Soon",
      description: "Map editing functionality will be available in the next update.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold">Venue Map</h2>
          <p className="text-sm text-gray-500">
            Floor plan and merchant locations for {venueData.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleUpdateMap}>
            <ImageIcon className="h-4 w-4 mr-2" />
            Upload New Map
          </Button>
          <Button onClick={handleUpdateMap}>
            Edit Map
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div 
              ref={mapContainerRef} 
              className="w-full h-[500px] bg-gray-100 relative"
            >
              {!mapLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-venu-orange"></div>
                </div>
              ) : (
                <>
                  <img 
                    src="https://images.unsplash.com/photo-1577413313059-4202c5ca789f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Venue Floor Plan" 
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 p-4">
                    <div className="absolute top-4 left-4">
                      <div className="bg-white p-2 rounded shadow-md text-xs">
                        Interactive floor plan (Example View)
                      </div>
                    </div>
                    
                    {/* Example vendor spots */}
                    <div className="absolute top-1/4 left-1/3">
                      <div onClick={() => toast({ title: "Food Truck 1", description: "Gourmet Burgers Co" })} className="cursor-pointer">
                        <div className="bg-venu-orange text-white rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                          <Store className="h-3 w-3" />
                        </div>
                        <div className="bg-white mt-1 px-2 py-1 rounded text-xs shadow-md">Food 1</div>
                      </div>
                    </div>
                    
                    <div className="absolute top-1/3 right-1/4">
                      <div onClick={() => toast({ title: "Drinks Stand", description: "Craft Beer Haven" })} className="cursor-pointer">
                        <div className="bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                          <Store className="h-3 w-3" />
                        </div>
                        <div className="bg-white mt-1 px-2 py-1 rounded text-xs shadow-md">Drinks</div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-1/4 left-1/2">
                      <div onClick={() => toast({ title: "Dessert Stand", description: "Sweet Delights" })} className="cursor-pointer">
                        <div className="bg-pink-500 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                          <Store className="h-3 w-3" />
                        </div>
                        <div className="bg-white mt-1 px-2 py-1 rounded text-xs shadow-md">Desserts</div>
                      </div>
                    </div>
                    
                    <div className="absolute top-1/2 left-1/5">
                      <div onClick={() => toast({ title: "Staff Area", description: "4 staff members assigned" })} className="cursor-pointer">
                        <div className="bg-gray-700 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                          <Users className="h-3 w-3" />
                        </div>
                        <div className="bg-white mt-1 px-2 py-1 rounded text-xs shadow-md">Staff</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Venue Details</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">{venueData.location}</p>
                    <p className="text-sm text-gray-500">123 Venue Street, City</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Capacity</p>
                    <p className="text-sm text-gray-500">{venueData.capacity} people</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CalendarDays className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Upcoming Events</p>
                    <p className="text-sm text-gray-500">{venueData.upcoming_events} scheduled</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Operating Hours</p>
                    <p className="text-sm text-gray-500">10:00 AM - 10:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Store className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Vendor Spots</p>
                    <p className="text-sm text-gray-500">10 total (7 allocated)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Map Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="bg-venu-orange text-white rounded-full h-5 w-5 flex items-center justify-center mr-2">
                    <Store className="h-3 w-3" />
                  </div>
                  <span className="text-sm">Food Vendors</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center mr-2">
                    <Store className="h-3 w-3" />
                  </div>
                  <span className="text-sm">Drink Vendors</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center mr-2">
                    <Store className="h-3 w-3" />
                  </div>
                  <span className="text-sm">Dessert Vendors</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-gray-700 text-white rounded-full h-5 w-5 flex items-center justify-center mr-2">
                    <Users className="h-3 w-3" />
                  </div>
                  <span className="text-sm">Staff Areas</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full" onClick={handleUpdateMap}>
                  Edit Vendor Placements
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
