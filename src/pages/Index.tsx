
import { useEffect, useState, useRef } from "react";
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
  const { user, initialized, loading: userLoading } = useUser();
  const { data: roles = [], isLoading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const redirectCheckedRef = useRef(false);
  
  // Circuit breaker to stop excessive redirects
  const MAX_REDIRECT_ATTEMPTS = 2;
  const REDIRECT_COOLDOWN = 3000; // ms
  const lastRedirectCheckRef = useRef(0);

  // Only check for redirect once after initialization
  useEffect(() => {
    // Don't do anything until auth is initialized and not loading
    if (!initialized || userLoading) {
      console.log("Index: Waiting for auth initialization or loading...");
      return;
    }
    
    // Skip if we've already checked or reached max attempts
    if (redirectCheckedRef.current || redirectAttempts >= MAX_REDIRECT_ATTEMPTS) {
      console.log("Index: Redirect already checked or max attempts reached");
      return;
    }
    
    // Skip if no user or still loading roles
    if (!user) {
      console.log("Index: No user, skipping redirect check");
      redirectCheckedRef.current = true;
      return;
    }
    
    // Enforce cooldown between redirect checks
    const now = Date.now();
    if (now - lastRedirectCheckRef.current < REDIRECT_COOLDOWN) {
      console.log("Index: Redirect check too soon, skipping");
      return;
    }
    lastRedirectCheckRef.current = now;
    
    // Only redirect if we have roles and user
    if (!rolesLoading && user) {
      // Ensure roles is an array
      const userRoles = Array.isArray(roles) ? roles : [];
      redirectCheckedRef.current = true;
        
      if (userRoles.length > 0 && window.location.pathname === "/") {
        console.log("Index: User has roles, checking for redirect:", userRoles);
        
        const redirectPath = getRedirectPageForRoles(userRoles);
        console.log("Index: Redirect check result:", redirectPath);
        
        // Only redirect if path is different and not already redirecting
        if (redirectPath !== "/" && !isRedirecting) {
          console.log(`Index: Initiating redirect to: ${redirectPath} (attempt ${redirectAttempts + 1}/${MAX_REDIRECT_ATTEMPTS})`);
          setIsRedirecting(true);
          
          // Use timeout to ensure we don't interrupt render
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
            setRedirectAttempts(prev => prev + 1);
          }, 300);
        } else {
          console.log("Index: No redirect needed or already redirecting");
        }
      } else {
        console.log("Index: No redirect needed. User:", !!user, "Roles:", userRoles, "Path:", window.location.pathname);
      }
    }
  }, [user, roles, rolesLoading, navigate, initialized, userLoading, isRedirecting, redirectAttempts]);

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
