
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, CheckCircle2, XCircle, Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import VendorPanelLayout from '@/components/layouts/VendorPanelLayout';

interface BookingRequest {
  id: string;
  event_id: string;
  event_name: string;
  host_name: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'accepted' | 'declined';
  invitation_date: string;
  fee: number | null;
  venue_name?: string;
}

export default function VendorBookingsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [responseType, setResponseType] = useState<'accept' | 'decline' | null>(null);

  useEffect(() => {
    if (user) {
      fetchBookingRequests();
    }
  }, [user]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredRequests(bookingRequests);
    } else {
      setFilteredRequests(bookingRequests.filter(request => request.status === filter));
    }
  }, [filter, bookingRequests]);

  useEffect(() => {
    if (search.trim() === '') {
      if (filter === 'all') {
        setFilteredRequests(bookingRequests);
      } else {
        setFilteredRequests(bookingRequests.filter(request => request.status === filter));
      }
    } else {
      const searchLower = search.toLowerCase();
      const filtered = bookingRequests.filter(
        request =>
          (filter === 'all' || request.status === filter) &&
          (request.event_name.toLowerCase().includes(searchLower) ||
           request.host_name.toLowerCase().includes(searchLower) ||
           (request.venue_name && request.venue_name.toLowerCase().includes(searchLower)))
      );
      setFilteredRequests(filtered);
    }
  }, [search, bookingRequests, filter]);

  const fetchBookingRequests = async () => {
    setIsLoading(true);
    try {
      // First, get the vendor profile ID
      const { data: vendorProfile, error: vendorError } = await supabase
        .from('vendor_profiles')
        .select('id')
        .eq('user_id', user!.id)
        .single();

      if (vendorError) throw vendorError;

      if (!vendorProfile) {
        toast({
          title: "Vendor profile not found",
          description: "Please complete your vendor profile setup.",
          variant: "destructive",
        });
        return;
      }

      // Then get all booking requests for this vendor
      const { data, error } = await supabase
        .from('event_vendors')
        .select(`
          id,
          event_id,
          status,
          invitation_date,
          response_date,
          fee,
          events (
            name,
            host_id,
            start_date,
            end_date,
            venue_id
          )
        `)
        .eq('vendor_id', vendorProfile.id);

      if (error) throw error;

      if (data) {
        // Transform the data and add mock host names for now
        // In a real app, you would join with host_profiles table
        const requests: BookingRequest[] = await Promise.all(data.map(async (item) => {
          // Get host name from the host_id in auth.users
          // This is simplified and would normally involve proper joins
          let hostName = "Event Host";
          
          // For a real application, get the host info from the database
          // const { data: hostData } = await supabase
          //   .from('host_profiles')
          //   .select('contact_name, company_name')
          //   .eq('user_id', item.events.host_id)
          //   .single();
          
          // if (hostData) {
          //   hostName = hostData.contact_name || hostData.company_name || "Event Host";
          // }

          return {
            id: item.id,
            event_id: item.event_id,
            event_name: item.events.name,
            host_name: hostName,
            start_date: item.events.start_date,
            end_date: item.events.end_date,
            status: item.status,
            invitation_date: item.invitation_date,
            fee: item.fee,
            venue_name: "Venue Name" // Would come from a join with venues table
          };
        }));

        setBookingRequests(requests);
      }
    } catch (error) {
      console.error('Error fetching booking requests:', error);
      toast({
        title: 'Failed to load booking requests',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowDetails = (request: BookingRequest) => {
    setSelectedRequest(request);
    setShowDetailsDialog(true);
  };

  const handleRespond = (request: BookingRequest, type: 'accept' | 'decline') => {
    setSelectedRequest(request);
    setResponseType(type);
    setShowResponseDialog(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedRequest || !responseType) return;

    try {
      const now = new Date().toISOString();
      const updateData: any = {
        status: responseType,
        response_date: now,
      };

      if (responseType === 'decline' && declineReason.trim()) {
        updateData.decline_reason = declineReason;
      }

      const { error } = await supabase
        .from('event_vendors')
        .update(updateData)
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast({
        title: `Booking ${responseType === 'accept' ? 'accepted' : 'declined'}`,
        description: responseType === 'accept' 
          ? 'You have been added to the event.'
          : 'The host has been notified of your decision.',
      });

      // Update local state
      setBookingRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: responseType } 
            : req
        )
      );

      setShowResponseDialog(false);
      setDeclineReason('');
      setResponseType(null);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: 'Failed to update booking status',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" /> Accepted</Badge>;
      case 'declined':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Declined</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="border-amber-500 text-amber-500"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
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
    <VendorPanelLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Booking Requests</h1>
            <p className="text-gray-500">Manage event invitations and bookings</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search events or hosts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col md:flex-row justify-between p-4 rounded-lg border">
                  <div className="md:flex-1">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="md:w-48 mt-2 md:mt-0 md:text-right">
                    <Skeleton className="h-5 w-20 ml-auto" />
                  </div>
                  <div className="flex mt-3 md:mt-0 space-x-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="p-4">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="md:flex-1">
                      <h3 className="font-semibold text-lg">{request.event_name}</h3>
                      <p className="text-gray-500 text-sm">Hosted by {request.host_name}</p>
                      <div className="flex items-center mt-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{formatDate(request.start_date)} - {formatDate(request.end_date)}</span>
                      </div>
                    </div>
                    <div className="md:w-48 mt-2 md:mt-0 md:text-right">
                      {getStatusBadge(request.status)}
                      <p className="text-xs text-gray-500 mt-1">
                        Invited {formatDate(request.invitation_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShowDetails(request)}
                    >
                      <Info className="h-4 w-4 mr-2" /> Details
                    </Button>
                    
                    {request.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleRespond(request, 'decline')}
                        >
                          <XCircle className="h-4 w-4 mr-2" /> Decline
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-500 hover:bg-green-50"
                          onClick={() => handleRespond(request, 'accept')}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" /> Accept
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <h3 className="font-medium text-lg text-gray-900 mb-2">No booking requests found</h3>
              <p className="text-gray-500 mb-6">
                {filter !== 'all'
                  ? `You don't have any ${filter} booking requests at the moment.`
                  : search
                  ? `No results found for "${search}".`
                  : "You haven't received any booking requests yet."}
              </p>
            </div>
          )}
        </div>

        {/* Event Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
              <DialogDescription>
                Information about the event booking request
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4 py-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedRequest.event_name}</h3>
                  <p className="text-gray-500">Hosted by {selectedRequest.host_name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Request Date</Label>
                    <div className="mt-1">{formatDate(selectedRequest.invitation_date)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Event Start</Label>
                    <div className="mt-1">{formatDate(selectedRequest.start_date)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Event End</Label>
                    <div className="mt-1">{formatDate(selectedRequest.end_date)}</div>
                  </div>
                  {selectedRequest.fee && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Offered Fee</Label>
                      <div className="mt-1">R {selectedRequest.fee.toLocaleString()}</div>
                    </div>
                  )}
                  {selectedRequest.venue_name && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Venue</Label>
                      <div className="mt-1">{selectedRequest.venue_name}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              {selectedRequest && selectedRequest.status === 'pending' && (
                <div className="flex w-full justify-between">
                  <Button 
                    variant="outline" 
                    className="border-red-500 text-red-500"
                    onClick={() => {
                      setShowDetailsDialog(false);
                      handleRespond(selectedRequest, 'decline');
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Decline
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowDetailsDialog(false);
                      handleRespond(selectedRequest, 'accept');
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Accept
                  </Button>
                </div>
              )}
              {(selectedRequest && selectedRequest.status !== 'pending') && (
                <Button onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Response Dialog */}
        <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {responseType === 'accept' ? 'Accept Booking' : 'Decline Booking'}
              </DialogTitle>
              <DialogDescription>
                {responseType === 'accept'
                  ? 'Confirm that you wish to accept this booking request.'
                  : 'Please provide a reason for declining this request.'}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedRequest && (
                <div className="mb-4">
                  <p className="font-medium">{selectedRequest.event_name}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedRequest.start_date)} - {formatDate(selectedRequest.end_date)}
                  </p>
                </div>
              )}
              
              {responseType === 'decline' && (
                <div>
                  <Label htmlFor="decline-reason">Reason (optional)</Label>
                  <Textarea
                    id="decline-reason"
                    placeholder="Provide a reason for declining"
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResponseDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitResponse}
                variant={responseType === 'decline' ? 'destructive' : 'default'}
              >
                {responseType === 'accept' ? 'Accept Booking' : 'Decline Booking'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </VendorPanelLayout>
  );
}
