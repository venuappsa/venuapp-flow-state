
import React, { useState } from "react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Tag, 
  MessageCircle, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Inbox, 
  UserCheck, 
  Download 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export default function AdminSupportPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("tickets");

  // Mock data for support tickets
  const tickets = [
    {
      id: "TICKET-001",
      subject: "Cannot access my account",
      requester: "John Smith",
      requesterEmail: "john.smith@example.com",
      status: "open",
      priority: "high",
      category: "Account Access",
      assignedTo: "Support Team",
      createdAt: new Date(2025, 4, 2, 14, 35).toISOString(),
      lastUpdated: new Date(2025, 4, 2, 15, 10).toISOString(),
      replies: 2
    },
    {
      id: "TICKET-002",
      subject: "Payment failed but money was deducted",
      requester: "Alice Johnson",
      requesterEmail: "alice.johnson@example.com",
      status: "pending",
      priority: "high",
      category: "Billing",
      assignedTo: "Finance Team",
      createdAt: new Date(2025, 4, 1, 9, 22).toISOString(),
      lastUpdated: new Date(2025, 4, 2, 11, 45).toISOString(),
      replies: 3
    },
    {
      id: "TICKET-003",
      subject: "How to add multiple vendors to an event",
      requester: "Robert Davis",
      requesterEmail: "robert.davis@example.com",
      status: "open",
      priority: "medium",
      category: "Feature Help",
      assignedTo: "Customer Success",
      createdAt: new Date(2025, 4, 1, 16, 10).toISOString(),
      lastUpdated: new Date(2025, 4, 1, 16, 45).toISOString(),
      replies: 1
    },
    {
      id: "TICKET-004",
      subject: "Suggestion for new feature",
      requester: "Emily Wilson",
      requesterEmail: "emily.wilson@example.com",
      status: "resolved",
      priority: "low",
      category: "Feature Request",
      assignedTo: "Product Team",
      createdAt: new Date(2025, 3, 28, 11, 20).toISOString(),
      lastUpdated: new Date(2025, 3, 30, 14, 15).toISOString(),
      replies: 4
    },
    {
      id: "TICKET-005",
      subject: "Vendor verification taking too long",
      requester: "Michael Brown",
      requesterEmail: "michael.brown@example.com",
      status: "closed",
      priority: "medium",
      category: "Verification",
      assignedTo: "Verification Team",
      createdAt: new Date(2025, 3, 25, 9, 30).toISOString(),
      lastUpdated: new Date(2025, 3, 27, 16, 20).toISOString(),
      replies: 5
    },
    {
      id: "TICKET-006",
      subject: "Website is slow when adding vendors",
      requester: "Sarah Lee",
      requesterEmail: "sarah.lee@example.com",
      status: "open",
      priority: "high",
      category: "Technical Issue",
      assignedTo: "Technical Support",
      createdAt: new Date(2025, 4, 2, 8, 45).toISOString(),
      lastUpdated: new Date(2025, 4, 2, 9, 30).toISOString(),
      replies: 1
    }
  ];

  // Mock data for knowledge base articles
  const knowledgeArticles = [
    {
      id: "KB-001",
      title: "Getting started with Venuapp",
      category: "Getting Started",
      views: 2560,
      lastUpdated: new Date(2025, 3, 15).toISOString(),
      status: "published"
    },
    {
      id: "KB-002",
      title: "How to manage your events",
      category: "Events",
      views: 1890,
      lastUpdated: new Date(2025, 3, 20).toISOString(),
      status: "published"
    },
    {
      id: "KB-003",
      title: "Vendor onboarding process",
      category: "Vendors",
      views: 1450,
      lastUpdated: new Date(2025, 3, 25).toISOString(),
      status: "published"
    },
    {
      id: "KB-004",
      title: "Troubleshooting payment issues",
      category: "Billing",
      views: 2100,
      lastUpdated: new Date(2025, 4, 1).toISOString(),
      status: "published"
    },
    {
      id: "KB-005",
      title: "Upcoming feature: Advanced analytics",
      category: "Features",
      views: 750,
      lastUpdated: new Date(2025, 4, 1).toISOString(),
      status: "draft"
    }
  ];

  // Filter tickets based on search term and filters
  const filteredTickets = tickets.filter((ticket) => {
    // Apply status filter
    if (statusFilter !== "all" && ticket.status !== statusFilter) {
      return false;
    }
    
    // Apply priority filter
    if (priorityFilter !== "all" && ticket.priority !== priorityFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm && 
        !ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !ticket.requester.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !ticket.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Filter knowledge base articles
  const filteredArticles = knowledgeArticles.filter((article) => {
    if (searchTerm && 
        !article.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !article.category.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
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

  const handleViewTicket = (id: string) => {
    toast({
      title: "Opening ticket",
      description: `Viewing ticket ${id}`
    });
  };

  const handleExportTickets = () => {
    toast({
      title: "Export initiated",
      description: "Ticket data is being exported to CSV"
    });
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Support Center</h1>
            <p className="text-gray-500">Manage support tickets and knowledge base</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline" onClick={handleExportTickets}>
              <Download className="mr-2 h-4 w-4" />
              Export Tickets
            </Button>
            <Button>
              <MessageCircle className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <CardTitle>Support Overview</CardTitle>
                <CardDescription>Quick summary of support activity</CardDescription>
              </div>
              <Tabs 
                defaultValue="tickets" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full sm:w-auto mt-4 sm:mt-0"
              >
                <TabsList className="grid w-full sm:w-auto grid-cols-2">
                  <TabsTrigger value="tickets">
                    <Inbox className="h-4 w-4 mr-2" />
                    Tickets
                  </TabsTrigger>
                  <TabsTrigger value="knowledge">
                    <Tag className="h-4 w-4 mr-2" />
                    Knowledge Base
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {activeTab === "tickets" ? (
                <>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <AlertTriangle className="h-8 w-8 text-blue-500 mr-4" />
                      <div>
                        <p className="text-2xl font-bold">
                          {tickets.filter(t => t.status === "open").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Open Tickets</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <Clock className="h-8 w-8 text-yellow-500 mr-4" />
                      <div>
                        <p className="text-2xl font-bold">
                          {tickets.filter(t => t.status === "pending").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Pending Response</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
                      <div>
                        <p className="text-2xl font-bold">
                          {tickets.filter(t => t.status === "resolved").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Resolved Today</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <UserCheck className="h-8 w-8 text-purple-500 mr-4" />
                      <div>
                        <p className="text-2xl font-bold">1.5h</p>
                        <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <FileSearchIcon className="h-8 w-8 text-blue-500 mr-4" />
                      <div>
                        <p className="text-2xl font-bold">{knowledgeArticles.length}</p>
                        <p className="text-sm text-muted-foreground">Total Articles</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
                      <div>
                        <p className="text-2xl font-bold">
                          {knowledgeArticles.filter(a => a.status === "published").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Published</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <Clock className="h-8 w-8 text-yellow-500 mr-4" />
                      <div>
                        <p className="text-2xl font-bold">
                          {knowledgeArticles.filter(a => a.status === "draft").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Draft</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <Eye className="h-8 w-8 text-purple-500 mr-4" />
                      <div>
                        <p className="text-2xl font-bold">8750</p>
                        <p className="text-sm text-muted-foreground">Monthly Views</p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <TabsContent value="tickets" className="mt-0 p-0" hidden={activeTab !== "tickets"}>
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Manage and respond to user support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search tickets..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>Status</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select 
                    value={priorityFilter} 
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="w-32">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span>Priority</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="mr-1">{ticket.subject}</span>
                              {ticket.replies > 0 && (
                                <Badge variant="outline" className="ml-2">
                                  {ticket.replies}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{ticket.requester}</p>
                              <p className="text-sm text-muted-foreground">{ticket.requesterEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(ticket.lastUpdated), { addSuffix: true })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket.id)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Inbox className="h-12 w-12 mb-2 text-gray-300" />
                            <p className="text-lg font-medium">No tickets found</p>
                            <p className="text-sm">
                              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" ? 
                                "Try adjusting your filters" : "No support tickets available"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="mt-0 p-0" hidden={activeTab !== "knowledge"}>
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>Manage help articles and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search articles..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="font-medium">{article.id}</TableCell>
                          <TableCell>{article.title}</TableCell>
                          <TableCell>{article.category}</TableCell>
                          <TableCell>{article.views.toLocaleString()}</TableCell>
                          <TableCell>
                            {new Date(article.lastUpdated).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{getStatusBadge(article.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm">
                                Preview
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <FileQuestion className="h-12 w-12 mb-2 text-gray-300" />
                            <p className="text-lg font-medium">No articles found</p>
                            <p className="text-sm">
                              {searchTerm ? "Try adjusting your search term" : "No knowledge base articles available"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </AdminPanelLayout>
  );
}

// Missing icons added
const Eye = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const FileSearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="m9 18-1.5-1.5" />
  </svg>
);

const FileQuestion = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <path d="M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2" />
    <path d="M12 17h.01" />
  </svg>
);
