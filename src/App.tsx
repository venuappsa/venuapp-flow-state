
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { usePlatformSettings } from '@/contexts/PlatformSettingsContext';
import { ScrollToTop } from '@/components/utils/ScrollToTop';
import AuthPage from './pages/AuthPage';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Home from './pages/Index';
import { useUser } from '@/hooks/useUser';
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
import SystemBanners from './components/banners/SystemBanners';

// Host page imports
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

// Vendor page imports
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import VendorProfilePage from './pages/vendor/VendorProfilePage';
import VendorMessagesPage from './pages/vendor/VendorMessagesPage';
import VendorSettingsPage from './pages/vendor/VendorSettingsPage';

function App() {
  const { settings, isLoading } = usePlatformSettings();
  const { user } = useUser();
  
  useEffect(() => {
    if (settings.maintenanceMode && user && !isUserAdmin(user)) {
      // For non-admin users, we could redirect to a maintenance page or show a modal
      console.log("Maintenance mode is active - restricted access");
    }
  }, [settings.maintenanceMode, user]);

  const isUserAdmin = (user: any) => {
    // This is a simplified check - in a real app, you would check roles from the database
    return user?.email?.includes('admin') || user?.user_metadata?.isAdmin;
  };

  return (
    <>
      <ScrollToTop />
      {!isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <SystemBanners />
        </div>
      )}
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />
        
        {/* Public Routes */}
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Panel Routes */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/platform" element={<AdminPlatformSettingsPage />} />
        <Route path="/admin/messages" element={<AdminMessagesPage />} />
        <Route path="/admin/hosts" element={<AdminHostsPage />} />
        <Route path="/admin/merchants" element={<AdminMerchantsPage />} />
        <Route path="/admin/events" element={<AdminEventsPage />} />
        <Route path="/admin/verification" element={<AdminVerificationCenterPage />} />
        
        {/* Host Panel Routes */}
        <Route path="/host" element={<HostPanel />} />
        <Route path="/host/dashboard" element={<HostDashboardPage />} />
        <Route path="/host/profile" element={<HostProfilePage />} />
        <Route path="/host/messages" element={<HostMessagesPage />} />
        <Route path="/host/settings" element={<HostSettingsPage />} />
        <Route path="/host/events/new" element={<EventCreationPage />} />
        <Route path="/host/events/:eventId" element={<EventManagementPage />} />
        <Route path="/host/events/:eventId/edit" element={<EventEditPage />} />
        <Route path="/host/events/:eventId/tasks" element={<EventTasksPage />} />
        <Route path="/host/events/:eventId/vendors" element={<EventVendorsPage />} />
        <Route path="/host/events/:eventId/messages" element={<EventMessagesPage />} />
        
        {/* Vendor Panel Routes */}
        <Route path="/vendor" element={<VendorDashboardPage />} />
        <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
        <Route path="/vendor/profile" element={<VendorProfilePage />} />
        <Route path="/vendor/messages" element={<VendorMessagesPage />} />
        <Route path="/vendor/settings" element={<VendorSettingsPage />} />
        
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <SonnerToaster />
    </>
  );
}

export default App;
