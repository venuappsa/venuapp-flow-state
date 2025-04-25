
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Login successful!" });
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast({ title: "Signup successful! Please check your email to verify." });
      }
      navigate("/");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <form className="flex flex-col gap-4 bg-white p-6 rounded shadow max-w-sm w-full" onSubmit={onSubmit}>
        <h2 className="text-xl font-bold text-center">{type === "login" ? "Login" : "Create an account"}</h2>
        <Input required autoFocus placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input required placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button disabled={loading} type="submit">{loading ? "..." : (type === "login" ? "Login" : "Sign Up")}</Button>
        <button
          type="button"
          className="text-xs text-gray-500 hover:underline"
          onClick={() => setType(type === "login" ? "signup" : "login")}>
          {type === "login" ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </form>
    </div>
  );
}
