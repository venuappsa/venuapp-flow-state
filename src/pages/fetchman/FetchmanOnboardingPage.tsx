
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { UserService } from "@/services/UserService";

export default function FetchmanOnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    vehicle_type: "",
    work_hours: "",
    service_area: "",
    phone_number: "",
    identity_number: "",
    has_own_transport: false,
    bank_account_number: "",
    bank_name: "",
    branch_code: ""
  });
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [loading, setLoading] = useState({
    profile: true,
    submit: false
  });

  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('fetchman_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking fetchman profile:", error);
          return;
        }
        
        if (data) {
          setExistingProfile(data);
          // Pre-fill form data if profile exists
          setFormData({
            vehicle_type: data.vehicle_type || "",
            work_hours: data.work_hours || "",
            service_area: data.service_area || "",
            phone_number: data.phone_number || "",
            identity_number: data.identity_number || "",
            has_own_transport: data.has_own_transport || false,
            bank_account_number: data.bank_account_number || "",
            bank_name: data.bank_name || "",
            branch_code: data.branch_code || ""
          });
        }
      } catch (err) {
        console.error("Error in checkExistingProfile:", err);
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }
    };
    
    checkExistingProfile();
  }, [user]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create your Fetchman profile.",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
    }
    
    // Validate form data
    const requiredFields = [
      'vehicle_type',
      'work_hours',
      'service_area',
      'phone_number',
      'identity_number',
      'bank_account_number',
      'bank_name',
      'branch_code'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(prev => ({ ...prev, submit: true }));
    
    try {
      const result = await UserService.createFetchmanProfile(user.id, formData);
      
      if (!result.success) {
        toast({
          title: "Profile Creation Failed",
          description: result.error || "Failed to create profile. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: existingProfile ? "Profile Updated" : "Profile Created",
        description: existingProfile 
          ? "Your Fetchman profile has been updated successfully." 
          : "Your Fetchman profile has been created and is pending verification.",
      });
      
      navigate('/fetchman/dashboard');
    } catch (err: any) {
      console.error("Error submitting fetchman profile:", err);
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1) {
      const step1Fields = ['vehicle_type', 'work_hours', 'service_area', 'phone_number'];
      const missingFields = step1Fields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  if (loading.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {existingProfile ? "Update Fetchman Profile" : "Become a Fetchman"}
          </h1>
          <p className="mt-2 text-gray-600">
            {existingProfile 
              ? "Update your profile information for verification" 
              : "Join our delivery team and earn money on your schedule"}
          </p>
        </div>
        
        <div className="flex justify-between text-sm mb-4">
          <div className={`font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
            Personal Details
          </div>
          <div className={`font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
            Identity Verification
          </div>
          <div className={`font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
            Banking Details
          </div>
        </div>
        
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>
                Tell us about yourself and your delivery preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number*</Label>
                <Input
                  id="phone_number"
                  placeholder="Enter your phone number"
                  value={formData.phone_number}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicle_type">Vehicle Type*</Label>
                <Select
                  value={formData.vehicle_type}
                  onValueChange={(value) => handleChange('vehicle_type', value)}
                >
                  <SelectTrigger id="vehicle_type">
                    <SelectValue placeholder="Select your vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bicycle">Bicycle</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="work_hours">Preferred Work Hours*</Label>
                <Select
                  value={formData.work_hours}
                  onValueChange={(value) => handleChange('work_hours', value)}
                >
                  <SelectTrigger id="work_hours">
                    <SelectValue placeholder="Select preferred hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                    <SelectItem value="evening">Evening (6PM - 12AM)</SelectItem>
                    <SelectItem value="night">Night (12AM - 6AM)</SelectItem>
                    <SelectItem value="full_day">Full Day</SelectItem>
                    <SelectItem value="weekends">Weekends Only</SelectItem>
                    <SelectItem value="weekdays">Weekdays Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service_area">Service Area*</Label>
                <Select
                  value={formData.service_area}
                  onValueChange={(value) => handleChange('service_area', value)}
                >
                  <SelectTrigger id="service_area">
                    <SelectValue placeholder="Select your service area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandton">Sandton</SelectItem>
                    <SelectItem value="rosebank">Rosebank</SelectItem>
                    <SelectItem value="johannesburg_cbd">Johannesburg CBD</SelectItem>
                    <SelectItem value="melville">Melville</SelectItem>
                    <SelectItem value="braamfontein">Braamfontein</SelectItem>
                    <SelectItem value="fourways">Fourways</SelectItem>
                    <SelectItem value="randburg">Randburg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="has_own_transport"
                  checked={formData.has_own_transport}
                  onCheckedChange={(checked) => handleChange('has_own_transport', checked)}
                />
                <Label htmlFor="has_own_transport">I have my own transport</Label>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button onClick={nextStep}>
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Identity Verification</CardTitle>
              <CardDescription>
                We need to verify your identity for security purposes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identity_number">ID Number*</Label>
                <Input
                  id="identity_number"
                  placeholder="Enter your ID number"
                  value={formData.identity_number}
                  onChange={(e) => handleChange('identity_number', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Upload ID Document</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <p className="text-sm text-gray-500">
                    Feature coming soon - ID document upload functionality
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => {
                      toast({
                        title: "Feature Coming Soon",
                        description: "Document upload will be available in a future update."
                      });
                    }}
                  >
                    Upload Document
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Previous Step
                </Button>
                <Button onClick={nextStep}>
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Banking Details</CardTitle>
              <CardDescription>
                Provide your banking information for payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank_name">Bank Name*</Label>
                <Select
                  value={formData.bank_name}
                  onValueChange={(value) => handleChange('bank_name', value)}
                >
                  <SelectTrigger id="bank_name">
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fnb">First National Bank</SelectItem>
                    <SelectItem value="absa">ABSA</SelectItem>
                    <SelectItem value="standard_bank">Standard Bank</SelectItem>
                    <SelectItem value="nedbank">Nedbank</SelectItem>
                    <SelectItem value="capitec">Capitec</SelectItem>
                    <SelectItem value="discovery">Discovery Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bank_account_number">Account Number*</Label>
                <Input
                  id="bank_account_number"
                  placeholder="Enter your account number"
                  value={formData.bank_account_number}
                  onChange={(e) => handleChange('bank_account_number', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="branch_code">Branch Code*</Label>
                <Input
                  id="branch_code"
                  placeholder="Enter your branch code"
                  value={formData.branch_code}
                  onChange={(e) => handleChange('branch_code', e.target.value)}
                />
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Previous Step
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={loading.submit}
                >
                  {loading.submit ? "Submitting..." : existingProfile ? "Update Profile" : "Submit Application"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
