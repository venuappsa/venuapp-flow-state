
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
  );
}
