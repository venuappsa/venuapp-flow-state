
import React from "react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";

export default function VendorFinancePage() {
  // Mock transaction data
  const mockTransactions = [
    { id: 1, date: "2025-05-01", description: "Wedding Expo 2025 - Catering", amount: 8500, status: "paid", client: "John Smith" },
    { id: 2, date: "2025-04-15", description: "Corporate Retreat - Sound System", amount: 3200, status: "paid", client: "ABC Corp" },
    { id: 3, date: "2025-04-10", description: "Birthday Celebration - Photography", amount: 2000, status: "processing", client: "Sarah Johnson" },
    { id: 4, date: "2025-03-28", description: "Tech Conference - Food Stall", amount: 5500, status: "processing", client: "TechCo" },
    { id: 5, date: "2025-03-15", description: "Music Festival - Vendor Booth", amount: 3000, status: "paid", client: "Event Masters" },
  ];

  // Mock invoice data
  const mockInvoices = [
    { id: 101, date: "2025-05-01", client: "John Smith", amount: 8500, status: "paid", reference: "INV-2025-101" },
    { id: 102, date: "2025-04-15", client: "ABC Corp", amount: 3200, status: "paid", reference: "INV-2025-102" },
    { id: 103, date: "2025-04-10", client: "Sarah Johnson", amount: 2000, status: "pending", reference: "INV-2025-103" },
    { id: 104, date: "2025-03-28", client: "TechCo", amount: 5500, status: "pending", reference: "INV-2025-104" },
    { id: 105, date: "2025-03-15", client: "Event Masters", amount: 3000, status: "paid", reference: "INV-2025-105" },
  ];
  
  return (
    <VendorPanelLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Finance Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Revenue</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 112,750</p>
              <p className="text-sm text-green-600">↑ 8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Payments</CardTitle>
              <CardDescription>To be received</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 7,500</p>
              <p className="text-sm text-muted-foreground">2 payments pending</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Next Payout</CardTitle>
              <CardDescription>Expected</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 5,500</p>
              <p className="text-sm text-muted-foreground">May 10, 2025</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="transactions" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="taxes">Tax Reports</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
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
                        <th className="text-left py-3 px-4">Client</th>
                        <th className="text-right py-3 px-4">Amount</th>
                        <th className="text-right py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b">
                          <td className="py-3 px-4">{transaction.date}</td>
                          <td className="py-3 px-4">{transaction.description}</td>
                          <td className="py-3 px-4">{transaction.client}</td>
                          <td className="py-3 px-4 text-right">R {transaction.amount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              transaction.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transaction.status === 'paid' ? 'Paid' : 'Processing'}
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
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Manage your invoices</CardDescription>
                </div>
                <Button size="sm">Create Invoice</Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Reference</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Client</th>
                        <th className="text-right py-3 px-4">Amount</th>
                        <th className="text-right py-3 px-4">Status</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b">
                          <td className="py-3 px-4">{invoice.reference}</td>
                          <td className="py-3 px-4">{invoice.date}</td>
                          <td className="py-3 px-4">{invoice.client}</td>
                          <td className="py-3 px-4 text-right">R {invoice.amount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              invoice.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Payouts</CardTitle>
                <CardDescription>Track your payouts and payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Payment Methods</h3>
                    <div className="border rounded-md p-3 flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                        <span className="font-bold">🏦</span>
                      </div>
                      <div>
                        <p className="font-medium">Bank Account</p>
                        <p className="text-sm text-muted-foreground">ABSA •••• 1234</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">Edit</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Recent Payouts</h3>
                    <div className="border rounded-md divide-y">
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">April 2025 Payout</p>
                          <p className="text-sm text-muted-foreground">Processed on May 1, 2025</p>
                        </div>
                        <p className="font-bold">R 14,700</p>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">March 2025 Payout</p>
                          <p className="text-sm text-muted-foreground">Processed on April 1, 2025</p>
                        </div>
                        <p className="font-bold">R 12,350</p>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">February 2025 Payout</p>
                          <p className="text-sm text-muted-foreground">Processed on March 1, 2025</p>
                        </div>
                        <p className="font-bold">R 9,800</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="taxes">
            <Card>
              <CardHeader>
                <CardTitle>Tax Reports</CardTitle>
                <CardDescription>Download and manage your tax documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="font-medium">Annual Tax Reports</p>
                    <div className="border rounded-md divide-y">
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">2024 Annual Tax Report</p>
                          <p className="text-sm text-muted-foreground">January - December 2024</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">2023 Annual Tax Report</p>
                          <p className="text-sm text-muted-foreground">January - December 2023</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Quarterly Tax Reports</p>
                    <div className="border rounded-md divide-y">
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">Q1 2025 Tax Report</p>
                          <p className="text-sm text-muted-foreground">January - March 2025</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">Q4 2024 Tax Report</p>
                          <p className="text-sm text-muted-foreground">October - December 2024</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </VendorPanelLayout>
  );
}
