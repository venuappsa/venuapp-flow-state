
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import FetchmanAllocationChart from "./FetchmanAllocationChart";
import EventVenueMap from "./EventVenueMap";
import FetchmanControlSliders from "./fetchman/FetchmanControlSliders";
import FetchmanAdvancedSettings from "./fetchman/FetchmanAdvancedSettings";
import FetchmanStats from "./fetchman/FetchmanStats";
import FetchmanShiftPlanTable from "./fetchman/FetchmanShiftPlan";

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

  const handleRequestFetchmen = () => {
    setRequestSent(true);
    toast({
      title: "Fetchmen request sent",
      description: `Request for ${fetchmenCount} fetchmen for ${hours} hours has been submitted.`,
    });
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate({ fetchmenCount, cost, allocation });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fetchman Estimation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FetchmanControlSliders
          capacity={capacity}
          vendors={vendors}
          hours={hours}
          rate={rate}
          onCapacityChange={setCapacity}
          onVendorsChange={setVendors}
          onHoursChange={setHours}
          onRateChange={setRate}
        />
          
        <div className="flex items-center justify-between">
          <Label htmlFor="showAdvanced">Show Advanced Options</Label>
          <Switch
            id="showAdvanced"
            checked={showAdvanced}
            onCheckedChange={setShowAdvanced}
          />
        </div>
        
        {showAdvanced && (
          <FetchmanAdvancedSettings
            floorArea={floorArea}
            multiLevel={multiLevel}
            overtimeHours={overtimeHours}
            densityFactor={allocation.densityFactor}
            onFloorAreaChange={setFloorArea}
            onMultiLevelChange={setMultiLevel}
            onOvertimeHoursChange={setOvertimeHours}
          />
        )}
        
        <FetchmanStats
          fetchmenCount={fetchmenCount}
          hours={hours}
          rate={rate}
          totalCost={overtimeHours > 0 ? totalCostWithOvertime : cost}
          hasOvertime={overtimeHours > 0}
        />
        
        <FetchmanShiftPlanTable staffingPlan={staffingPlan} />
        
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
