
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Share2, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

// Mock vendor data
const mockVendors = [
  {
    id: "v1",
    name: "Gourmet Burgers Co",
    category: "Food",
    subcategory: "Burgers",
    rating: 4.8,
    location: "Cape Town",
    description: "Specialty gourmet burgers with unique flavor combinations",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80"
  },
  {
    id: "v2",
    name: "Craft Beer Haven",
    category: "Drinks",
    subcategory: "Beer",
    rating: 4.5,
    location: "Johannesburg",
    description: "Local craft beers and international selections",
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
  {
    id: "v3",
    name: "Sweet Delights",
    category: "Food",
    subcategory: "Desserts",
    rating: 4.7,
    location: "Durban",
    description: "Delicious assortment of cakes, cookies, and ice cream",
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80"
  },
  {
    id: "v4",
    name: "Spice Fusion",
    category: "Food",
    subcategory: "Indian",
    rating: 4.6,
    location: "Pretoria",
    description: "Authentic Indian cuisine with a modern twist",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80"
  },
  {
    id: "v5",
    name: "Cocktail Masters",
    category: "Drinks",
    subcategory: "Cocktails",
    rating: 4.9,
    location: "Cape Town",
    description: "Expertly crafted cocktails and signature drinks",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80"
  }
];

export default function VendorDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filteredVendors, setFilteredVendors] = useState(mockVendors);

  const handleSearch = () => {
    let results = mockVendors;
    
    // Apply text search
    if (searchQuery) {
      results = results.filter(
        vendor =>
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      results = results.filter(
        vendor => vendor.category === categoryFilter
      );
    }
    
    // Apply location filter
    if (locationFilter) {
      results = results.filter(
        vendor => vendor.location === locationFilter
      );
    }
    
    setFilteredVendors(results);
  };

  const handleInvite = (vendorId: string, vendorName: string) => {
    toast({
      title: "Invitation sent",
      description: `You've invited ${vendorName} to your venue.`,
    });
  };

  const handleGenerateLink = (vendorId: string) => {
    // Generate a shareable link
    const shareableLink = `https://venuapp.co.za/invite/${vendorId}`;
    
    // Copy to clipboard
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
            <Card key={vendor.id} className="overflow-hidden">
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
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {vendor.description}
                </p>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex gap-1"
                    onClick={() => handleGenerateLink(vendor.id)}
                  >
                    <Share2 size={16} />
                    Share
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex gap-1"
                    onClick={() => handleInvite(vendor.id, vendor.name)}
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
    </div>
  );
}
