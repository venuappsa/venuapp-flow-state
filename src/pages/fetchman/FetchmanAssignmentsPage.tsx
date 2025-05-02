
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, User } from "lucide-react";
import FetchmanPanelLayout from "@/components/layouts/FetchmanPanelLayout";

export default function FetchmanAssignmentsPage() {
  const currentAssignments = [
    {
      id: "1",
      orderNumber: "F8742",
      customer: "Sarah Johnson",
      location: "Sandton City Mall",
      pickupTime: "13:30",
      status: "in-progress"
    },
    {
      id: "2",
      orderNumber: "F8743",
      customer: "Michael Brown",
      location: "Rosebank Mall",
      pickupTime: "14:15",
      status: "pending"
    },
    {
      id: "3",
      orderNumber: "F8744",
      customer: "Emma Davis",
      location: "Hyde Park Corner",
      pickupTime: "15:00",
      status: "pending"
    }
  ];

  const availableAssignments = [
    {
      id: "4",
      orderNumber: "F8745",
      customer: "David Wilson",
      location: "Mall of Africa",
      pickupTime: "16:30",
      earnings: 120
    },
    {
      id: "5",
      orderNumber: "F8746",
      customer: "Olivia Martin",
      location: "Menlyn Park",
      pickupTime: "17:15",
      earnings: 150
    }
  ];

  return (
    <FetchmanPanelLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold mb-2">Assignments</h1>
          <p className="text-gray-500">Manage your delivery assignments</p>
        </div>

        <Tabs defaultValue="current">
          <TabsList className="mb-6">
            <TabsTrigger value="current">Current Assignments</TabsTrigger>
            <TabsTrigger value="available">Available Assignments</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Order #{assignment.orderNumber}</CardTitle>
                      <Badge 
                        className={assignment.status === "in-progress" ? 
                          "bg-blue-100 text-blue-800" : 
                          "bg-yellow-100 text-yellow-800"}
                      >
                        {assignment.status === "in-progress" ? "In Progress" : "Pending"}
                      </Badge>
                    </div>
                    <CardDescription>{assignment.customer}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Pickup Location</p>
                          <p className="text-sm text-gray-500">{assignment.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Pickup Time</p>
                          <p className="text-sm text-gray-500">{assignment.pickupTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex mt-4">
                        <Button className="w-full">
                          {assignment.status === "in-progress" ? "Mark as Delivered" : "Start Delivery"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="available">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Order #{assignment.orderNumber}</CardTitle>
                    <CardDescription>{assignment.customer}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Pickup Location</p>
                          <p className="text-sm text-gray-500">{assignment.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Pickup Time</p>
                          <p className="text-sm text-gray-500">{assignment.pickupTime}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <User className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Earnings</p>
                          <p className="text-sm text-gray-500">R {assignment.earnings}</p>
                        </div>
                      </div>
                      
                      <div className="flex mt-4">
                        <Button className="w-full">Accept Assignment</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Assignments</CardTitle>
                <CardDescription>Your recently completed deliveries</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-3 px-4">Order</th>
                        <th className="text-left py-3 px-4">Customer</th>
                        <th className="text-left py-3 px-4">Location</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-right py-3 px-4">Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4">#F8735</td>
                        <td className="py-3 px-4">John D.</td>
                        <td className="py-3 px-4">Sandton City Mall</td>
                        <td className="py-3 px-4">May 1, 2025</td>
                        <td className="py-3 px-4 text-right">R 120</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">#F8732</td>
                        <td className="py-3 px-4">Lisa M.</td>
                        <td className="py-3 px-4">Rosebank Mall</td>
                        <td className="py-3 px-4">May 1, 2025</td>
                        <td className="py-3 px-4 text-right">R 85</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">#F8730</td>
                        <td className="py-3 px-4">Robert K.</td>
                        <td className="py-3 px-4">Hyde Park Corner</td>
                        <td className="py-3 px-4">Apr 30, 2025</td>
                        <td className="py-3 px-4 text-right">R 150</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FetchmanPanelLayout>
  );
}
