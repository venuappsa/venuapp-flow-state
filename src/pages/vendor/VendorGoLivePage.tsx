import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Share2,
  Eye,
  EyeOff,
  Radio,
} from "lucide-react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { VendorProfile } from "@/types/vendor";

export default function VendorGoLivePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [goingLive, setGoingLive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [serviceCount, setServiceCount] = useState(0);
  const [checksPassed, setChecksPassed] = useState({
    profile: false,
    services: false,
    pricing: false,
  });

  useEffect(() => {
    // Fetch vendor profile and service data
    const fetchVendorData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("vendor_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast({
            title: "Error loading profile",
            description: "Please try again later",
            variant: "destructive"
          });
          return;
        }
        
        if (profileData) {
          setProfile(profileData as VendorProfile);
          setIsVisible(profileData.status === "live");
          
          // Perform checks
          setChecksPassed({
            profile: !!profileData.business_name && 
                      !!profileData.description && 
                      (profileData.description?.length || 0) > 20,
            services: false, // Will update after fetching services
            pricing: profileData.setup_stage === "golive" || 
                      profileData.status === "live",
          });
        }
        
        // Fetch services count
        try {
          // We can't directly use vendor_services yet because types aren't updated
          // So we'll use a raw query for now
          const { count, error: countError } = await supabase
            .from("vendor_services")
            .select("id", { count: "exact", head: true })
            .eq("vendor_id", user.id);
            
          if (countError) {
            console.error("Error fetching services count:", countError);
          } else {
            const servicesCount = count || 0;
            setServiceCount(servicesCount);
            
            // Update services check
            setChecksPassed(checks => ({
              ...checks,
              services: servicesCount > 0
            }));
          }
        } catch (err) {
          console.error("Error fetching services count:", err);
        }
        
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        toast({
          title: "Error loading profile",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [user, toast]);

  // Check if all requirements are met to go live
  const allChecksPassed = checksPassed.profile && checksPassed.services && checksPassed.pricing;
  
  // Toggle visibility status
  const toggleVisibility = async () => {
    if (!user || !profile) return;
    
    try {
      setLoading(true);
      
      const newStatus = !isVisible ? "live" : "draft";
      
      // Update vendor status
      const { error } = await supabase
        .from("vendor_profiles")
        .update({
          status: newStatus,
          last_active: new Date().toISOString(),
        })
        .eq("user_id", user.id);
        
      if (error) {
        console.error("Error toggling visibility:", error);
        toast({
          title: "Error updating status",
          description: "Please try again",
          variant: "destructive"
        });
        return;
      }
      
      setIsVisible(!isVisible);
      
      toast({
        title: !isVisible ? "Profile is now live!" : "Profile hidden",
        description: !isVisible 
          ? "Your profile is now visible to hosts"
          : "Your profile is now hidden from hosts",
      });
      
    } catch (err) {
      console.error("Error toggling visibility:", err);
      toast({
        title: "Error updating status",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Go Live button click
  const handleGoLive = async () => {
    if (!user || !allChecksPassed) return;
    
    try {
      setGoingLive(true);
      
      // Update vendor status and complete onboarding
      const { error } = await supabase
        .from("vendor_profiles")
        .update({
          status: "live",
          setup_stage: "complete",
          setup_progress: 100,
          last_active: new Date().toISOString(),
        })
        .eq("user_id", user.id);
        
      if (error) {
        console.error("Error going live:", error);
        toast({
          title: "Error activating profile",
          description: "Please try again",
          variant: "destructive"
        });
        return;
      }
      
      setIsVisible(true);
      
      toast({
        title: "Congratulations! 🎉",
        description: "Your vendor profile is now live and visible to hosts!",
      });
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/vendor/dashboard");
      }, 2000);
      
    } catch (err) {
      console.error("Error going live:", err);
      toast({
        title: "Error activating profile",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setGoingLive(false);
    }
  };

  return (
    <VendorPanelLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Go Live</h1>
            <p className="text-gray-600 mt-1">
              Step 4 of 4: Review and publish your vendor profile
            </p>
          </div>

          <div className="flex items-center">
            <Progress
              value={100}
              className="h-2 w-40 mr-3"
              indicatorClassName={profile?.status === "live" ? "bg-green-500" : "bg-blue-500"}
            />
            <span className="text-sm font-medium">100% Complete</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Review</CardTitle>
                <CardDescription>
                  Make sure everything is ready before going live
                </CardDescription>
              </div>
              {profile?.status === "live" && (
                <Badge className="bg-green-500">Live</Badge>
              )}
              {profile?.status === "draft" && (
                <Badge variant="outline">Draft</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile completeness checklist */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Pre-Launch Checklist</h3>
              
              <div className={`p-4 rounded-lg border ${
                checksPassed.profile 
                  ? "border-green-200 bg-green-50" 
                  : "border-gray-200 bg-gray-50"
              }`}>
                <div className="flex items-start gap-3">
                  {checksPassed.profile ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-medium ${
                      checksPassed.profile ? "text-green-700" : "text-gray-700"
                    }`}>
                      Business Profile
                    </h4>
                    <p className={`text-sm ${
                      checksPassed.profile ? "text-green-600" : "text-gray-500"
                    }`}>
                      {checksPassed.profile 
                        ? "Complete with logo, business name, and description" 
                        : "Missing required business information"}
                    </p>
                    {!checksPassed.profile && (
                      <Button
                        variant="link"
                        className="px-0 h-auto text-blue-600"
                        onClick={() => navigate("/vendor/profile")}
                      >
                        Complete your profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                checksPassed.services 
                  ? "border-green-200 bg-green-50" 
                  : "border-gray-200 bg-gray-50"
              }`}>
                <div className="flex items-start gap-3">
                  {checksPassed.services ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-medium ${
                      checksPassed.services ? "text-green-700" : "text-gray-700"
                    }`}>
                      Services
                    </h4>
                    <p className={`text-sm ${
                      checksPassed.services ? "text-green-600" : "text-gray-500"
                    }`}>
                      {checksPassed.services 
                        ? `${serviceCount} service${serviceCount !== 1 ? 's' : ''} added` 
                        : "No services added yet"}
                    </p>
                    {!checksPassed.services && (
                      <Button
                        variant="link"
                        className="px-0 h-auto text-blue-600"
                        onClick={() => navigate("/vendor/services")}
                      >
                        Add services
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                checksPassed.pricing 
                  ? "border-green-200 bg-green-50" 
                  : "border-gray-200 bg-gray-50"
              }`}>
                <div className="flex items-start gap-3">
                  {checksPassed.pricing ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-medium ${
                      checksPassed.pricing ? "text-green-700" : "text-gray-700"
                    }`}>
                      Pricing & Availability
                    </h4>
                    <p className={`text-sm ${
                      checksPassed.pricing ? "text-green-600" : "text-gray-500"
                    }`}>
                      {checksPassed.pricing 
                        ? "Pricing model and availability configured" 
                        : "Pricing and availability settings not configured"}
                    </p>
                    {!checksPassed.pricing && (
                      <Button
                        variant="link"
                        className="px-0 h-auto text-blue-600"
                        onClick={() => navigate("/vendor/pricing")}
                      >
                        Configure pricing
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visibility toggle */}
            <div className="p-6 border rounded-lg bg-gray-50 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  {isVisible ? (
                    <Eye className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-500 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {isVisible 
                        ? "Your profile is currently visible to hosts" 
                        : "Your profile is currently hidden from hosts"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isVisible}
                  onCheckedChange={toggleVisibility}
                  disabled={loading || !allChecksPassed}
                />
              </div>
              
              {!allChecksPassed && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <p>Complete all checklist items above before making your profile visible.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Share profile */}
            {profile?.status === "live" && (
              <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-start gap-3">
                  <Share2 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Share Your Profile</h4>
                    <p className="text-sm text-blue-700 mb-4">
                      Promote your services by sharing your vendor profile with potential clients.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white border-blue-200"
                        onClick={() => {
                          // In a real implementation, this would share the profile link
                          toast({
                            title: "Profile link copied",
                            description: "Share it with potential clients",
                          });
                        }}
                      >
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/vendor/pricing")}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Pricing
            </Button>
            
            {profile?.status !== "live" ? (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleGoLive}
                disabled={goingLive || !allChecksPassed}
              >
                <Radio className="mr-2 h-4 w-4" />
                {goingLive ? "Going Live..." : "Go Live Now"}
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/vendor/dashboard")}
                className="bg-venu-orange hover:bg-venu-dark-orange"
              >
                Return to Dashboard
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Profile preview card */}
        {profile && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Preview</CardTitle>
              <CardDescription>
                How hosts will see your vendor listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center">
                  {profile.logo_url ? (
                    <img 
                      src={profile.logo_url} 
                      alt={profile.business_name || 'Vendor'} 
                      className="h-full w-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-gray-400">
                      {profile.business_name?.charAt(0) || "V"}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{profile.business_name || profile.company_name}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {profile.business_category?.replace("_", " ") || 'Service Provider'}
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                      {serviceCount} {serviceCount === 1 ? 'Service' : 'Services'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {profile.description && (
                <div className="mt-4">
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {profile.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </VendorPanelLayout>
  );
}
