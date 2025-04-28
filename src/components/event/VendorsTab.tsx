
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Store, Plus, Filter, User, ChevronRight, Check, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { dummyVendors } from "@/data/hostDummyData";
import { Input } from "@/components/ui/input";

export default function EventVendorsTab({ eventId }: { eventId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter vendors that might be at this event (for demo purposes using all vendors)
  const eventVendors = dummyVendors.filter(
    vendor => vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-medium">Event Vendors</h3>
          <p className="text-sm text-gray-500">Manage vendors for this event</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter Vendors
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search vendors..." 
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
      
      {eventVendors.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventVendors.map((vendor) => (
              <Card 
                key={vendor.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => toast({
                  title: "Vendor Details",
                  description: `View details for ${vendor.name}`,
                })}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <Store className="h-5 w-5 text-venu-orange" />
                      </div>
                      <div>
                        <h3 className="font-medium">{vendor.name}</h3>
                        <p className="text-sm text-gray-500">{vendor.category}</p>
                      </div>
                    </div>
                    <Badge className={`${vendor.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {vendor.status === 'approved' ? 'Assigned' : 'Pending'}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-1.5 text-gray-400" />
                      {vendor.contact}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-2">
                    {vendor.status === 'pending' ? (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({
                              title: "Vendor Rejected",
                              description: `${vendor.name} has been rejected`,
                              variant: "destructive"
                            });
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({
                              title: "Vendor Approved",
                              description: `${vendor.name} has been approved`,
                            });
                          }}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th scope="col" className="relative px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {eventVendors.map((vendor) => (
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
                      <Badge className={`${vendor.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {vendor.status === 'approved' ? 'Assigned' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {vendor.status === 'pending' ? (
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => toast({
                              title: "Vendor Rejected",
                              description: `${vendor.name} has been rejected`,
                              variant: "destructive"
                            })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => toast({
                              title: "Vendor Approved",
                              description: `${vendor.name} has been approved`,
                            })}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
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
          <h3 className="text-xl font-medium text-gray-700 mb-2">No vendors found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? `No vendors match your search "${searchQuery}"` 
              : "This event doesn't have any vendors assigned yet."}
          </p>
          <Button>Add Event Vendors</Button>
        </div>
      )}
    </div>
  );
}
