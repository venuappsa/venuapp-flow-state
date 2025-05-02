
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Check, X, Eye, AlertCircle } from "lucide-react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function AdminVerificationCenterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Mock verification data
  const verifications = [
    {
      id: "v1",
      name: "Sarah Johnson",
      email: "sarah@eventco.com",
      type: "host",
      documentType: "Business Registration",
      submissionDate: "2025-04-28",
      status: "pending",
    },
    {
      id: "v2",
      name: "Michael Brown",
      email: "michael@celebrationevents.com",
      type: "host",
      documentType: "ID Verification",
      submissionDate: "2025-04-27",
      status: "pending",
    },
    {
      id: "v3",
      name: "Emma Davis",
      email: "emma@partypros.com",
      type: "vendor",
      documentType: "Business License",
      submissionDate: "2025-04-26",
      status: "pending",
    },
    {
      id: "v4",
      name: "David Wilson",
      email: "david@premiereevents.com",
      type: "host",
      documentType: "Address Verification",
      submissionDate: "2025-04-25",
      status: "approved",
    },
    {
      id: "v5",
      name: "Olivia Martin",
      email: "olivia@eventelegance.com",
      type: "vendor",
      documentType: "Tax Registration",
      submissionDate: "2025-04-24",
      status: "rejected",
      rejectionReason: "Document expired"
    },
    {
      id: "v6",
      name: "James Wilson",
      email: "james@cateringco.com",
      type: "vendor",
      documentType: "Food Handler Certificate",
      submissionDate: "2025-04-23",
      status: "pending",
    },
    {
      id: "v7",
      name: "Sophia Lee",
      email: "sophia@venuemanagers.com",
      type: "host",
      documentType: "Property Deed",
      submissionDate: "2025-04-22",
      status: "approved",
    },
  ];

  const filterVerifications = (status: string) => {
    const filtered = verifications.filter(v => 
      v.status === status && 
      (v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       v.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return filtered;
  };

  const handleApprove = (id: string) => {
    toast({
      title: "Verification approved",
      description: `Verification ID: ${id} has been approved. User will be notified.`,
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: "Verification rejected",
      description: `Verification ID: ${id} has been rejected. User will be notified.`,
      variant: "destructive",
    });
  };

  const getAccountTypeBadge = (type: string) => {
    switch (type) {
      case "host":
        return <Badge className="bg-blue-100 text-blue-800">Host</Badge>;
      case "vendor":
        return <Badge className="bg-green-100 text-green-800">Vendor</Badge>;
      case "fetchman":
        return <Badge className="bg-purple-100 text-purple-800">Fetchman</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Verification Center</h1>
            <p className="text-gray-500">Approve or reject user verification documents</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Document Verifications</CardTitle>
            <CardDescription>Review submitted verification documents</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4 md:mb-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search verifications..."
                    className="pl-9 w-full sm:w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Account Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="host">Host</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="fetchman">Fetchman</SelectItem>
                  </SelectContent>
                </Select>
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

            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">Pending ({filterVerifications("pending").length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({filterVerifications("approved").length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({filterVerifications("rejected").length})</TabsTrigger>
              </TabsList>
              
              {["pending", "approved", "rejected"].map((status) => (
                <TabsContent key={status} value={status}>
                  <div className="rounded-md border mt-4">
                    <Table>
                      <TableCaption>List of {status} verification requests</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Account Type</TableHead>
                          <TableHead>Document Type</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Status</TableHead>
                          {status === "rejected" && <TableHead>Reason</TableHead>}
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterVerifications(status).map((verification) => (
                          <TableRow key={verification.id}>
                            <TableCell className="font-medium">
                              <div>
                                {verification.name}
                                <div className="text-xs text-gray-500">
                                  {verification.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getAccountTypeBadge(verification.type)}</TableCell>
                            <TableCell>{verification.documentType}</TableCell>
                            <TableCell>{new Date(verification.submissionDate).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusBadge(verification.status)}</TableCell>
                            {status === "rejected" && (
                              <TableCell>{verification.rejectionReason}</TableCell>
                            )}
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                {status === "pending" && (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleApprove(verification.id)}
                                    >
                                      <Check className="h-4 w-4 text-green-500" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleReject(verification.id)}
                                    >
                                      <X className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        
                        {filterVerifications(status).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={status === "rejected" ? 7 : 6} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <AlertCircle className="h-8 w-8 mb-2" />
                                <p>No {status} verification requests found.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminPanelLayout>
  );
}
