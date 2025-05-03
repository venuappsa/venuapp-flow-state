import React from 'react';
import { Route, Routes } from "react-router-dom";
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { usePlatformSettings } from '@/contexts/PlatformSettingsContext';
import { ScrollToTop } from '@/components/utils/ScrollToTop';
import { useUser } from '@/hooks/useUser';
import AuthTransitionWrapper from '@/components/AuthTransitionWrapper';
import AuthPage from './pages/AuthPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Home from './pages/Index';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPlatformSettingsPage from './pages/admin/AdminPlatformSettingsPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminHostsPage from './pages/admin/AdminHostsPage';
import AdminMerchantsPage from './pages/admin/AdminMerchantsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminVerificationCenterPage from './pages/admin/AdminVerificationCenterPage';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminSystemStatusPage from './pages/admin/AdminSystemStatusPage';
import AdminAnnouncementsPage from './pages/admin/AdminAnnouncementsPage';
import AdminSubscriptionsPage from './pages/admin/AdminSubscriptionsPage';
import AdminCMSPage from './pages/admin/AdminCMSPage';
import AdminWebsitePage from './pages/admin/AdminWebsitePage';
import AdminSupportPage from './pages/admin/AdminSupportPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminVendorPerformancePage from './pages/admin/AdminVendorPerformancePage';
import AdminEventVendorsPage from './pages/admin/AdminEventVendorsPage';

// Host pages
import HostDashboardPage from './pages/HostDashboardPage';
import HostProfilePage from './pages/HostProfilePage';
import HostPanel from './pages/HostPanel';
import EventTasksPage from './pages/host/EventTasksPage';
import EventMessagesPage from './pages/host/EventMessagesPage';
import EventEditPage from './pages/host/EventEditPage';
import EventCreationPage from './pages/host/EventCreationPage';
import EventVendorsPage from './pages/host/EventVendorsPage';
import EventManagementPage from './pages/host/EventManagementPage';
import HostMessagesPage from './pages/host/HostMessagesPage';
import HostSettingsPage from './pages/host/HostSettingsPage';

// Vendor pages
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import VendorProfilePage from './pages/vendor/VendorProfilePage';
import VendorMessagesPage from './pages/vendor/VendorMessagesPage';
import VendorSettingsPage from './pages/vendor/VendorSettingsPage';

// Fetchman pages
import FetchmanDashboardPage from './pages/fetchman/FetchmanDashboardPage';
import FetchmanOnboardingPage from './pages/fetchman/FetchmanOnboardingPage';
import FetchmanPanelLayout from './components/layouts/FetchmanPanelLayout';
import AuthProtected from './components/AuthProtected';
import FetchmanEarningsPage from './pages/fetchman/FetchmanEarningsPage';
import FetchmanSettingsPage from './pages/fetchman/FetchmanSettingsPage';
import FetchmanSchedulePage from './pages/fetchman/FetchmanSchedulePage';
import FetchmanAssignmentsPage from './pages/fetchman/FetchmanAssignmentsPage';
import FetchmanNotificationsPage from './pages/fetchman/FetchmanNotificationsPage';
import FetchmanMessagesPage from './pages/fetchman/FetchmanMessagesPage';

// Other components
import SystemBanners from './components/banners/SystemBanners';

function App() {
  const { settings, isLoading } = usePlatformSettings();
  const { user } = useUser();
  
  const isUserAdmin = (user: any) => {
    // This is a simplified check - in a real app, you would check roles from the database
    return user?.email?.includes('admin') || user?.user_metadata?.isAdmin;
  };

  return (
    <>
      <ScrollToTop />
      <SystemBanners />
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />
        
        {/* Public Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Panel Routes */}
        <Route path="/admin" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/dashboard" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/profile" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminProfilePage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/settings" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminSettingsPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/users" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminUsersPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/platform" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminPlatformSettingsPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/messages" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminMessagesPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/hosts" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminHostsPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/merchants" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminMerchantsPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/events" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminEventsPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/verification" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminVerificationCenterPage />
          </AuthTransitionWrapper>
        } />
        
        {/* New Admin Routes */}
        <Route path="/admin/analytics" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminAnalyticsPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/notifications" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminNotificationsPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/payments" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminPaymentsPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/system" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminSystemStatusPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/announcements" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminAnnouncementsPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/subscriptions" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminSubscriptionsPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/cms" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminCMSPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/website" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminWebsitePage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/support" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminSupportPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/reports" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminReportsPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/vendors/performance" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminVendorPerformancePage />
          </AuthTransitionWrapper>
        } />
        <Route path="/admin/events/:id/vendors" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["admin"]}>
            <AdminEventVendorsPage />
          </AuthTransitionWrapper>
        } />
        
        {/* Host Panel Routes */}
        <Route path="/host" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["host"]}>
            <HostPanel />
          </AuthTransitionWrapper>
        } />
        <Route path="/host/dashboard" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["host"]}>
            <HostDashboardPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/host/profile" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["host"]}>
            <HostProfilePage />
          </AuthTransitionWrapper>
        } />
        <Route path="/host/messages" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["host"]}>
            <HostMessagesPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/host/settings" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["host"]}>
            <HostSettingsPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/host/events/new" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["host"]}>
            <EventCreationPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/host/events/:eventId" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["host"]}>
            <EventManagementPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/host/events/:eventId/edit" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["host"]}>
            <EventEditPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/host/events/:eventId/tasks" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["host"]}>
            <EventTasksPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/host/events/:eventId/vendors" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["host"]}>
            <EventVendorsPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/host/events/:eventId/messages" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["host"]}>
            <EventMessagesPage />
          </AuthTransitionWrapper>
        } />
        
        {/* Vendor Panel Routes */}
        <Route path="/vendor" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["merchant"]}>
            <VendorDashboardPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/vendor/dashboard" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["merchant"]}>
            <VendorDashboardPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/vendor/profile" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["merchant"]}>
            <VendorProfilePage />
          </AuthTransitionWrapper>
        } />
        <Route path="/vendor/messages" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["merchant"]}>
            <VendorMessagesPage />
          </AuthTransitionWrapper>
        } />
        <Route path="/vendor/settings" element={
          <AuthTransitionWrapper requireAuth={true} allowedRoles={["merchant"]}>
            <VendorSettingsPage />
          </AuthTransitionWrapper>
        } />
        
        {/* Fetchman Routes */}
        <Route
          path="/fetchman"
          element={
            <AuthProtected requiredRoles={["fetchman"]}>
              <FetchmanPanelLayout>
                <FetchmanDashboardPage />
              </FetchmanPanelLayout>
            </AuthProtected>
          }
        />
        <Route
          path="/fetchman/dashboard"
          element={
            <AuthProtected requiredRoles={["fetchman"]}>
              <FetchmanPanelLayout>
                <FetchmanDashboardPage />
              </FetchmanPanelLayout>
            </AuthProtected>
          }
        />
        <Route
          path="/fetchman/earnings"
          element={
            <AuthProtected requiredRoles={["fetchman"]}>
              <FetchmanPanelLayout>
                <FetchmanEarningsPage />
              </FetchmanPanelLayout>
            </AuthProtected>
          }
        />
        <Route
          path="/fetchman/schedule"
          element={
            <AuthProtected requiredRoles={["fetchman"]}>
              <FetchmanPanelLayout>
                <FetchmanSchedulePage />
              </FetchmanPanelLayout>
            </AuthProtected>
          }
        />
        <Route
          path="/fetchman/assignments"
          element={
            <AuthProtected requiredRoles={["fetchman"]}>
              <FetchmanPanelLayout>
                <FetchmanAssignmentsPage />
              </FetchmanPanelLayout>
            </AuthProtected>
          }
        />
        <Route
          path="/fetchman/notifications"
          element={
            <AuthProtected requiredRoles={["fetchman"]}>
              <FetchmanPanelLayout>
                <FetchmanNotificationsPage />
              </FetchmanPanelLayout>
            </AuthProtected>
          }
        />
        <Route
          path="/fetchman/messages"
          element={
            <AuthProtected requiredRoles={["fetchman"]}>
              <FetchmanPanelLayout>
                <FetchmanMessagesPage />
              </FetchmanPanelLayout>
            </AuthProtected>
          }
        />
        <Route
          path="/fetchman/settings"
          element={
            <AuthProtected requiredRoles={["fetchman"]}>
              <FetchmanPanelLayout>
                <FetchmanSettingsPage />
              </FetchmanPanelLayout>
            </AuthProtected>
          }
        />
        
        <Route 
          path="/fetchman/onboarding" 
          element={
            <AuthProtected>
              <FetchmanOnboardingPage />
            </AuthProtected>
          } 
        />
        
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <SonnerToaster />
    </>
  );
}

export default App;
