import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";
import { createProfileAndRole, sendOtp } from "@/hooks/useAuthHelpers";
import type { Enums } from "@/integrations/supabase/types";
import RedirectLoaderOverlay from "@/components/RedirectLoaderOverlay";
import useAuthLoadingState from "@/hooks/useAuthLoadingState";
import { toast } from "@/components/ui/use-toast";
import AuthForm from "./AuthForm";
import OtpStep from "./OtpStep";
import { ROLE_OPTIONS } from "./roleOptions";

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
  const { data: userRoles, isLoading: rolesLoading } = useUserRoles(userId);
  const isAuthLoading = useAuthLoadingState();

  useRoleRedirect({
    pendingRedirect,
    userId,
    userRoles,
    rolesLoading,
    setPendingRedirect,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        setPendingRedirect(true);
      }
    });
  }, []);

  const handleQuickLogin = () => {
    setEmail("test@example.com");
    setPassword("password123");
    setType("login");
    toast({ title: "Demo credentials filled!" });
  };

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
        console.log("[AuthPage] Signup attempt", { email, password, result: data, error });
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
        setLoading(false);
      }
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log("[AuthPage] Login attempt", { email, password, result: data, error });
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
      setUserId(data.user.id);
      setPendingRedirect(true);
      toast({ title: "Login successful!" });
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
        <RedirectLoaderOverlay />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
        <form
          className="flex flex-col gap-4 bg-white p-6 rounded shadow max-w-sm w-full"
          onSubmit={otpStep ? onOtpSubmit : onSubmit}
        >
          <h2 className="text-xl font-bold text-center">
            {otpStep
              ? "Enter OTP"
              : type === "login"
                ? "Login"
                : "Create an account"}
          </h2>
          <div style={{ display: "none" }}>
            <label htmlFor="extra">Leave blank</label>
            <input
              id="extra"
              name="extra"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
            />
          </div>
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
        </form>
      </div>
    </>
  );
}
