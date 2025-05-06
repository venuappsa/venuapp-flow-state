
import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
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
        <Route path="subscribe" element={<SubscriptionPage />} />

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
        <Route
          path="host/venues/:venueId"
          element={
            <ProtectedRoute allowedRoles={["host"]}>
              <VenueDetailsPage />
            </ProtectedRoute>
          }
          errorElement={<ErrorPage />}
        />
        <Route
          path="host/venues/new"
          element={
            <ProtectedRoute allowedRoles={["host"]}>
              <NewVenuePage />
            </ProtectedRoute>
          }
          errorElement={<ErrorPage />}
        />
        <Route
          path="host/venues/:venueId/edit"
          element={
            <ProtectedRoute allowedRoles={["host"]}>
              <EditVenuePage />
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
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
