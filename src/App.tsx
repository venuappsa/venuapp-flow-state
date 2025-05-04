
import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
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
      <RouterProvider router={createBrowserRouter([
        // Admin routes
        {
          path: "/admin",
          element: <AdminPanelLayout />,
          children: [
            {
              index: true,
              element: <AdminDashboardPage />
            },
            {
              path: "vendors",
              element: <AdminVendorPerformancePage />
            },
            {
              path: "payments",
              element: <AdminPaymentsPage />
            },
            {
              path: "fetchman", // New route for Fetchman management
              element: <AdminFetchmanPage />
            },
          ]
        },
        
        // Fetchman routes
        {
          path: "/fetchman",
          element: <FetchmanPanelLayout />,
          children: [
            {
              index: true,
              element: <FetchmanDashboardPage />
            },
            {
              path: "assignments", // Add route for Assignments page
              element: <FetchmanAssignmentsPage />
            },
            {
              path: "schedule",
              element: <FetchmanSchedulePage />
            },
            {
              path: "earnings",
              element: <FetchmanEarningsPage />
            },
            {
              path: "settings",
              element: <FetchmanSettingsPage />
            },
            {
              path: "onboarding",
              element: <FetchmanOnboardingPage />
            },
            {
              path: "notifications",
              element: <FetchmanNotificationsPage />
            },
            {
              path: "messages",
              element: <FetchmanMessagesPage />
            }
          ]
        },
        
        {
          path: "*",
          element: <NotFound />
        }
      ])} />
      
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
