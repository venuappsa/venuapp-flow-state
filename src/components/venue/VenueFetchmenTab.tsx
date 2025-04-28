
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { 
  Calendar, 
  Users, 
  Building,
  Truck,
  Calculator,
  CreditCard,
  ArrowRight,
  CheckCircle
} from "lucide-react";

interface VenueFetchmenTabProps {
  venueData: any;
}

export default function VenueFetchmenTab({ venueData }: VenueFetchmenTabProps) {
  const [activeTab, setActiveTab] = useState("requirements");
  const [eventSize, setEventSize] = useState(venueData.capacity || 250);
  const [floorArea, setFloorArea] = useState(1000);
  const [avgOrdersPerHour, setAvgOrdersPerHour] = useState(50);
  const [hoursOfOperation, setHoursOfOperation] = useState(8);
  
  // Calculate fetchmen requirements
  const calculateFetchmenCount = () => {
    // Base calculation
    const baseCount = Math.ceil(eventSize / 75); // 1 fetchman per 75 attendees
    
    // Adjust for floor area
    const areaFactor = floorArea > 2000 ? 1.5 : floorArea > 1000 ? 1.2 : 1;
    
    // Adjust for order volume
    const ordersFactor = avgOrdersPerHour > 75 ? 1.5 : avgOrdersPerHour > 50 ? 1.25 : 1;
    
    // Final calculation
    return Math.max(2, Math.ceil(baseCount * areaFactor * ordersFactor));
  };
  
  const fetchmenCount = calculateFetchmenCount();
  const hourlyRate = 150; // R150 per hour per fetchman
  const totalCost = fetchmenCount * hourlyRate * hoursOfOperation;
  
  const handleRequestFetchmen = () => {
    toast({
      title: "Request Submitted",
      description: `Your request for ${fetchmenCount} fetchmen has been submitted.`,
    });
  };
  
  // Mock scheduled fetchmen
  const scheduledFetchmen = [
    {
      id: "f1",
      eventName: "Weekend Market",
      date: "2025-05-15",
      time: "09:00 - 17:00",
      fetchmenCount: 4,
      status: "confirmed"
    },
    {
      id: "f2",
      eventName: "Music Festival",
      date: "2025-05-22",
      time: "18:00 - 23:00",
      fetchmenCount: 8,
      status: "pending"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold">Fetchmen Management</h2>
          <p className="text-sm text-gray-500">
            Plan and manage fetchmen for {venueData.name}
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requirements" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h3 className="font-medium mb-6">Calculate Fetchmen Requirements</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Expected Venue Capacity</label>
                      <span className="text-sm">{eventSize} people</span>
                    </div>
                    <Slider
                      value={[eventSize]}
                      min={50}
                      max={1000}
                      step={10}
                      onValueChange={(value) => setEventSize(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Floor Area (m²)</label>
                      <span className="text-sm">{floorArea} m²</span>
                    </div>
                    <Slider
                      value={[floorArea]}
                      min={100}
                      max={5000}
                      step={100}
                      onValueChange={(value) => setFloorArea(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Average Orders per Hour</label>
                      <span className="text-sm">{avgOrdersPerHour} orders</span>
                    </div>
                    <Slider
                      value={[avgOrdersPerHour]}
                      min={10}
                      max={150}
                      step={5}
                      onValueChange={(value) => setAvgOrdersPerHour(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Hours of Operation</label>
                      <span className="text-sm">{hoursOfOperation} hours</span>
                    </div>
                    <Slider
                      value={[hoursOfOperation]}
                      min={1}
                      max={24}
                      step={1}
                      onValueChange={(value) => setHoursOfOperation(value[0])}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Requirements Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-start gap-3">
                        <div className="bg-venu-orange/10 p-2 rounded-full mt-0.5">
                          <Users className="h-5 w-5 text-venu-orange" />
                        </div>
                        <div>
                          <p className="font-medium">Capacity</p>
                          <p className="text-sm text-gray-500">{eventSize} people</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-full mt-0.5">
                          <Building className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Floor Area</p>
                          <p className="text-sm text-gray-500">{floorArea} m²</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-50 p-2 rounded-full mt-0.5">
                          <Calendar className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Duration</p>
                          <p className="text-sm text-gray-500">{hoursOfOperation} hours</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-3 mt-3 border-t">
                      <div className="flex justify-between items-center">
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-50 p-2 rounded-full mt-0.5">
                            <Truck className="h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <p className="font-medium">Recommended Fetchmen</p>
                            <p className="text-sm text-gray-500">{fetchmenCount} fetchmen required</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Cost Estimate</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{fetchmenCount} Fetchmen</span>
                      <span>R {fetchmenCount * hourlyRate} / hr</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{hoursOfOperation} Hours</span>
                      <span>× {hoursOfOperation}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t flex justify-between font-medium">
                      <span>Total Cost</span>
                      <span>R {totalCost}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" onClick={handleRequestFetchmen}>
                    <Truck className="h-4 w-4 mr-2" />
                    Request Fetchmen
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scheduledFetchmen.map(booking => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{booking.eventName}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          <span>{new Date(booking.date).toLocaleDateString("en-ZA", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="mx-1">•</span>
                          <span>{booking.time}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4 text-sm">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{booking.fetchmenCount} fetchmen assigned</span>
                    </div>
                    
                    <div className="pt-3 mt-3 border-t flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Total Cost: <span className="font-medium">R {booking.fetchmenCount * hourlyRate * 8}</span>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="border-dashed">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-6">
                    <Truck className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium">Schedule More Fetchmen</h3>
                    <p className="text-gray-500 text-center my-2">
                      Need fetchmen for another event at this venue?
                    </p>
                    <Button className="mt-2" onClick={handleRequestFetchmen}>
                      Schedule Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="bg-green-50 border border-green-100 rounded-md p-4 mb-6 flex">
                <div className="bg-green-100 p-2 rounded-full mr-3 h-fit">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">Excellent Service Record</h3>
                  <p className="text-sm text-green-700 mt-1">
                    This venue has maintained a perfect 5-star rating for fetchman service over the past 3 months.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border rounded-md p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Wine Festival</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        <span>April 15, 2025</span>
                        <span className="mx-1">•</span>
                        <span>10:00 - 18:00</span>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                      Completed
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Fetchmen</p>
                      <p className="font-medium">6 assigned</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Orders</p>
                      <p className="font-medium">412 orders</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Average Time</p>
                      <p className="font-medium">8 min / order</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 mt-3 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">R 7,200</span> final cost
                    </div>
                    <Button variant="outline" size="sm">View Report</Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Summer Market</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        <span>March 28, 2025</span>
                        <span className="mx-1">•</span>
                        <span>09:00 - 16:00</span>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                      Completed
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Fetchmen</p>
                      <p className="font-medium">4 assigned</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Orders</p>
                      <p className="font-medium">287 orders</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Average Time</p>
                      <p className="font-medium">7 min / order</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 mt-3 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">R 4,200</span> final cost
                    </div>
                    <Button variant="outline" size="sm">View Report</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
