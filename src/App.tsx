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
import AuthPage from "./pages/AuthPage";
import AdminPanel from "./pages/AdminPanel";
import HostPanel from "./pages/HostPanel";

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
          <Route path="/host" element={<HostPanel />} />
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
