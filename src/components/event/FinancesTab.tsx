
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Wallet, 
  LineChart, 
  Download,
  CreditCard,
  BarChart,
  PieChart,
  FileText,
  DollarSign,
  Clock,
  ArrowRight,
  Check
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ChartContainer } from "@/components/ui/chart";
import { 
  BarChart as RechartsBarChart, 
  PieChart as RechartsPreChart,
  Pie,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from "recharts";

const mockRevenueBreakdown = [
  { name: 'Ticket Sales', value: 82500, fill: '#f59e0b' },
  { name: 'Food & Beverage', value: 23750, fill: '#10b981' },
  { name: 'Merchandise', value: 8200, fill: '#3b82f6' },
  { name: 'Vendor Fees', value: 12000, fill: '#8b5cf6' },
  { name: 'Sponsorships', value: 15000, fill: '#ec4899' },
];

const mockRevenueTimeline = [
  { date: '1 Apr', amount: 8500 },
  { date: '8 Apr', amount: 12000 },
  { date: '15 Apr', amount: 24500 },
  { date: '22 Apr', amount: 43000 },
  { date: '29 Apr', amount: 48750 },
  { date: '6 May', amount: 102200 },
];

const mockTransactions = [
  {
    id: 'trans-1',
    description: 'Ticket Batch #2481',
    amount: 12500,
    type: 'income',
    date: '2024-05-10T14:23:00Z',
    status: 'completed'
  },
  {
    id: 'trans-2',
    description: 'Vendor Fee - Street Food Co.',
    amount: 3500,
    type: 'income',
    date: '2024-05-08T09:15:00Z',
    status: 'completed'
  },
  {
    id: 'trans-3',
    description: 'Sponsorship - Local Brewery',
    amount: 8500,
    type: 'income',
    date: '2024-05-05T16:30:00Z',
    status: 'completed'
  },
  {
    id: 'trans-4',
    description: 'VIP Ticket Sales',
    amount: 18750,
    type: 'income',
    date: '2024-05-01T11:45:00Z',
    status: 'completed'
  }
];

export default function EventFinancesTab({ eventId, eventData }: { eventId: string, eventData?: any }) {
  const [viewMode, setViewMode] = useState<'revenue' | 'reports'>('revenue');

  const totalRevenue = mockRevenueBreakdown.reduce((sum, item) => sum + item.value, 0);
  
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper function to format currency values for YAxis
  const formatYAxisValue = (value: number) => `R${value / 1000}K`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Event Finances</h3>
          <p className="text-sm text-gray-500">Track revenue and financial metrics</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex border rounded-md overflow-hidden">
            <button 
              className={`px-3 py-1.5 text-sm ${viewMode === 'revenue' ? 'bg-venu-orange text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setViewMode('revenue')}
            >
              Revenue
            </button>
            <button 
              className={`px-3 py-1.5 text-sm ${viewMode === 'reports' ? 'bg-venu-orange text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setViewMode('reports')}
            >
              Reports
            </button>
          </div>
          <Button variant="outline" onClick={() => toast({
            title: "Report Downloaded",
            description: "Financial report has been downloaded"
          })}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-2" />
              <div>
                <div className="font-bold text-2xl">R {totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-green-600">+12% from projections</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Ticket Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-venu-orange mr-2" />
              <div>
                <div className="font-bold text-2xl">
                  R {mockRevenueBreakdown.find(item => item.name === 'Ticket Sales')?.value.toLocaleString() || '0'}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round((mockRevenueBreakdown.find(item => item.name === 'Ticket Sales')?.value || 0) / totalRevenue * 100)}% of total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Vendor Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-600 mr-2" />
              <div>
                <div className="font-bold text-2xl">
                  R {(mockRevenueBreakdown.find(item => item.name === 'Vendor Fees')?.value || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round((mockRevenueBreakdown.find(item => item.name === 'Vendor Fees')?.value || 0) / totalRevenue * 100)}% of total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Per Attendee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <LineChart className="h-8 w-8 text-purple-600 mr-2" />
              <div>
                <div className="font-bold text-2xl">
                  R {Math.round(totalRevenue / (eventData?.ticketsSold || 250)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Per ticket sold
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === 'revenue' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by source category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer 
                  config={{
                    tickets: { color: "#f59e0b" },
                    food: { color: "#10b981" },
                    merch: { color: "#3b82f6" },
                    vendors: { color: "#8b5cf6" },
                    sponsors: { color: "#ec4899" },
                  }} 
                  className="h-full"
                >
                  <RechartsPreChart>
                    <Pie
                      data={mockRevenueBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockRevenueBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => `R ${Number(value).toLocaleString()}`} />
                  </RechartsPreChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue Timeline</CardTitle>
                <CardDescription>Cumulative revenue over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer 
                  config={{
                    amount: { color: "#f59e0b" },
                  }} 
                  className="h-full"
                >
                  <RechartsBarChart data={mockRevenueTimeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `R${value / 1000}K`} />
                    <Tooltip formatter={(value) => `R ${Number(value).toLocaleString()}`} />
                    <Bar dataKey="amount" name="Revenue" fill="var(--color-amount)" />
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 text-left font-medium">Description</th>
                      <th className="pb-2 text-center font-medium">Date</th>
                      <th className="pb-2 text-center font-medium">Status</th>
                      <th className="pb-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="py-3">{transaction.description}</td>
                        <td className="py-3 text-center">{formatDate(transaction.date)}</td>
                        <td className="py-3 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            <Check className="h-3 w-3 mr-1" />
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className={`py-3 text-right font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'} R {transaction.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 text-center">
                  <Button variant="ghost" className="text-sm text-venu-orange" onClick={() => toast({
                    title: "Transaction History",
                    description: "Viewing complete transaction history"
                  })}>
                    View All Transactions
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>Complete financial overview</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast({
                  title: "Report Downloaded",
                  description: "Financial summary has been downloaded as PDF"
                })}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-md mb-2">
                <div className="flex items-center">
                  <BarChart className="h-5 w-5 text-venu-orange mr-2" />
                  <span>Revenue Report</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => toast({
                  title: "Report Generated",
                  description: "Revenue report is ready for viewing"
                })}>
                  View
                </Button>
              </div>
              
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-md mb-2">
                <div className="flex items-center">
                  <PieChart className="h-5 w-5 text-venu-orange mr-2" />
                  <span>Revenue Breakdown</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => toast({
                  title: "Report Generated",
                  description: "Revenue breakdown is ready for viewing"
                })}>
                  View
                </Button>
              </div>
              
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-md mb-2">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-venu-orange mr-2" />
                  <span>Tax Summary</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => toast({
                  title: "Report Generated",
                  description: "Tax summary is ready for viewing"
                })}>
                  View
                </Button>
              </div>
              
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <LineChart className="h-5 w-5 text-venu-orange mr-2" />
                  <span>Projected vs Actual</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => toast({
                  title: "Report Generated",
                  description: "Projections comparison is ready for viewing"
                })}>
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Revenue Opportunities</CardTitle>
                  <CardDescription>Potential additional revenue sources</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast({
                  title: "Opportunity Analysis",
                  description: "Detailed analysis has been generated"
                })}>
                  <BarChart className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md">
                  <h3 className="font-medium text-green-800 mb-1">Premium Ticket Upgrade</h3>
                  <p className="text-sm text-green-700 mb-2">
                    Offer VIP upgrades to existing ticket holders.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-900">Potential Revenue: R 35,000</span>
                    <Button size="sm" variant="outline" className="border-green-200 text-green-700 bg-green-50 hover:bg-green-100" onClick={() => toast({
                      title: "Opportunity Selected",
                      description: "Premium ticket upgrade campaign prepared"
                    })}>
                      Implement
                    </Button>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-1">Additional Sponsorship Packages</h3>
                  <p className="text-sm text-blue-700 mb-2">
                    Create new tier-based sponsorship opportunities.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">Potential Revenue: R 25,000</span>
                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100" onClick={() => toast({
                      title: "Opportunity Selected",
                      description: "Sponsorship package details prepared"
                    })}>
                      Implement
                    </Button>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-md">
                  <h3 className="font-medium text-purple-800 mb-1">Merchandise Pre-orders</h3>
                  <p className="text-sm text-purple-700 mb-2">
                    Allow attendees to pre-order event merchandise.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-900">Potential Revenue: R 15,000</span>
                    <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100" onClick={() => toast({
                      title: "Opportunity Selected",
                      description: "Merchandise pre-order campaign prepared"
                    })}>
                      Implement
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
