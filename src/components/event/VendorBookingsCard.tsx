
import { useState, useEffect } from 'react';
import { PlusCircle, UserCheck, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VendorType {
  id: string;
  name: string;
  business: string;
  category: string;
  status?: 'pending' | 'accepted' | 'declined';
}

interface VendorBookingsCardProps {
  eventId: string;
}

const VendorBookingsCard = ({ eventId }: VendorBookingsCardProps) => {
  const [vendors, setVendors] = useState<VendorType[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<VendorType[]>([]);
  const [search, setSearch] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [bookedVendors, setBookedVendors] = useState<VendorType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch available vendors
  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would fetch actual vendor data from Supabase
        // For now, we're using mock data
        const mockVendors: VendorType[] = [
          {
            id: 'v1',
            name: 'Catering Co.',
            business: 'Food and Catering',
            category: 'catering',
          },
          {
            id: 'v2',
            name: 'Sound Systems',
            business: 'Audio Equipment',
            category: 'audio',
          },
          {
            id: 'v3',
            name: 'Party Lights',
            business: 'Lighting Solutions',
            category: 'lighting',
          },
          {
            id: 'v4',
            name: 'Event Photos',
            business: 'Photography',
            category: 'photography',
          },
        ];
        setVendors(mockVendors);
        setFilteredVendors(mockVendors);

        // Fetch already booked vendors for this event
        const { data, error } = await supabase
          .from('event_vendors')
          .select(`
            vendor_id,
            status,
            vendor_profiles (id, company_name, contact_name)
          `)
          .eq('event_id', eventId);

        if (error) throw error;

        if (data) {
          const bookings = data.map((booking: any) => ({
            id: booking.vendor_id,
            name: booking.vendor_profiles.contact_name || 'Unknown',
            business: booking.vendor_profiles.company_name || 'Unknown Business',
            category: 'unknown', // You would need to fetch the actual category
            status: booking.status,
          }));
          
          setBookedVendors(bookings);
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
        toast({
          title: 'Failed to load vendors',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [eventId]);

  // Filter vendors based on search input
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredVendors(vendors);
    } else {
      const filtered = vendors.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(search.toLowerCase()) ||
          vendor.business.toLowerCase().includes(search.toLowerCase()) ||
          vendor.category.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredVendors(filtered);
    }
  }, [search, vendors]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSelectVendor = (vendorId: string) => {
    setSelectedVendors((prevSelected) => {
      if (prevSelected.includes(vendorId)) {
        return prevSelected.filter((id) => id !== vendorId);
      } else {
        return [...prevSelected, vendorId];
      }
    });
  };

  const handleInviteVendors = async () => {
    if (selectedVendors.length === 0) {
      toast({
        title: 'No vendors selected',
        description: 'Please select at least one vendor to invite.',
        variant: 'default',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Insert event_vendor records for each selected vendor
      const now = new Date().toISOString();
      const invitations = selectedVendors.map((vendorId) => ({
        event_id: eventId,
        vendor_id: vendorId,
        status: 'pending',
        invitation_date: now,
      }));

      const { error } = await supabase.from('event_vendors').insert(invitations);

      if (error) throw error;

      toast({
        title: 'Invitations sent successfully',
        description: `${selectedVendors.length} vendor${selectedVendors.length > 1 ? 's' : ''} invited to your event.`,
      });

      // Update local state to reflect the invitations
      const newlyInvitedVendors = vendors.filter((vendor) =>
        selectedVendors.includes(vendor.id)
      ).map(vendor => ({
        ...vendor,
        status: 'pending' as const
      }));

      setBookedVendors((prev) => [...prev, ...newlyInvitedVendors]);
      setSelectedVendors([]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error inviting vendors:', error);
      toast({
        title: 'Failed to invite vendors',
        description: 'An error occurred while sending invitations.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-500 hover:bg-green-600"><UserCheck className="h-3 w-3 mr-1" /> Accepted</Badge>;
      case 'declined':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Declined</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="border-amber-500 text-amber-500"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Vendor Bookings</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" /> Invite Vendors
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Invite Vendors to Your Event</DialogTitle>
                <DialogDescription>
                  Select vendors you'd like to invite to participate in your event.
                </DialogDescription>
              </DialogHeader>
              <div className="mb-4">
                <Input
                  placeholder="Search vendors..."
                  value={search}
                  onChange={handleSearch}
                  className="mb-4"
                />
                <div className="max-h-[300px] overflow-y-auto border rounded-md">
                  {filteredVendors.length > 0 ? (
                    filteredVendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`vendor-${vendor.id}`}
                            checked={selectedVendors.includes(vendor.id)}
                            onCheckedChange={() => handleSelectVendor(vendor.id)}
                          />
                          <div>
                            <Label
                              htmlFor={`vendor-${vendor.id}`}
                              className="font-medium"
                            >
                              {vendor.name}
                            </Label>
                            <p className="text-sm text-gray-500">{vendor.business}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {vendor.category}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No vendors found matching your search.
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  onClick={handleInviteVendors}
                  disabled={selectedVendors.length === 0 || isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Invitations'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Invite and manage vendors for this event
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookedVendors.length > 0 ? (
            bookedVendors.map((vendor) => (
              <div key={vendor.id} className="flex justify-between items-center p-2 border rounded-md">
                <div>
                  <p className="font-medium">{vendor.name}</p>
                  <p className="text-sm text-gray-500">{vendor.business}</p>
                </div>
                {getStatusBadge(vendor.status)}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No vendors have been invited yet.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-sm text-gray-500">
          {bookedVendors.length} vendor{bookedVendors.length !== 1 ? 's' : ''} invited to this event
        </p>
      </CardFooter>
    </Card>
  );
};

export default VendorBookingsCard;
