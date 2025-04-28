
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FetchmanControlSlidersProps {
  capacity: number;
  vendors: number;
  hours: number;
  rate: number;
  onCapacityChange: (value: number) => void;
  onVendorsChange: (value: number) => void;
  onHoursChange: (value: number) => void;
  onRateChange: (value: number) => void;
}

export default function FetchmanControlSliders({
  capacity,
  vendors,
  hours,
  rate,
  onCapacityChange,
  onVendorsChange,
  onHoursChange,
  onRateChange,
}: FetchmanControlSlidersProps) {
  return (
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
          onValueChange={(values) => onCapacityChange(values[0])} 
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
          onValueChange={(values) => onVendorsChange(values[0])} 
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
          onValueChange={(values) => onHoursChange(values[0])} 
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
          onValueChange={(values) => onRateChange(values[0])} 
        />
      </div>
    </div>
  );
}
