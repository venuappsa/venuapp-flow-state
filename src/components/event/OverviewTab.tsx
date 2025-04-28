
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Store, 
  Wallet, 
  AlertTriangle,
  BarChart,
  FileText,
  Share2,
  ChevronRight,
  Check
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import EventQRCode from "@/components/EventQRCode";
import { calculateFetchmanEstimate } from "@/utils/fetchmanCalculator";

export default function EventOverviewTab({ eventData }: { eventData: any }) {
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-ZA', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };
  
  const handleShare = () => {
    if (!eventData) return;
    
    const shareableLink = `https://venuapp.co.za/events/${eventData.id}`;
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        toast({
          title: "Link copied",
          description: `Shareable link for ${eventData.name} copied to clipboard`,
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: "Error",
          description: "Could not copy link to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  const requiredActions = [
    {
      id: "action-1",
      title: "Complete safety compliance documentation",
      icon: FileText,
      priority: "high"
    },
    {
      id: "action-2",
      title: "Assign event staff roles",
      icon: Users,
      priority: "high"
    },
    {
      id: "action-3",
      title: "Confirm vendor setup times",
      icon: Store,
      priority: "medium"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Venue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-venu-orange mt-0.5 mr-2" />
              <div>
                <div className="font-medium">{eventData.venueName}</div>
                <div className="text-sm text-gray-500">{eventData.location || "Location details not available"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start">
              <Users className="h-5 w-5 text-venu-orange mt-0.5 mr-2" />
              <div>
                <div className="font-medium">{eventData.capacity} people</div>
                <div className="text-sm text-gray-500">{eventData.ticketsSold} tickets sold</div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-2 bg-venu-orange rounded-full" 
                    style={{ width: `${(eventData.ticketsSold / eventData.capacity) * 100}%` }} 
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start">
              <Store className="h-5 w-5 text-venu-orange mt-0.5 mr-2" />
              <div>
                <div className="font-medium">{eventData.vendors || 12} vendors</div>
                <div className="text-sm text-gray-500">{eventData.pendingVendors || 3} pending applications</div>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-sm text-blue-600"
                  onClick={() => toast({
                    title: "Manage Vendors",
                    description: "Switch to the Vendors tab to manage your vendors"
                  })}
                >
                  Manage vendors
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start">
              <Wallet className="h-5 w-5 text-venu-orange mt-0.5 mr-2" />
              <div>
                <div className="font-medium">R {eventData.revenue.toLocaleString()}</div>
                <div className="text-sm text-gray-500">From tickets & vendors</div>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-sm text-blue-600"
                  onClick={() => toast({
                    title: "Financial Details",
                    description: "Switch to the Finances tab for detailed analytics"
                  })}
                >
                  View details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-full">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Basic information about your event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
                  <p>{formatDate(eventData.date)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Start Time</h4>
                  <p>{eventData.startTime || new Date(eventData.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                  <p>{eventData.durationHours || 5} hours</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="text-sm mt-1">
                  {eventData.description || "Join us for an exciting event featuring live music, food vendors, and more. This event promises to be a memorable occasion for all attendees."}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Categories</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(eventData.categories || ["Music", "Food", "Entertainment"]).map((category: string, idx: number) => (
                    <Badge key={idx} variant="outline">{category}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Organizer</h4>
                <p>{eventData.organizer || "Venuapp Host"}</p>
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Event QR Code</h4>
                <EventQRCode eventId={eventData.id} eventName={eventData.name} />
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" className="w-full" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 h-full">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Required Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {requiredActions.map(action => (
                    <li 
                      key={action.id}
                      className={`flex items-center justify-between p-3 rounded-md ${
                        action.priority === 'high' ? 'bg-amber-50 border border-amber-100' : 
                        action.priority === 'medium' ? 'bg-blue-50 border border-blue-100' :
                        'bg-gray-50 border border-gray-100'
                      }`}
                    >
                      <span className="flex items-center">
                        <action.icon className={`h-4 w-4 mr-2 ${
                          action.priority === 'high' ? 'text-amber-500' :
                          action.priority === 'medium' ? 'text-blue-500' :
                          'text-gray-500'
                        }`} />
                        {action.title}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => toast({
                        title: "Action Started",
                        description: `You're now working on: ${action.title}`
                      })}>Complete</Button>
                    </li>
                  ))}
                  
                  <li className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-md">
                    <span className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Setup event registration table
                    </span>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-blue-500" />
                  Quick Analytics
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setAnalyticsExpanded(!analyticsExpanded)}
                >
                  {analyticsExpanded ? "Show Less" : "Show More"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Ticket Sales</span>
                      <span className="font-medium">{((eventData.ticketsSold / eventData.capacity) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${(eventData.ticketsSold / eventData.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Vendor Applications</span>
                      <span className="font-medium">80%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Staff Assignment</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-amber-500 rounded-full w-2/5"></div>
                    </div>
                  </div>
                  
                  {analyticsExpanded && (
                    <>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Fetchman Allocation</span>
                          <span className="font-medium">70%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-purple-500 rounded-full w-[70%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Marketing Reach</span>
                          <span className="font-medium">65%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-pink-500 rounded-full w-[65%]"></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-6">
                        <div className="bg-blue-50 p-3 rounded-md">
                          <h4 className="text-xs text-blue-700 font-medium">Most Popular Tickets</h4>
                          <p className="text-sm font-bold">VIP Access Pass</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-md">
                          <h4 className="text-xs text-green-700 font-medium">Top Vendor Category</h4>
                          <p className="text-sm font-bold">Food & Beverages</p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-md">
                          <h4 className="text-xs text-amber-700 font-medium">Peak Attendance Time</h4>
                          <p className="text-sm font-bold">19:00 - 21:00</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-md">
                          <h4 className="text-xs text-purple-700 font-medium">Projected Revenue</h4>
                          <p className="text-sm font-bold">R {(eventData.revenue * 1.2).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full" onClick={() => toast({
                        title: "Analytics Dashboard",
                        description: "Opening comprehensive analytics dashboard"
                      })}>
                        <BarChart className="h-4 w-4 mr-2" />
                        View Full Analytics
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Fetchmen Required</CardTitle>
          <CardDescription>
            Estimated fetchmen needed for this event: {calculateFetchmanEstimate(eventData.capacity, eventData.vendors || 12)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Based on your event capacity and number of vendors, we recommend {calculateFetchmanEstimate(eventData.capacity, eventData.vendors || 12)} fetchmen for optimal operations.
              </p>
              <Button 
                variant="link" 
                className="h-auto p-0 text-sm text-blue-600"
                onClick={() => toast({
                  title: "Fetchmen Details",
                  description: "Switch to the Fetchmen tab for detailed planning"
                })}
              >
                View detailed fetchmen planning
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <Button onClick={() => toast({
              title: "Fetchmen Requested",
              description: `Request for ${calculateFetchmanEstimate(eventData.capacity, eventData.vendors || 12)} fetchmen has been submitted`
            })}>
              Request Fetchmen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
