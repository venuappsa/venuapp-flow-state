
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle,
  Clock,
  UserCheck,
  Calendar,
  Settings,
  AlertCircle,
  Loader2
} from 'lucide-react';

export interface TimelineMilestone {
  id: string;
  type: 'booking-sent' | 'vendor-accepted' | 'vendor-declined' | 'setup-confirmed' | 'event-live';
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed' | 'current';
}

interface EventTimelineProps {
  eventId: string;
  milestones: TimelineMilestone[];
}

export default function EventTimeline({ eventId, milestones }: EventTimelineProps) {
  // Sort milestones by date
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const getIconForMilestone = (milestone: TimelineMilestone) => {
    switch (milestone.type) {
      case 'booking-sent':
        return <Calendar className="h-6 w-6" />;
      case 'vendor-accepted':
        return <UserCheck className="h-6 w-6" />;
      case 'vendor-declined':
        return <AlertCircle className="h-6 w-6" />;
      case 'setup-confirmed':
        return <Settings className="h-6 w-6" />;
      case 'event-live':
        return <CheckCircle className="h-6 w-6" />;
      default:
        return <Clock className="h-6 w-6" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'current':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="py-4">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-8">
            {sortedMilestones.map((milestone, index) => (
              <div key={milestone.id} className="relative">
                {index < sortedMilestones.length - 1 && (
                  <div
                    className={`absolute left-6 top-12 h-full w-0.5 ${
                      milestone.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
                <div className="flex gap-4">
                  <div className={`p-3 rounded-full ${getStatusColor(milestone.status)}`}>
                    {milestone.status === 'pending' ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      getIconForMilestone(milestone)
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h3 className="font-medium">{getMilestoneTitle(milestone.type)}</h3>
                      <span className="text-sm text-gray-500">
                        {format(new Date(milestone.date), 'MMM d, yyyy - HH:mm')}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getMilestoneTitle(type: string): string {
  switch (type) {
    case 'booking-sent':
      return 'Booking Request Sent';
    case 'vendor-accepted':
      return 'Vendor Accepted Booking';
    case 'vendor-declined':
      return 'Vendor Declined Booking';
    case 'setup-confirmed':
      return 'Event Setup Confirmed';
    case 'event-live':
      return 'Event Going Live';
    default:
      return 'Unknown Milestone';
  }
}
