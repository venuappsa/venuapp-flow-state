
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Store, Users, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { FetchmanAllocationResult } from "@/utils/fetchmanCalculator";

interface EventVenueMapProps {
  venueName: string;
  floorPlan?: string;
  vendorCount: number;
  fetchmanAllocation?: FetchmanAllocationResult;
}

export default function EventVenueMap({ venueName, floorPlan, vendorCount, fetchmanAllocation }: EventVenueMapProps) {
  const [activeView, setActiveView] = useState("overview");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  
  // Mock data for venue map - in a real app, this would come from a database
  const vendorPositions = Array(vendorCount).fill(0).map((_, i) => ({
    id: `vendor-${i+1}`,
    name: `Vendor ${i+1}`,
    x: 100 + (i % 5) * 80,
    y: 100 + Math.floor(i / 5) * 80,
    type: i % 3 === 0 ? 'Food' : i % 3 === 1 ? 'Merchandise' : 'Services'
  }));
  
  const fetchmanPositions = fetchmanAllocation ? [
    ...Array(fetchmanAllocation.allocation.entranceAndExit).fill(0).map((_, i) => ({
      id: `fetchman-entrance-${i+1}`,
      name: `Entrance Fetchman ${i+1}`,
      x: 50 + i * 30,
      y: 50,
      area: 'Entrance'
    })),
    ...Array(fetchmanAllocation.allocation.vendorAreas).fill(0).map((_, i) => ({
      id: `fetchman-vendor-${i+1}`,
      name: `Vendor Area Fetchman ${i+1}`,
      x: 100 + i * 40,
      y: 200,
      area: 'Vendor Areas'
    })),
    ...Array(fetchmanAllocation.allocation.generalAreas).fill(0).map((_, i) => ({
      id: `fetchman-general-${i+1}`,
      name: `General Area Fetchman ${i+1}`,
      x: 150 + i * 35,
      y: 300,
      area: 'General Areas'
    })),
    ...Array(fetchmanAllocation.allocation.emergencyReserve).fill(0).map((_, i) => ({
      id: `fetchman-emergency-${i+1}`,
      name: `Emergency Reserve ${i+1}`,
      x: 200 + i * 40,
      y: 100,
      area: 'Emergency Reserve'
    }))
  ] : [];
  
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.setData("text/plain", id);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem) {
      // In a real app, we'd update coordinates in the database
      toast({
        title: "Position Updated",
        description: `${draggedItem} position has been updated on the map.`,
      });
      setDraggedItem(null);
    }
  };
  
  const renderPlaceholder = () => (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-100 rounded-lg h-96">
      <Map className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-medium text-gray-700 mb-2">Interactive Venue Map</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        Upload a floor plan to place vendors and fetchmen on the map. 
        Drag and drop to position items and plan your event layout.
      </p>
      <Button onClick={() => toast({ title: "Upload Prompt", description: "Floor plan upload functionality coming soon." })}>
        Upload Floor Plan
      </Button>
    </div>
  );
  
  const renderMap = () => (
    <div 
      className="relative bg-gray-100 border border-gray-200 rounded-lg h-96 overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {floorPlan ? (
        <img src={floorPlan} alt={`${venueName} floor plan`} className="w-full h-full object-contain" />
      ) : (
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
          {Array(144).fill(0).map((_, i) => (
            <div key={i} className="border border-gray-200 border-dashed"></div>
          ))}
        </div>
      )}
      
      {/* Render vendors */}
      {activeView === "vendors" && vendorPositions.map((vendor) => (
        <div
          key={vendor.id}
          className="absolute flex flex-col items-center cursor-move"
          style={{ left: vendor.x, top: vendor.y }}
          draggable
          onDragStart={(e) => handleDragStart(e, vendor.id)}
        >
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${vendor.type === 'Food' ? 'bg-orange-100 text-orange-600' : 
              vendor.type === 'Merchandise' ? 'bg-blue-100 text-blue-600' : 
              'bg-purple-100 text-purple-600'}
          `}>
            <Store className="h-5 w-5" />
          </div>
          <span className="text-xs mt-1 font-medium">{vendor.name}</span>
          <span className="text-xs text-gray-500">{vendor.type}</span>
        </div>
      ))}
      
      {/* Render fetchmen */}
      {activeView === "fetchmen" && fetchmanPositions.map((fetchman) => (
        <div
          key={fetchman.id}
          className="absolute flex flex-col items-center cursor-move"
          style={{ left: fetchman.x, top: fetchman.y }}
          draggable
          onDragStart={(e) => handleDragStart(e, fetchman.id)}
        >
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${fetchman.area === 'Entrance' ? 'bg-green-100 text-green-600' : 
              fetchman.area === 'Vendor Areas' ? 'bg-blue-100 text-blue-600' : 
              fetchman.area === 'General Areas' ? 'bg-amber-100 text-amber-600' :
              'bg-red-100 text-red-600'}
          `}>
            <Users className="h-5 w-5" />
          </div>
          <span className="text-xs mt-1 font-medium">{fetchman.name}</span>
        </div>
      ))}
      
      {/* Emergency exits */}
      {activeView === "emergency" && (
        <>
          <div className="absolute top-10 right-10">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-xs font-medium block text-center mt-1">Exit 1</span>
          </div>
          <div className="absolute bottom-10 left-10">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-xs font-medium block text-center mt-1">Exit 2</span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5 text-venu-orange" />
          {venueName} - Venue Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vendors">Vendors ({vendorCount})</TabsTrigger>
            <TabsTrigger value="fetchmen">Fetchmen ({fetchmanPositions.length})</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>
          
          {floorPlan || activeView !== "overview" ? renderMap() : renderPlaceholder()}
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => toast({ title: "Print Map", description: "Printing functionality coming soon." })}>
              Print Map
            </Button>
            <Button onClick={() => toast({ title: "Save Layout", description: "Layout has been saved." })}>
              Save Layout
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
