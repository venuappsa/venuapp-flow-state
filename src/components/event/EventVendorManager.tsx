
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { Search, Plus, X, UserPlus, Mail, Phone } from 'lucide-react';

// Mock vendor categories
const vendorCategories = [
  "All Categories",
  "Catering",
  "DJ/Music",
  "Decor",
  "Photography",
  "Videography",
  "Venue",
  "Transportation",
  "Lighting",
  "Security",
  "Florist"
];

// Mock vendor data
const mockVendors = [
  {
    id: "v1",
    name: "Gourmet Catering Co.",
    category: "Catering",
    rating: 4.8,
    reviews: 24,
    location: "Johannesburg, South Africa",
    description: "Premium catering services for all types of events.",
    contactEmail: "info@gourmetcatering.co.za",
    contactPhone: "+27 11 234 5678",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033"
  },
  {
    id: "v2",
    name: "Urban Sound DJ's",
    category: "DJ/Music",
    rating: 4.9,
    reviews: 42,
    location: "Cape Town, South Africa",
    description: "Professional DJ services for weddings, corporate events and parties.",
    contactEmail: "bookings@urbansound.co.za",
    contactPhone: "+27 21 987 6543",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89"
  },
  {
    id: "v3",
    name: "Elegant Decor Solutions",
    category: "Decor",
    rating: 4.7,
    reviews: 18,
    location: "Pretoria, South Africa",
    description: "Transform your venue with our stunning decor packages.",
    contactEmail: "hello@elegantdecor.co.za",
    contactPhone: "+27 12 345 6789",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed"
  },
  {
    id: "v4",
    name: "Capture Moments Photography",
    category: "Photography",
    rating: 5.0,
    reviews: 31,
    location: "Durban, South Africa",
    description: "Award-winning photography for all your special moments.",
    contactEmail: "smile@capturemoments.co.za",
    contactPhone: "+27 31 765 4321",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
  },
  {
    id: "v5",
    name: "Premium Transport Services",
    category: "Transportation",
    rating: 4.6,
    reviews: 15,
    location: "Johannesburg, South Africa",
    description: "Luxury transportation for events and special occasions.",
    contactEmail: "bookings@premiumtransport.co.za",
    contactPhone: "+27 11 876 5432",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8"
  },
];

// Mock assigned vendors for an event
const mockAssignedVendors = [
  {
    id: "v2",
    name: "Urban Sound DJ's",
    category: "DJ/Music",
    assignedRole: "Main Event DJ",
    status: "confirmed",
    quoteAmount: 5200,
  },
  {
    id: "v3",
    name: "Elegant Decor Solutions",
    category: "Decor",
    assignedRole: "Venue Decoration",
    status: "pending",
    quoteAmount: 8500,
  }
];

// Mock event data
const mockEvent = {
  id: "event-1",
  name: "Corporate Annual Gala",
  date: "2024-06-15T18:00:00Z",
  location: "Grand Ballroom, Sandton",
  description: "Annual celebration of company achievements with awards ceremony and dinner.",
  status: "planning",
  budget: 120000,
  vendorBudget: 75000,
  spentBudget: 13700,
};

export default function EventVendorManager() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showAddVendorDialog, setShowAddVendorDialog] = useState(false);
  const [assignVendorDialog, setAssignVendorDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [assignedRole, setAssignedRole] = useState("");
  const [vendors, setVendors] = useState(mockVendors);
  const [assignedVendors, setAssignedVendors] = useState(mockAssignedVendors);

  // Filter vendors based on search and category
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setAssignVendorDialog(true);
    setShowAddVendorDialog(false);
  };

  const handleAssignVendor = () => {
    if (!selectedVendor || !assignedRole.trim()) return;

    const newAssignedVendor = {
      ...selectedVendor,
      assignedRole,
      status: "pending",
      quoteAmount: 0,
    };

    setAssignedVendors([...assignedVendors, newAssignedVendor]);
    setAssignVendorDialog(false);
    setAssignedRole("");
    
    toast({
      title: "Vendor assigned",
      description: `${selectedVendor.name} has been assigned as ${assignedRole}`,
    });
  };

  const handleRemoveVendor = (vendorId: string) => {
    setAssignedVendors(assignedVendors.filter(vendor => vendor.id !== vendorId));
    
    toast({
      title: "Vendor removed",
      description: "Vendor has been removed from this event",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Event Vendors</h1>
          <p className="text-gray-500">Manage vendors for {mockEvent.name}</p>
        </div>
        <Button onClick={() => setShowAddVendorDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {/* Event Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Event Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Budget</h3>
              <p className="text-lg font-bold">R {mockEvent.budget.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Vendor Budget</h3>
              <p className="text-lg font-bold">R {mockEvent.vendorBudget.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Spent</h3>
              <p className="text-lg font-bold">R {mockEvent.spentBudget.toLocaleString()}</p>
              <div className="w-full mt-1 bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-venu-orange h-1.5 rounded-full" 
                  style={{ width: `${(mockEvent.spentBudget / mockEvent.vendorBudget) * 100}%` }} 
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Vendors Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Assigned Vendors</h2>
        
        {assignedVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedVendors.map((vendor) => (
              <Card key={vendor.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{vendor.name}</h3>
                        <p className="text-sm text-gray-500">{vendor.category}</p>
                        <p className="text-xs mt-1 font-medium">Role: {vendor.assignedRole}</p>
                      </div>
                      <Badge 
                        variant={vendor.status === 'confirmed' ? 'default' : 'outline'}
                        className="mt-1"
                      >
                        {vendor.status}
                      </Badge>
                    </div>
                    
                    {vendor.quoteAmount > 0 && (
                      <div className="mt-3 text-sm">
                        <span className="font-medium">Quote: </span>
                        <span className="text-green-600 font-semibold">R {vendor.quoteAmount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-between items-center">
                      <Button 
                        variant="link" 
                        className="h-8 p-0"
                        onClick={() => toast({
                          title: "Message sent",
                          description: `Your message has been sent to ${vendor.name}`,
                        })}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveVendor(vendor.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">No vendors assigned</h3>
            <p className="text-gray-500 mb-4">
              Add vendors to help with your event.
            </p>
            <Button onClick={() => setShowAddVendorDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </div>
        )}
      </div>

      {/* Add Vendor Dialog */}
      <Dialog open={showAddVendorDialog} onOpenChange={setShowAddVendorDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Vendor</DialogTitle>
            <DialogDescription>
              Search and add vendors to your event
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search vendors..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {vendorCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVendors.map((vendor) => (
                  <Card 
                    key={vendor.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleSelectVendor(vendor)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                          {vendor.image ? (
                            <img 
                              src={vendor.image} 
                              alt={vendor.name} 
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <Store className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{vendor.name}</h3>
                          <p className="text-sm text-gray-500">{vendor.category}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {vendor.rating} ★ ({vendor.reviews})
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {vendor.location}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mt-2 line-clamp-2">{vendor.description}</p>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredVendors.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-lg font-medium">No vendors found</h3>
                    <p className="text-gray-500">Try a different search term or category</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddVendorDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Vendor Role Dialog */}
      <Dialog open={assignVendorDialog} onOpenChange={setAssignVendorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Vendor Role</DialogTitle>
            <DialogDescription>
              {selectedVendor?.name} - {selectedVendor?.category}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Assigned Role
              </label>
              <Input 
                placeholder="e.g., Main DJ, Catering Lead, etc."
                value={assignedRole}
                onChange={(e) => setAssignedRole(e.target.value)}
              />
            </div>
            
            {selectedVendor && (
              <div className="rounded-md border p-4 space-y-2">
                <h4 className="font-medium">Contact Information</h4>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{selectedVendor.contactEmail}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{selectedVendor.contactPhone}</span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignVendorDialog(false)}>Cancel</Button>
            <Button onClick={handleAssignVendor} disabled={!assignedRole.trim()}>
              Assign Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
