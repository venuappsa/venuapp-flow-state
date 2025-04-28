
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Share2, Settings, ChevronRight, CalendarPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { dummyVenues } from "@/data/hostDummyData";

export default function VenuesTab() {
  const handleGenerateVenueLink = (venueId: string, venueName: string) => {
    const shareableLink = `https://venuapp.co.za/v/${venueId}`;
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        toast({
          title: "Link copied",
          description: `Shareable link for ${venueName} copied to clipboard`,
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Your Venues</h2>
        <Button onClick={() => toast({ title: "Coming Soon", description: "Venue creation will be available in the next update." })}>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Add Venue
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyVenues.map((venue) => (
          <Card 
            key={venue.id} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="h-32 overflow-hidden relative">
              <img 
                src={venue.imageUrl} 
                alt={venue.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <div className={`inline-block text-xs px-2 py-1 rounded ${venue.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {venue.status === 'active' ? 'Active' : 'Pending'}
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium truncate">{venue.name}</h3>
                  <p className="text-sm text-gray-500">{venue.location}</p>
                </div>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center text-sm mt-2">
                <Building className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-gray-600">Capacity: {venue.capacity}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-sm">
                  <CalendarPlus className="h-4 w-4 text-venu-orange mr-1" />
                  <span>{venue.upcoming_events} upcoming events</span>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1"
                    onClick={() => handleGenerateVenueLink(venue.id, venue.name)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
