import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useRoleRedirect, getRedirectPageForRoles } from "@/hooks/useRoleRedirect";
import { createProfileAndRole, sendOtp } from "@/hooks/useAuthHelpers";
import type { Enums } from "@/integrations/supabase/types";
import RedirectLoaderOverlay from "@/components/RedirectLoaderOverlay";
import useAuthLoadingState from "@/hooks/useAuthLoadingState";
import { toast } from "@/components/ui/use-toast";
import AuthForm from "./AuthForm";
import OtpStep from "./OtpStep";
import useConnectionStatus from "@/hooks/useConnectionStatus";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useUser } from "@/hooks/useUser";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Enums<"app_role"> | "">("");
  const [type, setType] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [sentOtp, setSentOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [signupUserId, setSignupUserId] = useState<string | null>(null);
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, initialized } = useUser();
  const { data: userRoles = [], isLoading: rolesLoading } = useUserRoles(userId);
  
  const isAuthLoading = useAuthLoadingState();
  const { isConnected, isChecking, checkConnection } = useConnectionStatus();

  useRoleRedirect({
    pendingRedirect,
    userId,
    userRoles: Array.isArray(userRoles) ? userRoles : [],
    rolesLoading,
    setPendingRedirect,
  });

  useEffect(() => {
    let isMounted = true;
    let sessionCheckTimer: NodeJS.Timeout;
    
    if (location.state?.skipSessionCheck) {
      console.log("AuthPage: Skipping session check due to explicit navigation");
      return;
    }
    
    if (!initialized) {
      console.log("AuthPage: Waiting for useUser to initialize...");
      return;
    }
    
    if (user) {
      console.log("AuthPage: User exists from useUser hook, initiating redirect");
      setUserId(user.id);
      setPendingRedirect(true);
      return;
    }
    
    sessionCheckTimer = setTimeout(() => {
      console.log("AuthPage: Double-checking session status...");
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!isMounted) return;
        
        if (session) {
          console.log("AuthPage: Found existing session, initiating redirect...");
          setUserId(session.user.id);
          setPendingRedirect(true);
        } else {
          console.log("AuthPage: No session found, staying on auth page");
        }
      });
    }, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(sessionCheckTimer);
    };
  }, [user, initialized, location.state]);

  useEffect(() => {
    if (userId && userRoles && !rolesLoading && !pendingRedirect && location.pathname === "/auth") {
      console.log("AuthPage: User and roles ready, manual redirect check");
      const roleArray = Array.isArray(userRoles) ? userRoles : [];
      
      if (roleArray.length > 0) {
        const redirectPath = getRedirectPageForRoles(roleArray);
        console.log("AuthPage: Manual redirect check result:", redirectPath);
        
        if (redirectPath !== location.pathname) {
          navigate(redirectPath, { replace: true });
        }
      }
    }
  }, [userId, userRoles, rolesLoading, pendingRedirect, navigate, location.pathname]);

  const handleQuickLogin = () => {
    setEmail("test@example.com");
    setPassword("password123");
    setType("login");
    toast({ title: "Demo credentials filled!" });
  };

  if (isConnected === false) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              <div className="bg-amber-100 text-amber-800 p-4 rounded-md mb-6 w-full">
                <h2 className="text-lg font-medium mb-2">Connection Error</h2>
                <p className="text-sm mb-4">Unable to connect to the authentication server. This could be due to:</p>
                <ul className="list-disc pl-5 mb-4 text-sm">
                  <li>Internet connection issues</li>
                  <li>Temporary server downtime</li>
                  <li>Configuration problem</li>
                </ul>
                <Button 
                  onClick={checkConnection} 
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isChecking}
                >
                  {isChecking ? "Checking..." : "Try Again"} 
                  {!isChecking && <RefreshCw className="h-4 w-4" />}
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (honeypot) {
      setLoading(false);
      return;
    }
    if (type === "signup") {
      if (!role) {
        toast({ title: "Please select a role", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        toast({ title: "Passwords do not match", variant: "destructive" });
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        console.log("[AuthPage] Signup attempt", { email, result: data?.user?.id, error });
        
        if (error) throw error;
        if (!data.user || !data.user.id) throw new Error("No user ID returned from signup");
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setSentOtp(otp);
        setSignupUserId(data.user.id);
        await sendOtp({ email, code: otp, toast });
        setOtpStep(true);
        toast({ title: "Signup step 1 complete", description: "Check your email and enter the OTP to continue." });
      } catch (e: any) {
        console.error("[AuthPage] Signup ERROR", e);
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
      setLoading(false);
      return;
    }
    
    try {
      console.log("[AuthPage] Attempting login with:", { email });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log("[AuthPage] Login attempt result:", { userId: data?.user?.id, error });
      
      if (error) {
        console.error("[AuthPage] Login ERROR", error);
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      
      if (!data.user) {
        toast({ title: "Login failed", description: "No user returned.", variant: "destructive" });
        setLoading(false);
        return;
      }
      
      console.log("[AuthPage] Login successful, setting userId and pendingRedirect");
      setUserId(data.user.id);
      setPendingRedirect(true);
      toast({ title: "Login successful!" });
      
      const checkAndRedirect = async () => {
        console.log("[AuthPage] Attempting immediate redirect after login");
        const { data: rolesData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);
          
        if (rolesData && rolesData.length > 0) {
          const userRoles = rolesData.map((r: { role: string }) => r.role);
          console.log("[AuthPage] Immediate redirect with roles:", userRoles);
          const redirectPath = getRedirectPageForRoles(userRoles);
          navigate(redirectPath, { replace: true });
        } else {
          console.log("[AuthPage] No immediate roles found, relying on hook redirect");
        }
      };
      
      checkAndRedirect();
    } catch (e: any) {
      console.error("[AuthPage] Login Exception", e);
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (
      otpInput === sentOtp &&
      signupUserId &&
      role !== ""
    ) {
      try {
        await createProfileAndRole({
          userId: signupUserId,
          name,
          surname,
          email,
          phone,
          role,
        });
        setUserId(signupUserId);
        setPendingRedirect(true);
        toast({ title: "Signup successful!", description: "Welcome!" });
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Invalid OTP code", variant: "destructive" });
    }
    setLoading(false);
  };

  if (pendingRedirect || isAuthLoading) {
    return (
      <>
        <Navbar />
        <RedirectLoaderOverlay message="Setting up your dashboard..." />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
        {otpStep ? (
          <OtpStep
            loading={loading}
            otpInput={otpInput}
            setOtpInput={setOtpInput}
            onOtpSubmit={onOtpSubmit}
          />
        ) : (
          <AuthForm
            type={type}
            onTypeChange={setType}
            otpStep={otpStep}
            setOtpStep={setOtpStep}
            setUserId={setUserId}
            setPendingRedirect={setPendingRedirect}
            setSentOtp={setSentOtp}
            setSignupUserId={setSignupUserId}
            setLoading={setLoading}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            name={name}
            setName={setName}
            surname={surname}
            setSurname={setSurname}
            phone={phone}
            setPhone={setPhone}
            role={role}
            setRole={setRole}
            loading={loading}
            honeypot={honeypot}
            setHoneypot={setHoneypot}
            handleQuickLogin={handleQuickLogin}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </>
  );
}
