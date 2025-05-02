
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
  maintenanceMessage?: string;
  commissionRates?: {
    hostCommission: number;
    vendorCommission: number;
    fetchmanCommission: number;
  };
  verificationRequirements?: {
    requireIdVerification: boolean;
    requireAddressVerification: boolean;
    requireBusinessVerification: boolean;
  };
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
  maintenanceMessage: "We're currently performing system maintenance. Please check back shortly.",
  commissionRates: {
    hostCommission: 5.0,
    vendorCommission: 10.0,
    fetchmanCommission: 15.0,
  },
  verificationRequirements: {
    requireIdVerification: true,
    requireAddressVerification: true,
    requireBusinessVerification: true,
  },
};

interface PlatformSettingsContextType {
  settings: PlatformSettings;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  saveSettings: () => void;
  isLoading: boolean;
}

const PlatformSettingsContext = createContext<PlatformSettingsContextType | undefined>(undefined);

export function PlatformSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on component mount
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedSettings = localStorage.getItem("platformSettings");
      if (storedSettings) {
        setSettings(prev => ({
          ...prev,
          ...JSON.parse(storedSettings)
        }));
      }
    } catch (error) {
      console.error("Error loading platform settings:", error);
    } finally {
      setInitialized(true);
      setIsLoading(false);
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
    isLoading,
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
