
import React, { useState } from "react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Filter, Download, Eye, CreditCard, ArrowDownUp, 
  CheckCircle, XCircle, AlertCircle 
} from "lucide-react";
import { format } from "date-fns";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for transactions
  const transactions = [
    {
      id: "TR-1234567",
      type: "subscription",
      date: "2025-05-01T10:20:00",
      amount: 499.99,
      fee: 14.99,
      status: "completed",
      customer: {
        name: "EventCo Planners",
        email: "billing@eventco.com",
        plan: "Premium Host"
      }
    },
    {
      id: "TR-1234568",
      type: "commission",
      date: "2025-05-01T11:45:00",
      amount: 80.00,
      fee: 2.40,
      status: "completed",
      customer: {
        name: "Elite Photography",
        email: "finance@elitephoto.com",
        plan: "Vendor Pro"
      }
    },
    {
      id: "TR-1234569",
      type: "payout",
      date: "2025-05-01T14:30:00",
      amount: 350.00,
      fee: 0,
      status: "pending",
      customer: {
        name: "Gourmet Catering Co.",
        email: "payments@gourmetcatering.com",
        plan: "Vendor Pro"
      }
    },
    {
      id: "TR-1234570",
      type: "subscription",
      date: "2025-05-02T09:15:00",
      amount: 299.99,
      fee: 8.99,
      status: "completed",
      customer: {
        name: "Sound Masters",
        email: "billing@soundmasters.com",
        plan: "Vendor Basic"
      }
    },
    {
      id: "TR-1234571",
      type: "refund",
      date: "2025-05-02T16:45:00",
      amount: 199.99,
      fee: 0,
      status: "completed",
      customer: {
        name: "Bloom Floral Design",
        email: "accounts@bloomfloral.com",
        plan: "Vendor Basic"
      }
    },
    {
      id: "TR-1234572",
      type: "commission",
      date: "2025-05-03T10:10:00",
      amount: 120.00,
      fee: 3.60,
      status: "failed",
      customer: {
        name: "Sweet Delights Bakery",
        email: "finance@sweetdelights.com",
        plan: "Vendor Pro"
      }
    }
  ];

  // Financial summary mock data
  const financialSummary = {
    totalRevenue: 32845.50,
    pendingPayouts: 4750.25,
    processingFees: 985.37,
    netRevenue: 27109.88,
    subscriptionRevenue: 22500.00,
    commissionRevenue: 10345.50
  };

  const filteredTransactions = transactions.filter(
    transaction =>
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "subscription":
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case "commission":
        return <ArrowDownUp className="h-5 w-5 text-purple-500" />;
      case "payout":
        return <ArrowDownUp className="h-5 w-5 text-green-500" />;
      case "refund":
        return <ArrowDownUp className="h-5 w-5 text-red-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Payments & Payouts</h1>
            <p className="text-gray-500">Manage platform financial transactions</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              Process Payouts
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{financialSummary.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                +8.7% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{financialSummary.pendingPayouts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-yellow-500 flex items-center mt-1">
                3 vendors awaiting payment
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Net Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{financialSummary.netRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                After processing fees (R{financialSummary.processingFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="mb-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>View and manage financial transactions</CardDescription>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div className="relative max-w-md mb-4 md:mb-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableCaption>List of recent financial transactions</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getTypeIcon(transaction.type)}
                              <span className="ml-2 capitalize">{transaction.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            <div>
                              {transaction.customer.name}
                              <div className="text-xs text-gray-500">{transaction.customer.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>R{transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View details</DropdownMenuItem>
                                <DropdownMenuItem>Download receipt</DropdownMenuItem>
                                {transaction.status === "failed" && (
                                  <DropdownMenuItem>Retry transaction</DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Payouts</CardTitle>
                <CardDescription>Manage payouts to vendors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">All vendor payouts are up to date</h3>
                    <p className="text-gray-500">The next payout processing window is on May 15, 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>Download detailed financial reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border rounded-md flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="font-medium">Monthly Revenue Report</h3>
                      <p className="text-gray-500 text-sm">Comprehensive revenue breakdown by source</p>
                    </div>
                    <Button variant="outline" className="mt-3 md:mt-0">
                      <Download className="mr-2 h-4 w-4" />
                      Export (CSV)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-md flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="font-medium">Subscription Summary</h3>
                      <p className="text-gray-500 text-sm">Active subscriptions and recurring revenue</p>
                    </div>
                    <Button variant="outline" className="mt-3 md:mt-0">
                      <Download className="mr-2 h-4 w-4" />
                      Export (CSV)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-md flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="font-medium">Commission Report</h3>
                      <p className="text-gray-500 text-sm">Platform commissions from vendor bookings</p>
                    </div>
                    <Button variant="outline" className="mt-3 md:mt-0">
                      <Download className="mr-2 h-4 w-4" />
                      Export (CSV)
                    </Button>
                  </div>
                  <div className="p-4 border rounded-md flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="font-medium">Tax Summary</h3>
                      <p className="text-gray-500 text-sm">Tax calculations for financial reporting</p>
                    </div>
                    <Button variant="outline" className="mt-3 md:mt-0">
                      <Download className="mr-2 h-4 w-4" />
                      Export (CSV)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPanelLayout>
  );
}
