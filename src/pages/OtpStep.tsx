
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
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
        <InputOTP
          value={otpInput}
          onChange={setOtpInput}
          maxLength={6}
          render={({ slots }) => (
            <InputOTPGroup className="gap-2 flex justify-center">
              {slots.map((slot, index) => (
                <InputOTPSlot
                  key={index}
                  {...slot}
                  className="w-10 h-12 text-lg"
                  aria-label={`Digit ${index + 1} of OTP`}
                  autoComplete={index === 0 ? "one-time-code" : undefined}
                />
              ))}
            </InputOTPGroup>
          )}
        />
      </div>
      <Button 
        disabled={loading} 
        type="submit"
        aria-live="polite"
      >
        {loading ? "Verifying..." : "Verify"}
      </Button>
    </form>
  );
}
