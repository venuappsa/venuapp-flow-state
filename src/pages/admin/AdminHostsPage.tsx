
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, UserCheck, UserX, User, Settings } from "lucide-react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";

export default function AdminHostsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for hosts
  const hosts = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@eventco.com",
      company: "EventCo Planners",
      joinDate: "2025-01-15",
      status: "active",
      plan: "Premium",
      eventsHosted: 12,
    },
    {
      id: "2",
      name: "Michael Brown",
      email: "michael@celebrationevents.com",
      company: "Celebration Events",
      joinDate: "2025-02-21",
      status: "active",
      plan: "Premium",
      eventsHosted: 8,
    },
    {
      id: "3",
      name: "Emma Davis",
      email: "emma@partypros.com",
      company: "Party Professionals",
      joinDate: "2025-03-05",
      status: "pending",
      plan: "Basic",
      eventsHosted: 2,
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david@premiereevents.com",
      company: "Premiere Events",
      joinDate: "2025-02-12",
      status: "suspended",
      plan: "Premium",
      eventsHosted: 5,
    },
    {
      id: "5",
      name: "Olivia Martin",
      email: "olivia@eventelegance.com",
      company: "Event Elegance",
      joinDate: "2025-03-18",
      status: "active",
      plan: "Basic",
      eventsHosted: 3,
    },
  ];

  const filteredHosts = hosts.filter(
    host =>
      host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      host.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      host.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Host Management</h1>
            <p className="text-gray-500">Manage and monitor host accounts</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <UserCheck className="mr-2 h-4 w-4" />
              Add New Host
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Host Accounts</CardTitle>
            <CardDescription>View and manage host accounts on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="relative max-w-md mb-4 md:mb-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search hosts..."
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
                <TableCaption>List of hosts registered on the platform</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHosts.map((host) => (
                    <TableRow key={host.id}>
                      <TableCell className="font-medium">
                        <div>
                          {host.name}
                          <div className="text-xs text-gray-500">
                            {host.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{host.company}</TableCell>
                      <TableCell>{new Date(host.joinDate).toLocaleDateString()}</TableCell>
                      <TableCell>{host.plan}</TableCell>
                      <TableCell>{host.eventsHosted}</TableCell>
                      <TableCell>{getStatusBadge(host.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <User className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                          {host.status !== "suspended" ? (
                            <Button variant="ghost" size="icon">
                              <UserX className="h-4 w-4 text-red-500" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon">
                              <UserCheck className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPanelLayout>
  );
}
