
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, UserCheck, UserX, User, Star } from "lucide-react";

export default function AdminMerchantsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for merchants/vendors
  const merchants = [
    {
      id: "1",
      name: "Gourmet Catering Co.",
      contact: "John Smith",
      email: "john@gourmetcatering.com",
      category: "Catering",
      joinDate: "2025-01-10",
      status: "verified",
      bookings: 24,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Elite Photography",
      contact: "Lisa Johnson",
      email: "lisa@elitephoto.com",
      category: "Photography",
      joinDate: "2025-02-15",
      status: "verified",
      bookings: 18,
      rating: 4.9,
    },
    {
      id: "3",
      name: "Sound Masters",
      contact: "David Brown",
      email: "david@soundmasters.com",
      category: "Audio Equipment",
      joinDate: "2025-03-20",
      status: "pending",
      bookings: 7,
      rating: 4.5,
    },
    {
      id: "4",
      name: "Bloom Floral Design",
      contact: "Anna Williams",
      email: "anna@bloomfloral.com",
      category: "Florist",
      joinDate: "2025-02-28",
      status: "suspended",
      bookings: 12,
      rating: 4.2,
    },
    {
      id: "5",
      name: "Sweet Delights Bakery",
      contact: "Michael Davis",
      email: "michael@sweetdelights.com",
      category: "Bakery",
      joinDate: "2025-01-25",
      status: "verified",
      bookings: 31,
      rating: 4.7,
    },
  ];

  const filteredMerchants = merchants.filter(
    merchant =>
      merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Merchant Management</h1>
          <p className="text-gray-500">Manage and monitor vendor accounts</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <UserCheck className="mr-2 h-4 w-4" />
            Add New Vendor
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vendor Accounts</CardTitle>
          <CardDescription>View and manage vendor accounts on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="relative max-w-md mb-4 md:mb-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search vendors..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-x-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">
                Export
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableCaption>List of vendors registered on the platform</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">{merchant.name}</TableCell>
                    <TableCell>{merchant.category}</TableCell>
                    <TableCell>
                      <div>
                        {merchant.contact}
                        <div className="text-xs text-gray-500">
                          {merchant.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(merchant.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(merchant.status)}</TableCell>
                    <TableCell>{merchant.bookings}</TableCell>
                    <TableCell className="flex items-center">
                      {merchant.rating}
                      <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <User className="h-4 w-4" />
                        </Button>
                        {merchant.status !== "suspended" ? (
                          <Button variant="ghost" size="icon">
                            <UserX className="h-4 w-4 text-red-500" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon">
                            <UserCheck className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
