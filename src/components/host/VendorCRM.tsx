
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Store,
  Filter,
  ChevronRight,
  BarChart,
  MessageSquare,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { VendorProfile } from "@/types/vendor";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import VendorDetailDrawer from "./VendorDetailDrawer";

interface VendorHostRelationship {
  vendor_id: string;
  host_id: string;
  status: string;
  engagement_score: number;
  last_interaction_date: string;
}

export default function VendorCRM() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [relationships, setRelationships] = useState<VendorHostRelationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<{id: string, userId: string} | null>(null);
  const [hostId, setHostId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchHostId();
      fetchVendorsAndRelationships();
    }
  }, [user]);

  const fetchHostId = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("host_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (error) {
        throw error;
      }

      setHostId(data.id);
    } catch (error) {
      console.error("Error fetching host ID:", error);
    }
  };

  const fetchVendorsAndRelationships = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // For now, we'll just fetch some vendor profiles as a workaround
      // since the vendor_host_relationships table might not be available yet
      const { data: vendorsData, error: vendorError } = await supabase
        .from("vendor_profiles")
        .select("*")
        .limit(10);

      if (vendorError) throw vendorError;
      
      // Create mock relationships for demo purposes
      const mockRelationships = vendorsData.map((vendor) => ({
        vendor_id: vendor.id,
        host_id: "hostid", // This will be replaced with actual host_id later
        status: ["invited", "active", "paused", "rejected"][Math.floor(Math.random() * 4)],
        engagement_score: Math.floor(Math.random() * 100),
        last_interaction_date: new Date().toISOString(),
      }));
      
      setVendors(vendorsData as VendorProfile[]);
      setRelationships(mockRelationships as VendorHostRelationship[]);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Combine vendor data with relationship data
  const vendorsWithRelationships = vendors.map(vendor => {
    const relationship = relationships.find(rel => rel.vendor_id === vendor.id);
    return {
      ...vendor,
      relationship,
      engagementScore: relationship ? relationship.engagement_score : 0,
      status: relationship ? relationship.status : "invited",
      lastInteraction: relationship ? new Date(relationship.last_interaction_date).toLocaleDateString() : "-"
    };
  });

  // Filter vendors based on search query and filters
  const filteredVendors = vendorsWithRelationships
    .filter(vendor => 
      (vendor.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       vendor.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       vendor.business_category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       searchQuery === '')
    )
    .filter(vendor => statusFilter === "all" || vendor.status === statusFilter)
    .filter(vendor => categoryFilter === "all" || vendor.business_category === categoryFilter);

  // Get unique categories for filter
  const categories = [...new Set(vendors.map(v => v.business_category).filter(Boolean))];

  // Function to get color for engagement score
  const getEngagementColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  // Function to handle vendor selection
  const handleVendorClick = (vendor: VendorProfile) => {
    setSelectedVendor({
      id: vendor.id,
      userId: vendor.user_id
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Vendor Management</h2>
          <p className="text-gray-500">Manage your vendors and their interactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/host/messages">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/host/analytics">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </a>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search vendors by name or category..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category || ""}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-venu-orange mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading vendors...</p>
        </div>
      ) : filteredVendors.length > 0 ? (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Interaction
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement Score
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr 
                  key={vendor.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleVendorClick(vendor)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <Store className="h-5 w-5 text-venu-orange" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {vendor.business_name || vendor.company_name || "Unnamed Vendor"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vendor.contact_name || "No contact name"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {vendor.business_category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={
                        vendor.status === "active"
                          ? "bg-green-100 text-green-800"
                          : vendor.status === "invited"
                          ? "bg-blue-100 text-blue-800"
                          : vendor.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vendor.lastInteraction}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-semibold ${getEngagementColor(vendor.engagementScore)}`}>
                      {vendor.engagementScore}
                    </span>
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
      ) : (
        <Card className="p-12 text-center">
          <Store className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No vendors found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
              ? "No vendors match your search criteria"
              : "You haven't connected with any vendors yet. Invite vendors to collaborate with you."}
          </p>
          <Button>Invite New Vendor</Button>
        </Card>
      )}

      {/* Vendor Detail Drawer */}
      <VendorDetailDrawer
        isOpen={selectedVendor !== null}
        onClose={() => setSelectedVendor(null)}
        vendorId={selectedVendor?.id}
        vendorUserId={selectedVendor?.userId}
      />
    </div>
  );
}
