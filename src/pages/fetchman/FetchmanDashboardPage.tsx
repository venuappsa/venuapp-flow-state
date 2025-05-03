import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FetchmanDashboardPage() {
  const { user } = useUser();
  const [fetchmanProfile, setFetchmanProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFetchmanProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('fetchman_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking fetchman profile:", error);
        }
        
        setFetchmanProfile(data);
      } catch (err) {
        console.error("Error fetching fetchman profile:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkFetchmanProfile();
  }, [user]);
  
  const getVerificationStatus = () => {
    if (!fetchmanProfile) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profile Not Found</AlertTitle>
          <AlertDescription>
            Your fetchman profile has not been created. Please complete the onboarding process.
            <div className="mt-2">
              <Button onClick={() => navigate('/fetchman/onboarding')}>
                Complete Onboarding
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }
    
    switch(fetchmanProfile.verification_status) {
      case 'pending':
        return (
          <Alert className="mb-6 border-yellow-500 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-700">Verification Pending</AlertTitle>
            <AlertDescription className="text-yellow-600">
              Your fetchman profile is currently under review. We'll notify you once it's approved.
            </AlertDescription>
          </Alert>
        );
      case 'verified':
        return (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">Verification Complete</AlertTitle>
            <AlertDescription className="text-green-600">
              Your fetchman profile has been verified. You can now accept delivery assignments.
            </AlertDescription>
          </Alert>
        );
      case 'declined':
        return (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Declined</AlertTitle>
            <AlertDescription>
              Your fetchman profile verification was declined. Please update your information and try again.
              <div className="mt-2">
                <Button onClick={() => navigate('/fetchman/onboarding')}>
                  Update Profile
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Fetchman Dashboard</h1>

      {loading ? (
        <div className="text-center py-10">Loading profile information...</div>
      ) : (
        getVerificationStatus()
      )}

      {/* Rest of the dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dashboard components will go here */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Quick Stats</h2>
          <p>Fetchman Dashboard is coming soon.</p>
        </div>
      </div>
    </div>
  );
}
