
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

interface OtpStepProps {
  loading: boolean;
  otpInput: string;
  setOtpInput: (v: string) => void;
  onOtpSubmit: (e: React.FormEvent) => void;
}

export default function OtpStep({ loading, otpInput, setOtpInput, onOtpSubmit }: OtpStepProps) {
  return (
    <form 
      onSubmit={onOtpSubmit}
      className="flex flex-col gap-4 bg-white p-6 rounded shadow max-w-sm w-full"
      aria-labelledby="otp-title"
    >
      <h2 id="otp-title" className="text-xl font-bold text-center">Verify your email</h2>
      <div className="space-y-2">
        <label htmlFor="otp-input" className="sr-only">Enter OTP code</label>
        <Input
          id="otp-input"
          required
          autoFocus
          placeholder="Enter OTP code"
          value={otpInput}
          onChange={e => setOtpInput(e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          className="text-center text-lg tracking-widest"
          aria-label="One-time password"
        />
      </div>
      <Button disabled={loading} type="submit">
        {loading ? "Verifying..." : "Verify"}
      </Button>
    </form>
  );
}
