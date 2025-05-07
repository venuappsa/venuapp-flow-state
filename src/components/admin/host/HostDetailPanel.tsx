import { useState } from "react";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import {
  CreditCard, 
  BadgeCheck, 
  ClipboardCheck, 
  Calendar, 
  Users, 
  Megaphone, 
  Ticket, 
  SplitSquareVertical, 
  BarChart3, 
  Store
} from "lucide-react";

interface Host {
  id: string;
  name: string;
  email: string;
  company: string;
  joinDate: string;
  status: string;
  plan: string;
  eventsHosted: number;
}

interface HostDetailPanelProps {
  host: Host;
}

export function HostDetailPanel({ host }: HostDetailPanelProps) {
  const [activeTab, setActiveTab] = useState("subscriptions");
  
  return (
    <div className="py-2">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="mb-6 border-b overflow-x-auto">
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 flex-nowrap">
            <TabsTrigger
              value="subscriptions"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <CreditCard className="mr-2 h-4 w-4" /> Subscriptions
            </TabsTrigger>
            <TabsTrigger
              value="compliance"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <BadgeCheck className="mr-2 h-4 w-4" /> Compliance
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <ClipboardCheck className="mr-2 h-4 w-4" /> Tasks
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <Calendar className="mr-2 h-4 w-4" /> Events
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <Users className="mr-2 h-4 w-4" /> Admin Users
            </TabsTrigger>
            <TabsTrigger
              value="promotions"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <Megaphone className="mr-2 h-4 w-4" /> Promotions
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <Ticket className="mr-2 h-4 w-4" /> Ticket Sales
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <SplitSquareVertical className="mr-2 h-4 w-4" /> Resources
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <BarChart3 className="mr-2 h-4 w-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger
              value="merchants"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <Store className="mr-2 h-4 w-4" /> Merchants
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="subscriptions">
          <SubscriptionsTab host={host} />
        </TabsContent>
        
        <TabsContent value="compliance">
          <ComplianceTab host={host} />
        </TabsContent>
        
        <TabsContent value="tasks">
          <TasksTab host={host} />
        </TabsContent>
        
        <TabsContent value="events">
          <EventsTab host={host} />
        </TabsContent>
        
        <TabsContent value="users">
          <UsersTab host={host} />
        </TabsContent>
        
        <TabsContent value="promotions">
          <PromotionsTab host={host} />
        </TabsContent>
        
        <TabsContent value="tickets">
          <TicketsTab host={host} />
        </TabsContent>
        
        <TabsContent value="resources">
          <ResourcesTab host={host} />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsTab host={host} />
        </TabsContent>
        
        <TabsContent value="merchants">
          <MerchantsTab host={host} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Tab Components
function SubscriptionsTab({ host }: { host: Host }) {
  return (
    <DashboardSection title="Subscription Management">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <h3 className="font-medium mb-1">Current Plan</h3>
              <p className="text-2xl font-bold">{host.plan}</p>
              <p className="text-sm text-muted-foreground mt-1">Active since {new Date(host.joinDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div>
              <h3 className="font-medium mb-1">Renewal Date</h3>
              <p className="text-2xl font-bold">{new Date(new Date(host.joinDate).setMonth(new Date(host.joinDate).getMonth() + 1)).toLocaleDateString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Auto-renewal enabled</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div>
              <h3 className="font-medium mb-1">Payment Method</h3>
              <p className="text-xl font-semibold">Visa ending in 4242</p>
              <p className="text-sm text-muted-foreground mt-1">Expires 12/2026</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardSection>
  );
}

function ComplianceTab({ host }: { host: Host }) {
  return (
    <DashboardSection title="Compliance Verification">
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Verification Status</h3>
                  <p className="text-sm text-muted-foreground">{host.status === "active" ? "Verified" : "Pending Verification"}</p>
                </div>
                <Badge className={host.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                  {host.status === "active" ? "Verified" : "Pending"}
                </Badge>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Required Documents</h3>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Business Registration</span>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Tax Clearance</span>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Event Hosting License</span>
                    <Badge className={host.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {host.status === "active" ? "Verified" : "Pending"}
                    </Badge>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardSection>
  );
}

function TasksTab({ host }: { host: Host }) {
  // Mock task data
  const tasks = [
    { id: 1, title: "Complete verification process", status: "pending", dueDate: "2025-05-15", priority: "high" },
    { id: 2, title: "Submit monthly event report", status: "completed", dueDate: "2025-05-01", priority: "medium" },
    { id: 3, title: "Update payment information", status: "pending", dueDate: "2025-05-10", priority: "low" },
  ];
  
  return (
    <DashboardSection title="Host Tasks">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={
                    task.priority === "high" ? "bg-red-100 text-red-800" : 
                    task.priority === "medium" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-blue-100 text-blue-800"
                  }>
                    {task.priority}
                  </Badge>
                  <Badge className={task.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {task.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

function EventsTab({ host }: { host: Host }) {
  // Mock events data
  const events = [
    { id: 1, name: "Summer Music Festival", date: "2025-06-15", status: "upcoming", guests: 500 },
    { id: 2, name: "Tech Conference", date: "2025-05-23", status: "upcoming", guests: 300 },
    { id: 3, name: "Corporate Gala", date: "2025-04-10", status: "completed", guests: 200 },
  ];
  
  return (
    <DashboardSection title="Events">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0">
                <div>
                  <h3 className="font-medium">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">Date: {new Date(event.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">{event.guests} guests</p>
                  <Badge className={event.status === "completed" ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}>
                    {event.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

function UsersTab({ host }: { host: Host }) {
  // Mock admin users data
  const adminUsers = [
    { id: 1, name: "John Smith", role: "Admin", email: "john@eventco.com", lastActive: "2025-05-06" },
    { id: 2, name: "Lisa Johnson", role: "Manager", email: "lisa@eventco.com", lastActive: "2025-05-07" },
  ];
  
  return (
    <DashboardSection title="Admin Users">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {adminUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0">
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm">Last active: {new Date(user.lastActive).toLocaleDateString()}</p>
                  <Badge>{user.role}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

function PromotionsTab({ host }: { host: Host }) {
  // Mock promotions data
  const promotions = [
    { id: 1, name: "Summer Discount", code: "SUMMER25", discount: "25%", status: "active", expiry: "2025-08-31" },
    { id: 2, name: "Early Bird Special", code: "EARLYBIRD", discount: "15%", status: "scheduled", expiry: "2025-06-30" },
  ];
  
  return (
    <DashboardSection title="Promotions">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {promotions.map(promo => (
              <div key={promo.id} className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0">
                <div>
                  <h3 className="font-medium">{promo.name}</h3>
                  <p className="text-sm text-muted-foreground">Code: {promo.code} | Discount: {promo.discount}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm">Expires: {new Date(promo.expiry).toLocaleDateString()}</p>
                  <Badge className={promo.status === "active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                    {promo.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

function TicketsTab({ host }: { host: Host }) {
  // Mock ticket sales data
  const events = [
    { id: 1, name: "Summer Music Festival", sold: 350, total: 500, revenue: 8750 },
    { id: 2, name: "Tech Conference", sold: 245, total: 300, revenue: 12250 },
  ];
  
  return (
    <DashboardSection title="Ticket Sales">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="border-b last:border-b-0 pb-3 last:pb-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{event.name}</h3>
                  <p className="font-medium text-green-600">${event.revenue.toLocaleString()}</p>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Tickets sold: {event.sold}/{event.total}</span>
                    <span>{Math.round((event.sold / event.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(event.sold / event.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardSection>
  );
}

function ResourcesTab({ host }: { host: Host }) {
  // Mock resource allocation data
  const resourceData = {
    fetchmen: 12,
    fetchmenAllocated: 8,
    productLimit: 500,
    productsUsed: 320,
  };
  
  return (
    <DashboardSection title="Resource Allocations">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-3">Fetchman Allocation</h3>
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Allocated: {resourceData.fetchmenAllocated}/{resourceData.fetchmen}</span>
                <span>{Math.round((resourceData.fetchmenAllocated / resourceData.fetchmen) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(resourceData.fetchmenAllocated / resourceData.fetchmen) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-3">Product Load</h3>
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Used: {resourceData.productsUsed}/{resourceData.productLimit}</span>
                <span>{Math.round((resourceData.productsUsed / resourceData.productLimit) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${(resourceData.productsUsed / resourceData.productLimit) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardSection>
  );
}

function AnalyticsTab({ host }: { host: Host }) {
  // Mock analytics data
  const analyticsData = {
    totalRevenue: 29500,
    totalGuests: 945,
    averageRating: 4.7,
    conversionRate: 68,
  };
  
  return (
    <DashboardSection title="Analytics">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-sm text-muted-foreground">Total Revenue</h3>
            <p className="text-2xl font-bold">${analyticsData.totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-sm text-muted-foreground">Total Guests</h3>
            <p className="text-2xl font-bold">{analyticsData.totalGuests}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-sm text-muted-foreground">Average Rating</h3>
            <p className="text-2xl font-bold">{analyticsData.averageRating}/5</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium text-sm text-muted-foreground">Conversion Rate</h3>
            <p className="text-2xl font-bold">{analyticsData.conversionRate}%</p>
          </CardContent>
        </Card>
      </div>
    </DashboardSection>
  );
}

function MerchantsTab({ host }: { host: Host }) {
  // Mock merchants data
  const merchants = [
    { id: 1, name: "Food Delights", category: "Food", status: "active", inviteMethod: "QR" },
    { id: 2, name: "Sound Systems Pro", category: "Equipment", status: "pending", inviteMethod: "Link" },
    { id: 3, name: "Party Decorations", category: "Decor", status: "active", inviteMethod: "QR" },
  ];
  
  return (
    <DashboardSection title="Merchants">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {merchants.map(merchant => (
              <div key={merchant.id} className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0">
                <div>
                  <h3 className="font-medium">{merchant.name}</h3>
                  <p className="text-sm text-muted-foreground">Category: {merchant.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-gray-100 text-gray-800">
                    Invite: {merchant.inviteMethod}
                  </Badge>
                  <Badge className={merchant.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {merchant.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
