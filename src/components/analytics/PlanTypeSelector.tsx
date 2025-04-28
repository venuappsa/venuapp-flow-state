
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, Home } from "lucide-react";
import { PlanType } from "@/utils/pricingUtils";

interface PlanTypeSelectorProps {
  selectedPlanType: PlanType;
  onChange: (type: PlanType) => void;
}

export default function PlanTypeSelector({ selectedPlanType, onChange }: PlanTypeSelectorProps) {
  return (
    <div className="flex justify-center mb-4">
      <div className="inline-flex p-1 rounded-lg bg-gray-100">
        <Button 
          variant="ghost" 
          className={`px-4 rounded-md ${selectedPlanType === "venue" ? 'bg-white shadow text-venu-orange' : ''}`}
          onClick={() => onChange("venue")}
        >
          <Home className="h-4 w-4 mr-2" />
          <span>Venue Plan</span>
        </Button>
        <Button 
          variant="ghost" 
          className={`px-4 rounded-md ${selectedPlanType === "event" ? 'bg-white shadow text-venu-orange' : ''}`}
          onClick={() => onChange("event")}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          <span>Event Plan</span>
        </Button>
      </div>
    </div>
  );
}
