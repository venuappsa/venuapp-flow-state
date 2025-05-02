
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

// Vendor pages
const VendorSignupPage = lazy(() => import("./pages/vendor/VendorSignupPage"));
const VendorMessagesPage = lazy(() => import("./pages/VendorMessagesPage"));

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
            <Route path="account" element={<AccountSettingsPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="messages" element={<MessagesPage />} />
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
            <Route path="payouts" element={<AdminPayoutsPage />} />
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
            <Route path="dashboard" element={<VendorMessagesPage />} /> {/* Temporary using MessagesPage as dashboard */}
            <Route path="messages" element={<VendorMessagesPage />} />
            <Route path="signup" element={<VendorSignupPage />} />
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

