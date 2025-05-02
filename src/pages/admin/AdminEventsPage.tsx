
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, Eye, Check, X } from "lucide-react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";

export default function AdminEventsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for events
  const events = [
    {
      id: "1",
      name: "Wedding Expo 2025",
      host: "EventCo Planners",
      date: "2025-06-15",
      venue: "Grand Convention Center",
      status: "upcoming",
      attendees: 500,
      revenue: 15000,
      featured: true,
    },
    {
      id: "2",
      name: "Corporate Retreat Summit",
      host: "Celebration Events",
      date: "2025-07-21",
      venue: "Mountain View Resort",
      status: "upcoming",
      attendees: 120,
      revenue: 22000,
      featured: false,
    },
    {
      id: "3",
      name: "Music Festival Weekend",
      host: "Party Professionals",
      date: "2025-05-30",
      venue: "Central Park Arena",
      status: "pending",
      attendees: 2000,
      revenue: 75000,
      featured: true,
    },
    {
      id: "4",
      name: "Tech Conference 2025",
      host: "Premiere Events",
      date: "2025-04-12",
      venue: "Tech Hub Center",
      status: "completed",
      attendees: 850,
      revenue: 42500,
      featured: true,
    },
    {
      id: "5",
      name: "Summer Fashion Show",
      host: "Event Elegance",
      date: "2025-08-18",
      venue: "Downtown Gallery",
      status: "upcoming",
      attendees: 300,
      revenue: 18000,
      featured: false,
    },
  ];

  const filteredEvents = events.filter(
    event =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Event Management</h1>
            <p className="text-gray-500">Monitor and manage events across the platform</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>All Events</CardTitle>
            <CardDescription>View and manage events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="relative max-w-md mb-4 md:mb-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search events..."
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
                <TableCaption>List of events on the platform</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Revenue (R)</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{event.host}</TableCell>
                      <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                      <TableCell>{event.venue}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>{event.attendees}</TableCell>
                      <TableCell>{event.revenue.toLocaleString()}</TableCell>
                      <TableCell>{event.featured ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Calendar className="h-4 w-4" />
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
      </div>
    </AdminPanelLayout>
  );
}
