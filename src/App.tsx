import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@/hooks/useUser";
import { checkSupabaseConnection } from "@/integrations/supabase/client";

// Import Layouts
import MainLayout from "@/components/layouts/MainLayout";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import FetchmanPanelLayout from "@/components/layouts/FetchmanPanelLayout";

// Import Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminProfilePage from "@/pages/admin/AdminProfilePage";
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
import { UserCog, Users, Store, Bike, ShoppingCart, LayoutDashboard, Clipboard, CalendarClock, Wallet, MessageSquare, Settings } from "lucide-react";

function App() {
  const queryClient = new QueryClient();
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      const connectionStatus = await checkSupabaseConnection();
      setIsConnected(connectionStatus);

      if (!connectionStatus) {
        toast({
          title: "Connection Error",
          description:
            "Could not connect to Supabase. Please check your internet connection and Supabase configuration.",
          variant: "destructive",
        });
      }
    };

    checkConnection();
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={createBrowserRouter([
        // Public routes
        {
          path: "/",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <HomePage />,
            },
            {
              path: "about",
              element: <AboutPage />,
            },
            {
              path: "contact",
              element: <ContactPage />,
            },
            {
              path: "login",
              element: <LoginPage />,
            },
            {
              path: "register",
              element: <RegisterPage />,
            },
            {
              path: "profile",
              element: <ProfilePage />,
            },
          ],
        },
        
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
              path: "users",
              element: <AdminUsersPage />
            },
            {
              path: "profile",
              element: <AdminProfilePage />
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
      ])}>
        <Toaster />
      </RouterProvider>
      
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
