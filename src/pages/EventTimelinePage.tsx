
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HostPanelLayout from '@/components/layouts/HostPanelLayout';
import EventTimeline, { TimelineMilestone } from '@/components/event/EventTimeline';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function EventTimelinePage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchEventTimeline(eventId);
    }
  }, [eventId]);

  const fetchEventTimeline = async (id: string) => {
    setLoading(true);
    
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - in a real app, this would come from your API
    const mockMilestones: TimelineMilestone[] = [
      {
        id: 'm1',
        type: 'booking-sent',
        date: '2025-03-15T10:30:00',
        description: 'Initial booking request sent to vendor',
        status: 'completed',
      },
      {
        id: 'm2',
        type: 'vendor-accepted',
        date: '2025-03-16T14:22:00',
        description: 'Vendor accepted the booking request with standard rates',
        status: 'completed',
      },
      {
        id: 'm3',
        type: 'setup-confirmed',
        date: '2025-04-20T09:45:00',
        description: 'Vendor confirmed setup details and requirements',
        status: 'current',
      },
      {
        id: 'm4',
        type: 'event-live',
        date: '2025-05-15T08:00:00',
        description: 'Event scheduled to go live',
        status: 'pending',
      },
    ];
    
    setMilestones(mockMilestones);
    setLoading(false);
  };

  const handleRefresh = () => {
    if (eventId) {
      fetchEventTimeline(eventId);
      toast({
        title: 'Timeline refreshed',
        description: 'The latest event timeline information has been loaded.',
      });
    }
  };

  if (loading) {
    return (
      <HostPanelLayout>
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4 mt-2" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </HostPanelLayout>
    );
  }

  return (
    <HostPanelLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Event Timeline</h1>
            <p className="text-gray-500">Track the progress of your event</p>
          </div>
          <div className="flex space-x-2 mt-2 md:mt-0">
            <Button variant="outline" asChild>
              <a href={`/host/events/${eventId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Event
              </a>
            </Button>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <EventTimeline eventId={eventId || ''} milestones={milestones} />
      </div>
    </HostPanelLayout>
  );
}
