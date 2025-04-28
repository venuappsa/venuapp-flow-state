
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { getRedirectPageForRoles } from "@/hooks/useRoleRedirect";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import UserRoles from "@/components/UserRoles";
import Stats from "@/components/Stats";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RedirectLoaderOverlay from "@/components/RedirectLoaderOverlay";

const Index = () => {
  const { user, initialized } = useUser();
  const { data: roles = [], isLoading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  
  // Store the last check time to prevent excessive redirect attempts
  const [lastCheckTime, setLastCheckTime] = useState(0);

  useEffect(() => {
    // Skip redirect checks until useUser is fully initialized
    if (!initialized) {
      console.log("Index: Waiting for auth initialization...");
      return;
    }
    
    // Limit redirect attempts to prevent loops
    if (redirectAttempts > 2) {
      console.log("Index: Too many redirect attempts, stopping");
      return;
    }
    
    // Add a delay between redirect checks
    const now = Date.now();
    if (now - lastCheckTime < 2000) {
      console.log("Index: Redirect check too soon, skipping");
      return;
    }
    setLastCheckTime(now);
    
    // Skip if no user or still loading roles
    if (!user || rolesLoading) {
      console.log("Index: No user or still loading roles, skipping redirect check");
      return;
    }
    
    // Ensure roles is an array
    const userRoles = Array.isArray(roles) ? roles : [];
      
    if (userRoles.length > 0 && window.location.pathname === "/") {
      console.log("Index: Detected user with roles:", userRoles);
      
      const redirectPath = getRedirectPageForRoles(userRoles as string[]);
      console.log("Index: Redirect check result:", redirectPath);
      
      // Only redirect if we're not already going there
      if (redirectPath !== "/" && !isRedirecting) {
        console.log("Index: Starting redirect to:", redirectPath);
        setIsRedirecting(true);
        
        // Small timeout for smoother transition
        setTimeout(() => {
          console.log("Index: Executing redirect to:", redirectPath);
          navigate(redirectPath, { replace: true });
          setRedirectAttempts(prev => prev + 1);
        }, 100);
      }
    } else {
      console.log("Index: No redirect needed. User:", !!user, "Roles:", userRoles, "Path:", window.location.pathname);
    }
  }, [user, roles, rolesLoading, navigate, initialized, isRedirecting, redirectAttempts, lastCheckTime]);

  if (isRedirecting) {
    return <RedirectLoaderOverlay message="Redirecting to your dashboard..." />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <About />
        <Features />
        <UserRoles />
        <Stats />
        <Pricing />
        <Testimonials />
        <CTASection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
