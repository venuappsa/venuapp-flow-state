
import { useEffect } from "react";
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

const Index = () => {
  const { user } = useUser();
  const { data: roles, isLoading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && roles && roles.length > 0 && !rolesLoading) {
      console.log("Index: Detected user with roles:", roles);
      const redirectPath = getRedirectPageForRoles(roles);
      console.log("Index: Redirecting to:", redirectPath);
      if (window.location.pathname === "/") {
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, roles, rolesLoading, navigate]);

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
