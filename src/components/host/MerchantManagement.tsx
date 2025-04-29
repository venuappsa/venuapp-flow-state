
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Store, Plus, Filter, Tag, ChevronRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import MerchantPricing from "@/components/host/MerchantPricing";

// Sample merchant data
const dummyMerchants = [
  { 
    id: "m1", 
    name: "Food Truck Masters", 
    category: "Food & Beverage", 
    location: "Cape Town",
    rating: 4.8,
    price: "R500 - R1,200 per day",
    priceCategory: "premium",
    status: "active" 
  },
  { 
    id: "m2", 
    name: "Artisan Crafts", 
    category: "Crafts", 
    location: "Johannesburg",
    rating: 4.5,
    price: "R350 - R750 per day",
    priceCategory: "basic",
    status: "active" 
  },
  { 
    id: "m3", 
    name: "Fresh Organic Produce", 
    category: "Fresh Produce", 
    location: "Durban",
    rating: 4.7,
    price: "R400 - R900 per day",
    priceCategory: "standard",
    status: "active" 
  },
  { 
    id: "m4", 
    name: "Vintage Collections", 
    category: "Antiques", 
    location: "Port Elizabeth",
    rating: 4.2,
    price: "R600 - R1,500 per day",
    priceCategory: "premium",
    status: "pending" 
  },
  { 
    id: "m5", 
    name: "Fashion Forward", 
    category: "Clothing", 
    location: "Bloemfontein",
    rating: 4.4,
    price: "R450 - R1,000 per day",
    priceCategory: "standard",
    status: "active" 
  },
  { 
    id: "m6", 
    name: "Tech Gadgets", 
    category: "Electronics", 
    location: "Pretoria",
    rating: 4.3,
    price: "R800 - R2,500 per day",
    priceCategory: "premium",
    status: "active" 
  }
];

export default function MerchantManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("merchants");
  
  // Filter merchants based on search query
  const filteredMerchants = dummyMerchants.filter(
    merchant => merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               merchant.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle merchant click
  const handleMerchantClick = (merchant: any) => {
    toast({
      title: "Merchant Selected",
      description: `You selected ${merchant.name}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="merchants">
            <Store className="h-4 w-4 mr-2" />
            My Merchants
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <Tag className="h-4 w-4 mr-2" />
            Pricing
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="merchants">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search merchants..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Merchant
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMerchants.map((merchant) => (
              <Card 
                key={merchant.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleMerchantClick(merchant)}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <Store className="h-5 w-5 text-venu-orange" />
                      </div>
                      <div>
                        <h3 className="font-medium">{merchant.name}</h3>
                        <p className="text-sm text-gray-500">{merchant.category}</p>
                      </div>
                    </div>
                    <Badge className={merchant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                      {merchant.status === 'active' ? 'Active' : 'Pending'}
                    </Badge>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>Location:</span>
                      <span className="font-medium">{merchant.location}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span>Rating:</span>
                      <span className="font-medium">{merchant.rating}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span>Price:</span>
                      <span className={`font-medium ${
                        merchant.priceCategory === 'premium' 
                          ? 'text-venu-orange' 
                          : merchant.priceCategory === 'standard' 
                            ? 'text-blue-600' 
                            : 'text-green-600'
                      }`}>{merchant.price}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pricing">
          <MerchantPricing />
        </TabsContent>
      </Tabs>
    </div>
  );
}
