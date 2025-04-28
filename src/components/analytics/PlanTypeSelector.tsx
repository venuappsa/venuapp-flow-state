
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building, CalendarDays } from "lucide-react";
import { PlanType } from "@/utils/pricingUtils";

interface PlanTypeSelectorProps {
  selectedPlanType: PlanType;
  onChange: (planType: PlanType) => void;
  className?: string;
}

export default function PlanTypeSelector({
  selectedPlanType,
  onChange,
  className = ""
}: PlanTypeSelectorProps) {
  const [hoveredOption, setHoveredOption] = useState<PlanType | null>(null);

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          <Button
            variant={selectedPlanType === "venue" ? "default" : "ghost"}
            className={`flex items-center gap-2 ${
              selectedPlanType === "venue" ? "" : "hover:bg-gray-200"
            }`}
            onClick={() => onChange("venue")}
            onMouseEnter={() => setHoveredOption("venue")}
            onMouseLeave={() => setHoveredOption(null)}
          >
            <Building className="h-4 w-4" />
            <span>Venue-Based</span>
          </Button>
          <Button
            variant={selectedPlanType === "event" ? "default" : "ghost"}
            className={`flex items-center gap-2 ${
              selectedPlanType === "event" ? "" : "hover:bg-gray-200"
            }`}
            onClick={() => onChange("event")}
            onMouseEnter={() => setHoveredOption("event")}
            onMouseLeave={() => setHoveredOption(null)}
          >
            <CalendarDays className="h-4 w-4" />
            <span>Event-Based</span>
          </Button>
        </div>
      </div>
      <div className="text-sm text-center text-gray-600">
        {hoveredOption === "venue" && (
          <span>Monthly subscription with per-event fee. Best for permanent venues.</span>
        )}
        {hoveredOption === "event" && (
          <span>Pay per event without monthly fees. Best for occasional events.</span>
        )}
        {hoveredOption === null && (
          <span>
            {selectedPlanType === "venue"
              ? "Monthly subscription with per-event fee. Best for permanent venues."
              : "Pay per event without monthly fees. Best for occasional events."}
          </span>
        )}
      </div>
    </div>
  );
}
