
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Check, Search, Star } from "lucide-react";

// Mock vendors data
const mockVendors = [
  {
    id: "v1",
    name: "African Cuisine Caterers",
    description: "Authentic African cuisine for all your events. We specialize in traditional dishes with a modern twist.",
    category: "Food & Beverage",
    rating: 4.8,
    location: "Johannesburg",
    tags: ["Catering", "African Food", "Buffet"],
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: "v2",
    name: "Sound Masters",
    description: "Professional sound and lighting services for events of all sizes. Top-quality equipment and experienced technicians.",
    category: "Audio & Visual",
    rating: 4.5,
    location: "Cape Town",
    tags: ["Sound", "Lighting", "DJ"],
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: "v3",
    name: "Elegant Decor",
    description: "Transform your venue with our stunning decor services. We create beautiful environments for any occasion.",
    category: "Decorations",
    rating: 4.7,
    location: "Durban",
    tags: ["Flowers", "Stage", "Tables"],
    image: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: "v4",
    name: "Premier Security",
    description: "Keep your events safe with our professional security services. Trained personnel and modern security systems.",
    category: "Security",
    rating: 4.3,
    location: "Pretoria",
    tags: ["Guards", "Access Control", "CCTV"],
    image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: "v5",
    name: "Shuttle Express",
    description: "Reliable transportation solutions for your events. We ensure your guests arrive safely and on time.",
    category: "Transportation",
    rating: 4.6,
    location: "Johannesburg",
    tags: ["Shuttle", "Valet", "VIP Transport"],
    image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: "v6",
    name: "Clean Team",
    description: "Pre and post-event cleaning services. We make sure your venue is spotless before and after your event.",
    category: "Cleaning Services",
    rating: 4.2,
    location: "Cape Town",
    tags: ["Pre-event", "Post-event", "Waste Management"],
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: "v7",
    name: "TechSupport Pro",
    description: "Technical support for all your event needs. From Wi-Fi setup to registration systems and more.",
    category: "IT Services",
    rating: 4.9,
    location: "Johannesburg",
    tags: ["Wi-Fi", "Registration Systems", "Tech Support"],
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=600&h=400",
  },
];

// Available categories
const categories = [
  "All Categories",
  "Food & Beverage",
  "Audio & Visual",
  "Decorations",
  "Security",
  "Transportation",
  "Cleaning Services",
  "IT Services",
];

// Available locations
const locations = [
  "All Locations",
  "Johannesburg",
  "Cape Town",
  "Durban",
  "Pretoria",
];

export default function VendorListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [minRating, setMinRating] = useState(0);

  // Filter vendors based on search, category, location, and rating
  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory === "All Categories" || vendor.category === selectedCategory;
    const matchesLocation = selectedLocation === "All Locations" || vendor.location === selectedLocation;
    const matchesRating = vendor.rating >= minRating;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
                alt="Venuapp Logo"
                className="h-10 w-10"
              />
              <span className="ml-2 text-xl font-bold text-venu-orange">Venuapp</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-venu-orange">Home</Link>
              <Link to="/vendors" className="text-venu-orange font-medium">Vendors</Link>
              <Link to="/about" className="text-gray-600 hover:text-venu-orange">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-venu-orange">Contact</Link>
            </nav>
            <div>
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-venu-orange to-venu-purple py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find the Perfect Vendor for Your Event
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Browse our curated list of vendors and service providers to make your event memorable
          </p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for vendors, services, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full bg-white/95 border-0 focus-visible:ring-2 focus-visible:ring-white w-full"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div 
                    key={category} 
                    className="flex items-center"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div 
                      className={`w-5 h-5 flex items-center justify-center rounded-full border mr-2 cursor-pointer ${
                        selectedCategory === category 
                          ? "bg-venu-orange border-venu-orange text-white" 
                          : "border-gray-300"
                      }`}
                    >
                      {selectedCategory === category && <Check className="h-3 w-3" />}
                    </div>
                    <span className="cursor-pointer">{category}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Location</h3>
              <div className="space-y-2">
                {locations.map((location) => (
                  <div 
                    key={location} 
                    className="flex items-center"
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div 
                      className={`w-5 h-5 flex items-center justify-center rounded-full border mr-2 cursor-pointer ${
                        selectedLocation === location 
                          ? "bg-venu-orange border-venu-orange text-white" 
                          : "border-gray-300"
                      }`}
                    >
                      {selectedLocation === location && <Check className="h-3 w-3" />}
                    </div>
                    <span className="cursor-pointer">{location}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Minimum Rating</h3>
              <div className="space-y-4">
                <Slider
                  defaultValue={[0]}
                  max={5}
                  step={0.5}
                  value={[minRating]}
                  onValueChange={(value) => setMinRating(value[0])}
                />
                <div className="flex items-center">
                  <span className="mr-2">{minRating}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-500 text-sm ml-1">and above</span>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setSelectedLocation("All Locations");
                setMinRating(0);
              }}
            >
              Reset Filters
            </Button>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {filteredVendors.length} 
                {filteredVendors.length === 1 ? " Vendor" : " Vendors"} Found
              </h2>
              <div className="text-sm text-gray-500">
                Showing all available vendors
              </div>
            </div>

            {filteredVendors.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <h3 className="text-xl font-semibold mb-2">No vendors found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                    setSelectedLocation("All Locations");
                    setMinRating(0);
                  }}
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                  <Card key={vendor.id} className="overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{vendor.name}</CardTitle>
                        <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span>{vendor.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <span>{vendor.location}</span>
                        <span className="mx-2">•</span>
                        <span>{vendor.category}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-600 text-sm line-clamp-3">{vendor.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {vendor.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/vendors/${vendor.id}`} className="w-full">
                        <Button variant="default" className="w-full">View Profile</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="flex items-center">
                <img
                  src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
                  alt="Venuapp Logo"
                  className="h-10 w-10"
                />
                <span className="ml-2 text-xl font-bold text-venu-orange">Venuapp</span>
              </Link>
              <p className="mt-2 text-gray-400 max-w-xs">
                Your all-in-one platform for event planning and vendor management.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 md:gap-16">
              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                  <li><Link to="/vendors" className="text-gray-400 hover:text-white">Vendors</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                  <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Venuapp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
