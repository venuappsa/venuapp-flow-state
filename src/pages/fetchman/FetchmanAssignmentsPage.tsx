
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useFetchmanProfile } from "@/hooks/useFetchmanProfile";
import { useFetchmanAssignments } from "@/hooks/useFetchmanAssignments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Download, 
  FileText, 
  Info, 
  Layers, 
  MapPin,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export default function FetchmanAssignmentsPage() {
  const { user } = useUser();
  const { profile, isLoading: profileLoading } = useFetchmanProfile();
  const { data: assignments, isLoading: assignmentsLoading, refetch } = 
    useFetchmanAssignments(profile?.id);
  
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  
  // Filter assignments by status
  const upcomingAssignments = assignments?.filter(a => a.status === 'upcoming') || [];
  const activeAssignments = assignments?.filter(a => a.status === 'active') || [];
  const completedAssignments = assignments?.filter(a => a.status === 'completed') || [];
  
  const getEntityTypeIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'vendor':
        return <Layers className="h-4 w-4" />;
      case 'host':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return "bg-blue-100 text-blue-800";
      case 'active':
        return "bg-green-100 text-green-800";
      case 'completed':
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const handleRefresh = async () => {
    refetch();
  };
  
  const viewAssignmentDetails = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Assignments</h1>
          <p className="text-gray-500">View and manage your assignments</p>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      {profileLoading ? (
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </CardContent>
        </Card>
      ) : profile ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming
              {upcomingAssignments.length > 0 && (
                <Badge className="ml-2 bg-blue-100 text-blue-800">
                  {upcomingAssignments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">
              Active
              {activeAssignments.length > 0 && (
                <Badge className="ml-2 bg-green-100 text-green-800">
                  {activeAssignments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              {completedAssignments.length > 0 && (
                <Badge className="ml-2">{completedAssignments.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          {/* Upcoming Assignments */}
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Assignments</CardTitle>
                <CardDescription>
                  Assignments scheduled for future dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assignmentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="border rounded-md p-4 space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/6" />
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : upcomingAssignments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAssignments.map((assignment) => (
                      <div key={assignment.id} className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getEntityTypeIcon(assignment.entity_type)}
                              <span className="font-medium capitalize">
                                {assignment.entity_type} Assignment
                              </span>
                              <Badge className={getStatusColor(assignment.status)}>
                                {assignment.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Clock className="h-3 w-3" />
                              <span>
                                {format(new Date(assignment.start_date), 'PPP')} - {format(new Date(assignment.end_date), 'PPP')}
                              </span>
                            </div>
                            {assignment.notes && (
                              <p className="text-sm text-gray-600 mt-1">{assignment.notes}</p>
                            )}
                          </div>
                          <div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => viewAssignmentDetails(assignment)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You have no upcoming assignments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Active Assignments */}
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Assignments</CardTitle>
                <CardDescription>
                  Currently active assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assignmentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="border rounded-md p-4 space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/6" />
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : activeAssignments.length > 0 ? (
                  <div className="space-y-4">
                    {activeAssignments.map((assignment) => (
                      <div key={assignment.id} className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getEntityTypeIcon(assignment.entity_type)}
                              <span className="font-medium capitalize">
                                {assignment.entity_type} Assignment
                              </span>
                              <Badge className={getStatusColor(assignment.status)}>
                                {assignment.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Clock className="h-3 w-3" />
                              <span>
                                {format(new Date(assignment.start_date), 'PPP')} - {format(new Date(assignment.end_date), 'PPP')}
                              </span>
                            </div>
                            {assignment.notes && (
                              <p className="text-sm text-gray-600 mt-1">{assignment.notes}</p>
                            )}
                          </div>
                          <div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => viewAssignmentDetails(assignment)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You have no active assignments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Completed Assignments */}
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Assignments</CardTitle>
                <CardDescription>
                  Your history of completed assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assignmentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border rounded-md p-4 space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-4 w-1/6" />
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : completedAssignments.length > 0 ? (
                  <div className="space-y-4">
                    {completedAssignments.map((assignment) => (
                      <div key={assignment.id} className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getEntityTypeIcon(assignment.entity_type)}
                              <span className="font-medium capitalize">
                                {assignment.entity_type} Assignment
                              </span>
                              <Badge className={getStatusColor(assignment.status)}>
                                {assignment.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Clock className="h-3 w-3" />
                              <span>
                                {format(new Date(assignment.start_date), 'PPP')} - {format(new Date(assignment.end_date), 'PPP')}
                              </span>
                            </div>
                            {assignment.notes && (
                              <p className="text-sm text-gray-600 mt-1">{assignment.notes}</p>
                            )}
                          </div>
                          <div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => viewAssignmentDetails(assignment)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You have no completed assignments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-gray-500 mb-4">You need to create a fetchman profile first.</p>
            <Button onClick={() => window.location.href = '/fetchman/onboarding'}>
              Create Fetchman Profile
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Assignment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-xl">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <DialogTitle>Assignment Details</DialogTitle>
                <DialogDescription>
                  Complete information about this assignment
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Assignment Type</p>
                    <p className="capitalize">{selectedAssignment.entity_type}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge className={getStatusColor(selectedAssignment.status)}>
                      {selectedAssignment.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p>{format(new Date(selectedAssignment.start_date), 'PPP p')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">End Date</p>
                    <p>{format(new Date(selectedAssignment.end_date), 'PPP p')}</p>
                  </div>
                </div>
                
                {selectedAssignment.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedAssignment.notes}</p>
                  </div>
                )}
                
                {selectedAssignment.brief_url && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Brief Document</p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(selectedAssignment.brief_url, '_blank')}
                      className="mt-2"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Brief
                    </Button>
                  </div>
                )}
                
                {selectedAssignment.created_at && (
                  <div className="text-xs text-gray-500 border-t pt-4 mt-4">
                    <p>Assignment created on {format(new Date(selectedAssignment.created_at), 'PPP')}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
