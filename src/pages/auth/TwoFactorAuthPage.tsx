
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { LockKeyhole, AlertCircle, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function TwoFactorAuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [otpCode, setOtpCode] = useState("");
  
  // Get email from location state, if available
  const email = location.state?.email || "your account";
  
  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      setVerificationError("Please enter a valid 6-digit code.");
      return;
    }
    
    setIsLoading(true);
    setVerificationError("");
    
    try {
      // For demo purposes, simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would verify the 2FA code
      
      toast({
        title: "Verification successful",
        description: "You have been successfully authenticated."
      });
      
      // Redirect based on email (simulating role-based redirect)
      if (email.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/host");
      }
    } catch (error: any) {
      console.error("Error verifying code:", error);
      setVerificationError(error.message || "Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center flex items-center justify-center">
            <ShieldCheck className="mr-2 h-5 w-5" /> Two-Factor Authentication
          </CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code sent to {email}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {verificationError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{verificationError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <LockKeyhole className="h-10 w-10 text-venu-orange mb-2" />
              
              <InputOTP 
                value={otpCode} 
                onChange={setOtpCode} 
                maxLength={6}
                render={({ slots }) => (
                  <InputOTPGroup className="gap-2">
                    {slots.map((slot, index) => (
                      <InputOTPSlot 
                        key={index} 
                        {...slot} 
                        className="w-12 h-14 text-xl border-venu-orange/30 focus:border-venu-orange"
                      />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            
            <Button 
              className="w-full bg-venu-orange hover:bg-venu-dark-orange" 
              onClick={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
            
            <div className="text-center">
              <Button variant="link" className="text-sm text-gray-500">
                Didn't receive a code? Resend
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="w-full text-center text-xs text-gray-500">
            <p>
              This is a demo 2FA page. For testing, enter any 6 digits.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
