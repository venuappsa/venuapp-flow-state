
import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { checkSupabaseConnection } from "@/integrations/supabase/client";

// Import Layouts
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import FetchmanPanelLayout from "@/components/layouts/FetchmanPanelLayout";

// Import Pages
import NotFound from "@/pages/NotFound";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminVendorPerformancePage from "@/pages/admin/AdminVendorPerformancePage";
import AdminPaymentsPage from "@/pages/admin/AdminPaymentsPage";
import FetchmanDashboardPage from "@/pages/fetchman/FetchmanDashboardPage";
import FetchmanSchedulePage from "@/pages/fetchman/FetchmanSchedulePage";
import FetchmanEarningsPage from "@/pages/fetchman/FetchmanEarningsPage";
import FetchmanSettingsPage from "@/pages/fetchman/FetchmanSettingsPage";
import FetchmanOnboardingPage from "@/pages/fetchman/FetchmanOnboardingPage";
import FetchmanNotificationsPage from "@/pages/fetchman/FetchmanNotificationsPage";
import FetchmanMessagesPage from "@/pages/fetchman/FetchmanMessagesPage";
import FetchmanAssignmentsPage from "@/pages/fetchman/FetchmanAssignmentsPage";
import AdminFetchmanPage from "@/pages/admin/AdminFetchmanPage";
import Index from "@/pages/Index";
import AuthPage from "@/pages/AuthPage";
import LoginPage from "@/pages/auth/LoginPage";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60000, // 1 minute
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Home/Landing Page */}
        <Route path="/" element={<Index />} />
        
        {/* Auth routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminPanelLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="vendors" element={<AdminVendorPerformancePage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="fetchman" element={<AdminFetchmanPage />} />
        </Route>
        
        {/* Fetchman routes */}
        <Route path="/fetchman" element={<FetchmanPanelLayout />}>
          <Route index element={<FetchmanDashboardPage />} />
          <Route path="assignments" element={<FetchmanAssignmentsPage />} />
          <Route path="schedule" element={<FetchmanSchedulePage />} />
          <Route path="earnings" element={<FetchmanEarningsPage />} />
          <Route path="settings" element={<FetchmanSettingsPage />} />
          <Route path="onboarding" element={<FetchmanOnboardingPage />} />
          <Route path="notifications" element={<FetchmanNotificationsPage />} />
          <Route path="messages" element={<FetchmanMessagesPage />} />
        </Route>
        
        {/* Catch all not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
