
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
  const { user } = useUser();
  const { data: roles = [], isLoading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Skip if no user or still loading roles
    if (!user || rolesLoading) return;
    
    // Ensure roles is an array
    const userRoles = Array.isArray(roles) ? roles : [];
      
    if (userRoles.length > 0 && window.location.pathname === "/") {
      console.log("Index: Detected user with roles:", userRoles);
      setIsRedirecting(true);
      
      const redirectPath = getRedirectPageForRoles(userRoles as string[]);
      console.log("Index: Redirecting to:", redirectPath);
      
      // Small timeout for smoother transition
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
    }
  }, [user, roles, rolesLoading, navigate]);

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
