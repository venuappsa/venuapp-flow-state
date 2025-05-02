
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
      
      <Route path="host">
        <Route path="" element={<HostDashboardPage />} />
        <Route path="subscription" element={<SubscriptionManagementPage />} />
        <Route path="subscription/paystack-manage" element={<PaystackManagePage />} />
        <Route path="profile" element={<HostProfilePage />} />
        <Route path="merchants" element={<MerchantsPage />} />
        <Route path="venues" element={<VenuesPage />} />
        <Route path="venues/create" element={<VenueCreate />} />
        <Route path="venues/:venueId" element={<VenueManagementPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:eventId" element={<EventManagementPage />} />
        <Route path="events/:eventId/timeline" element={<EventTimelinePage />} />
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
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default RootApp;
