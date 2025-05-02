import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from 'next-themes';
import { Toaster } from "@/components/ui/toaster"
import { useUser } from "@/hooks/useUser";
import { checkSupabaseConnection } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToTop } from "@/components/utils/ScrollToTop";
import { useBreakpoint } from "@/hooks/useResponsive";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "@/contexts/NotificationContext";
import {
  Home as HomePage,
  About as AboutPage,
  Contact as ContactPage,
  Terms as TermsPage,
  Privacy as PrivacyPage,
  Pricing as PricingPage,
  KnowledgeBase as KnowledgeBasePage,
  NotFound as NotFoundPage,
  Auth as AuthPage,
  HostDashboard as HostDashboardPage,
  HostProfile as HostProfilePage,
  Merchants as MerchantsPage,
  Venues as VenuesPage,
  VenueCreate,
  VenueManagement as VenueManagementPage,
  Events as EventsPage,
  EventManagement as EventManagementPage,
  EventTimeline as EventTimelinePage,
  Vendors as VendorsPage,
  Invitations as InvitationsPage,
  Finance as FinancePage,
  Analytics as AnalyticsPage,
  Messages as MessagesPage,
  Notifications as NotificationsPage,
  Settings as SettingsPage,
  FinanceSettings as FinanceSettingsPage,
  Fetchman as FetchmanPage,
  Subscribe as SubscribePage,
  SubscriptionManagement as SubscriptionManagementPage,
  PaystackSubscriptionPage as PaystackManagePage
} from "@/pages";

// Import new event pages
import EventCreationPage from "@/pages/host/EventCreationPage";
import EventEditPage from "@/pages/host/EventEditPage";
import EventVendorsPage from "@/pages/host/EventVendorsPage";
import EventTasksPage from "@/pages/host/EventTasksPage";
import EventMessagesPage from "@/pages/host/EventMessagesPage";

// Admin pages imports
import AdminPanel from "@/pages/AdminPanel";
import AdminEventsPage from "@/pages/admin/AdminEventsPage";
import AdminEventVendorsPage from "@/pages/admin/AdminEventVendorsPage";
import AdminEventTimelinePage from "@/pages/admin/AdminEventTimelinePage";
import AdminEventResourcesPage from "@/pages/admin/AdminEventResourcesPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import AdminNotificationSettingsPage from "@/pages/admin/AdminNotificationSettingsPage";
import AdminPlatformSettingsPage from "@/pages/admin/AdminPlatformSettingsPage";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import AdminVendorPerformancePage from "@/pages/admin/AdminVendorPerformancePage";

// Vendor pages imports
import VendorNotificationSettingsPage from "@/pages/vendor/VendorNotificationSettingsPage";

// Public vendor pages imports
import VendorListingPage from "@/pages/public/VendorListingPage";
import VendorProfilePage from "@/pages/public/VendorProfilePage";
import VendorPublicProfilePage from "./pages/public/VendorPublicProfilePage";
import VendorInvitationsPage from "./pages/vendor/VendorInvitationsPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/knowledge" element={<KnowledgeBasePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/subscribe" element={<SubscribePage />} />
      <Route path="*" element={<NotFoundPage />} />
      
      {/* Public vendor routes */}
      <Route path="/vendors" element={<VendorListingPage />} />
      <Route path="/vendors/:id" element={<VendorProfilePage />} />
      <Route path="/vendors/:vendorId" element={<VendorPublicProfilePage />} />
      <Route path="/vendor/invites" element={<VendorInvitationsPage />} />
      
      {/* Host routes */}
      <Route path="host">
        <Route path="" element={<HostDashboardPage />} />
        <Route path="dashboard" element={<HostDashboardPage />} />
        <Route path="subscription" element={<SubscriptionManagementPage />} />
        <Route path="subscription/paystack-manage" element={<PaystackManagePage />} />
        <Route path="profile" element={<HostProfilePage />} />
        <Route path="merchants" element={<MerchantsPage />} />
        <Route path="venues" element={<VenuesPage />} />
        <Route path="venues/create" element={<VenueCreate />} />
        <Route path="venues/:venueId" element={<VenueManagementPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/new" element={<EventCreationPage />} />
        <Route path="events/:eventId" element={<EventManagementPage />} />
        <Route path="events/:eventId/edit" element={<EventEditPage />} />
        <Route path="events/:eventId/timeline" element={<EventTimelinePage />} />
        <Route path="events/:eventId/vendors" element={<EventVendorsPage />} />
        <Route path="events/:eventId/tasks" element={<EventTasksPage />} />
        <Route path="events/:eventId/messages" element={<EventMessagesPage />} />
        <Route path="vendors" element={<VendorsPage />} />
        <Route path="invitations" element={<InvitationsPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="finance/settings" element={<FinanceSettingsPage />} />
        <Route path="fetchman/:venueId?" element={<FetchmanPage />} />
        <Route path="knowledge" element={<KnowledgeBasePage />} />
      </Route>

      {/* Admin routes */}
      <Route path="admin">
        <Route path="" element={<AdminPanel />} />
        <Route path="dashboard" element={<AdminPanel />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="events/:id/vendors" element={<AdminEventVendorsPage />} />
        <Route path="events/:id/timeline" element={<AdminEventTimelinePage />} />
        <Route path="events/:id/resources" element={<AdminEventResourcesPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="vendors/performance" element={<AdminVendorPerformancePage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="settings/notifications" element={<AdminNotificationSettingsPage />} />
        <Route path="settings/platform" element={<AdminPlatformSettingsPage />} />
      </Route>
      
      {/* Vendor routes */}
      <Route path="vendor">
        <Route path="settings/notifications" element={<VendorNotificationSettingsPage />} />
      </Route>
    </Routes>
  );
};

function App() {
  const { theme } = useTheme()
  const { user, loading: isLoading } = useUser();
  const [isConnected, setIsConnected] = useState(true);
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkConnection = async () => {
      const connectionStatus = await checkSupabaseConnection();
      setIsConnected(connectionStatus);
    };

    checkConnection();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      console.error('Supabase connection failed. Redirecting to /knowledge.');
      navigate('/knowledge', { replace: true });
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');

    if (user && redirect) {
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="w-[300px] h-[400px]" />
      </div>
    );
  }

  return (
    <div data-theme={theme} className="bg-background text-foreground">
      <ScrollToTop />
      <AppRoutes />
      <Toaster />
    </div>
  );
}

function RootApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
        <NotificationProvider>
          <Router>
            <App />
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default RootApp;
