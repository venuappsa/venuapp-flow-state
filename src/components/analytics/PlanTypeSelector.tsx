
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlanTypeSelectorProps {
  selectedPlanType: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function PlanTypeSelector({
  selectedPlanType, 
  onChange,
  className = ""
}: PlanTypeSelectorProps) {
  // This is a fallback component that doesn't actually change plan types anymore
  // It maintains the interface for compatibility but will be removed in future updates
  return (
    <div className={`${className}`}>
      {/* This is now a single unified plan view */}
    </div>
  );
}
