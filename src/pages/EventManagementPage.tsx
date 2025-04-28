import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import HostHeader from "@/components/HostHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Shield,
  FileText,
  AlertTriangle,
  Share2,
  Settings,
  ChevronLeft,
  Building,
  Tag,
  Copy,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { dummyEvents } from "@/data/hostDummyData";
import { generateEventSalesData } from "@/data/salesData";
import SalesBreakdownDialog from "@/components/SalesBreakdownDialog";
import { Badge } from "@/components/ui/badge";

export default function EventManagementPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: roles = [], isLoading: rolesLoading } = useUserRoles(user?.id);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  
  const [salesDialogOpen, setSalesDialogOpen] = useState(false);
  const [selectedSalesData, setSelectedSalesData] = useState<any>(null);
  
  useEffect(() => {
    // Simulate loading event data
    setTimeout(() => {
      const foundEvent = dummyEvents.find(e => e.id === eventId);
      if (foundEvent) {
        setEvent(foundEvent);
      }
      setLoading(false);
    }, 800);
  }, [eventId]);
  
  const handleBack = () => {
    navigate('/host');
  };
  
  const handleOpenSalesBreakdown = () => {
    if (!event) return;
    const salesData = generateEventSalesData(event.id, event.name, event.revenue);
    setSelectedSalesData(salesData);
    setSalesDialogOpen(true);
  };
  
  const handleShareEvent = () => {
    const eventLink = `https://venuapp.co.za/event/${eventId}`;
    navigator.clipboard.writeText(eventLink).then(
      () => {
        toast({
          title: "Link copied",
          description: `Shareable link for ${event?.name} copied to clipboard`,
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  const handleGenerateQR = () => {
    toast({
      title: "QR Code Generated",
      description: "The event QR code has been generated and can be downloaded",
    });
    // In a real implementation, this would generate and download a QR code
  };

  return (
    <AuthTransitionWrapper 
      requireAuth={true} 
      allowedRoles={["host"]} 
      showFallback={true}
    >
      <div className="min-h-screen bg-gray-50">
        <HostHeader />
        <main className="pt-16 px-4 md:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto py-8">
            {loading ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-10 w-24" />
                </div>
                <Skeleton className="h-12 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Skeleton className="h-48" />
                  <Skeleton className="h-48" />
                  <Skeleton className="h-48" />
                </div>
              </div>
            ) : !event ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">Event not found</h2>
                <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or you don't have permission to view it.</p>
                <Button onClick={handleBack}>Back to Dashboard</Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleBack}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">{event.name}</h1>
                    <Badge className={event.status === "upcoming" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                      {event.status === "upcoming" ? "Upcoming" : "Past"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={handleShareEvent}
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button 
                      size="sm" 
                      className="gap-1"
                      onClick={() => toast({
                        title: "Settings",
                        description: "Event settings panel will be implemented in the next update."
                      })}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-gray-100 grid grid-cols-4 md:grid-cols-8 w-full">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="map">Map</TabsTrigger>
                    <TabsTrigger value="roles">Roles</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                    <TabsTrigger value="emergency">Emergency</TabsTrigger>
                    <TabsTrigger value="promotions">Promotions</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                  
                  {/* Info Tab */}
                  <TabsContent value="info" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-venu-orange" />
                            Event Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Event Name</h3>
                            <p className="font-medium">{event.name}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Date</h3>
                            <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Venue</h3>
                            <p className="font-medium">{event.venueName}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
                            <p className="font-medium">{event.capacity} people</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                            <p className="font-medium capitalize">{event.status}</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Tag className="h-5 w-5 text-venu-orange" />
                            Event Links
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Public Link</h3>
                            <div className="mt-1 flex items-center gap-2">
                              <code className="text-xs bg-gray-100 p-2 rounded flex-1 overflow-x-auto">
                                https://venuapp.co.za/e/{eventId}
                              </code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => {
                                  navigator.clipboard.writeText(`https://venuapp.co.za/e/${eventId}`);
                                  toast({ title: "Copied to clipboard" });
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Vendor Registration Link</h3>
                            <div className="mt-1 flex items-center gap-2">
                              <code className="text-xs bg-gray-100 p-2 rounded flex-1 overflow-x-auto">
                                https://venuapp.co.za/vendor-reg/{eventId}
                              </code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => {
                                  navigator.clipboard.writeText(`https://venuapp.co.za/vendor-reg/${eventId}`);
                                  toast({ title: "Copied to clipboard" });
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Admin Link</h3>
                            <div className="mt-1 flex items-center gap-2">
                              <code className="text-xs bg-gray-100 p-2 rounded flex-1 overflow-x-auto">
                                https://venuapp.co.za/admin-event/{eventId}
                              </code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => {
                                  navigator.clipboard.writeText(`https://venuapp.co.za/admin-event/${eventId}`);
                                  toast({ title: "Copied to clipboard" });
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Button onClick={handleGenerateQR} variant="outline" className="w-full gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-qr-code"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                            Generate QR Code
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-venu-orange" />
                            Attendance
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Tickets Sold</h3>
                            <p className="font-medium">{event.ticketsSold} / {event.capacity}</p>
                            <div className="w-full mt-1 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-venu-orange h-1.5 rounded-full" 
                                style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }} 
                              ></div>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                            <p className="font-medium">R {event.revenue.toLocaleString()}</p>
                          </div>
                          <Button 
                            className="w-full gap-2"
                            onClick={handleOpenSalesBreakdown}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-big"><path d="M3 3v18h18"/><rect width="4" height="7" x="7" y="10" rx="1"/><rect width="4" height="12" x="15" y="5" rx="1"/></svg>
                            View Sales Breakdown
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  {/* Map Tab */}
                  <TabsContent value="map" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-venu-orange" />
                          Venue Location
                        </CardTitle>
                        <CardDescription>
                          Interactive map showing the event venue, parking areas, and vendor locations
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="font-medium mb-2">Map View</h3>
                            <p className="text-gray-500 max-w-md">
                              The interactive map view will be implemented in the next update.
                              This will show the venue location, parking areas, and vendor booth positions.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Role Tab */}
                  <TabsContent value="roles" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-venu-orange" />
                          Role Management
                        </CardTitle>
                        <CardDescription>
                          Manage user roles and permissions for this event
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-xl font-medium text-gray-700 mb-2">Role Management</h3>
                          <p className="text-gray-500 max-w-md mx-auto mb-6">
                            The role management interface will be implemented in the next update.
                            You'll be able to assign admin, vendor, and fetchman roles here.
                          </p>
                          <Button>Add Team Members</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Other tab content would be similar */}
                  <TabsContent value="schedule" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-venu-orange" />
                          Event Schedule
                        </CardTitle>
                        <CardDescription>
                          Manage event timeline, opening hours, and vendor schedules
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-xl font-medium text-gray-700 mb-2">Schedule Management</h3>
                          <p className="text-gray-500 max-w-md mx-auto mb-6">
                            The schedule management interface will be implemented in the next update.
                            You'll be able to set opening times, vendor schedules, and event timelines.
                          </p>
                          <Button>Set Schedule</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="compliance" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-venu-orange" />
                          Compliance Documents
                        </CardTitle>
                        <CardDescription>
                          Manage licenses, permits, and regulatory compliance
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-xl font-medium text-gray-700 mb-2">Compliance Management</h3>
                          <p className="text-gray-500 max-w-md mx-auto mb-6">
                            The compliance documentation interface will be implemented in the next update.
                            You'll be able to upload and manage permits, licenses, and other regulatory documents.
                          </p>
                          <Button>Upload Documents</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="emergency" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-venu-orange" />
                          Emergency Plan
                        </CardTitle>
                        <CardDescription>
                          Manage emergency procedures, contacts, and safety plans
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-xl font-medium text-gray-700 mb-2">Emergency Planning</h3>
                          <p className="text-gray-500 max-w-md mx-auto mb-6">
                            The emergency planning interface will be implemented in the next update.
                            You'll be able to set up emergency contacts, evacuation routes, and safety procedures.
                          </p>
                          <Button>Create Emergency Plan</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="promotions" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-venu-orange"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                          Event Promotions
                        </CardTitle>
                        <CardDescription>
                          Manage marketing, promotions, and discounts
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                          <h3 className="text-xl font-medium text-gray-700 mb-2">Promotions</h3>
                          <p className="text-gray-500 max-w-md mx-auto mb-6">
                            The promotions interface will be implemented in the next update.
                            You'll be able to create discount codes, set up special offers, and manage marketing campaigns.
                          </p>
                          <Button>Create Promotion</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-venu-orange"><path d="M3 3v18h18"/><path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M6 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M12 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
                          Event Analytics
                        </CardTitle>
                        <CardDescription>
                          View detailed statistics and performance metrics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4"><path d="M3 3v18h18"/><path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M6 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M12 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
                          <h3 className="text-xl font-medium text-gray-700 mb-2">Analytics Dashboard</h3>
                          <p className="text-gray-500 max-w-md mx-auto mb-6">
                            The analytics dashboard will be implemented in the next update.
                            You'll be able to view detailed statistics, attendance trends, and revenue metrics.
                          </p>
                          <Button onClick={handleOpenSalesBreakdown}>View Sales Data</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
          
          <SalesBreakdownDialog 
            open={salesDialogOpen} 
            onOpenChange={setSalesDialogOpen} 
            salesData={selectedSalesData} 
          />
        </main>
      </div>
    </AuthTransitionWrapper>
  );
}
