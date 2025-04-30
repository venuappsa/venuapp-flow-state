
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";

export default function VendorPanelPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is logged in, check their onboarding stage and redirect appropriately
    const checkOnboardingStage = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("vendor_profiles")
            .select("setup_stage")
            .eq("user_id", user.id)
            .single();
            
          if (error) {
            console.error("Error checking vendor profile:", error);
            return;
          }
          
          // Redirect based on setup stage
          if (data) {
            switch(data.setup_stage) {
              case "welcome":
                navigate("/vendor/welcome");
                break;
              default:
                navigate("/vendor/dashboard");
                break;
            }
          }
        } catch (err) {
          console.error("Error checking onboarding stage:", err);
        }
      }
    };
    
    checkOnboardingStage();
  }, [user, navigate]);
  
  return (
    <VendorPanelLayout>
      {/* This page acts as a router to the appropriate onboarding page */}
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-venu-orange"></div>
      </div>
    </VendorPanelLayout>
  );
}
