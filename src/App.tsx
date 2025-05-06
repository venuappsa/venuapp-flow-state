
import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import "./App.css";
import AuthenticationPage from "./pages/AuthenticationPage";
import HostDashboardPage from "./pages/HostDashboardPage";
import VenueDetailsPage from "./pages/VenueDetailsPage";
import NewVenuePage from "./pages/NewVenuePage";
import EditVenuePage from "./pages/EditVenuePage";
import SubscriptionPage from "./pages/SubscriptionPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "@/components/ui/theme-provider";
import MainLayout from "./components/layouts/MainLayout";
import FetchmanPanelLayout from "./components/layouts/FetchmanPanelLayout";
import FetchmanDashboardPage from "./pages/fetchman/FetchmanDashboardPage";
import AdminPanelLayout from "./components/layouts/AdminPanelLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminFetchmanPage from "./pages/admin/AdminFetchmanPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminUserManagementPage from "@/pages/admin/AdminUserManagementPage";
import Index from "./pages/Index";
import ErrorPage from "./pages/ErrorPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import HostPage from "./pages/HostPage";
import MerchantPage from "./pages/MerchantPage";
import FetchmanPage from "./pages/FetchmanPage";
import AttendeePage from "./pages/AttendeePage";
import SubscribePage from "./pages/SubscribePage";
import SubscriptionManagementPage from "./pages/SubscriptionManagementPage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  // Debug theme setup
  useEffect(() => {
    console.log("App component mounted");
    console.log(`Current document class: ${document.documentElement.className}`);
    
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem("venu-theme");
    console.log(`Theme in localStorage: ${storedTheme}`);
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />} errorElement={<ErrorPage />}>
        <Route index element={<Index />} />
        <Route path="auth" element={<AuthenticationPage />} />
        {/* Update to use the fully implemented subscription management page */}
        <Route path="subscribe" element={<SubscriptionManagementPage />} />

        {/* Feature Pages */}
        <Route path="features/host" element={<HostPage />} />
        <Route path="features/merchant" element={<MerchantPage />} />
        <Route path="features/fetchman" element={<FetchmanPage />} />
        <Route path="features/attendee" element={<AttendeePage />} />
        
        {/* Legacy route redirects */}
        <Route path="features/customer" element={<AttendeePage />} />
        <Route path="host" element={<Navigate to="/features/host" />} />
        <Route path="merchant" element={<Navigate to="/features/merchant" />} />
        <Route path="vendor" element={<Navigate to="/features/merchant" />} />
        <Route path="fetchman" element={<Navigate to="/features/fetchman" />} />
        <Route path="customer" element={<Navigate to="/features/attendee" />} />

        {/* Host routes - only accessible to hosts */}
        <Route
          path="host"
          element={
            <ProtectedRoute allowedRoles={["host"]}>
              <HostDashboardPage />
            </ProtectedRoute>
          }
          errorElement={<ErrorPage />}
        />
        
        {/* Host subscription management route */}
        <Route
          path="host/subscription"
          element={
            <ProtectedRoute allowedRoles={["host"]}>
              <SubscriptionManagementPage />
            </ProtectedRoute>
          }
          errorElement={<ErrorPage />}
        />
        
        {/* Fetchman routes - only accessible to fetchmans */}
        <Route
          path="fetchman"
          element={
            <ProtectedRoute allowedRoles={["fetchman"]}>
              <FetchmanPanelLayout />
            </ProtectedRoute>
          }
          errorElement={<ErrorPage />}
        >
          <Route index element={<FetchmanDashboardPage />} />
        </Route>
        
        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={<AdminPanelLayout />}
          errorElement={<ErrorPage />}
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="fetchmen" element={<AdminFetchmanPage />} />
          <Route path="users" element={<AdminUserManagementPage />} />
        </Route>
      </Route>
    )
  );

  return (
    <ThemeProvider
      defaultTheme="light"
      storageKey="venu-theme"
      attribute="class"
    >
      <ErrorBoundary>
        <RouterProvider router={router} />
        <Toaster />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
