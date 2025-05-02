
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Filter, Plus } from "lucide-react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminNotificationsPage() {
  // Mock notification data
  const notifications = [
    {
      id: "1",
      title: "May Update: New Features Released",
      content: "We've released new vendor management features. Click to learn more.",
      audience: "all",
      status: "active",
      date: "2025-05-01T10:00:00Z",
      priority: "normal",
    },
    {
      id: "2",
      title: "Scheduled Maintenance",
      content: "The system will be undergoing maintenance on May 10th from 02:00 to 04:00 UTC. Expect brief service disruptions.",
      audience: "all",
      status: "scheduled",
      date: "2025-05-08T14:30:00Z",
      priority: "high",
    },
    {
      id: "3",
      title: "Host Plan Promotion",
      content: "Get 20% off Premium Host plans this month. Limited time offer!",
      audience: "hosts",
      status: "active",
      date: "2025-05-02T08:15:00Z",
      priority: "normal",
    },
    {
      id: "4",
      title: "Vendor Portal Updates",
      content: "The vendor dashboard has been updated with new analytics features.",
      audience: "vendors",
      status: "active",
      date: "2025-05-03T11:45:00Z",
      priority: "normal",
    },
    {
      id: "5",
      title: "Payment Processing Issue Resolved",
      content: "The payment processing issue affecting some users has been resolved. We apologize for any inconvenience.",
      audience: "all",
      status: "completed",
      date: "2025-04-29T16:20:00Z",
      priority: "high",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case "all":
        return <Badge variant="outline">All Users</Badge>;
      case "hosts":
        return <Badge className="bg-blue-100 text-blue-800">Hosts</Badge>;
      case "vendors":
        return <Badge className="bg-green-100 text-green-800">Vendors</Badge>;
      case "customers":
        return <Badge className="bg-yellow-100 text-yellow-800">Customers</Badge>;
      default:
        return <Badge variant="outline">{audience}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notification Management</h1>
            <p className="text-gray-500">Manage system notifications and announcements</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Notification
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Notifications</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>View and manage all system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div className="relative max-w-md mb-4 md:mb-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search notifications..."
                      className="pl-9"
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

                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex items-start gap-3">
                          <div className="bg-gray-100 rounded-full p-2 mt-1">
                            <Bell className="h-5 w-5 text-venu-orange" />
                          </div>
                          <div>
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{notification.content}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {getAudienceBadge(notification.audience)}
                              {getStatusBadge(notification.status)}
                              {getPriorityBadge(notification.priority)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 md:mt-0 flex flex-col items-start md:items-end">
                          <span className="text-sm text-gray-500">{formatDate(notification.date)}</span>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Notifications</CardTitle>
                <CardDescription>Currently active notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications
                    .filter(notification => notification.status === "active")
                    .map((notification) => (
                      <div key={notification.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-100 rounded-full p-2 mt-1">
                              <Bell className="h-5 w-5 text-venu-orange" />
                            </div>
                            <div>
                              <h3 className="font-medium">{notification.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{notification.content}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {getAudienceBadge(notification.audience)}
                                {getPriorityBadge(notification.priority)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 md:mt-0 flex flex-col items-start md:items-end">
                            <span className="text-sm text-gray-500">{formatDate(notification.date)}</span>
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" size="sm">End</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Notifications</CardTitle>
                <CardDescription>Notifications scheduled for future delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications
                    .filter(notification => notification.status === "scheduled")
                    .map((notification) => (
                      <div key={notification.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-100 rounded-full p-2 mt-1">
                              <Bell className="h-5 w-5 text-venu-orange" />
                            </div>
                            <div>
                              <h3 className="font-medium">{notification.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{notification.content}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {getAudienceBadge(notification.audience)}
                                {getPriorityBadge(notification.priority)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 md:mt-0 flex flex-col items-start md:items-end">
                            <span className="text-sm text-gray-500">{formatDate(notification.date)}</span>
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" size="sm">Cancel</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Notifications</CardTitle>
                <CardDescription>Past notifications that are no longer active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications
                    .filter(notification => notification.status === "completed")
                    .map((notification) => (
                      <div key={notification.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-100 rounded-full p-2 mt-1">
                              <Bell className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="font-medium">{notification.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{notification.content}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {getAudienceBadge(notification.audience)}
                                {getPriorityBadge(notification.priority)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 md:mt-0 flex flex-col items-start md:items-end">
                            <span className="text-sm text-gray-500">{formatDate(notification.date)}</span>
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" size="sm">Archive</Button>
                              <Button variant="outline" size="sm">Duplicate</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Notification</CardTitle>
                <CardDescription>Create and send a new system notification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Notification Title</Label>
                      <Input id="title" placeholder="Enter notification title" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Notification Content</Label>
                      <Textarea id="content" placeholder="Enter notification content" rows={4} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="audience">Target Audience</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="hosts">Hosts Only</SelectItem>
                            <SelectItem value="vendors">Vendors Only</SelectItem>
                            <SelectItem value="customers">Customers Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="schedule">Schedule</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="now">Send Immediately</SelectItem>
                            <SelectItem value="schedule">Schedule for Later</SelectItem>
                            <SelectItem value="draft">Save as Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Notification</Button>
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
