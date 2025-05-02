
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, MessageSquare, AlertCircle, CheckCircle, Clock, ArrowUpRight } from "lucide-react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function AdminSupportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock support ticket data
  const tickets = [
    {
      id: "T-1001",
      subject: "Payment Processing Issue",
      user: "Sarah Johnson",
      userEmail: "sarah@eventco.com",
      userType: "host",
      status: "open",
      priority: "high",
      date: "2025-05-01T10:30:00Z",
      lastUpdate: "2025-05-01T14:45:00Z",
      assignedTo: "Admin User",
    },
    {
      id: "T-1002",
      subject: "Cannot Upload Event Photos",
      user: "Michael Brown",
      userEmail: "michael@celebrationevents.com",
      userType: "host",
      status: "in_progress",
      priority: "medium",
      date: "2025-04-30T09:15:00Z",
      lastUpdate: "2025-05-01T11:20:00Z",
      assignedTo: "Support Team",
    },
    {
      id: "T-1003",
      subject: "Subscription Cancellation Request",
      user: "Elite Photography",
      userEmail: "lisa@elitephoto.com",
      userType: "vendor",
      status: "open",
      priority: "medium",
      date: "2025-05-01T13:45:00Z",
      lastUpdate: "2025-05-01T13:45:00Z",
      assignedTo: "Unassigned",
    },
    {
      id: "T-1004",
      subject: "Refund for Double Charge",
      user: "David Wilson",
      userEmail: "david@premiereevents.com",
      userType: "host",
      status: "closed",
      priority: "high",
      date: "2025-04-28T15:20:00Z",
      lastUpdate: "2025-04-30T09:10:00Z",
      assignedTo: "Admin User",
    },
    {
      id: "T-1005",
      subject: "Account Access Issues",
      user: "Sweet Delights Bakery",
      userEmail: "michael@sweetdelights.com",
      userType: "vendor",
      status: "in_progress",
      priority: "high",
      date: "2025-04-29T11:30:00Z",
      lastUpdate: "2025-05-01T10:15:00Z",
      assignedTo: "Support Team",
    },
    {
      id: "T-1006",
      subject: "Feature Request: Calendar Integration",
      user: "Olivia Martin",
      userEmail: "olivia@eventelegance.com",
      userType: "host",
      status: "open",
      priority: "low",
      date: "2025-05-01T09:00:00Z",
      lastUpdate: "2025-05-01T09:00:00Z",
      assignedTo: "Product Team",
    },
  ];

  const filteredTickets = tickets.filter(
    ticket =>
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "closed":
        return <Badge className="bg-green-100 text-green-800">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case "host":
        return <Badge className="bg-purple-100 text-purple-800">Host</Badge>;
      case "vendor":
        return <Badge className="bg-indigo-100 text-indigo-800">Vendor</Badge>;
      case "customer":
        return <Badge className="bg-cyan-100 text-cyan-800">Customer</Badge>;
      default:
        return <Badge variant="outline">{userType}</Badge>;
    }
  };

  // Mock knowledge base articles
  const kbArticles = [
    { id: "KB-1001", title: "Getting Started with Venuapp", category: "General", views: 1250 },
    { id: "KB-1002", title: "How to Create Your First Event", category: "Host", views: 890 },
    { id: "KB-1003", title: "Setting Up Your Vendor Profile", category: "Vendor", views: 750 },
    { id: "KB-1004", title: "Subscription Plans and Billing", category: "Billing", views: 680 },
    { id: "KB-1005", title: "Troubleshooting Login Issues", category: "Account", views: 920 },
    { id: "KB-1006", title: "Managing Guest Lists", category: "Host", views: 540 },
    { id: "KB-1007", title: "Processing Refunds", category: "Billing", views: 420 },
    { id: "KB-1008", title: "Vendor Booking Process", category: "Vendor", views: 610 },
  ];

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Support Management</h1>
            <p className="text-gray-500">Manage customer support tickets and knowledge base</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              Create New Ticket
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Open Tickets</CardTitle>
              <CardDescription>Awaiting response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-blue-500 mr-3" />
                <p className="text-3xl font-bold">{tickets.filter(t => t.status === "open").length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">In Progress</CardTitle>
              <CardDescription>Being worked on</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500 mr-3" />
                <p className="text-3xl font-bold">{tickets.filter(t => t.status === "in_progress").length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resolved</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                <p className="text-3xl font-bold">{tickets.filter(t => t.status === "closed").length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Avg. Response Time</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">4.2 hrs</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-tickets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all-tickets">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
            <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-tickets">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Manage all support tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div className="relative max-w-md mb-4 md:mb-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search tickets..."
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
                    <TableCaption>All support tickets</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.subject}</TableCell>
                          <TableCell>
                            <div>
                              {ticket.user}
                              <div className="text-xs text-gray-500">{ticket.userEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getUserTypeBadge(ticket.userType)}</TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                          <TableCell>{formatDate(ticket.date)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              <ArrowUpRight className="h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="open">
            <Card>
              <CardHeader>
                <CardTitle>Open Tickets</CardTitle>
                <CardDescription>Tickets awaiting response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>Open support tickets</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets
                        .filter(ticket => ticket.status === "open")
                        .map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-medium">{ticket.id}</TableCell>
                            <TableCell>{ticket.subject}</TableCell>
                            <TableCell>
                              <div>
                                {ticket.user}
                                <div className="text-xs text-gray-500">{ticket.userEmail}</div>
                              </div>
                            </TableCell>
                            <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                            <TableCell>{formatDate(ticket.date)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                <ArrowUpRight className="h-4 w-4" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="in-progress">
            <Card>
              <CardHeader>
                <CardTitle>In Progress Tickets</CardTitle>
                <CardDescription>Tickets currently being worked on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>In progress support tickets</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets
                        .filter(ticket => ticket.status === "in_progress")
                        .map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-medium">{ticket.id}</TableCell>
                            <TableCell>{ticket.subject}</TableCell>
                            <TableCell>
                              <div>
                                {ticket.user}
                                <div className="text-xs text-gray-500">{ticket.userEmail}</div>
                              </div>
                            </TableCell>
                            <TableCell>{ticket.assignedTo}</TableCell>
                            <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                            <TableCell>{formatDate(ticket.lastUpdate)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                <ArrowUpRight className="h-4 w-4" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="closed">
            <Card>
              <CardHeader>
                <CardTitle>Closed Tickets</CardTitle>
                <CardDescription>Resolved support tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>Closed support tickets</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Resolved By</TableHead>
                        <TableHead>Date Closed</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets
                        .filter(ticket => ticket.status === "closed")
                        .map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-medium">{ticket.id}</TableCell>
                            <TableCell>{ticket.subject}</TableCell>
                            <TableCell>
                              <div>
                                {ticket.user}
                                <div className="text-xs text-gray-500">{ticket.userEmail}</div>
                              </div>
                            </TableCell>
                            <TableCell>{ticket.assignedTo}</TableCell>
                            <TableCell>{formatDate(ticket.lastUpdate)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                <ArrowUpRight className="h-4 w-4" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="knowledge-base">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Knowledge Base Articles</CardTitle>
                  <CardDescription>Manage help and support articles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-6">
                    <div className="relative max-w-md">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search articles..."
                        className="pl-9"
                      />
                    </div>
                    <Button>
                      Add New Article
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableCaption>Knowledge base articles</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {kbArticles.map((article) => (
                          <TableRow key={article.id}>
                            <TableCell className="font-medium">{article.id}</TableCell>
                            <TableCell>{article.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{article.category}</Badge>
                            </TableCell>
                            <TableCell>{article.views}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Add New Article</CardTitle>
                  <CardDescription>Create a new knowledge base article</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="article-title">Article Title</Label>
                      <Input id="article-title" placeholder="Enter article title" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="host">Host</SelectItem>
                          <SelectItem value="vendor">Vendor</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">Article Content</Label>
                      <Textarea id="content" placeholder="Write article content..." rows={8} />
                    </div>
                    
                    <Button className="w-full">
                      Publish Article
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPanelLayout>
  );
}
