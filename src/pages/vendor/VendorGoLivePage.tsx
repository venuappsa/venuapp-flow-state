import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";

export default function VendorGoLivePage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [termsChecked, setTermsChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // You can add any initialization logic here
  }, []);

  const handleGoLive = async () => {
    if (!user) return;

    try {
      setSubmitting(true);

      // Update vendor profile to "live" status
      const { error } = await supabase
        .from("vendor_profiles")
        .update({
          setup_progress: 100,
          verification_status: "verified",
          status: "active"
        })
        .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    toast({
      title: "Congratulations!",
      description: "Your vendor profile is now live and visible to hosts."
    });

    // Redirect to dashboard
    navigate("/vendor/dashboard");
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: error.message,
    });
  } finally {
    setSubmitting(false);
  }
};

  return (
    <VendorPanelLayout>
      <div className="container max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">Go Live</h1>
        <p className="text-gray-500 mb-6">
          Review your profile and get ready to connect with hosts.
        </p>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
          <p className="text-gray-700 mb-4">
            Please read and accept the terms and conditions before going live.
          </p>

          <div className="mb-4">
            <Label htmlFor="terms" className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsChecked}
                onCheckedChange={setTermsChecked}
                disabled={submitting}
              />
              <span>I agree to the terms and conditions</span>
            </Label>
          </div>

          <Button
            className="w-full"
            onClick={handleGoLive}
            disabled={!termsChecked || submitting}
          >
            {submitting ? "Submitting..." : "Go Live"}
          </Button>
        </div>
      </div>
    </VendorPanelLayout>
  );
}
