
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarPlus,
  Calendar,
  Search,
  Settings,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CalendarX,
  ArrowUpDown
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import HostPanelLayout from '@/components/layouts/HostPanelLayout';

interface Event {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  venue_name?: string;
  vendor_count?: number;
}

export default function EventsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, statusFilter, sortBy]);

  const fetchEvents = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id, 
          name, 
          start_date, 
          end_date, 
          status
        `)
        .eq('host_id', user.id);

      if (error) throw error;

      if (data) {
        // In a real app, you would join with the venues table and count event_vendors
        // Here, we'll add mock data for demonstration
        const eventsWithCounts = data.map(event => ({
          ...event,
          venue_name: event.venue_id ? 'Sample Venue' : 'No Venue Selected',
          vendor_count: Math.floor(Math.random() * 10)
        }));

        setEvents(eventsWithCounts);
        setFilteredEvents(eventsWithCounts);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Failed to load events',
        description: 'Could not fetch your events. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.name.toLowerCase().includes(term) ||
          (event.venue_name && event.venue_name.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'planning':
        return <Settings className="h-4 w-4 text-purple-500" />;
      case 'booked':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'live':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <CalendarX className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">{getStatusIcon(status)} Draft</Badge>;
      case 'planning':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">{getStatusIcon(status)} Planning</Badge>;
      case 'booked':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">{getStatusIcon(status)} Booked</Badge>;
      case 'live':
        return <Badge className="bg-green-100 text-green-800 border-green-200">{getStatusIcon(status)} Live</Badge>;
      case 'complete':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{getStatusIcon(status)} Complete</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">{getStatusIcon(status)} Cancelled</Badge>;
      default:
        return <Badge variant="outline">{getStatusIcon(status)} Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <HostPanelLayout>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Events</h1>
            <p className="text-gray-500">Manage your events and bookings</p>
          </div>
          <Button 
            onClick={() => navigate('/host/events/new')}
            className="mt-4 md:mt-0"
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            Create New Event
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Events Overview</CardTitle>
            <CardDescription>
              View and manage all your events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sort By</SelectLabel>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <Table>
                <TableCaption>A list of your events</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Event Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vendors</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow 
                      key={event.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/host/events/${event.id}`)}
                    >
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{formatDate(event.start_date)}</TableCell>
                      <TableCell>{event.venue_name || 'No Venue'}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>{event.vendor_count || 0}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/host/events/${event.id}`);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <div className="flex justify-center mb-4">
                  <Calendar className="h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium mb-1">No events found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? "No events match your current filter settings."
                    : "You haven't created any events yet."}
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    if (events.length === 0) {
                      navigate('/host/events/new');
                    }
                  }}
                >
                  {searchTerm || statusFilter !== 'all'
                    ? "Clear Filters"
                    : "Create Your First Event"}
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-6">
            <p className="text-sm text-gray-500">
              {filteredEvents.length} event{filteredEvents.length !== 1 && 's'} found
            </p>
          </CardFooter>
        </Card>
      </div>
    </HostPanelLayout>
  );
}
