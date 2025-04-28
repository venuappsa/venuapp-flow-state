import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Share2, UserPlus, MapPin, Phone, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockVendors = [
  {
    id: "v1",
    name: "Gourmet Burgers Co",
    category: "Food",
    subcategory: "Burgers",
    rating: 4.8,
    location: "Cape Town",
    distance: 2.1,
    coordinates: {lat: -33.9249, lng: 18.4241},
    description: "Specialty gourmet burgers with unique flavor combinations",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    contactName: "John Burger",
    contactEmail: "john@gourmetburgers.co.za",
    contactPhone: "+27 82 555 1234",
    products: ["Classic Burger", "Cheese Burger", "Veggie Burger", "BBQ Burger"],
    previousEvents: ["Cape Town Food Festival", "Summer Beach Party"],
    availableDates: ["2025-05-15", "2025-05-16", "2025-05-22", "2025-05-23"]
  },
  {
    id: "v2",
    name: "Craft Beer Haven",
    category: "Drinks",
    subcategory: "Beer",
    rating: 4.5,
    location: "Johannesburg",
    distance: 5.3,
    coordinates: {lat: -26.2041, lng: 28.0473},
    description: "Local craft beers and international selections",
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    contactName: "Mike Brewster",
    contactEmail: "mike@craftbeerhaven.co.za",
    contactPhone: "+27 83 777 5678",
    products: ["IPA", "Lager", "Stout", "Pale Ale", "Wheat Beer"],
    previousEvents: ["Joburg Beer Fest", "Pretoria Craft Market"],
    availableDates: ["2025-05-10", "2025-05-11", "2025-05-17", "2025-05-18"]
  },
  {
    id: "v3",
    name: "Sweet Delights",
    category: "Food",
    subcategory: "Desserts",
    rating: 4.7,
    location: "Durban",
    distance: 1.2,
    coordinates: {lat: -29.8587, lng: 31.0218},
    description: "Delicious assortment of cakes, cookies, and ice cream",
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    contactName: "Sarah Sweet",
    contactEmail: "sarah@sweetdelights.co.za",
    contactPhone: "+27 84 333 9876",
    products: ["Chocolate Cake", "Cupcakes", "Ice Cream", "Cookies"],
    previousEvents: ["Durban Food Market", "Beach Festival"],
    availableDates: ["2025-05-08", "2025-05-09", "2025-05-15", "2025-05-16"]
  },
  {
    id: "v4",
    name: "Spice Fusion",
    category: "Food",
    subcategory: "Indian",
    rating: 4.6,
    location: "Pretoria",
    distance: 3.8,
    coordinates: {lat: -25.7461, lng: 28.1881},
    description: "Authentic Indian cuisine with a modern twist",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    contactName: "Raj Patel",
    contactEmail: "raj@spicefusion.co.za",
    contactPhone: "+27 76 222 4567",
    products: ["Butter Chicken", "Biryani", "Samosas", "Curry Selection"],
    previousEvents: ["Pretoria Food Fair", "Cultural Festival"],
    availableDates: ["2025-05-22", "2025-05-23", "2025-05-29", "2025-05-30"]
  },
  {
    id: "v5",
    name: "Cocktail Masters",
    category: "Drinks",
    subcategory: "Cocktails",
    rating: 4.9,
    location: "Cape Town",
    distance: 0.5,
    coordinates: {lat: -33.9249, lng: 18.4241},
    description: "Expertly crafted cocktails and signature drinks",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    contactName: "Jessica Mix",
    contactEmail: "jessica@cocktailmasters.co.za",
    contactPhone: "+27 82 111 3344",
    products: ["Classic Mojito", "Martini", "Margarita", "Custom Creations"],
    previousEvents: ["Cape Town Cocktail Week", "Beach Party"],
    availableDates: ["2025-05-01", "2025-05-02", "2025-05-08", "2025-05-09"]
  }
];

export default function VendorDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [radiusFilter, setRadiusFilter] = useState(10);
  const [filteredVendors, setFilteredVendors] = useState(mockVendors);
  const [userPosition, setUserPosition] = useState<{lat: number, lng: number} | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [vendorDetailsOpen, setVendorDetailsOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteVendor, setInviteVendor] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedVenue, setSelectedVenue] = useState<string>("");

  const mockVenues = [
    { id: "venue1", name: "Grand Arena" },
    { id: "venue2", name: "Beach Front" },
    { id: "venue3", name: "City Hall" }
  ];
  
  const mockEvents = [
    { id: "event1", name: "Summer Festival", venueId: "venue1", date: "2025-05-15" },
    { id: "event2", name: "Food Market", venueId: "venue2", date: "2025-05-22" },
    { id: "event3", name: "Music Concert", venueId: "venue3", date: "2025-06-10" }
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location access denied",
            description: "Please enable location access to use proximity-based features",
            variant: "destructive",
          });
        }
      );
    }
  }, []);

  const handleSearch = () => {
    let results = mockVendors;
    
    if (searchQuery) {
      results = results.filter(
        vendor =>
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter && categoryFilter !== "all") {
      results = results.filter(
        vendor => vendor.category === categoryFilter
      );
    }
    
    if (locationFilter && locationFilter !== "all") {
      results = results.filter(
        vendor => vendor.location === locationFilter
      );
    }
    
    if (userPosition && radiusFilter > 0) {
      results = results.filter(
        vendor => vendor.distance <= radiusFilter
      );
    }
    
    setFilteredVendors(results);
  };

  const openVendorDetails = (vendor: any) => {
    setSelectedVendor(vendor);
    setVendorDetailsOpen(true);
  };

  const handleInvite = (vendor: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setInviteVendor(vendor);
    setInviteDialogOpen(true);
  };

  const sendInvitation = () => {
    if (!selectedEvent && !selectedVenue) {
      toast({
        title: "Selection required",
        description: "Please select an event or venue for the invitation",
        variant: "destructive",
      });
      return;
    }

    const targetName = selectedEvent ? 
      mockEvents.find(e => e.id === selectedEvent)?.name : 
      mockVenues.find(v => v.id === selectedVenue)?.name;

    toast({
      title: "Invitation sent",
      description: `You've invited ${inviteVendor.name} to ${targetName}.`,
    });
    
    setInviteDialogOpen(false);
    setSelectedEvent("");
    setSelectedVenue("");
  };

  const handleGenerateLink = (vendorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareableLink = `https://venuapp.co.za/invite/${vendorId}`;
    
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        toast({
          title: "Link copied",
          description: "Shareable vendor link copied to clipboard",
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Find Vendors</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Drinks">Drinks</SelectItem>
              <SelectItem value="Merchandise">Merchandise</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Cape Town">Cape Town</SelectItem>
              <SelectItem value="Johannesburg">Johannesburg</SelectItem>
              <SelectItem value="Durban">Durban</SelectItem>
              <SelectItem value="Pretoria">Pretoria</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-gray-500" />
            <span className="text-sm text-gray-600">Distance radius:</span>
          </div>
          
          <div className="flex-1 flex items-center gap-4">
            <div className="w-full max-w-md">
              <Slider 
                value={[radiusFilter]} 
                onValueChange={(values) => setRadiusFilter(values[0])} 
                max={50} 
                step={1}
                className="w-full"
              />
            </div>
            <span className="text-sm font-medium w-20">{radiusFilter} km</span>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <MapPin size={16} />
                <span>Map View</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="h-72 bg-gray-100 rounded flex items-center justify-center">
                <div className="text-center text-sm text-gray-500 p-4">
                  <MapPin className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p>Map view will be available in the next update.</p>
                  <p className="mt-2">This will show vendors within your selected {radiusFilter}km radius</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex mt-4 justify-end">
          <Button onClick={handleSearch} className="flex gap-2">
            <Filter size={16} />
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <Card 
              key={vendor.id} 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openVendorDetails(vendor)}
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{vendor.name}</h3>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {vendor.rating} ★
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">{vendor.category}</Badge>
                  <Badge variant="outline">{vendor.subcategory}</Badge>
                  <Badge variant="outline">{vendor.location}</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin size={14} className="mr-1" />
                  {vendor.distance} km away
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {vendor.description}
                </p>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex gap-1"
                    onClick={(e) => handleGenerateLink(vendor.id, e)}
                  >
                    <Share2 size={16} />
                    Share
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex gap-1"
                    onClick={(e) => handleInvite(vendor, e)}
                  >
                    <UserPlus size={16} />
                    Invite
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">No vendors found matching your criteria.</p>
          </div>
        )}
      </div>

      <Dialog open={vendorDetailsOpen} onOpenChange={setVendorDetailsOpen}>
        {selectedVendor && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedVendor.name}</DialogTitle>
              <DialogDescription>
                {selectedVendor.category} • {selectedVendor.subcategory} • {selectedVendor.location}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="h-48 overflow-hidden rounded-md">
                <img
                  src={selectedVendor.image}
                  alt={selectedVendor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <Tabs defaultValue="info">
                <TabsList>
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4 pt-4">
                  <div>
                    <h3 className="font-medium text-sm mb-1">Description</h3>
                    <p className="text-gray-600">{selectedVendor.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-1">Rating</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500 font-medium">{selectedVendor.rating}</span>
                      <span className="text-amber-500">★★★★★</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm mb-1">Contact Information</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Contact:</span>
                      <span>{selectedVendor.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-gray-500" />
                      <span>{selectedVendor.contactPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-gray-500" />
                      <span>{selectedVendor.contactEmail}</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="products" className="pt-4">
                  <h3 className="font-medium text-sm mb-2">Product Offerings</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedVendor.products.map((product: string, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-2 rounded text-sm">{product}</div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="availability" className="pt-4">
                  <h3 className="font-medium text-sm mb-2">Available Dates</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedVendor.availableDates.map((date: string, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                        {new Date(date).toLocaleDateString('en-ZA', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="pt-4">
                  <h3 className="font-medium text-sm mb-2">Previous Events</h3>
                  <div className="space-y-2">
                    {selectedVendor.previousEvents.map((event: string, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-2 rounded text-sm">{event}</div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex justify-between mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleGenerateLink(selectedVendor.id, new Event('click') as any)}
                >
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
                <Button 
                  onClick={() => {
                    setInviteVendor(selectedVendor);
                    setVendorDetailsOpen(false);
                    setInviteDialogOpen(true);
                  }}
                >
                  <UserPlus size={16} className="mr-2" />
                  Invite Vendor
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        {inviteVendor && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite {inviteVendor.name}</DialogTitle>
              <DialogDescription>
                Choose where you would like to invite this vendor
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Choose an Event</h3>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {mockEvents.map(event => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name} ({new Date(event.date).toLocaleDateString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Or choose a Venue</h3>
                <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a venue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {mockVenues.map(venue => (
                      <SelectItem key={venue.id} value={venue.id}>{venue.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800">
                <p>Invitation will be sent to: {inviteVendor.contactEmail}</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
              <Button onClick={sendInvitation}>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
