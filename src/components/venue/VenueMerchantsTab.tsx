
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
import { Search, Store, Plus, Filter, User, ChevronRight, Check, X, Share2, QrCode } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { dummyVendors } from "@/data/hostDummyData";

interface VenueMerchantsTabProps {
  venueId: string;
}

export default function VenueMerchantsTab({ venueId }: VenueMerchantsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("approved");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter vendors by status
  const filteredVendors = dummyVendors.filter(
    vendor => {
      // First filter by search query
      const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Then filter by tab status
      if (activeTab === "approved") {
        return matchesSearch && vendor.status === 'approved';
      } else if (activeTab === "pending") {
        return matchesSearch && vendor.status === 'pending';
      } else if (activeTab === "rejected") {
        return matchesSearch && vendor.status === 'rejected';
      }
      
      return matchesSearch;
    }
  );

  const handleInviteVendor = () => {
    toast({
      title: "Invitation Sent",
      description: "The merchant has been invited to join this venue",
    });
    setInviteDialogOpen(false);
  };
  
  const handleGenerateLink = () => {
    const vendorLink = `https://venuapp.co.za/vendor-invite/venue-${venueId}-${Date.now()}`;
    navigator.clipboard.writeText(vendorLink).then(
      () => {
        toast({
          title: "Link copied",
          description: "Shareable merchant invitation link copied to clipboard",
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  const handleVendorAction = (vendor: any, action: 'approve' | 'reject') => {
    toast({
      title: action === 'approve' ? "Merchant Approved" : "Merchant Rejected",
      description: action === 'approve' 
        ? `${vendor.name} has been approved and can now operate at this venue.` 
        : `${vendor.name} has been rejected.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-medium">Venue Merchants</h3>
          <p className="text-sm text-gray-500">Manage merchants for this venue</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setQrDialogOpen(true)}>
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR
          </Button>
          <Button variant="outline" onClick={handleGenerateLink}>
            <Share2 className="h-4 w-4 mr-2" />
            Generate Link
          </Button>
          <Button onClick={() => setInviteDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Invite Merchant
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search merchants..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
        
        <TabsContent value="approved">
          {filteredVendors.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVendors.map((vendor) => (
                  <Card 
                    key={vendor.id}
                    className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                  >
                    <div className="h-32 overflow-hidden relative">
                      <img 
                        src="https://images.unsplash.com/photo-1532509774891-141d37f25ae9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80" 
                        alt={vendor.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{vendor.name}</h3>
                          <p className="text-sm text-gray-500">{vendor.category}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-1.5 text-gray-400" />
                          {vendor.contact}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-gray-500">Last active:</span> Today
                        </div>
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
                      <th scope="col" className="relative px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-2 rounded-full mr-3">
                              <Store className="h-4 w-4 text-venu-orange" />
                            </div>
                            <div className="font-medium text-gray-900">{vendor.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vendor.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vendor.contact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vendor.events || 3}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No merchants found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? `No merchants match your search "${searchQuery}"` 
                  : "This venue doesn't have any approved merchants yet."}
              </p>
              <Button onClick={() => setInviteDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Invite Merchants
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending">
          {filteredVendors.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVendors.map((vendor) => (
                  <Card 
                    key={vendor.id}
                    className="hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 p-3 rounded-full">
                            <Store className="h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">{vendor.name}</h3>
                            <p className="text-sm text-gray-500">{vendor.category}</p>
                          </div>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800">
                          Pending
                        </Badge>
                      </div>
                      
                      <div className="mt-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-1.5 text-gray-400" />
                          {vendor.contact}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVendorAction(vendor, 'reject');
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVendorAction(vendor, 'approve');
                          }}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                      <th scope="col" className="relative px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-2 rounded-full mr-3">
                              <Store className="h-4 w-4 text-amber-500" />
                            </div>
                            <div className="font-medium text-gray-900">{vendor.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vendor.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vendor.contact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-amber-100 text-amber-800">
                            Pending
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleVendorAction(vendor, 'reject')}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleVendorAction(vendor, 'approve')}
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No pending applications</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                There are no pending merchant applications for this venue.
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={handleGenerateLink}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Generate Link
                </Button>
                <Button onClick={() => setQrDialogOpen(true)}>
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected">
          {filteredVendors.length > 0 ? (
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Merchant</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejected Date</th>
                    <th scope="col" className="relative px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-2 rounded-full mr-3">
                            <Store className="h-4 w-4 text-red-500" />
                          </div>
                          <div className="font-medium text-gray-900">{vendor.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vendor.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vendor.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className="bg-red-100 text-red-800">
                          Rejected
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleVendorAction(vendor, 'approve')}
                        >
                          Reconsider
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No rejected merchants</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                There are no rejected merchant applications for this venue.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Invite Merchant Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite a Merchant</DialogTitle>
            <DialogDescription>
              Send an invitation to a merchant to join this venue.
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
              <Plus className="h-4 w-4 mr-2" />
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
              Merchants can scan this QR code to apply to your venue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <div className="bg-white p-2 border rounded-md">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://venuapp.co.za/merchant-apply/venue-123" 
                alt="QR Code" 
                className="w-48 h-48"
              />
            </div>
          </div>
          <div className="text-center text-sm text-gray-500">
            <p>https://venuapp.co.za/merchant-apply/venue-123</p>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              className="mr-2" 
              onClick={handleGenerateLink}
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
    </div>
  );
}
