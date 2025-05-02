
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePlatformSettings } from "@/contexts/PlatformSettingsContext";

export default function MaintenanceBanner() {
  const { settings } = usePlatformSettings();

  // Only render if maintenance mode is active
  if (!settings.maintenanceMode) {
    return null;
  }

  return (
    <Alert variant="destructive" className="bg-red-50 border-red-300 text-red-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {settings.maintenanceMessage || "System maintenance in progress. Some features may be unavailable."}
      </AlertDescription>
    </Alert>
  );
}
