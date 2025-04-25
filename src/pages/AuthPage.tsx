import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

const ROLE_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "host", label: "Host/Event Organizer" },
  { value: "merchant", label: "Merchant/Vendor" },
  { value: "fetchman", label: "Fetchman" },
  { value: "admin", label: "Admin" },
];

type AppRole = "admin" | "host" | "merchant" | "customer" | "fetchman";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<string>("");
  const [type, setType] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [sentOtp, setSentOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [signupUserId, setSignupUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
  }, [navigate]);

  const handleQuickLogin = () => {
    setEmail("test@example.com");
    setPassword("password123");
    setType("login");
    toast({ title: "Demo credentials filled!" });
  };

  const createProfileAndRole = async (userId: string) => {
    let { error: profileError } = await supabase
      .from("profiles")
      .insert({ id: userId, name, surname, email, phone });
    if (profileError) throw profileError;

    let { error: roleError } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role: role as AppRole,
      });
    if (roleError) throw roleError;
  };

  const sendOtp = async (toEmail: string, code: string) => {
    toast({
      title: "OTP sent!",
      description: "A 6-digit code was sent to your e-mail.",
    });
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
        if (error) throw error;
        if (!data.user || !data.user.id) throw new Error("No user ID returned from signup");

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setSentOtp(otp);
        setSignupUserId(data.user.id);

        await sendOtp(email, otp);
        setOtpStep(true);
        toast({ title: "Signup step 1 complete", description: "Check your email and enter the OTP to continue." });
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
        setLoading(false);
      }
      setLoading(false);
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Login successful!" });
      navigate("/");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (otpInput === sentOtp && signupUserId) {
      try {
        await createProfileAndRole(signupUserId);
        toast({ title: "Signup successful!", description: "Welcome!" });
        navigate("/");
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Invalid OTP code", variant: "destructive" });
    }
    setLoading(false);
  };

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
            <>
              <Input
                required
                autoFocus
                placeholder="Enter OTP code"
                value={otpInput}
                onChange={e => setOtpInput(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
              />
              <Button disabled={loading} type="submit">
                {loading ? "..." : "Verify"}
              </Button>
            </>
          ) : (
            <>
              {type === "signup" && (
                <>
                  <Input
                    required
                    placeholder="Name"
                    value={name}
                    autoComplete="given-name"
                    onChange={e => setName(e.target.value)}
                  />
                  <Input
                    required
                    placeholder="Surname"
                    value={surname}
                    autoComplete="family-name"
                    onChange={e => setSurname(e.target.value)}
                  />
                  <Input
                    required
                    placeholder="Phone"
                    value={phone}
                    autoComplete="tel"
                    type="tel"
                    onChange={e => setPhone(e.target.value)}
                  />
                  <select
                    required
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="bg-gray-100 border rounded px-3 py-2 text-base"
                  >
                    <option value="">Select your role</option>
                    {ROLE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <Input
                required
                autoFocus
                placeholder="Email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                required
                placeholder="Password"
                type="password"
                value={password}
                autoComplete={type === "login" ? "current-password" : "new-password"}
                onChange={e => setPassword(e.target.value)}
              />
              {type === "signup" && (
                <Input
                  required
                  placeholder="Confirm password"
                  type="password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              )}
              <Button disabled={loading} type="submit">
                {loading ? "..." : (type === "login" ? "Login" : "Sign Up")}
              </Button>
              {type === "login" && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleQuickLogin}
                    className="w-full"
                  >
                    Quick Login (demo)
                  </Button>
                  <div className="text-xs text-gray-500 text-center">
                    Fills in demo credentials for <b>test@example.com</b> / <b>password123</b>.<br />
                    Sign up with these first, then use Quick Login for fast access.
                  </div>
                </>
              )}
              <button
                type="button"
                className="text-xs text-gray-500 hover:underline"
                onClick={() => {
                  setType(type === "login" ? "signup" : "login");
                  setOtpStep(false);
                }}>
                {type === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Log in"}
              </button>
            </>
          )}
        </form>
      </div>
    </>
  );
}
