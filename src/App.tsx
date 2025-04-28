
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CustomerPage from "./pages/CustomerPage";
import HostPage from "./pages/HostPage";
import MerchantPage from "./pages/MerchantPage";
import FetchmanPage from "./pages/FetchmanPage";
import SubscribePage from "./pages/SubscribePage";
import SubscriptionManagementPage from "./pages/SubscriptionManagementPage";
import AuthPage from "./pages/AuthPage";
import AdminPanel from "./pages/AdminPanel";
import HostPanel from "./pages/HostPanel";
import VenueCreate from "./pages/VenueCreate";
import VendorRules from "./pages/VendorRules";
import EventManagementPage from "./pages/EventManagementPage";
import EventsPage from "./pages/EventsPage";
import VendorsPage from "./pages/VendorsPage";
import FinancePage from "./pages/FinancePage";
import VenuesPage from "./pages/VenuesPage";
import GuestPage from "./pages/GuestPage";
import MerchantsPage from "./pages/MerchantsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Host panel routes */}
          <Route path="/host" element={<HostPanel />} />
          <Route path="/host/venues" element={<VenuesPage />} />
          <Route path="/host/venues/new" element={<VenueCreate />} />
          <Route path="/host/rules" element={<VendorRules />} />
          <Route path="/host/events" element={<EventsPage />} />
          <Route path="/host/events/new" element={<EventManagementPage />} />
          <Route path="/host/events/:eventId" element={<EventManagementPage />} />
          <Route path="/host/merchants" element={<MerchantsPage />} />
          <Route path="/host/vendors" element={<VendorsPage />} />
          <Route path="/host/finance" element={<FinancePage />} />
          <Route path="/host/guests" element={<GuestPage />} />
          <Route path="/host/subscription" element={<SubscriptionManagementPage />} />
          <Route path="/host/analytics" element={<AnalyticsPage />} />
          <Route path="/host/settings" element={<SettingsPage />} />
          <Route path="/host/knowledge" element={<KnowledgeBasePage />} />
          <Route path="/host/messages" element={<MessagesPage />} />
          <Route path="/host/notifications" element={<NotificationsPage />} />
          
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/merchant" element={<MerchantPage />} />
          <Route path="/fetchman" element={<FetchmanPage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
