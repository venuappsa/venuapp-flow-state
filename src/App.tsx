
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

// Use lazy loading for pages that don't need to be immediately available
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const HostDashboardPage = lazy(() => import("./pages/HostDashboardPage"));
const AccountSettingsPage = lazy(() => import("./pages/SettingsPage"));
const SubscriptionPage = lazy(() => import("./pages/SubscribePage"));

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

          {/* Not found route */}
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </Suspense>
      <FeedbackWidget />
      <TawkToChat />
      <Toaster />
    </>
  );
}
