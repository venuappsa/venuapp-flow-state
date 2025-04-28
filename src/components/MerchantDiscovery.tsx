
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Share2, UserPlus, MapPin, Phone, Mail, Star, Store, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Mock merchant data
const mockMerchants = [
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
  },
  {
    id: "v6",
    name: "African Flavors",
    category: "Food",
    subcategory: "Traditional",
    rating: 4.7,
    location: "Cape Town",
    distance: 7.3,
    coordinates: {lat: -33.9560, lng: 18.4900},
    description: "Traditional South African cuisine with local ingredients",
    image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80",
    contactName: "Thabo Nkosi",
    contactEmail: "thabo@africanflavors.co.za",
    contactPhone: "+27 84 555 1234",
    products: ["Bobotie", "Potjiekos", "Boerewors", "Chakalaka"],
    previousEvents: ["African Food Festival", "Cape Town Cultural Fair"],
    availableDates: ["2025-05-15", "2025-05-16", "2025-05-22", "2025-05-23"]
  },
  {
    id: "v7",
    name: "Vegan Delight",
    category: "Food",
    subcategory: "Vegan",
    rating: 4.6,
    location: "Johannesburg",
    distance: 8.7,
    coordinates: {lat: -26.1900, lng: 28.0600},
    description: "Plant-based dishes that are full of flavor and nutrition",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    contactName: "Lisa Green",
    contactEmail: "lisa@vegandelight.co.za",
    contactPhone: "+27 83 222 3333",
    products: ["Buddha Bowl", "Vegan Burger", "Falafel Wrap", "Smoothies"],
    previousEvents: ["Vegan Food Fair", "Health Expo"],
    availableDates: ["2025-05-10", "2025-05-11", "2025-05-17", "2025-05-18"]
  }
];

interface MerchantDiscoveryProps {
  eventLocation?: { lat: number, lng: number, name: string } | null;
  onMerchantSelect?: (merchant: any) => void;
  className?: string;
}

export default function MerchantDiscovery({ 
  eventLocation = null,
  onMerchantSelect,
  className = ""
}: MerchantDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [radiusFilter, setRadiusFilter] = useState(10);
  const [minRating, setMinRating] = useState(0);
  const [filteredMerchants, setFilteredMerchants] = useState(mockMerchants);
  const [userPosition, setUserPosition] = useState<{lat: number, lng: number} | null>(eventLocation);
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [merchantDetailsOpen, setMerchantDetailsOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteMerchant, setInviteMerchant] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    // If we have an event location, use it; otherwise use geolocation
    if (!userPosition) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            toast({
              title: "Location detected",
              description: "Using your current location to find nearby merchants."
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
    } else if (eventLocation) {
      toast({
        title: "Using event location",
        description: `Finding merchants near ${eventLocation.name}`,
      });
    }
  }, [eventLocation, userPosition]);

  const handleSearch = () => {
    setIsSearching(true);
    
    setTimeout(() => {
      let results = mockMerchants;
      
      if (searchQuery) {
        results = results.filter(
          merchant =>
            merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            merchant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            merchant.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (categoryFilter && categoryFilter !== "all") {
        results = results.filter(
          merchant => merchant.category === categoryFilter
        );
      }
      
      if (locationFilter && locationFilter !== "all") {
        results = results.filter(
          merchant => merchant.location === locationFilter
        );
      }
      
      if (minRating > 0) {
        results = results.filter(
          merchant => merchant.rating >= minRating
        );
      }
      
      if (userPosition && radiusFilter > 0) {
        results = results.filter(
          merchant => merchant.distance <= radiusFilter
        );
        
        // Sort by distance
        results.sort((a, b) => a.distance - b.distance);
      }
      
      setFilteredMerchants(results);
      setIsSearching(false);
      
      if (results.length === 0) {
        toast({
          title: "No merchants found",
          description: "Try adjusting your search filters.",
        });
      }
    }, 800);
  };

  const openMerchantDetails = (merchant: any) => {
    setSelectedMerchant(merchant);
    setMerchantDetailsOpen(true);
  };

  const handleInvite = (merchant: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setInviteMerchant(merchant);
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
      description: `You've invited ${inviteMerchant.name} to ${targetName}.`,
    });
    
    setInviteDialogOpen(false);
    setSelectedEvent("");
    setSelectedVenue("");
  };

  const handleGenerateLink = (merchantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareableLink = `https://venuapp.co.za/invite/${merchantId}`;
    
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        toast({
          title: "Link copied",
          description: "Shareable merchant link copied to clipboard",
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Find Merchants</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search merchants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
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
              <SelectItem value="Services">Services</SelectItem>
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
          <div className="flex items-center gap-2 w-full md:w-auto">
            <MapPin size={18} className="text-gray-500" />
            <span className="text-sm text-gray-600">Distance radius:</span>
          </div>
          
          <div className="flex-1 flex items-center gap-4 w-full">
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
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Star size={18} className="text-yellow-400" />
            <span className="text-sm text-gray-600">Min rating:</span>
          </div>
          
          <div className="flex-1 flex items-center gap-4 w-full">
            <div className="w-full max-w-md">
              <Slider 
                value={[minRating]} 
                onValueChange={(values) => setMinRating(values[0])} 
                max={5} 
                step={0.5}
                className="w-full"
              />
            </div>
            <span className="text-sm font-medium w-20">{minRating.toFixed(1)}</span>
          </div>
          
          <Button onClick={handleSearch} className="w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="mt-4 flex justify-end">
          <div className="flex gap-1 border rounded-md">
            <button
              className={`px-3 py-1.5 text-sm ${viewMode === 'grid' ? 'bg-venu-orange text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${viewMode === 'list' ? 'bg-venu-orange text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>
      
      {/* Search Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Search Results</h3>
          <div className="text-sm text-gray-500">
            Showing {filteredMerchants.length} merchants
            {userPosition && <span> within {radiusFilter} km</span>}
          </div>
        </div>
        
        {isSearching ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-venu-orange"></div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMerchants.map((merchant) => (
                  <Card 
                    key={merchant.id} 
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openMerchantDetails(merchant)}
                  >
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={merchant.image} 
                        alt={merchant.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{merchant.name}</h3>
                          <p className="text-sm text-gray-500">{merchant.subcategory}</p>
                        </div>
                        <Badge className="bg-venu-orange text-white">{merchant.category}</Badge>
                      </div>
                      
                      <div className="mt-2">
                        {renderRatingStars(merchant.rating)}
                      </div>
                      
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{merchant.location} • {merchant.distance} km away</span>
                      </div>
                      
                      <p className="mt-3 text-sm line-clamp-2">{merchant.description}</p>
                      
                      <div className="mt-4 pt-4 border-t flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => handleInvite(merchant, e)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Invite
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => handleGenerateLink(merchant.id, e)}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Merchant</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMerchants.map((merchant) => (
                      <tr 
                        key={merchant.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => openMerchantDetails(merchant)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                              <img 
                                src={merchant.image} 
                                alt={merchant.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{merchant.name}</div>
                              <div className="text-sm text-gray-500">{merchant.subcategory}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Badge className="bg-venu-orange/10 text-venu-orange border-venu-orange/20">
                            {merchant.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {renderRatingStars(merchant.rating)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {merchant.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {merchant.distance} km
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => handleInvite(merchant, e)}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => handleGenerateLink(merchant.id, e)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {filteredMerchants.length === 0 && !isSearching && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No merchants found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchQuery 
                    ? `No merchants match your search "${searchQuery}".` 
                    : "Adjust your search filters to find merchants."}
                  {radiusFilter < 50 && userPosition && " Try increasing the search radius."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Merchant Details Dialog */}
      <Dialog open={merchantDetailsOpen} onOpenChange={setMerchantDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMerchant?.name}</DialogTitle>
            <DialogDescription>
              {selectedMerchant?.subcategory} • {selectedMerchant?.location}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMerchant && (
            <div className="space-y-4 py-4">
              <div className="h-48 overflow-hidden rounded-md">
                <img 
                  src={selectedMerchant.image} 
                  alt={selectedMerchant.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex justify-between">
                <div>
                  {renderRatingStars(selectedMerchant.rating)}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedMerchant.distance} km away
                </div>
              </div>
              
              <div className="border-b pb-4">
                <h4 className="font-medium mb-2">About</h4>
                <p className="text-sm text-gray-600">{selectedMerchant.description}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row pb-4">
                <div className="sm:w-1/2 mb-4 sm:mb-0 space-y-2">
                  <h4 className="font-medium">Contact Information</h4>
                  <div className="text-sm flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{selectedMerchant.contactName}</span>
                  </div>
                  <div className="text-sm flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{selectedMerchant.contactEmail}</span>
                  </div>
                  <div className="text-sm flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{selectedMerchant.contactPhone}</span>
                  </div>
                </div>
                <div className="sm:w-1/2 space-y-2">
                  <h4 className="font-medium">Products</h4>
                  <ul className="text-sm space-y-1">
                    {selectedMerchant.products.map((product: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-venu-orange mr-2"></div>
                        {product}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Previous Events</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMerchant.previousEvents.map((event: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-gray-50">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setMerchantDetailsOpen(false)}
            >
              Close
            </Button>
            <Button 
              type="button" 
              onClick={() => {
                setMerchantDetailsOpen(false);
                setInviteMerchant(selectedMerchant);
                setInviteDialogOpen(true);
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite to Event/Venue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Invite Merchant Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Merchant</DialogTitle>
            <DialogDescription>
              {inviteMerchant && `Invite ${inviteMerchant.name} to your event or venue`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Invite to Event</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {mockEvents.map(event => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name} ({new Date(event.date).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Invite to Venue</label>
              <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a venue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {mockVenues.map(venue => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">Custom Message (Optional)</label>
              <Input placeholder="Add a personalized message..." />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={sendInvitation}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
