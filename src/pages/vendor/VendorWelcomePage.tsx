
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight } from "lucide-react";

export default function VendorWelcomePage() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If not authenticated, redirect to login page
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);
  
  // Function to update vendor setup stage and navigate to dashboard
  const startOnboarding = async () => {
    if (user) {
      // Update vendor profile to reflect they've started onboarding
      try {
        await supabase
          .from("vendor_profiles")
          .update({
            updated_at: new Date().toISOString(),
            last_active: new Date().toISOString(),
          })
          .eq('user_id', user.id);
          
        // Store setup progress in localStorage
        localStorage.setItem("vendorSetupProgress", "10");
        localStorage.setItem("vendorSetupStage", "profile");
      } catch (error) {
        console.error("Error updating vendor profile:", error);
      }
      
      // Navigate to the vendor dashboard
      navigate("/vendor/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Venuapp!</h1>
        
        <p className="text-lg text-gray-600">
          Your vendor account has been created successfully.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-6 text-left">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">What's next?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <span>Complete your business profile with details about your services</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <span>Add your service offerings and pricing information</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <span>Set your availability for events</span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <span>Go live and start receiving booking requests</span>
            </li>
          </ul>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={startOnboarding} 
            className="px-8 py-6 text-lg bg-venu-orange hover:bg-venu-dark-orange"
          >
            Start Your Onboarding Process
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            We're excited to have you join our platform!
          </p>
        </div>
      </div>
    </div>
  );
}
