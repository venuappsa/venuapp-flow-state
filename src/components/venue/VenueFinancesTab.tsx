
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { 
  Calendar,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Download,
  CreditCard,
  Store,
  ChevronRight
} from "lucide-react";

interface VenueFinancesTabProps {
  venueId: string;
  venueData?: any;
}

export default function VenueFinancesTab({ venueId, venueData }: VenueFinancesTabProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30d");
  
  // Mock financial data
  const financialData = {
    totalRevenue: 85250,
    commissionEarned: 4262.5,
    stallFees: 12000,
    ticketSales: 15500,
    previousPeriodChange: 23.5,
    transactions: [
      {
        id: "t1",
        date: "2025-05-01",
        description: "Stall Fee - Gourmet Burgers Co",
        amount: 3000,
        type: "income"
      },
      {
        id: "t2",
        date: "2025-05-01",
        description: "Stall Fee - Craft Beer Haven",
        amount: 2500,
        type: "income"
      },
      {
        id: "t3",
        date: "2025-05-03",
        description: "Commission - Weekend Market",
        amount: 1500,
        type: "income"
      },
      {
        id: "t4",
        date: "2025-05-05",
        description: "Fetchman Payment - Wine Festival",
        amount: 4800,
        type: "expense"
      },
      {
        id: "t5",
        date: "2025-05-10",
        description: "Ticket Sales - Music Event",
        amount: 15500,
        type: "income"
      },
      {
        id: "t6",
        date: "2025-05-15",
        description: "Venue Maintenance",
        amount: 2200,
        type: "expense"
      }
    ],
    pendingPayouts: [
      {
        id: "p1",
        description: "Vendor Commission - Food Market",
        amount: 2750,
        date: "2025-05-20"
      },
      {
        id: "p2",
        description: "Ticket Revenue - Jazz Night",
        amount: 8500,
        date: "2025-05-25"
      }
    ]
  };
  
  const generateReport = () => {
    toast({
      title: "Report Generated",
      description: "Financial report has been generated and is ready to download.",
    });
  };
  
  const processPayout = () => {
    toast({
      title: "Payout Initiated",
      description: "Your payout request has been initiated and will be processed within 2-3 business days.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold">Venue Finances</h2>
          <p className="text-sm text-gray-500">
            Financial overview and reports for {venueData?.name || "this venue"}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold mt-1">R {financialData.totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center mt-1 text-sm">
                      <div className={`flex items-center ${financialData.previousPeriodChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {financialData.previousPeriodChange >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(financialData.previousPeriodChange)}%
                      </div>
                      <span className="text-gray-500 ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className="bg-venu-orange/10 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-venu-orange" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Commission Earned</p>
                    <p className="text-2xl font-bold mt-1">R {financialData.commissionEarned.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">5% of vendor sales</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <Store className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Stall Fees</p>
                    <p className="text-2xl font-bold mt-1">R {financialData.stallFees.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">From 6 vendors</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Ticket Sales</p>
                    <p className="text-2xl font-bold mt-1">R {financialData.ticketSales.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">310 tickets sold</p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Revenue Breakdown</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                  {/* Placeholder for chart */}
                  <p className="text-gray-500">Revenue chart will be displayed here</p>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Commission</div>
                    <div className="font-medium mt-1">5%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Stall Fees</div>
                    <div className="font-medium mt-1">14%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Ticket Sales</div>
                    <div className="font-medium mt-1">18%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Other</div>
                    <div className="font-medium mt-1">63%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="h-fit">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Upcoming Payments</h3>
                <div className="space-y-4">
                  {financialData.pendingPayouts.map(payout => (
                    <div key={payout.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{payout.description}</p>
                        <p className="text-sm text-gray-500">Due {new Date(payout.date).toLocaleDateString()}</p>
                      </div>
                      <div className="font-medium">R {payout.amount.toLocaleString()}</div>
                    </div>
                  ))}
                  
                  <div className="pt-3 mt-3 border-t">
                    <Button className="w-full" onClick={processPayout}>
                      Request Payout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">All Transactions</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-3 font-medium text-gray-500">Date</th>
                      <th className="text-left pb-3 font-medium text-gray-500">Description</th>
                      <th className="text-right pb-3 font-medium text-gray-500">Amount</th>
                      <th className="text-right pb-3 font-medium text-gray-500">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.transactions.map(transaction => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50 cursor-pointer">
                        <td className="py-3 text-sm">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <div className="font-medium">{transaction.description}</div>
                        </td>
                        <td className={`py-3 text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'} R {transaction.amount.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <div className={`inline-block px-2 py-1 rounded-full text-xs ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {transaction.type === 'income' ? 'Income' : 'Expense'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  Showing {financialData.transactions.length} transactions
                </div>
                <Button variant="outline" size="sm">
                  View All Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payouts" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Payout History</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">April 2025 Payout</h4>
                        <p className="text-sm text-gray-500">Processed on May 5, 2025</p>
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                        Completed
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-500">
                        Reference: PAY-2025-04-1234
                      </div>
                      <div className="font-medium">R 12,500.00</div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">March 2025 Payout</h4>
                        <p className="text-sm text-gray-500">Processed on April 5, 2025</p>
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                        Completed
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-500">
                        Reference: PAY-2025-03-0987
                      </div>
                      <div className="font-medium">R 9,750.00</div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">February 2025 Payout</h4>
                        <p className="text-sm text-gray-500">Processed on March 5, 2025</p>
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                        Completed
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-500">
                        Reference: PAY-2025-02-0654
                      </div>
                      <div className="font-medium">R 8,200.00</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Payout Settings</h3>
                
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Bank Account</h4>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Standard Bank</p>
                      <p>Account: **** 5678</p>
                      <p>Branch: 051001</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Payout Schedule</h4>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Monthly</p>
                      <p>Processed on the 5th of each month</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Tax Information</h4>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>VAT Number: 123456789</p>
                      <p>Tax ID: TRN-987654</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  Download Tax Statements
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
