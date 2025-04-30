
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { useToast } from "@/components/ui/use-toast";
import { VendorProfile } from "@/types/vendor";

export default function VendorPanelPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // If user is logged in, check their onboarding stage and redirect appropriately
    const checkOnboardingStage = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("vendor_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();
            
          if (error) {
            console.error("Error checking vendor profile:", error);
            toast({
              title: "Error loading profile",
              description: "Please try again later",
              variant: "destructive"
            });
            return;
          }
          
          // Redirect based on setup stage
          if (data) {
            const profileData = data as VendorProfile;
            const setupStage = profileData.setup_stage || 'welcome';
            
            switch(setupStage) {
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
          toast({
            title: "Error loading profile",
            description: "Please try again later",
            variant: "destructive"
          });
        }
      }
    };
    
    checkOnboardingStage();
  }, [user, navigate, toast]);
  
  return (
    <VendorPanelLayout>
      {/* This page acts as a router to the appropriate onboarding page */}
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-venu-orange"></div>
      </div>
    </VendorPanelLayout>
  );
}
