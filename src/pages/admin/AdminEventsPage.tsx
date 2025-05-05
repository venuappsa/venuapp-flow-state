
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, Edit, Trash, Eye } from "lucide-react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Host {
  name?: string;
  surname?: string;
  email?: string;
}

interface Event {
  id: string;
  name: string;
  start_date: string;
  end_date?: string;
  status: string;
  host?: Host | null;
}

export default function AdminEventsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          host:host_id(name, surname, email)
        `)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return (data || []) as Event[];
    }
  });

  const filteredEvents = events.filter(
    event => event.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-lg">Loading events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 p-4 rounded-md">
          <h2 className="text-red-800 font-medium">Error loading events</h2>
          <p className="text-red-600">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Event Management</h1>
          <p className="text-gray-500">View and manage all events on the platform</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>Browse and manage upcoming and past events</CardDescription>
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

          {filteredEvents.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableCaption>List of all events</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>
                        {event.host ? (
                          <div>
                            <div>{`${event.host.name || ''} ${event.host.surname || ''}`}</div>
                            <div className="text-xs text-gray-500">{event.host.email || ''}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">No host data</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {event.start_date && (
                          <div>
                            <div>{format(new Date(event.start_date), 'MMM dd, yyyy')}</div>
                            <div className="text-xs text-gray-500">
                              {format(new Date(event.start_date), 'h:mm a')} - 
                              {event.end_date && format(new Date(event.end_date), ' h:mm a')}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No events found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm ? 'Try adjusting your search term' : 'Create your first event to get started'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
