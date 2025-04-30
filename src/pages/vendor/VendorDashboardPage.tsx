
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, Clock } from "lucide-react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { VendorProfile } from "@/types/vendor";
import { useToast } from "@/components/ui/use-toast";

interface OnboardingStep {
  id: string;
  name: string;
  path: string;
  completed: boolean;
  icon: React.ReactNode;
}

export default function VendorDashboardPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Define the onboarding steps
  const onboardingSteps: OnboardingStep[] = [
    {
      id: "profile",
      name: "Complete Profile",
      path: "/vendor/profile",
      completed: vendorProfile?.setup_stage === "profile" || 
                vendorProfile?.setup_stage === "services" ||
                vendorProfile?.setup_stage === "pricing" ||
                vendorProfile?.setup_stage === "golive" ||
                vendorProfile?.status === "live",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      id: "services",
      name: "Add Services",
      path: "/vendor/services",
      completed: vendorProfile?.setup_stage === "services" || 
                vendorProfile?.setup_stage === "pricing" ||
                vendorProfile?.setup_stage === "golive" ||
                vendorProfile?.status === "live",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      id: "pricing",
      name: "Set Pricing & Availability",
      path: "/vendor/pricing",
      completed: vendorProfile?.setup_stage === "pricing" || 
                vendorProfile?.setup_stage === "golive" ||
                vendorProfile?.status === "live",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      id: "golive",
      name: "Go Live",
      path: "/vendor/go-live",
      completed: vendorProfile?.setup_stage === "golive" || 
                vendorProfile?.status === "live",
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];
  
  useEffect(() => {
    // Fetch vendor profile data when user is available
    const fetchVendorProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("vendor_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
          
        if (error) {
          console.error("Error fetching vendor profile:", error);
          toast({
            title: "Error loading profile",
            description: "Please try again later",
            variant: "destructive"
          });
          return;
        }
        
        if (data) {
          setVendorProfile(data as VendorProfile);
        }
      } catch (err) {
        console.error("Error in fetch operation:", err);
        toast({
          title: "Error loading profile",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendorProfile();
  }, [user, toast]);
  
  // Determine the next step based on current progress
  const getNextStep = (): OnboardingStep | undefined => {
    if (!vendorProfile) return undefined;
    
    const currentStageIndex = onboardingSteps.findIndex(
      step => step.id === vendorProfile.setup_stage
    );
    
    // If we found the current stage and it's not the last one
    if (currentStageIndex !== -1 && currentStageIndex < onboardingSteps.length - 1) {
      return onboardingSteps[currentStageIndex + 1];
    }
    
    // If we couldn't find the current stage, return the first incomplete step
    const firstIncompleteStep = onboardingSteps.find(step => !step.completed);
    return firstIncompleteStep;
  };
  
  // Get the next step
  const nextStep = getNextStep();

  return (
    <VendorPanelLayout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          {vendorProfile?.business_name ? `Welcome, ${vendorProfile.business_name}` : 'Vendor Dashboard'}
        </h1>
        
        {/* Onboarding Progress Card */}
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-lg md:text-xl text-blue-800">
              Onboarding Progress
            </CardTitle>
            <CardDescription>
              Complete all steps to go live with your vendor profile
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {vendorProfile?.setup_progress || 0}% Complete
                </span>
                <span className="text-sm text-gray-500">
                  {onboardingSteps.filter(step => step.completed).length} of {onboardingSteps.length} steps
                </span>
              </div>
              <Progress 
                value={vendorProfile?.setup_progress || 0} 
                className="h-2" 
                indicatorClassName={vendorProfile?.setup_progress === 100 ? "bg-green-500" : ""}
              />
            </div>
            
            <div className="space-y-4">
              {onboardingSteps.map((step, index) => {
                // Determine if this step is enabled (clickable)
                const isEnabled = index === 0 || onboardingSteps[index - 1].completed;
                
                // Create the step item
                return (
                  <div 
                    key={step.id}
                    className={`flex items-center p-3 rounded-lg border ${
                      step.completed 
                        ? "bg-green-50 border-green-200" 
                        : isEnabled 
                          ? "bg-blue-50 border-blue-200" 
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      step.completed 
                        ? "bg-green-500 text-white" 
                        : isEnabled 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-300 text-gray-500"
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        step.completed 
                          ? "text-green-700" 
                          : isEnabled 
                            ? "text-blue-700" 
                            : "text-gray-500"
                      }`}>
                        {step.name}
                      </h3>
                      
                      <p className={`text-xs ${
                        step.completed 
                          ? "text-green-600" 
                          : isEnabled 
                            ? "text-blue-600" 
                            : "text-gray-400"
                      }`}>
                        {step.completed 
                          ? "Completed" 
                          : isEnabled 
                            ? "Ready to complete" 
                            : "Complete previous steps first"}
                      </p>
                    </div>
                    
                    {isEnabled && !step.completed && (
                      <Link to={step.path}>
                        <Button 
                          variant="outline" 
                          className={`ml-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700`}
                        >
                          Start
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    
                    {step.completed && (
                      <Link to={step.path}>
                        <Button 
                          variant="ghost" 
                          className="ml-2 text-green-600 hover:bg-green-50 hover:text-green-700"
                        >
                          View
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
            
            {nextStep && (
              <div className="mt-6 pt-4 border-t">
                <Link to={nextStep.path}>
                  <Button 
                    className="w-full bg-venu-orange hover:bg-venu-dark-orange"
                  >
                    {nextStep.completed 
                      ? "View Your Profile" 
                      : `Continue with ${nextStep.name}`}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            )}
            
            {vendorProfile?.status === "live" && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white mr-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-green-700">Your profile is live!</h3>
                  <p className="text-xs text-green-600">
                    Your services are now visible to event hosts
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Additional dashboard cards would go here */}
        {vendorProfile?.setup_progress === 100 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Your recent platform activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Profile viewed by Host</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Service inquiry received</p>
                      <p className="text-sm text-gray-500">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Metrics</CardTitle>
                <CardDescription>How your profile is performing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">12</p>
                    <p className="text-sm text-blue-600">Profile Views</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">3</p>
                    <p className="text-sm text-green-600">Service Inquiries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </VendorPanelLayout>
  );
}
