
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar"; // Add the Navbar import

const ROLE_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "host", label: "Host/Event Organizer" },
  { value: "merchant", label: "Merchant/Vendor" },
  { value: "fetchman", label: "Fetchman" },
];

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [type, setType] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
  }, [navigate]);

  // Save user profile & role in tables
  const createProfileAndRole = async (userId: string) => {
    // Insert profile
    let { error: profileError } = await supabase
      .from("profiles")
      .insert({ id: userId, name, surname, email, phone });
    if (profileError) throw profileError;

    // Insert user role
    let { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role });
    if (roleError) throw roleError;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (honeypot) {
      setLoading(false);
      // silently fail for bots
      return;
    }
    try {
      if (type === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Login successful!" });
        navigate("/");
      } else {
        if (!role) throw new Error("Please select a role");

        // Signup
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Add profile and role for new user
        if (!data.user || !data.user.id) throw new Error("No user ID returned from signup");

        await createProfileAndRole(data.user.id);

        toast({ title: "Signup successful! Please check your email to verify." });
        navigate("/");
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
        <form className="flex flex-col gap-4 bg-white p-6 rounded shadow max-w-sm w-full" onSubmit={onSubmit}>
          <h2 className="text-xl font-bold text-center">
            {type === "login" ? "Login" : "Create an account"}
          </h2>

          {/* Honeypot for bots (hidden with CSS) */}
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
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
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
          <Button disabled={loading} type="submit">
            {loading ? "..." : (type === "login" ? "Login" : "Sign Up")}
          </Button>
          <button
            type="button"
            className="text-xs text-gray-500 hover:underline"
            onClick={() => setType(type === "login" ? "signup" : "login")}>
            {type === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </form>
      </div>
    </>
  );
}
