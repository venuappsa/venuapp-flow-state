
import React, { createContext, useContext, useEffect, useState } from "react";

// Define the shape of our platform settings
interface PlatformSettings {
  platformName: string;
  primaryColor: string;
  enableVendorDiscovery: boolean;
  enableReviewsSystem: boolean;
  enablePublicQuoteRequests: boolean;
  isSoftLaunchActive: boolean;
  maintenanceMode: boolean;
}

// Default settings to use if nothing is in localStorage
const defaultSettings: PlatformSettings = {
  platformName: "Venuapp",
  primaryColor: "purple",
  enableVendorDiscovery: true,
  enableReviewsSystem: true,
  enablePublicQuoteRequests: true,
  isSoftLaunchActive: true,
  maintenanceMode: false,
};

interface PlatformSettingsContextType {
  settings: PlatformSettings;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  saveSettings: () => void;
}

const PlatformSettingsContext = createContext<PlatformSettingsContextType | undefined>(undefined);

export function PlatformSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [initialized, setInitialized] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("platformSettings");
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Error loading platform settings:", error);
    } finally {
      setInitialized(true);
    }
  }, []);

  // Update specific settings
  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  // Save settings to localStorage
  const saveSettings = () => {
    try {
      localStorage.setItem("platformSettings", JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving platform settings:", error);
    }
  };

  const value = {
    settings,
    updateSettings,
    saveSettings,
  };

  // Only render children once we've tried to load settings
  if (!initialized) {
    return null;
  }

  return (
    <PlatformSettingsContext.Provider value={value}>
      {children}
    </PlatformSettingsContext.Provider>
  );
}

export function usePlatformSettings() {
  const context = useContext(PlatformSettingsContext);
  if (context === undefined) {
    throw new Error("usePlatformSettings must be used within a PlatformSettingsProvider");
  }
  return context;
}
