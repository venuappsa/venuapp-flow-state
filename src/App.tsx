
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { usePlatformSettings } from '@/contexts/PlatformSettingsContext';
import { ScrollToTop } from '@/components/utils/ScrollToTop';
import AdminPanel from './pages/AdminPanel';
import AdminProfilePage from './pages/AdminProfilePage';
import AuthPage from './pages/AuthPage';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { useUser } from '@/hooks/useUser';
import AdminPlatformSettingsPage from './pages/admin/AdminPlatformSettingsPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminHostsPage from './pages/admin/AdminHostsPage';
import AdminMerchantsPage from './pages/admin/AdminMerchantsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminVerificationCenterPage from './pages/admin/AdminVerificationCenterPage';
import SystemBanners from './components/banners/SystemBanners';

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
        {/* Public Routes */}
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Panel Routes */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
        <Route path="/admin/settings" element={<AdminPanel />} />
        <Route path="/admin/platform" element={<AdminPlatformSettingsPage />} />
        <Route path="/admin/messages" element={<AdminMessagesPage />} />
        <Route path="/admin/hosts" element={<AdminHostsPage />} />
        <Route path="/admin/merchants" element={<AdminMerchantsPage />} />
        <Route path="/admin/events" element={<AdminEventsPage />} />
        <Route path="/admin/verification" element={<AdminVerificationCenterPage />} />
        
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <SonnerToaster />
    </>
  );
}

export default App;
