
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, User, Calendar, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";

export default function AdminSubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for subscriptions
  const subscriptions = [
    {
      id: "1",
      user: "Sarah Johnson",
      email: "sarah@eventco.com",
      plan: "Premium Host",
      startDate: "2025-01-15",
      renewalDate: "2026-01-15",
      status: "active",
      amount: 1499,
      paymentMethod: "Credit Card",
    },
    {
      id: "2",
      user: "Michael Brown",
      email: "michael@celebrationevents.com",
      plan: "Premium Host",
      startDate: "2025-02-21",
      renewalDate: "2026-02-21",
      status: "active",
      amount: 1499,
      paymentMethod: "Debit Card",
    },
    {
      id: "3",
      user: "Gourmet Catering Co.",
      email: "john@gourmetcatering.com",
      plan: "Premium Vendor",
      startDate: "2025-03-05",
      renewalDate: "2025-06-05",
      status: "active",
      amount: 999,
      paymentMethod: "PayPal",
    },
    {
      id: "4",
      user: "Elite Photography",
      email: "lisa@elitephoto.com",
      plan: "Basic Vendor",
      startDate: "2025-01-10",
      renewalDate: "2025-02-10",
      status: "expired",
      amount: 499,
      paymentMethod: "Credit Card",
    },
    {
      id: "5",
      user: "David Wilson",
      email: "david@premiereevents.com",
      plan: "Premium Host",
      startDate: "2025-02-12",
      renewalDate: "2026-02-12",
      status: "paused",
      amount: 1499,
      paymentMethod: "Debit Card",
    },
  ];

  const filteredSubscriptions = subscriptions.filter(
    subscription =>
      subscription.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit card":
        return "💳";
      case "debit card":
        return "💳";
      case "paypal":
        return "💰";
      default:
        return "💲";
    }
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Subscription Management</h1>
            <p className="text-gray-500">Manage and monitor user subscriptions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Subscriptions</CardTitle>
              <CardDescription>Current active users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">85</p>
              <p className="text-sm text-green-600">↑ 12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly Revenue</CardTitle>
              <CardDescription>From subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 87,450</p>
              <p className="text-sm text-green-600">↑ 8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Churn Rate</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3.2%</p>
              <p className="text-sm text-green-600">↓ 0.8% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Subscription Records</CardTitle>
            <CardDescription>View and manage user subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="relative max-w-md mb-4 md:mb-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search subscriptions..."
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
                <TableCaption>List of user subscriptions</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Renewal Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount (R)</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">
                        <div>
                          {subscription.user}
                          <div className="text-xs text-gray-500">
                            {subscription.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{subscription.plan}</TableCell>
                      <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(subscription.renewalDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell>{subscription.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span title={subscription.paymentMethod}>
                          {getPaymentIcon(subscription.paymentMethod)} {subscription.paymentMethod}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View User">
                            <User className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Extend Subscription">
                            <Calendar className="h-4 w-4" />
                          </Button>
                          {subscription.status === "active" ? (
                            <Button variant="ghost" size="icon" title="Pause Subscription">
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            </Button>
                          ) : subscription.status === "paused" ? (
                            <Button variant="ghost" size="icon" title="Reactivate Subscription">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon" title="Renew Subscription">
                              <XCircle className="h-4 w-4 text-red-500" />
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
    </AdminPanelLayout>
  );
}
