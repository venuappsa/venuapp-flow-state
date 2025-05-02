
import React from "react";
import SoftLaunchBanner from "./SoftLaunchBanner";
import MaintenanceBanner from "./MaintenanceBanner";
import { usePlatformSettings } from "@/contexts/PlatformSettingsContext";

export default function SystemBanners() {
  const { settings, isLoading } = usePlatformSettings();
  
  if (isLoading) return null;

  return (
    <div className="space-y-2">
      {settings.maintenanceMode && <MaintenanceBanner />}
      {settings.isSoftLaunchActive && <SoftLaunchBanner />}
    </div>
  );
}
