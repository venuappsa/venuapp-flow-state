
import React from "react";
import { Wrench } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function MaintenanceBanner() {
  return (
    <Alert variant="destructive">
      <Wrench className="h-4 w-4" />
      <AlertTitle>Maintenance Mode</AlertTitle>
      <AlertDescription>
        We're currently performing maintenance. The platform will be available again soon. Thank you for your patience.
      </AlertDescription>
    </Alert>
  );
}
