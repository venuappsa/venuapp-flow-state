
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  UserPlus, 
  Search, 
  Share2, 
  QrCode, 
  Filter, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Building,
  CalendarPlus
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import VendorDiscovery from "@/components/VendorDiscovery";
import { useSubscription } from "@/hooks/useSubscription";
import { isPremiumFeature } from "@/utils/pricingUtils";

// Mock vendor data
const mockVendors = [
  {
    id: "v1",
    name: "Gourmet Burgers Co",
    type: "Food",
    contact: "John Smith",
    email: "john@gourmetburgers.co.za",
    phone: "+27 82 555 1234",
    status: "active",
    events: 3,
    venues: 2,
    lastActive: "2025-05-01",
    totalSales: 14650,
    commission: 732.5
  },
  {
    id: "v2",
    name: "Craft Beer Haven",
    type: "Drinks",
    contact: "Mike Brewster",
    email: "mike@craftbeer.co.za",
    phone: "+27 83 444 5678",
    status: "active",
    events: 5,
    venues: 1,
    lastActive: "2025-05-03",
    totalSales: 22150,
    commission: 1107.5
  },
  {
    id: "v3",
    name: "Sweet Delights",
    type: "Desserts",
    contact: "Sarah Brown",
    email: "sarah@sweetdelights.co.za",
    phone: "+27 84 333 9876",
    status: "pending",
    events: 0,
    venues: 0,
    lastActive: "",
    totalSales: 0,
    commission: 0
  },
  {
    id: "v4",
    name: "Wine Emporium",
    type: "Drinks",
    contact: "Jessica Wine",
    email: "jessica@wineemporium.co.za",
    phone: "+27 82 111 2222",
    status: "rejected",
    events: 0,
    venues: 0,
    lastActive: "",
    totalSales: 0,
    commission: 0
  },
  {
    id: "v5",
    name: "Tech Gadgets",
    type: "Merchandise",
    contact: "Robert Tech",
    email: "robert@techgadgets.co.za",
    phone: "+27 83 999 8888",
    status: "pending",
    events: 0,
    venues: 0,
    lastActive: "",
    totalSales: 0,
    commission: 0
  },
];

// Mock events and venues for assigning
const mockEvents = [
  { id: "e1", name: "Summer Festival", date: "2025-06-15", venue: "Grand Arena" },
  { id: "e2", name: "Jazz Night", date: "2025-05-22", venue: "Music Hall" },
  { id: "e3", name: "Food Market", date: "2025-05-30", venue: "City Park" },
];

const mockVenues = [
  { id: "v1", name: "Grand Arena", location: "Cape Town" },
  { id: "v2", name: "Music Hall", location: "Johannesburg" },
  { id: "v3", name: "City Park", location: "Durban" },
];

export default function MerchantManagement() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [stallFeeDialogOpen, setStallFeeDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [stallFee, setStallFee] = useState("250");
  const { subscription_tier = "Free" } = useSubscription();
  
  // Get the filtered vendors based on active tab and filters
  const filteredVendors = mockVendors.filter(vendor => {
    // Filter by search query
    if (searchQuery && 
        !vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !vendor.type.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !vendor.contact.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by vendor type
    if (filterType && vendor.type !== filterType) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === "active" && vendor.status !== "active") {
      return false;
    } else if (activeTab === "pending" && vendor.status !== "pending") {
      return false;
    } else if (activeTab === "rejected" && vendor.status !== "rejected") {
      return false;
    }
    
    return true;
  });
  
  // Sort vendors
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "sales") {
      return b.totalSales - a.totalSales;
    } else if (sortBy === "commission") {
      return b.commission - a.commission;
    } else if (sortBy === "events") {
      return b.events - a.events;
    }
    return 0;
  });
  
  const handleInviteVendor = () => {
    toast({
      title: "Invitation Sent",
      description: "The vendor has been invited to join your venues and events",
    });
    setInviteDialogOpen(false);
  };
  
  const handleGenerateLink = () => {
    const vendorLink = `https://venuapp.co.za/vendor-invite/host-${Date.now()}`;
    navigator.clipboard.writeText(vendorLink).then(
      () => {
        toast({
          title: "Link copied",
          description: "Shareable vendor invitation link copied to clipboard",
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  const handleVendorAction = (vendor: any, action: 'approve' | 'reject') => {
    toast({
      title: action === 'approve' ? "Vendor Approved" : "Vendor Rejected",
      description: action === 'approve' 
        ? `${vendor.name} has been approved and can now be assigned to events and venues.` 
        : `${vendor.name} has been rejected.`,
    });
  };
  
  const handleAssignVendor = () => {
    if (!selectedEventId && !selectedVenueId) {
      toast({
        title: "Selection Required",
        description: "Please select an event or venue to assign the vendor to",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Vendor Assigned",
      description: `${selectedVendor.name} has been assigned successfully.${stallFeeDialogOpen ? ' Stall fee has been set.' : ''}`,
    });
    
    setAssignDialogOpen(false);
    setStallFeeDialogOpen(false);
  };

  const openAssignDialog = (vendor: any) => {
    setSelectedVendor(vendor);
    setAssignDialogOpen(true);
  };
  
  const openStallFeeDialog = () => {
    setAssignDialogOpen(false);
    setStallFeeDialogOpen(true);
  };
  
  const openQrDialog = () => {
    setQrDialogOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const canAccessDiscovery = !isPremiumFeature("Vendor Discovery", subscription_tier);
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Merchant Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => setInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Merchant
          </Button>
          <Button variant="outline" onClick={handleGenerateLink}>
            <Share2 className="h-4 w-4 mr-2" />
            Generate Link
          </Button>
          <Button variant="outline" onClick={openQrDialog}>
            <QrCode className="h-4 w-4 mr-2" />
            QR Code
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search merchants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Drinks">Drinks</SelectItem>
              <SelectItem value="Desserts">Desserts</SelectItem>
              <SelectItem value="Merchandise">Merchandise</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="sales">Highest Sales</SelectItem>
              <SelectItem value="commission">Highest Commission</SelectItem>
              <SelectItem value="events">Most Events</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-50 mb-6">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="discover" disabled={!canAccessDiscovery}>Discover</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-0">
          <div className="bg-white rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Merchant</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Venues</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.contact}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{vendor.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{vendor.events}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{vendor.venues}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{vendor.lastActive || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {vendor.totalSales > 0 ? `R ${vendor.totalSales.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {vendor.commission > 0 ? `R ${vendor.commission.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(vendor.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={() => openAssignDialog(vendor)}
                        >
                          Assign
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedVendors.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                      No active merchants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          <div className="bg-white rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Merchant</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium">{vendor.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{vendor.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{vendor.contact}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{vendor.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{vendor.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(vendor.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex justify-center space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleVendorAction(vendor, 'approve')}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleVendorAction(vendor, 'reject')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedVendors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      No pending merchant applications.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-0">
          <div className="bg-white rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Merchant</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium">{vendor.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{vendor.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{vendor.contact}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{vendor.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{vendor.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(vendor.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex justify-center space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={() => handleVendorAction(vendor, 'approve')}
                        >
                          Reconsider
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedVendors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      No rejected merchants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="discover" className="mt-0">
          {canAccessDiscovery ? (
            <VendorDiscovery />
          ) : (
            <Alert className="bg-amber-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Subscription Required</AlertTitle>
              <AlertDescription>
                Vendor discovery is available on Growth tier and above.
                <div className="mt-3">
                  <Button variant="outline" size="sm" onClick={() => window.location.href = "/host/subscription"}>
                    Upgrade Subscription
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite a Merchant</DialogTitle>
            <DialogDescription>
              Send an invitation to a merchant to join your venues and events.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" placeholder="merchant@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Company Name</label>
              <Input id="name" placeholder="Merchant Company Name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="drinks">Drinks</SelectItem>
                  <SelectItem value="desserts">Desserts</SelectItem>
                  <SelectItem value="merchandise">Merchandise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="assign" />
              <label htmlFor="assign" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Assign to a venue or event after invitation
              </label>
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
            <Button type="button" onClick={handleInviteVendor}>
              <UserPlus className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Merchant Application QR Code</DialogTitle>
            <DialogDescription>
              Merchants can scan this QR code to apply to your venue or event.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <div className="bg-white p-2 border rounded-md">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://venuapp.co.za/merchant-apply/host-123" 
                alt="QR Code" 
                className="w-48 h-48"
              />
            </div>
          </div>
          <div className="text-center text-sm text-gray-500">
            <p>https://venuapp.co.za/merchant-apply/host-123</p>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              className="mr-2" 
              onClick={() => handleGenerateLink()}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button type="button" onClick={() => setQrDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Vendor Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Merchant</DialogTitle>
            <DialogDescription>
              {selectedVendor && `Assign ${selectedVendor.name} to a venue or event`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Event</label>
                <Badge variant="outline" className="font-normal">OR</Badge>
              </div>
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {mockEvents.map(event => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name} ({formatDate(event.date)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Venue</label>
              <Select value={selectedVenueId} onValueChange={setSelectedVenueId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a venue" />
                </SelectTrigger>
                <SelectContent>
                  {mockVenues.map(venue => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.name} ({venue.location})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="stallFee" />
              <label htmlFor="stallFee" className="text-sm font-medium leading-none">
                Charge a stall fee
              </label>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={openStallFeeDialog}>
                Set Stall Fee
              </Button>
              <Button type="button" onClick={handleAssignVendor}>
                Assign
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Stall Fee Dialog */}
      <Dialog open={stallFeeDialogOpen} onOpenChange={setStallFeeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Stall Fee</DialogTitle>
            <DialogDescription>
              {selectedVendor && `Set a stall fee for ${selectedVendor.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fee Amount (ZAR)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={stallFee}
                onChange={e => setStallFee(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Due Date</label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venuapp">Venuapp Payment System</SelectItem>
                  <SelectItem value="bank">Direct Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash on Arrival</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStallFeeDialogOpen(false)}
            >
              Back
            </Button>
            <Button type="button" onClick={handleAssignVendor}>
              Set Fee and Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-ZA', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }).format(date);
}
