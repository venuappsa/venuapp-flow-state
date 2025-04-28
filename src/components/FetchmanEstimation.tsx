
import { useState, useEffect } from "react";
import { 
  calculateFetchmanEstimate, 
  calculateFetchmanCost,
  generateFetchmanStaffingPlan,
  calculateFetchmanAllocation,
  calculateOvertimeCosts,
  FetchmanAllocationResult
} from "@/utils/fetchmanCalculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Clock, BadgePercent, Calendar, Building } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import FetchmanAllocationChart from "./FetchmanAllocationChart";
import EventVenueMap from "./EventVenueMap";

interface FetchmanEstimationProps {
  capacity?: number;
  vendors?: number;
  hours?: number;
  venueName?: string;
  floorArea?: number;
  onUpdate?: (data: {fetchmenCount: number, cost: number, allocation: FetchmanAllocationResult}) => void;
}

export default function FetchmanEstimation({ 
  capacity: initialCapacity = 100, 
  vendors: initialVendors = 10,
  hours: initialHours = 5,
  venueName = "Event Venue",
  floorArea: initialFloorArea = 1000,
  onUpdate 
}: FetchmanEstimationProps) {
  const [capacity, setCapacity] = useState(initialCapacity);
  const [vendors, setVendors] = useState(initialVendors);
  const [hours, setHours] = useState(initialHours);
  const [rate, setRate] = useState(150);
  const [floorArea, setFloorArea] = useState(initialFloorArea);
  const [multiLevel, setMultiLevel] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [requestSent, setRequestSent] = useState(false);

  const fetchmenCount = calculateFetchmanEstimate(capacity, vendors);
  const cost = calculateFetchmanCost(fetchmenCount, hours, rate);
  const staffingPlan = generateFetchmanStaffingPlan(fetchmenCount, hours);
  const allocation = calculateFetchmanAllocation(capacity, floorArea, multiLevel);
  const totalCostWithOvertime = calculateOvertimeCosts(hours, overtimeHours, fetchmenCount, rate);

  useEffect(() => {
    if (onUpdate) {
      onUpdate({ fetchmenCount, cost, allocation });
    }
  }, [fetchmenCount, cost, allocation, onUpdate]);

  const handleRequestFetchmen = () => {
    setRequestSent(true);
    toast({
      title: "Fetchmen request sent",
      description: `Request for ${fetchmenCount} fetchmen for ${hours} hours has been submitted.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-venu-orange" />
          Fetchman Estimation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="capacity">Event Capacity: {capacity} people</Label>
              <span className="text-sm text-gray-500">{capacity} attendees</span>
            </div>
            <Slider 
              id="capacity"
              value={[capacity]} 
              min={50} 
              max={5000} 
              step={50}
              onValueChange={(values) => setCapacity(values[0])} 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="vendors">Number of Vendors: {vendors}</Label>
              <span className="text-sm text-gray-500">{vendors} vendors</span>
            </div>
            <Slider 
              id="vendors"
              value={[vendors]} 
              min={0} 
              max={100} 
              step={1}
              onValueChange={(values) => setVendors(values[0])} 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="hours">Event Duration: {hours} hours</Label>
              <span className="text-sm text-gray-500">{hours} hours</span>
            </div>
            <Slider 
              id="hours"
              value={[hours]} 
              min={1} 
              max={24} 
              step={1}
              onValueChange={(values) => setHours(values[0])} 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="rate">Hourly Rate: R{rate}</Label>
              <span className="text-sm text-gray-500">R{rate} per hour</span>
            </div>
            <Slider 
              id="rate"
              value={[rate]} 
              min={100} 
              max={300} 
              step={10}
              onValueChange={(values) => setRate(values[0])} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="showAdvanced">Show Advanced Options</Label>
            <Switch
              id="showAdvanced"
              checked={showAdvanced}
              onCheckedChange={setShowAdvanced}
            />
          </div>
          
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="floorArea">Venue Floor Area (m²): {floorArea}m²</Label>
                <Slider 
                  id="floorArea"
                  value={[floorArea]} 
                  min={100} 
                  max={10000} 
                  step={100}
                  onValueChange={(values) => setFloorArea(values[0])} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="multiLevel">Multi-level Venue</Label>
                <Switch
                  id="multiLevel"
                  checked={multiLevel}
                  onCheckedChange={setMultiLevel}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="overtimeHours">Expected Overtime Hours: {overtimeHours}</Label>
                <Slider 
                  id="overtimeHours"
                  value={[overtimeHours]} 
                  min={0} 
                  max={12} 
                  step={0.5}
                  onValueChange={(values) => setOvertimeHours(values[0])} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-medium mb-2">Density Calculation</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Attendee Density: {allocation.densityFactor.toFixed(2)} people/m²
                  </p>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        allocation.densityFactor < 0.5 ? 'bg-green-500' :
                        allocation.densityFactor < 1.0 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, allocation.densityFactor * 50)}%` }} 
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {allocation.densityFactor < 0.5 ? 'Low density - standard staffing sufficient' :
                     allocation.densityFactor < 1.0 ? 'Medium density - moderate staffing needed' : 
                     'High density - increased staffing recommended'}
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-medium mb-2">Venue Complexity</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-blue-500" />
                    <span>
                      {multiLevel ? 'Multi-level Venue' : 'Single-level Venue'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {multiLevel ? 
                      'Multi-level venues require additional coordination and fetchmen to manage vertical flow.' :
                      'Single-level venues are easier to manage with standard fetchmen allocation.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-md shadow-sm">
              <Users className="h-6 w-6 text-venu-orange mb-2" />
              <p className="text-sm text-gray-500">Fetchmen Required</p>
              <p className="text-2xl font-bold">{fetchmenCount}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-md shadow-sm">
              <Clock className="h-6 w-6 text-venu-orange mb-2" />
              <p className="text-sm text-gray-500">Total Hours</p>
              <p className="text-2xl font-bold">{hours}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-md shadow-sm">
              <BadgePercent className="h-6 w-6 text-venu-orange mb-2" />
              <p className="text-sm text-gray-500">Hourly Rate</p>
              <p className="text-2xl font-bold">R{rate}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-md shadow-sm">
              <Calendar className="h-6 w-6 text-venu-orange mb-2" />
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="text-2xl font-bold">R{overtimeHours > 0 ? totalCostWithOvertime.toLocaleString() : cost.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {staffingPlan.isMultiShift && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Shift Planning</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Number of Shifts</TableCell>
                  <TableCell>{staffingPlan.shiftsNeeded}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fetchmen per Shift</TableCell>
                  <TableCell>{staffingPlan.fetchmenPerShift}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Fetchmen Needed</TableCell>
                  <TableCell>{staffingPlan.totalFetchmen}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Hours per Shift</TableCell>
                  <TableCell>{staffingPlan.shiftHours}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
        
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FetchmanAllocationChart allocation={allocation} />
            <EventVenueMap 
              venueName={venueName}
              vendorCount={vendors}
              fetchmanAllocation={allocation}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => toast({ 
            title: "Estimate Saved", 
            description: "Fetchman estimate has been saved to your event." 
          })}
        >
          Save Estimate
        </Button>
        <Button 
          onClick={handleRequestFetchmen}
          disabled={requestSent}
        >
          {requestSent ? "Request Sent" : "Request Fetchmen"}
        </Button>
      </CardFooter>
    </Card>
  );
}
