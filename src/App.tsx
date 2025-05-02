
import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Home as HomePage } from "./pages/index";
import RedirectLoaderOverlay from "./components/RedirectLoaderOverlay";
import AuthProtected from "./components/AuthProtected";
import VendorsPage from "./pages/VendorsPage";
import VenuesPage from "./pages/VenuesPage";
import SoftLaunchBanner from "./components/banners/SoftLaunchBanner";
import { Toaster } from "@/components/ui/toaster";
import FeedbackWidget from "@/components/feedback/FeedbackWidget";
import { Auth as AuthPage } from "./pages/index";
import TawkToChat from "@/components/TawkToChat";
import MessagesPage from "@/pages/MessagesPage";
import NotFound from "@/pages/NotFound";

// Use lazy loading for pages that don't need to be immediately available
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const HostDashboardPage = lazy(() => import("./pages/HostDashboardPage"));
const AccountSettingsPage = lazy(() => import("./pages/SettingsPage"));
const SubscriptionPage = lazy(() => import("./pages/SubscribePage"));

// Admin pages
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminProfilePage = lazy(() => import("./pages/AdminProfilePage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const AdminPayoutsPage = lazy(() => import("./pages/AdminPayoutsPage"));
const AdminPlatformSettingsPage = lazy(() => import("./pages/admin/AdminPlatformSettingsPage"));
const AdminHostsPage = lazy(() => import("./pages/admin/AdminHostsPage"));
const AdminEventsPage = lazy(() => import("./pages/admin/AdminEventsPage"));
const AdminMerchantsPage = lazy(() => import("./pages/admin/AdminMerchantsPage"));
const AdminVendorPerformancePage = lazy(() => import("./pages/admin/AdminVendorPerformancePage"));
const AdminSubscriptionsPage = lazy(() => import("./pages/admin/AdminSubscriptionsPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/admin/AdminAnalyticsPage"));
const AdminReportsPage = lazy(() => import("./pages/admin/AdminReportsPage"));
const AdminNotificationsPage = lazy(() => import("./pages/admin/AdminNotificationsPage"));
const AdminSupportPage = lazy(() => import("./pages/admin/AdminSupportPage"));
const AdminPlatformPage = lazy(() => import("./pages/admin/AdminPlatformPage"));

// Vendor pages
const VendorSignupPage = lazy(() => import("./pages/vendor/VendorSignupPage"));
const VendorMessagesPage = lazy(() => import("./pages/VendorMessagesPage"));
const VendorDashboardPage = lazy(() => import("./pages/vendor/VendorDashboardPage"));
const VendorProfilePage = lazy(() => import("./pages/vendor/VendorProfilePage"));
const VendorServicesPage = lazy(() => import("./pages/vendor/VendorServicesPage"));
const VendorPricingPage = lazy(() => import("./pages/vendor/VendorPricingPage"));
const VendorBookingsPage = lazy(() => import("./pages/vendor/VendorBookingsPage"));
const VendorAvailabilityPage = lazy(() => import("./pages/vendor/VendorAvailabilityPage"));
const VendorReviewsPage = lazy(() => import("./pages/vendor/VendorReviewsPage"));
const VendorGoLivePage = lazy(() => import("./pages/vendor/VendorGoLivePage"));
const VendorSettingsPage = lazy(() => import("./pages/vendor/VendorSettingsPage"));
const VendorSupportPage = lazy(() => import("./pages/vendor/VendorSupportPage"));
const VendorKnowledgePage = lazy(() => import("./pages/vendor/VendorKnowledgePage"));
const VendorFinancePage = lazy(() => import("./pages/vendor/VendorFinancePage"));
const VendorAnalyticsPage = lazy(() => import("./pages/vendor/VendorAnalyticsPage"));
const VendorNotificationsPage = lazy(() => import("./pages/vendor/VendorNotificationsPage"));

// Host pages
const HostEventsPage = lazy(() => import("./pages/host/HostEventsPage"));
const HostGuestsPage = lazy(() => import("./pages/host/HostGuestsPage"));
const HostFinancePage = lazy(() => import("./pages/host/HostFinancePage"));
const HostAnalyticsPage = lazy(() => import("./pages/host/HostAnalyticsPage"));
const HostMessagesPage = lazy(() => import("./pages/host/HostMessagesPage"));
const HostNotificationsPage = lazy(() => import("./pages/host/HostNotificationsPage"));
const HostKnowledgePage = lazy(() => import("./pages/host/HostKnowledgePage"));
const HostSettingsPage = lazy(() => import("./pages/host/HostSettingsPage"));
const EventManagementPage = lazy(() => import("./pages/host/EventManagementPage"));
const EventCreationPage = lazy(() => import("./pages/host/EventCreationPage"));
const EventEditPage = lazy(() => import("./pages/host/EventEditPage"));

// Fetchman pages
const FetchmanDashboardPage = lazy(() => import("./pages/fetchman/FetchmanDashboardPage"));
const FetchmanAssignmentsPage = lazy(() => import("./pages/fetchman/FetchmanAssignmentsPage"));
const FetchmanSchedulePage = lazy(() => import("./pages/fetchman/FetchmanSchedulePage"));
const FetchmanEarningsPage = lazy(() => import("./pages/fetchman/FetchmanEarningsPage"));
const FetchmanSettingsPage = lazy(() => import("./pages/fetchman/FetchmanSettingsPage"));

export default function App() {
  return (
    <>
      <SoftLaunchBanner />
      <Suspense fallback={<RedirectLoaderOverlay />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/login" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/register" element={<Navigate to="/register" replace />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Host panel routes */}
          <Route 
            path="/host" 
            element={
              <AuthProtected 
                requiredRoles={["host"]} 
                redirectTo="/auth?next=/host&required=host"
              />
            }
          >
            <Route index element={<Navigate to="/host/dashboard" replace />} />
            <Route path="dashboard" element={<HostDashboardPage />} />
            <Route path="venues" element={<VenuesPage />} />
            <Route path="vendors" element={<VendorsPage />} />
            <Route path="events" element={<HostEventsPage />} />
            <Route path="events/new" element={<EventCreationPage />} />
            <Route path="events/:eventId" element={<EventManagementPage />} />
            <Route path="events/:eventId/edit" element={<EventEditPage />} />
            <Route path="guests" element={<HostGuestsPage />} />
            <Route path="finance" element={<HostFinancePage />} />
            <Route path="analytics" element={<HostAnalyticsPage />} />
            <Route path="messages" element={<HostMessagesPage />} />
            <Route path="notifications" element={<HostNotificationsPage />} />
            <Route path="knowledge" element={<HostKnowledgePage />} />
            <Route path="settings" element={<HostSettingsPage />} />
            <Route path="account" element={<AccountSettingsPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
          </Route>

          {/* Admin panel routes */}
          <Route 
            path="/admin" 
            element={
              <AuthProtected 
                requiredRoles={["admin"]} 
                redirectTo="/auth?next=/admin&required=admin"
              />
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminPanel />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="hosts" element={<AdminHostsPage />} />
            <Route path="events" element={<AdminEventsPage />} />
            <Route path="merchants" element={<AdminMerchantsPage />} />
            <Route path="vendors/performance" element={<AdminVendorPerformancePage />} />
            <Route path="payouts" element={<AdminPayoutsPage />} />
            <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="support" element={<AdminSupportPage />} />
            <Route path="platform" element={<AdminPlatformPage />} />
            <Route path="settings" element={<AdminPlatformSettingsPage />} />
          </Route>

          {/* Vendor panel routes */}
          <Route 
            path="/vendor" 
            element={
              <AuthProtected 
                requiredRoles={["merchant"]} 
                redirectTo="/auth?next=/vendor&required=merchant"
              />
            }
          >
            <Route index element={<Navigate to="/vendor/dashboard" replace />} />
            <Route path="dashboard" element={<VendorDashboardPage />} />
            <Route path="profile" element={<VendorProfilePage />} />
            <Route path="services" element={<VendorServicesPage />} />
            <Route path="pricing" element={<VendorPricingPage />} />
            <Route path="bookings" element={<VendorBookingsPage />} />
            <Route path="availability" element={<VendorAvailabilityPage />} />
            <Route path="reviews" element={<VendorReviewsPage />} />
            <Route path="go-live" element={<VendorGoLivePage />} />
            <Route path="messages" element={<VendorMessagesPage />} />
            <Route path="settings" element={<VendorSettingsPage />} />
            <Route path="support" element={<VendorSupportPage />} />
            <Route path="signup" element={<VendorSignupPage />} />
            <Route path="knowledge" element={<VendorKnowledgePage />} />
            <Route path="finance" element={<VendorFinancePage />} />
            <Route path="analytics" element={<VendorAnalyticsPage />} />
            <Route path="notifications" element={<VendorNotificationsPage />} />
          </Route>

          {/* Fetchman panel routes */}
          <Route 
            path="/fetchman" 
            element={
              <AuthProtected 
                requiredRoles={["fetchman"]} 
                redirectTo="/auth?next=/fetchman&required=fetchman"
              />
            }
          >
            <Route index element={<Navigate to="/fetchman/dashboard" replace />} />
            <Route path="dashboard" element={<FetchmanDashboardPage />} />
            <Route path="assignments" element={<FetchmanAssignmentsPage />} />
            <Route path="schedule" element={<FetchmanSchedulePage />} />
            <Route path="earnings" element={<FetchmanEarningsPage />} />
            <Route path="settings" element={<FetchmanSettingsPage />} />
          </Route>

          {/* Not found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <FeedbackWidget />
      <TawkToChat />
      <Toaster />
    </>
  );
}
