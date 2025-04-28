
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Ticket,
  Plus,
  Edit,
  Trash2,
  BarChart,
  QrCode,
  Download,
  RefreshCcw
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock ticket types data
const mockTicketTypes = [
  {
    id: "ticket-1",
    name: "General Admission",
    price: 250,
    sold: 187,
    available: 300,
    description: "Standard entry ticket"
  },
  {
    id: "ticket-2",
    name: "VIP Pass",
    price: 750,
    sold: 78,
    available: 100,
    description: "VIP access with exclusive benefits"
  },
  {
    id: "ticket-3",
    name: "Early Bird",
    price: 150,
    sold: 50,
    available: 50,
    description: "Early access at reduced price",
    soldOut: true
  }
];

// Sales data for chart
const salesData = [
  { name: '1 May', sales: 12 },
  { name: '2 May', sales: 19 },
  { name: '3 May', sales: 15 },
  { name: '4 May', sales: 27 },
  { name: '5 May', sales: 34 },
  { name: '6 May', sales: 42 },
  { name: '7 May', sales: 25 },
];

export default function EventTicketsTab({ eventId }: { eventId: string }) {
  const [activeView, setActiveView] = useState<'types' | 'sales'>('types');
  
  const totalSold = mockTicketTypes.reduce((acc, ticket) => acc + ticket.sold, 0);
  const totalAvailable = mockTicketTypes.reduce((acc, ticket) => acc + ticket.available, 0);
  const soldPercentage = Math.round((totalSold / totalAvailable) * 100);
  const totalRevenue = mockTicketTypes.reduce((acc, ticket) => acc + (ticket.price * ticket.sold), 0);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Ticket Management</h3>
          <p className="text-sm text-gray-500">Manage tickets and track sales</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex border rounded-md overflow-hidden">
            <button 
              className={`px-3 py-1.5 text-sm ${activeView === 'types' ? 'bg-venu-orange text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setActiveView('types')}
            >
              Ticket Types
            </button>
            <button 
              className={`px-3 py-1.5 text-sm ${activeView === 'sales' ? 'bg-venu-orange text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setActiveView('sales')}
            >
              Sales Analytics
            </button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Ticket Type
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Ticket className="h-5 w-5 text-venu-orange mr-2" />
              <div>
                <div className="font-medium text-2xl">{totalSold} / {totalAvailable}</div>
                <div className="text-sm text-gray-500">{soldPercentage}% of capacity</div>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div 
                className="h-2 bg-venu-orange rounded-full" 
                style={{ width: `${soldPercentage}%` }} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <div className="font-medium text-2xl">R {totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-500">From ticket sales</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">QR Scanner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <QrCode className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="font-medium">Check-in System</div>
                  <div className="text-sm text-gray-500">Scan tickets at entry</div>
                </div>
              </div>
              <Button size="sm" onClick={() => toast({
                title: "QR Scanner Activated",
                description: "Ready to scan tickets for check-in"
              })}>
                Launch
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {activeView === 'types' ? (
        <div className="space-y-4">
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sold</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th scope="col" className="relative px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockTicketTypes.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{ticket.name}</div>
                        <div className="text-sm text-gray-500">{ticket.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      R {ticket.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {ticket.sold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {ticket.available}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.soldOut ? (
                        <Badge className="bg-red-100 text-red-800">Sold Out</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">On Sale</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your ticket settings</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Attendee List
              </Button>
              <Button variant="outline" className="justify-start">
                <QrCode className="h-4 w-4 mr-2" />
                Generate Batch QR Codes
              </Button>
              <Button variant="outline" className="justify-start">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Sync with External System
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Sales Over Time</CardTitle>
              <CardDescription>Daily ticket sales volume</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer 
                config={{
                  sales: { color: "#f59e0b" },
                }} 
                className="h-full"
              >
                <RechartsBarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="var(--color-sales)" />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Type Distribution</CardTitle>
                <CardDescription>Breakdown of sales by ticket type</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <div className="space-y-4">
                  {mockTicketTypes.map(ticket => (
                    <div key={ticket.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{ticket.name}</span>
                        <span className="text-sm text-gray-500">{ticket.sold} sold ({Math.round((ticket.sold / totalSold) * 100)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-venu-orange rounded-full" 
                          style={{ width: `${(ticket.sold / ticket.available) * 100}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Insights</CardTitle>
                <CardDescription>Financial analytics for ticket sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Average Ticket Price</p>
                      <p className="text-xl font-medium">
                        R {Math.round(totalRevenue / totalSold)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Projected Revenue</p>
                      <p className="text-xl font-medium">
                        R {Math.round(totalRevenue * (totalAvailable / totalSold)).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Sales Velocity</p>
                      <p className="text-xl font-medium">
                        {Math.round(totalSold / 30)} / day
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Conversion Rate</p>
                      <p className="text-xl font-medium">
                        {Math.round(Math.random() * 10 + 10)}%
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <BarChart className="h-4 w-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
