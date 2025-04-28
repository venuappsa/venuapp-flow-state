
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Building } from "lucide-react";

interface FetchmanAdvancedSettingsProps {
  floorArea: number;
  multiLevel: boolean;
  overtimeHours: number;
  densityFactor: number;
  onFloorAreaChange: (value: number) => void;
  onMultiLevelChange: (value: boolean) => void;
  onOvertimeHoursChange: (value: number) => void;
}

export default function FetchmanAdvancedSettings({
  floorArea,
  multiLevel,
  overtimeHours,
  densityFactor,
  onFloorAreaChange,
  onMultiLevelChange,
  onOvertimeHoursChange,
}: FetchmanAdvancedSettingsProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="floorArea">Venue Floor Area (m²): {floorArea}m²</Label>
        <Slider 
          id="floorArea"
          value={[floorArea]} 
          min={100} 
          max={10000} 
          step={100}
          onValueChange={(values) => onFloorAreaChange(values[0])} 
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="multiLevel">Multi-level Venue</Label>
        <Switch
          id="multiLevel"
          checked={multiLevel}
          onCheckedChange={onMultiLevelChange}
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
          onValueChange={(values) => onOvertimeHoursChange(values[0])} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-medium mb-2">Density Calculation</h4>
          <p className="text-sm text-gray-600 mb-2">
            Attendee Density: {densityFactor.toFixed(2)} people/m²
          </p>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className={`h-2 rounded-full ${
                densityFactor < 0.5 ? 'bg-green-500' :
                densityFactor < 1.0 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, densityFactor * 50)}%` }} 
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {densityFactor < 0.5 ? 'Low density - standard staffing sufficient' :
             densityFactor < 1.0 ? 'Medium density - moderate staffing needed' : 
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
  );
}
