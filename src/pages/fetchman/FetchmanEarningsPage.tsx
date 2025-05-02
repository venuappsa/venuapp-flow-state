
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, ArrowUpRight, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Create a basic layout similar to the other role layouts
const FetchmanLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
            alt="Venuapp Logo"
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-xl font-semibold text-venu-orange">Venuapp Fetchman</h1>
        </div>
        <div className="flex items-center gap-4">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <Calendar className="h-5 w-5 text-gray-500" />
          <div className="h-8 w-8 rounded-full bg-venu-orange text-white flex items-center justify-center">
            FB
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">{children}</main>
    </div>
  );
};

export default function FetchmanEarningsPage() {
  // Mock earnings data
  const earningsData = [
    { date: "Apr 24", amount: 150 },
    { date: "Apr 25", amount: 120 },
    { date: "Apr 26", amount: 200 },
    { date: "Apr 27", amount: 0 },
    { date: "Apr 28", amount: 180 },
    { date: "Apr 29", amount: 250 },
    { date: "Apr 30", amount: 300 },
    { date: "May 1", amount: 150 },
    { date: "May 2", amount: 180 },
  ];

  // Mock payment history data
  const paymentHistory = [
    { id: "1", date: "2025-04-30", amount: 1850, status: "completed", reference: "PAY-8346921" },
    { id: "2", date: "2025-03-31", amount: 2200, status: "completed", reference: "PAY-7265104" },
    { id: "3", date: "2025-02-28", amount: 1950, status: "completed", reference: "PAY-6198375" },
    { id: "4", date: "2025-01-31", amount: 1750, status: "completed", reference: "PAY-5124698" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <FetchmanLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold mb-2">Earnings</h1>
          <p className="text-gray-500">Track your earnings and payment history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Current Balance</CardTitle>
              <CardDescription>Available for withdrawal</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 1,180</p>
              <Button className="mt-4 w-full">
                Withdraw Funds
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">This Month</CardTitle>
              <CardDescription>May 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 780</p>
              <p className="text-sm text-green-600">↑ 15% from last month</p>
              <div className="mt-2 text-sm text-gray-500">5 deliveries completed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Last Month</CardTitle>
              <CardDescription>April 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 1,850</p>
              <div className="mt-2 text-sm text-gray-500">12 deliveries completed</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Track your daily earnings</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={earningsData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#ff6b35" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="payment-history">
          <TabsList className="mb-6">
            <TabsTrigger value="payment-history">Payment History</TabsTrigger>
            <TabsTrigger value="trip-history">Trip History</TabsTrigger>
            <TabsTrigger value="tax-documents">Tax Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payment-history">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Record of your monthly payouts</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left text-sm font-medium">Date</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Reference</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Amount</th>
                        <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                        <th className="py-3 px-4 text-right text-sm font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="border-b">
                          <td className="py-3 px-4 text-sm">{formatDate(payment.date)}</td>
                          <td className="py-3 px-4 text-sm">{payment.reference}</td>
                          <td className="py-3 px-4 text-sm font-medium">R {payment.amount}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-sm">
                            <Button variant="ghost" size="sm">
                              <ArrowUpRight className="h-4 w-4" />
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
          
          <TabsContent value="trip-history">
            <Card>
              <CardHeader>
                <CardTitle>Trip History</CardTitle>
                <CardDescription>Record of your delivery trips</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-10">
                <p className="text-gray-500">Trip history feature coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tax-documents">
            <Card>
              <CardHeader>
                <CardTitle>Tax Documents</CardTitle>
                <CardDescription>Access your tax documents</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-10">
                <p className="text-gray-500">Tax documents feature coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FetchmanLayout>
  );
}
