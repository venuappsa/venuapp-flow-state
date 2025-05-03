
import React, { useState } from "react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, UserCheck, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export default function AdminSubscriptionsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock subscription data
  const subscriptions = [
    {
      id: "1",
      customerName: "Elegant Events Co.",
      email: "contact@elegantevents.com",
      plan: "Professional",
      status: "active",
      amount: "$99.99",
      billingCycle: "monthly",
      startDate: new Date(2025, 3, 15),
      nextBilling: new Date(2025, 4, 15),
      type: "host"
    },
    {
      id: "2",
      customerName: "Gourmet Catering LLC",
      email: "info@gourmetcatering.com",
      plan: "Premium",
      status: "active",
      amount: "$149.99",
      billingCycle: "monthly",
      startDate: new Date(2025, 2, 10),
      nextBilling: new Date(2025, 4, 10),
      type: "merchant"
    },
    {
      id: "3",
      customerName: "Savvy Planners",
      email: "hello@savvyplanners.com",
      plan: "Basic",
      status: "past_due",
      amount: "$49.99",
      billingCycle: "monthly",
      startDate: new Date(2025, 3, 5),
      nextBilling: new Date(2025, 4, 5),
      type: "host"
    },
    {
      id: "4",
      customerName: "Star Decorations",
      email: "contact@stardecorations.com",
      plan: "Professional",
      status: "cancelled",
      amount: "$99.99",
      billingCycle: "monthly",
      startDate: new Date(2024, 11, 20),
      nextBilling: new Date(2025, 0, 20),
      type: "merchant"
    },
    {
      id: "5",
      customerName: "Jade Photography",
      email: "info@jadephotography.com",
      plan: "Professional",
      status: "active",
      amount: "$99.99",
      billingCycle: "annual",
      startDate: new Date(2024, 9, 10),
      nextBilling: new Date(2025, 9, 10),
      type: "merchant"
    },
    {
      id: "6",
      customerName: "Perfect Venues Inc.",
      email: "support@perfectvenues.com",
      plan: "Premium",
      status: "trialing",
      amount: "$0.00",
      billingCycle: "monthly",
      startDate: new Date(2025, 4, 1),
      nextBilling: new Date(2025, 5, 1),
      type: "host"
    },
  ];

  // Filter subscriptions based on search term and active tab
  const filteredSubscriptions = subscriptions.filter((sub) => {
    // Filter by tab
    if (activeTab !== "all" && sub.type !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && 
        !sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !sub.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !sub.plan.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "past_due":
        return <Badge className="bg-yellow-100 text-yellow-800">Past Due</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "trialing":
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Subscription data is being exported to CSV"
    });
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Subscriptions</h1>
            <p className="text-gray-500">Manage and monitor user subscriptions</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Subscriptions</CardTitle>
            <CardDescription>
              Track and manage subscription plans across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search subscriptions..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs 
                defaultValue="all" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full md:w-auto"
              >
                <TabsList className="grid w-full md:w-auto grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="host">Hosts</TabsTrigger>
                  <TabsTrigger value="merchant">Merchants</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.length > 0 ? (
                    filteredSubscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{sub.customerName}</p>
                            <p className="text-sm text-muted-foreground">{sub.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{sub.plan}</p>
                            <p className="text-sm text-muted-foreground">{sub.billingCycle}</p>
                          </div>
                        </TableCell>
                        <TableCell>{sub.amount}</TableCell>
                        <TableCell>{getStatusBadge(sub.status)}</TableCell>
                        <TableCell>
                          {sub.status === "cancelled" ? (
                            "—"
                          ) : (
                            formatDistanceToNow(sub.nextBilling, { addSuffix: true })
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <AlertTriangle className="h-12 w-12 mb-2 text-gray-300" />
                          <p className="text-lg font-medium">No subscriptions found</p>
                          <p className="text-sm">
                            {searchTerm ? "Try adjusting your search" : "No data matches your current filter"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Subscription Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
                    <div>
                      <p className="text-2xl font-bold">4</p>
                      <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <AlertTriangle className="h-8 w-8 text-yellow-500 mr-4" />
                    <div>
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-sm text-muted-foreground">Past Due</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <XCircle className="h-8 w-8 text-red-500 mr-4" />
                    <div>
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-sm text-muted-foreground">Cancelled</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPanelLayout>
  );
}
