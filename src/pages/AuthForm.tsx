
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ROLE_OPTIONS } from "./roleOptions";
import type { Enums } from "@/integrations/supabase/types";

interface AuthFormProps {
  type: "login" | "signup";
  onTypeChange: (type: "login" | "signup") => void;
  otpStep: boolean;
  setOtpStep: (val: boolean) => void;
  setPendingRedirect: (val: boolean) => void;
  setUserId: (val: string | null) => void;
  setSentOtp: (val: string) => void;
  setSignupUserId: (val: string | null) => void;
  setLoading: (val: boolean) => void;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  setConfirmPassword: (val: string) => void;
  setName: (val: string) => void;
  setSurname: (val: string) => void;
  setPhone: (val: string) => void;
  setRole: (val: Enums<"app_role"> | "") => void;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
  phone: string;
  role: Enums<"app_role"> | "";
  loading: boolean;
  honeypot: string;
  setHoneypot: (val: string) => void;
  handleQuickLogin: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AuthForm({
  type,
  onTypeChange,
  otpStep,
  setOtpStep,
  setUserId,
  setPendingRedirect,
  setSentOtp,
  setSignupUserId,
  setLoading,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  surname,
  setSurname,
  phone,
  setPhone,
  role,
  setRole,
  loading,
  honeypot,
  setHoneypot,
  handleQuickLogin,
  onSubmit,
}: AuthFormProps) {
  return (
    <form
      className="flex flex-col gap-4 bg-white p-6 rounded shadow max-w-sm w-full"
      onSubmit={onSubmit}
      aria-labelledby="auth-form-title"
    >
      <h2 id="auth-form-title" className="text-xl font-bold text-center">
        {type === "login" ? "Login" : "Create an account"}
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
      {type === "signup" && (
        <>
          <Input
            required
            placeholder="Name"
            name="given-name"
            id="given-name"
            value={name}
            autoComplete="given-name"
            onChange={e => setName(e.target.value)}
            aria-label="First name"
          />
          <Input
            required
            placeholder="Surname"
            name="family-name"
            id="family-name"
            value={surname}
            autoComplete="family-name"
            onChange={e => setSurname(e.target.value)}
            aria-label="Last name"
          />
          <Input
            required
            placeholder="Phone"
            name="tel"
            id="tel"
            value={phone}
            autoComplete="tel"
            type="tel"
            onChange={e => setPhone(e.target.value)}
            aria-label="Phone number"
          />
          <select
            required
            value={role}
            name="role"
            id="role"
            autoComplete="off"
            onChange={e => setRole(e.target.value as Enums<"app_role"> | "")}
            className="bg-gray-100 border rounded px-3 py-2 text-base"
            aria-label="Select your role"
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
        name="email"
        id="email"
        type="email"
        value={email}
        autoComplete="email"
        onChange={e => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <Input
        required
        placeholder="Password"
        name={type === "login" ? "current-password" : "new-password"}
        id={type === "login" ? "current-password" : "new-password"}
        type="password"
        value={password}
        autoComplete={type === "login" ? "current-password" : "new-password"}
        onChange={e => setPassword(e.target.value)}
        aria-label="Password"
      />
      {type === "signup" && (
        <Input
          required
          placeholder="Confirm password"
          name="confirm-password"
          id="confirm-password"
          type="password"
          value={confirmPassword}
          autoComplete="new-password"
          onChange={e => setConfirmPassword(e.target.value)}
          aria-label="Confirm password"
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
          onTypeChange(type === "login" ? "signup" : "login");
          setOtpStep(false);
        }}>
        {type === "login"
          ? "Don't have an account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </form>
  );
}
