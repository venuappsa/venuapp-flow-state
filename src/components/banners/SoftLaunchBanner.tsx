
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePlatformSettings } from "@/contexts/PlatformSettingsContext";

export default function SoftLaunchBanner() {
  const { settings } = usePlatformSettings();

  // Only render if soft launch is active
  if (!settings.isSoftLaunchActive) {
    return null;
  }

  return (
    <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        We're in soft launch mode! Some features may be limited as we continue to improve the platform. Thanks for being an early adopter.
      </AlertDescription>
    </Alert>
  );
}
