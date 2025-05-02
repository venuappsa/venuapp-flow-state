
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Check, X, User, Plus, Phone, MessageSquare } from "lucide-react";

// Create a basic layout similar to the other role layouts
const FetchmanLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
            alt="Venuapp Logo"
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-xl font-semibold text-venu-orange">Venuapp Fetchman</h1>
        </div>
        <div className="flex items-center gap-4">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <Calendar className="h-5 w-5 text-gray-500" />
          <div className="h-8 w-8 rounded-full bg-venu-orange text-white flex items-center justify-center">
            FB
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">{children}</main>
    </div>
  );
};

export default function FetchmanAssignmentsPage() {
  // Mock data for assignments
  const assignments = [
    {
      id: "1",
      title: "Wedding Cake Delivery",
      vendor: "Sweet Delights Bakery",
      event: "Johnson Wedding",
      pickupAddress: "123 Baker Street, Sandton",
      deliveryAddress: "Grand Hyatt Hotel, Rosebank",
      pickupTime: "2025-05-15T13:00:00Z",
      deliveryTime: "2025-05-15T15:00:00Z",
      status: "pending",
      customerName: "Emily Johnson",
      customerPhone: "+27 82 123 4567",
      paymentAmount: 150
    },
    {
      id: "2",
      title: "Audio Equipment Transport",
      vendor: "Sound Masters",
      event: "Corporate Conference",
      pickupAddress: "45 Tech Avenue, Midrand",
      deliveryAddress: "Sandton Convention Centre",
      pickupTime: "2025-05-16T08:00:00Z",
      deliveryTime: "2025-05-16T10:00:00Z",
      status: "accepted",
      customerName: "David Brown",
      customerPhone: "+27 83 765 4321",
      paymentAmount: 200
    },
    {
      id: "3",
      title: "Floral Arrangements Delivery",
      vendor: "Bloom Floral Design",
      event: "Smith Anniversary",
      pickupAddress: "78 Garden Road, Fourways",
      deliveryAddress: "Thaba Eco Hotel, Johannesburg South",
      pickupTime: "2025-05-17T09:00:00Z",
      deliveryTime: "2025-05-17T11:00:00Z",
      status: "completed",
      customerName: "Anna Smith",
      customerPhone: "+27 84 987 6543",
      paymentAmount: 120
    },
    {
      id: "4",
      title: "Catering Equipment Return",
      vendor: "Gourmet Catering Co.",
      event: "Wilson Birthday",
      pickupAddress: "Waterfall Estate Clubhouse",
      deliveryAddress: "10 Culinary Street, Bryanston",
      pickupTime: "2025-05-18T21:00:00Z",
      deliveryTime: "2025-05-18T22:30:00Z",
      status: "pending",
      customerName: "John Wilson",
      customerPhone: "+27 82 345 6789",
      paymentAmount: 180
    }
  ];

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-ZA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-blue-100 text-blue-800">Accepted</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <FetchmanLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold mb-2">Delivery Assignments</h1>
          <p className="text-gray-500">Manage your pickup and delivery tasks</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex space-x-2">
            <Button variant="outline" className="text-yellow-700 border-yellow-200 bg-yellow-50">
              Pending ({assignments.filter(a => a.status === "pending").length})
            </Button>
            <Button variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
              Accepted ({assignments.filter(a => a.status === "accepted").length})
            </Button>
            <Button variant="outline" className="text-green-700 border-green-200 bg-green-50">
              Completed ({assignments.filter(a => a.status === "completed").length})
            </Button>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Find New Tasks
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>
                    {assignment.vendor} • {assignment.event}
                  </CardDescription>
                </div>
                {getStatusBadge(assignment.status)}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-gray-500">Pickup</div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{assignment.pickupAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{formatDateTime(assignment.pickupTime)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-gray-500">Delivery</div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{assignment.deliveryAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{formatDateTime(assignment.deliveryTime)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-gray-500">Contact Person</div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{assignment.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{assignment.customerPhone}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-gray-500">Payment</div>
                      <div className="text-xl font-bold">R {assignment.paymentAmount}</div>
                      
                      {assignment.status === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <Button className="flex-1">
                            <Check className="mr-2 h-4 w-4" />
                            Accept
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <X className="mr-2 h-4 w-4" />
                            Decline
                          </Button>
                        </div>
                      )}
                      
                      {assignment.status === "accepted" && (
                        <div className="flex gap-2 mt-2">
                          <Button className="flex-1">
                            Mark Completed
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Contact
                          </Button>
                        </div>
                      )}
                      
                      {assignment.status === "completed" && (
                        <div className="mt-2">
                          <Badge className="bg-green-100 text-green-800 py-1">
                            <Check className="mr-2 h-3 w-3" />
                            Completed on {new Date().toLocaleDateString()}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </FetchmanLayout>
  );
}
