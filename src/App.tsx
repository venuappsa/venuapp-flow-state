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
import AdminMessagesPage from "@/pages/admin/AdminMessagesPage";
import AdminHostsPage from "@/pages/admin/AdminHostsPage";
import AdminMerchantsPage from "@/pages/admin/AdminMerchantsPage";
import AdminNotificationsPage from "@/pages/admin/AdminNotificationsPage";
import AdminNotificationSettingsPage from "@/pages/admin/AdminNotificationSettingsPage";
import AdminUsersPage from "@/pages/AdminUsersPage";
import AdminEventsPage from "@/pages/admin/AdminEventsPage";
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
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="hosts" element={<AdminHostsPage />} />
          <Route path="merchants" element={<AdminMerchantsPage />} />
          <Route path="events" element={<AdminEventsPage />} />
          <Route path="vendors/performance" element={<AdminVendorPerformancePage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="fetchman" element={<AdminFetchmanPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="notification-settings" element={<AdminNotificationSettingsPage />} />
          <Route path="analytics" element={<ComingSoonPage title="Analytics" />} />
          <Route path="reports" element={<ComingSoonPage title="Reports" />} />
          <Route path="subscriptions" element={<ComingSoonPage title="Subscriptions" />} />
          <Route path="cms" element={<ComingSoonPage title="Content Management" />} />
          <Route path="website" element={<ComingSoonPage title="Website" />} />
          <Route path="support" element={<ComingSoonPage title="Support Tickets" />} />
          <Route path="system" element={<ComingSoonPage title="System Status" />} />
          <Route path="platform" element={<ComingSoonPage title="Platform Settings" />} />
          <Route path="settings" element={<ComingSoonPage title="Settings" />} />
          
          {/* Legacy route support - redirect /admin/dashboard to /admin */}
          <Route path="dashboard" element={<Navigate to="/admin" replace />} />
          
          {/* Catch-all route for admin panel to prevent 404s */}
          <Route path="*" element={<NotFound />} />
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
          
          {/* Legacy route support - redirect /fetchman/dashboard to /fetchman */}
          <Route path="dashboard" element={<Navigate to="/fetchman" replace />} />
        </Route>
        
        {/* Add host routes with redirection support */}
        <Route path="/host" element={<Navigate to="/fetchman" replace />} />
        <Route path="/host/*" element={<Navigate to="/fetchman" replace />} />
        
        {/* Add vendor routes with redirection support */}
        <Route path="/vendor" element={<Navigate to="/fetchman" replace />} />
        <Route path="/vendor/*" element={<Navigate to="/fetchman" replace />} />
        
        {/* Catch all not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster />
    </QueryClientProvider>
  );
}

// Create a simple ComingSoonPage component for routes that are not yet implemented
const ComingSoonPage = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-gray-500 mb-4">This page is coming soon!</p>
      <p className="text-sm text-gray-400">We're working hard to make this feature available.</p>
    </div>
  );
};

export default App;
