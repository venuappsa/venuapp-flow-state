
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Map as MapIcon, 
  Download, 
  Upload, 
  Pencil, 
  Store, 
  User,
  Flame,
  DoorOpen,
  UserCog
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import EventVenueMap from "@/components/EventVenueMap";
import { calculateFetchmanAllocation } from "@/utils/fetchmanCalculator";

export default function MapTab({ eventData }: { eventData: any }) {
  const [activeLayer, setActiveLayer] = useState<'all' | 'vendors' | 'staff' | 'exits'>('all');
  
  // Generate fetchman allocation data for the map
  const fetchmanAllocation = calculateFetchmanAllocation(
    eventData.capacity, 
    eventData.floorArea || 1000, 
    eventData.multiLevel || false
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-medium">Event Map</h3>
          <p className="text-sm text-gray-500">Interactive map of your event venue</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast({
            title: "Map Exported",
            description: "Event map has been downloaded as an image"
          })}>
            <Download className="h-4 w-4 mr-2" />
            Export Map
          </Button>
          <Button variant="outline" onClick={() => toast({
            title: "Upload Map",
            description: "Upload a custom venue map"
          })}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Custom Map
          </Button>
          <Button onClick={() => toast({
            title: "Edit Mode",
            description: "You can now edit the map layout"
          })}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Layout
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant={activeLayer === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveLayer('all')}
        >
          All Layers
        </Button>
        <Button 
          variant={activeLayer === 'vendors' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveLayer('vendors')}
        >
          <Store className="h-4 w-4 mr-1" />
          Vendors
        </Button>
        <Button 
          variant={activeLayer === 'staff' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveLayer('staff')}
        >
          <User className="h-4 w-4 mr-1" />
          Staff
        </Button>
        <Button 
          variant={activeLayer === 'exits' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveLayer('exits')}
        >
          <DoorOpen className="h-4 w-4 mr-1" />
          Exits
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="h-[500px] relative">
            <EventVenueMap 
              venueName={eventData.venueName} 
              vendorCount={eventData.vendors || 12}
              fetchmanAllocation={fetchmanAllocation}
              activeLayer={activeLayer}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Store className="h-5 w-5 mr-2 text-venu-orange" />
              Vendor Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-4">
              {eventData.vendors || 12} vendors have been assigned to specific locations on the map.
            </div>
            <Button variant="outline" className="w-full" onClick={() => setActiveLayer('vendors')}>
              Show Vendor Layer
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <UserCog className="h-5 w-5 mr-2 text-venu-orange" />
              Staff Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-4">
              {fetchmanAllocation.securityStaff} security and {fetchmanAllocation.eventStaff} event staff positions assigned.
            </div>
            <Button variant="outline" className="w-full" onClick={() => setActiveLayer('staff')}>
              Show Staff Layer
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Flame className="h-5 w-5 mr-2 text-venu-orange" />
              Safety & Exits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 mb-4">
              4 emergency exits and 8 fire extinguisher locations marked.
            </div>
            <Button variant="outline" className="w-full" onClick={() => setActiveLayer('exits')}>
              Show Safety Layer
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-blue-500 mr-2"></div>
              <span>Main Entrance</span>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-red-500 mr-2"></div>
              <span>Emergency Exit</span>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-green-500 mr-2"></div>
              <span>Vendor Stall</span>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-purple-500 mr-2"></div>
              <span>Staff Position</span>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-amber-500 mr-2"></div>
              <span>Fetchman</span>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-pink-500 mr-2"></div>
              <span>Toilets</span>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-teal-500 mr-2"></div>
              <span>First Aid</span>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-indigo-500 mr-2"></div>
              <span>Stage/Main Area</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
