
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

export default function HostFinancePage() {
  // Mock transaction data
  const mockTransactions = [
    { id: 1, date: "2025-04-25", description: "Wedding Expo 2025", amount: 15000, status: "completed" },
    { id: 2, date: "2025-04-20", description: "Corporate Retreat", amount: 8500, status: "completed" },
    { id: 3, date: "2025-04-15", description: "Birthday Celebration", amount: 3200, status: "completed" },
    { id: 4, date: "2025-04-10", description: "Music Festival", amount: 22000, status: "processing" },
    { id: 5, date: "2025-04-05", description: "Tech Conference", amount: 12500, status: "processing" },
  ];
  
  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-6">
          Finance Management
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Revenue</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 245,300</p>
              <p className="text-sm text-green-600">↑ 12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Payments</CardTitle>
              <CardDescription>To be processed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 34,500</p>
              <p className="text-sm text-muted-foreground">3 payments pending</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Next Payout</CardTitle>
              <CardDescription>Scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 18,750</p>
              <p className="text-sm text-muted-foreground">May 15, 2025</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="transactions" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </div>
          </div>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>A list of your recent transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Description</th>
                        <th className="text-right py-3 px-4">Amount</th>
                        <th className="text-right py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b">
                          <td className="py-3 px-4">{transaction.date}</td>
                          <td className="py-3 px-4">{transaction.description}</td>
                          <td className="py-3 px-4 text-right">R {transaction.amount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transaction.status === 'completed' ? 'Completed' : 'Processing'}
                            </span>
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
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Manage your invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Invoice content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>View and download your financial reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Financial reports will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HostPanelLayout>
  );
}
