
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, Calendar, Download, ArrowUpRight } from "lucide-react";

export default function HostFinancePage() {
  const recentTransactions = [
    { id: 1, description: "Vendor Payment - Elegant Events", amount: -15000, date: "2025-05-01", status: "Completed" },
    { id: 2, description: "Ticket Sales - Wedding Expo", amount: 45000, date: "2025-04-28", status: "Completed" },
    { id: 3, description: "Venue Booking Deposit", amount: -25000, date: "2025-04-25", status: "Completed" },
    { id: 4, description: "Refund - Cancelled Registration", amount: -1200, date: "2025-04-22", status: "Completed" },
    { id: 5, description: "Catering Service Payment", amount: -18500, date: "2025-04-20", status: "Pending" },
  ];

  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-6">
          Finance Management
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-2xl">R280,500</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+12.5%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Expenses</CardDescription>
              <CardTitle className="text-2xl">R120,300</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1 text-red-500 transform rotate-45" />
                <span className="text-red-500 font-medium">+8.2%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Net Profit</CardDescription>
              <CardTitle className="text-2xl">R160,200</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+15.8%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Payments</CardDescription>
              <CardTitle className="text-2xl">R28,500</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">5</span> invoices awaiting payment
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="mb-6">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <div className="flex justify-between items-center mt-4 mb-2">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" variant="outline">
                <BarChart className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </div>
          </div>
          
          <TabsContent value="transactions">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium">Description</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b">
                          <td className="py-3 px-4">{transaction.description}</td>
                          <td className="py-3 px-4">{transaction.date}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className={`py-3 px-4 text-right font-medium ${
                            transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            R {Math.abs(transaction.amount).toLocaleString()}
                            {transaction.amount >= 0 ? ' (+)' : ' (-)'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invoices">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center py-8 text-muted-foreground">
                  No invoices to display for the selected period.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center py-8 text-muted-foreground">
                  Financial reports will be available after the current quarter is complete.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HostPanelLayout>
  );
}
