
import React from "react";
import { Outlet } from "react-router-dom";
import FetchmanSidebar from "@/components/fetchman/FetchmanSidebar";
import FetchmanHeader from "@/components/fetchman/FetchmanHeader";
import { FetchmanFeaturesSelfTest } from "@/components/fetchman/FetchmanFeaturesSelfTest";
import { useUser } from "@/hooks/useUser";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function FetchmanPanelLayout() {
  const { user } = useUser();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <FetchmanSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <FetchmanHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        
        {/* Self-test floating button, visible only in development */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="fixed bottom-4 right-4 z-50">
            <FetchmanFeaturesSelfTest />
          </div>
        )}
      </div>
    </div>
  );
}
