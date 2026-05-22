'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { OTPInput } from '@/components/ui/OTPInput';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';
import { maskEmail, maskPhone } from '@/lib/utils';

const COOLDOWN_SECONDS = 60;

interface VerifyCodeStepProps {
  onComplete?: () => void;
}

export function VerifyCodeStep({ onComplete }: VerifyCodeStepProps) {
  const { payer, setPayerStep } = useOnboardingStore();

  const contact =
    payer.contactType === 'phone'
      ? maskPhone(payer.phone || '+447700900000')
      : maskEmail(payer.email || 'you@example.com');

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleVerify = useCallback(
    async (finalCode: string) => {
      setVerifying(true);
      setError('');
      await new Promise((r) => setTimeout(r, 1200));
      // Accept any 6-digit code for demo
      if (finalCode.length === 6) {
        setPayerStep(2);
        setVerifying(false);
        onComplete?.();
      } else {
        setError('Invalid code. Please try again.');
        setCode('');
        setVerifying(false);
      }
    },
    [setPayerStep, onComplete]
  );

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setResendSuccess(false);
    await new Promise((r) => setTimeout(r, 800));
    setResending(false);
    setResendSuccess(true);
    setCooldown(COOLDOWN_SECONDS);
    setCode('');
    setError('');
    setTimeout(() => setResendSuccess(false), 3000);
  }, [cooldown, resending]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#FFF0EB] flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔐</span>
        </div>
        <h1 className="text-2xl font-black text-[#111827] tracking-tight">
          Enter your code
        </h1>
        <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed">
          We sent a 6-digit code to{' '}
          <strong className="text-[#374151]">{contact}</strong>
        </p>
      </div>

      {/* OTP input */}
      <div className="flex flex-col items-center gap-3">
        <OTPInput
          value={code}
          onChange={(v) => {
            setCode(v);
            if (error) setError('');
          }}
          onComplete={handleVerify}
          disabled={verifying}
          autoFocus
          error={!!error}
        />
        {error && (
          <p role="alert" className="text-sm text-[#EF4444] font-medium animate-fade-in">
            {error}
          </p>
        )}
      </div>

      {/* Resend success */}
      {resendSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 text-sm text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl px-4 py-3 animate-fade-in"
        >
          <CheckCircle2 size={16} className="text-[#10B981] shrink-0" aria-hidden="true" />
          New code sent! Check your {payer.contactType === 'phone' ? 'messages' : 'inbox'}.
        </div>
      )}

      {/* Verify button */}
      <Button
        variant="warm"
        size="lg"
        fullWidth
        loading={verifying}
        disabled={code.length < 6}
        onClick={() => handleVerify(code)}
      >
        {verifying ? 'Verifying…' : 'Verify code'}
      </Button>

      {/* Resend */}
      <div className="text-center">
        <button
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className={cn(
            'inline-flex items-center gap-1.5 text-sm font-medium transition-colors',
            cooldown > 0 || resending
              ? 'text-[#9CA3AF] cursor-not-allowed'
              : 'text-[#FF6B35] hover:text-[#E55A22]'
          )}
        >
          <RefreshCw size={13} aria-hidden="true" />
          {resending
            ? 'Sending…'
            : cooldown > 0
            ? `Resend code in ${cooldown}s`
            : 'Resend code'}
        </button>
      </div>

      <p className="text-center text-xs text-[#9CA3AF]">
        Wrong number?{' '}
        <button
          className="text-[#FF6B35] font-semibold hover:underline"
          onClick={() => setPayerStep(0)}
        >
          Go back
        </button>
      </p>
    </div>
  );
}

export default VerifyCodeStep;
