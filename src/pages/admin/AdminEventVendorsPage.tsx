
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

// Mock vendors data
const mockVendors = [
  {
    id: "v1",
    name: "African Cuisine Caterers",
    category: "Food & Beverage",
    rating: 4.8,
    location: "Johannesburg",
    tags: ["Catering", "African Food", "Buffet"],
    isAssigned: false,
  },
  {
    id: "v2",
    name: "Sound Masters",
    category: "Audio & Visual",
    rating: 4.5,
    location: "Cape Town",
    tags: ["Sound", "Lighting", "DJ"],
    isAssigned: true,
  },
  {
    id: "v3",
    name: "Elegant Decor",
    category: "Decorations",
    rating: 4.7,
    location: "Durban",
    tags: ["Flowers", "Stage", "Tables"],
    isAssigned: false,
  },
  {
    id: "v4",
    name: "Premier Security",
    category: "Security",
    rating: 4.3,
    location: "Pretoria",
    tags: ["Guards", "Access Control", "CCTV"],
    isAssigned: true,
  },
  {
    id: "v5",
    name: "Shuttle Express",
    category: "Transportation",
    rating: 4.6,
    location: "Johannesburg",
    tags: ["Shuttle", "Valet", "VIP Transport"],
    isAssigned: false,
  },
  {
    id: "v6",
    name: "Clean Team",
    category: "Cleaning Services",
    rating: 4.2,
    location: "Cape Town",
    tags: ["Pre-event", "Post-event", "Waste Management"],
    isAssigned: false,
  },
  {
    id: "v7",
    name: "TechSupport Pro",
    category: "IT Services",
    rating: 4.9,
    location: "Johannesburg",
    tags: ["Wi-Fi", "Registration Systems", "Tech Support"],
    isAssigned: true,
  },
];

// Mock events data
const mockEvents = [
  {
    id: "1",
    name: "Summer Music Festival",
    date: new Date(2025, 6, 15),
    location: "Pretoria Botanical Gardens",
    description: "Annual music festival featuring local artists",
  },
  {
    id: "2",
    name: "Corporate Tech Conference",
    date: new Date(2025, 7, 22),
    location: "Cape Town Convention Center",
    description: "Industry-leading tech conference",
  },
  {
    id: "3",
    name: "Wedding Expo",
    date: new Date(2025, 8, 10),
    location: "Sandton Convention Center",
    description: "Showcase of wedding services and products",
  },
  {
    id: "4",
    name: "Food & Wine Festival",
    date: new Date(2025, 9, 5),
    location: "Johannesburg Exhibition Centre",
    description: "Celebration of local cuisine and wines",
  },
];

export default function AdminEventVendorsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [vendors, setVendors] = useState(mockVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const { addNotification, sendEmail } = useNotifications();

  useEffect(() => {
    // Find the event by ID
    const foundEvent = mockEvents.find((e) => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
    }
  }, [id]);

  const handleVendorToggle = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === vendorId
          ? { ...vendor, isAssigned: !vendor.isAssigned }
          : vendor
      )
    );
  };

  const handleSaveAssignments = () => {
    addNotification({
      title: "Vendors Assigned",
      message: `Vendors have been assigned to ${event?.name}.`,
      type: "success",
    });

    // Simulate sending emails to assigned vendors
    const assignedVendors = vendors.filter(v => v.isAssigned);
    assignedVendors.forEach(vendor => {
      sendEmail(
        `${vendor.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        `You've been assigned to ${event?.name}`,
        `You have been assigned to provide services at the following event: ${event?.name}`
      );
    });
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = filter === "" || 
      (filter === "assigned" && vendor.isAssigned) ||
      (filter === "unassigned" && !vendor.isAssigned);

    return matchesSearch && matchesFilter;
  });

  return (
    <AdminPanelLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/admin/events")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{event?.name || "Loading..."}</h1>
              <p className="text-gray-500">{event?.description}</p>
            </div>
          </div>
          <Button onClick={handleSaveAssignments}>Save Assignments</Button>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Assign Vendors</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search vendors..."
                  className="pl-9 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="border rounded px-3 py-2 bg-background"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Assign</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <Checkbox
                      checked={vendor.isAssigned}
                      onCheckedChange={() => handleVendorToggle(vendor.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-1">{vendor.rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </TableCell>
                  <TableCell>{vendor.location}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {vendor.tags.map((tag, i) => (
                        <Badge key={i} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredVendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No vendors found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(`/admin/events/${id}/timeline`)}>
            Manage Timeline
          </Button>
          <Button variant="outline" onClick={() => navigate(`/admin/events/${id}/resources`)}>
            Manage Resources
          </Button>
        </div>
      </div>
    </AdminPanelLayout>
  );
}
