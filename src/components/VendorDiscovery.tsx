import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Phone, Mail, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample vendors for demonstration
const dummyVendors = [
  {
    id: "v1",
    name: "Sunshine Catering",
    category: "Food & Beverage",
    rating: 4.7,
    reviews: 28,
    location: "Cape Town",
    description: "Gourmet catering for all occasions with a focus on fresh, local ingredients.",
    contactEmail: "info@sunshinecatering.co.za",
    contactPhone: "+27 21 555 1234",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    id: "v2",
    name: "Craft Cocktails Co.",
    category: "Drinks",
    rating: 4.5,
    reviews: 15,
    location: "Johannesburg",
    description: "Mobile cocktail bar service with a wide range of classic and custom cocktails.",
    contactEmail: "events@craftcocktails.co.za",
    contactPhone: "+27 11 444 5678",
    image: "https://images.unsplash.com/photo-1543051828-a96355388658?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    id: "v3",
    name: "The Sweet Spot",
    category: "Desserts",
    rating: 4.8,
    reviews: 32,
    location: "Durban",
    description: "Delicious homemade desserts and pastries for any event or celebration.",
    contactEmail: "orders@sweetspot.co.za",
    contactPhone: "+27 31 222 9012",
    image: "https://images.unsplash.com/photo-1567005387814-9c38ca10e134?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    id: "v4",
    name: "Global Eats",
    category: "Food & Beverage",
    rating: 4.6,
    reviews: 22,
    location: "Pretoria",
    description: "Authentic international cuisine with a modern twist, perfect for any event.",
    contactEmail: "bookings@globaleats.co.za",
    contactPhone: "+27 12 333 4567",
    image: "https://images.unsplash.com/photo-1514988869602-f769c496460b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    id: "v5",
    name: "Artisan Ice Cream",
    category: "Desserts",
    rating: 4.9,
    reviews: 45,
    location: "Cape Town",
    description: "Handcrafted ice cream with unique and exciting flavors, made with local ingredients.",
    contactEmail: "info@artisanicecream.co.za",
    contactPhone: "+27 21 666 7890",
    image: "https://images.unsplash.com/photo-1576506231674-edc9f92cfb91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  }
];

export default function VendorDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInvite = (vendorId: string) => {
    toast({
      title: "Invite Sent",
      description: "An invitation has been sent to this vendor.",
    });
  };

  // Filter vendors based on search query and category
  const filteredVendors = dummyVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? vendor.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories
  const categories = [...new Set(dummyVendors.map(vendor => vendor.category))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search vendors..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            value={categoryFilter || ''}
            onChange={(e) => setCategoryFilter(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <Card key={vendor.id}>
              <div className="relative h-40 rounded-t-lg overflow-hidden">
                {vendor.image ? (
                  <img 
                    src={vendor.image} 
                    alt={vendor.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                <Badge className="absolute top-2 right-2 bg-white/80 text-gray-800 backdrop-blur-sm">
                  {vendor.category}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{vendor.name}</CardTitle>
                <div className="flex items-center text-sm text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500 mr-1" />
                  <span>{vendor.rating} ({vendor.reviews} reviews)</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{vendor.description}</p>
                
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{vendor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{vendor.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{vendor.contactEmail}</span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleInvite(vendor.id)}>Invite Vendor</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <h3 className="text-lg font-medium text-gray-700">No vendors found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
