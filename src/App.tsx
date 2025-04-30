
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import AdminPanel from "./pages/AdminPanel";
import HostPanel from "./pages/HostPanel";
import VenueCreate from "./pages/VenueCreate";
import VendorRules from "./pages/VendorRules";
import EventManagementPage from "./pages/EventManagementPage";
import EventsPage from "./pages/EventsPage";
import VendorsPage from "./pages/VendorsPage";
import FinancePage from "./pages/FinancePage";
import VenuesPage from "./pages/VenuesPage";
import VenueManagementPage from "./pages/VenueManagementPage";
import GuestPage from "./pages/GuestPage";
import MerchantsPage from "./pages/MerchantsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";

// Auth pages imports
import AuthLayout from "./pages/auth/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import TwoFactorAuthPage from "./pages/auth/TwoFactorAuthPage";
import AuthTestReport from "./pages/auth/TestReport";

// Profile and User Management imports
import AdminProfilePage from "./pages/AdminProfilePage";
import HostProfilePage from "./pages/HostProfilePage";
import AdminUsersPage from "./pages/AdminUsersPage";

// Dashboard and Invitation pages
import HostDashboardPage from "./pages/HostDashboardPage";
import InvitationsPage from "./pages/InvitationsPage";

// Vendor pages imports
import VendorSignupPage from "./pages/vendor/VendorSignupPage";
import VendorWelcomePage from "./pages/vendor/VendorWelcomePage";
import VendorDashboardPage from "./pages/vendor/VendorDashboardPage";
import VendorProfilePage from "./pages/vendor/VendorProfilePage";
import VendorServicesPage from "./pages/vendor/VendorServicesPage";
import VendorPricingPage from "./pages/vendor/VendorPricingPage";
import VendorGoLivePage from "./pages/vendor/VendorGoLivePage";
import VendorPanelPage from "./pages/vendor/VendorPanelPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<LoginPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="2fa" element={<TwoFactorAuthPage />} />
            <Route path="test-report" element={<AuthTestReport />} />
          </Route>
          
          {/* Legacy auth page (to be removed) */}
          <Route path="/auth-old" element={<AuthPage />} />

          {/* Vendor Signup (Public) */}
          <Route path="/vendor-signup" element={<VendorSignupPage />} />
          
          {/* Admin panel routes */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/hosts" element={<AdminPanel />} />
          <Route path="/admin/events" element={<AdminPanel />} />
          <Route path="/admin/merchants" element={<AdminPanel />} />
          <Route path="/admin/subscriptions" element={<AdminPanel />} />
          <Route path="/admin/reports" element={<AdminPanel />} />
          <Route path="/admin/verifications" element={<AdminPanel />} />
          <Route path="/admin/notifications" element={<AdminPanel />} />
          <Route path="/admin/support" element={<AdminPanel />} />
          <Route path="/admin/platform" element={<AdminPanel />} />
          <Route path="/admin/settings" element={<AdminPanel />} />
          
          {/* Host panel routes */}
          <Route path="/host" element={<HostPanel />} />
          <Route path="/host/dashboard" element={<HostDashboardPage />} />
          <Route path="/host/profile" element={<HostProfilePage />} />
          <Route path="/host/venues" element={<VenuesPage />} />
          <Route path="/host/venues/new" element={<VenueCreate />} />
          <Route path="/host/venues/:venueId" element={<VenueManagementPage />} />
          <Route path="/host/rules" element={<VendorRules />} />
          <Route path="/host/events" element={<EventsPage />} />
          <Route path="/host/events/new" element={<EventManagementPage />} />
          <Route path="/host/events/:eventId" element={<EventManagementPage />} />
          <Route path="/host/merchants" element={<MerchantsPage />} />
          <Route path="/host/vendors" element={<VendorsPage />} />
          <Route path="/host/invitations" element={<InvitationsPage />} />
          <Route path="/host/finance" element={<FinancePage />} />
          <Route path="/host/guests" element={<GuestPage />} />
          <Route path="/host/analytics" element={<AnalyticsPage />} />
          <Route path="/host/settings" element={<SettingsPage />} />
          <Route path="/host/knowledge" element={<KnowledgeBasePage />} />
          <Route path="/host/messages" element={<MessagesPage />} />
          <Route path="/host/notifications" element={<NotificationsPage />} />

          {/* Vendor panel routes */}
          <Route path="/vendor" element={<VendorPanelPage />} />
          <Route path="/vendor/welcome" element={<VendorWelcomePage />} />
          <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
          <Route path="/vendor/profile" element={<VendorProfilePage />} />
          <Route path="/vendor/services" element={<VendorServicesPage />} />
          <Route path="/vendor/pricing" element={<VendorPricingPage />} />
          <Route path="/vendor/go-live" element={<VendorGoLivePage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
