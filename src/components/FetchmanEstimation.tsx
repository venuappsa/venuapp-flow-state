
import { useState, useEffect } from "react";
import { 
  calculateFetchmanEstimate, 
  calculateFetchmanCost,
  generateFetchmanStaffingPlan
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
import { Users, Clock, BadgePercent, Calendar } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface FetchmanEstimationProps {
  capacity?: number;
  vendors?: number;
  hours?: number;
  onUpdate?: (data: {fetchmenCount: number, cost: number}) => void;
}

export default function FetchmanEstimation({ 
  capacity: initialCapacity = 100, 
  vendors: initialVendors = 10,
  hours: initialHours = 5,
  onUpdate 
}: FetchmanEstimationProps) {
  const [capacity, setCapacity] = useState(initialCapacity);
  const [vendors, setVendors] = useState(initialVendors);
  const [hours, setHours] = useState(initialHours);
  const [rate, setRate] = useState(150);

  const fetchmenCount = calculateFetchmanEstimate(capacity, vendors);
  const cost = calculateFetchmanCost(fetchmenCount, hours, rate);
  const staffingPlan = generateFetchmanStaffingPlan(fetchmenCount, hours);

  useEffect(() => {
    if (onUpdate) {
      onUpdate({ fetchmenCount, cost });
    }
  }, [fetchmenCount, cost, onUpdate]);

  const handleRequestFetchmen = () => {
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
              <p className="text-2xl font-bold">R{cost.toLocaleString()}</p>
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
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Save Estimate</Button>
        <Button onClick={handleRequestFetchmen}>Request Fetchmen</Button>
      </CardFooter>
    </Card>
  );
}
