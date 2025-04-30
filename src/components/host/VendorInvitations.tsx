
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from '@/components/ui/use-toast';
import { 
  Search, 
  Send,
  Filter, 
  QrCode, 
  ClipboardCheck,
  PlusCircle,
  Store,
  Mail
} from 'lucide-react';

// Demo data for vendors
const demoVendors = [
  {
    id: 'v1',
    name: 'Gourmet Delights',
    category: 'Food',
    description: 'Premium catering services for all events',
    status: 'invited',
    invitedDate: '2024-04-18',
    email: 'contact@gourmetdelights.com',
    acceptanceRate: '85%',
    setupProgress: '0%'
  },
  {
    id: 'v2',
    name: 'Sound Systems Pro',
    category: 'Equipment',
    description: 'Professional audio equipment for events',
    status: 'accepted',
    invitedDate: '2024-04-10',
    email: 'info@soundsystemspro.com',
    acceptanceRate: '100%',
    setupProgress: '75%'
  },
  {
    id: 'v3',
    name: 'Event Planners Inc',
    category: 'Services',
    description: 'Full event planning and coordination',
    status: 'declined',
    invitedDate: '2024-04-05',
    email: 'team@eventplannersinc.com',
    acceptanceRate: '45%',
    setupProgress: '0%'
  },
  {
    id: 'v4',
    name: 'Craft Brewery Co',
    category: 'Beverages',
    description: 'Local craft beers and beverages',
    status: 'accepted',
    invitedDate: '2024-03-28',
    email: 'sales@craftbreweryco.co.za',
    acceptanceRate: '100%',
    setupProgress: '90%'
  },
  {
    id: 'v5',
    name: 'Decor Masters',
    category: 'Decor',
    description: 'Event decoration and styling services',
    status: 'invited',
    invitedDate: '2024-04-20',
    email: 'info@decormasters.com',
    acceptanceRate: '0%',
    setupProgress: '0%'
  },
  {
    id: 'v6',
    name: 'Sweet Treat Bakery',
    category: 'Food',
    description: 'Custom cakes and desserts for events',
    status: 'accepted',
    invitedDate: '2024-03-15',
    email: 'orders@sweettreatbakery.com',
    acceptanceRate: '100%',
    setupProgress: '60%'
  },
  {
    id: 'v7',
    name: 'Party Supplies Co',
    category: 'Supplies',
    description: 'All party supplies and rentals',
    status: 'new',
    invitedDate: '',
    email: 'info@partysupplies.co.za',
    acceptanceRate: '0%',
    setupProgress: '0%'
  },
  {
    id: 'v8',
    name: 'Photobooth Rentals',
    category: 'Entertainment',
    description: 'Fun photobooths for events',
    status: 'new',
    invitedDate: '',
    email: 'book@photoboothrentals.com',
    acceptanceRate: '0%',
    setupProgress: '0%'
  }
];

// Status badge components
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'invited':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Invited</Badge>;
    case 'accepted':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Accepted</Badge>;
    case 'declined':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Declined</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">New</Badge>;
  }
};

export default function VendorInvitations() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showQRCode, setShowQRCode] = useState(false);
  const [invitationLink, setInvitationLink] = useState('https://venuapp.co.za/vendor/signup?ref=HOST123');
  
  // Filter vendors based on search term and filters
  const filteredVendors = demoVendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSendInvitation = (vendorId: string) => {
    const vendor = demoVendors.find(v => v.id === vendorId);
    toast({
      title: "Invitation sent!",
      description: `Invitation has been sent to ${vendor?.name} (${vendor?.email})`,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    toast({
      title: "Link copied!",
      description: "Vendor invitation link has been copied to clipboard",
    });
  };

  // Generate unique categories for the filter
  const uniqueCategories = Array.from(new Set(demoVendors.map(v => v.category)));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="vendors">
        <TabsList className="mb-4">
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="public-signup">Public Signup</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vendors" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search vendors by name or category..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredVendors.map(vendor => (
              <Card key={vendor.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      <CardDescription>{vendor.category}</CardDescription>
                    </div>
                    <StatusBadge status={vendor.status} />
                  </div>
                </CardHeader>
                <CardContent className="pb-0">
                  <p className="text-sm text-gray-700 mb-3">{vendor.description}</p>
                  
                  {vendor.status !== 'new' && (
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between mb-1">
                        <span>Invited:</span>
                        <span>{vendor.invitedDate}</span>
                      </div>
                      {vendor.status === 'accepted' && (
                        <div className="flex justify-between">
                          <span>Setup Progress:</span>
                          <span>{vendor.setupProgress}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-4">
                  {vendor.status === 'new' ? (
                    <Button 
                      className="w-full bg-venu-orange hover:bg-venu-dark-orange" 
                      onClick={() => handleSendInvitation(vendor.id)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Invitation
                    </Button>
                  ) : vendor.status === 'invited' ? (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleSendInvitation(vendor.id)}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Resend Invitation
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      variant="secondary"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Vendor
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
            
            {/* Add new vendor card */}
            <Card className="border-dashed h-full">
              <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <PlusCircle className="h-8 w-8 text-venu-orange" />
                </div>
                <CardTitle className="text-lg mb-2">Add New Vendor</CardTitle>
                <CardDescription>Create a new vendor profile to send invitations</CardDescription>
                <Button 
                  className="mt-4 bg-venu-orange hover:bg-venu-dark-orange"
                >
                  <Store className="mr-2 h-4 w-4" />
                  Add Vendor
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {filteredVendors.length === 0 && searchTerm && (
            <div className="text-center p-10">
              <p className="text-gray-500">No vendors found matching your search criteria.</p>
              <Button className="mt-4" variant="outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="invitations" className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Recent Invitations</h3>
            <div className="space-y-4">
              {demoVendors
                .filter(v => v.status !== 'new')
                .sort((a, b) => new Date(b.invitedDate).getTime() - new Date(a.invitedDate).getTime())
                .slice(0, 5)
                .map(vendor => (
                  <div key={vendor.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-venu-orange/10 text-venu-orange">
                          {vendor.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-500">{vendor.invitedDate}</div>
                      <StatusBadge status={vendor.status} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invitation Statistics</CardTitle>
                <CardDescription>Overview of your vendor invitation performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">Acceptance Rate</div>
                    <div className="font-medium">68%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">Average Response Time</div>
                    <div className="font-medium">2.3 days</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <div className="text-green-700 text-xl font-bold">15</div>
                      <div className="text-xs text-gray-600">Accepted</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg text-center">
                      <div className="text-red-700 text-xl font-bold">5</div>
                      <div className="text-xs text-gray-600">Declined</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                      <div className="text-yellow-700 text-xl font-bold">7</div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Performing Categories</CardTitle>
                <CardDescription>Categories with highest vendor engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Food & Beverage</div>
                      <div className="text-sm text-gray-500">85% acceptance</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-venu-orange h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Entertainment</div>
                      <div className="text-sm text-gray-500">75% acceptance</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-venu-orange h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Services</div>
                      <div className="text-sm text-gray-500">70% acceptance</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-venu-orange h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Equipment</div>
                      <div className="text-sm text-gray-500">50% acceptance</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-venu-orange h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="public-signup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Signup Link</CardTitle>
              <CardDescription>
                Share this link with vendors to allow them to sign up directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input value={invitationLink} readOnly className="flex-1" />
                <Button variant="outline" onClick={handleCopyLink}>
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              
              <div className="flex justify-center pt-4">
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="mb-4"
                    onClick={() => setShowQRCode(!showQRCode)}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    {showQRCode ? "Hide QR Code" : "Show QR Code"}
                  </Button>
                  
                  {showQRCode && (
                    <div className="border p-4 rounded-lg inline-block bg-white">
                      {/* Placeholder for a QR code - in a real app this would be a generated QR code */}
                      <div className="h-48 w-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">QR Code Placeholder</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Scan to join as a vendor</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Customize Signup Page</CardTitle>
              <CardDescription>
                Customize the vendor signup experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Welcome Message
                  </label>
                  <Input placeholder="Enter welcome message for vendors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Required Information
                  </label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue placeholder="Select information to collect" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal (Name, Email)</SelectItem>
                      <SelectItem value="standard">Standard (Name, Email, Phone, Business Type)</SelectItem>
                      <SelectItem value="detailed">Detailed (All business information)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auto-Approval
                  </label>
                  <Select defaultValue="manual">
                    <SelectTrigger>
                      <SelectValue placeholder="Select approval process" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-approve all vendors</SelectItem>
                      <SelectItem value="manual">Manually approve vendors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enable Email Notifications
                  </label>
                  <Select defaultValue="yes">
                    <SelectTrigger>
                      <SelectValue placeholder="Enable notifications" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button className="bg-venu-orange hover:bg-venu-dark-orange">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
