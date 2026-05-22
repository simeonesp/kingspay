'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Mail, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useOnboardingStore } from '@/store/onboardingStore';
import { maskEmail } from '@/lib/utils';

const COOLDOWN_SECONDS = 60;

interface VerifyEmailStepProps {
  onComplete?: () => void;
}

export function VerifyEmailStep({ onComplete }: VerifyEmailStepProps) {
  const { merchant, setAccountStatus, setMerchantStep } = useOnboardingStore();
  const email = merchant.formData.email || 'you@example.com';

  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);
  const [resendCount, setResendCount] = useState(0);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setResendSuccess(false);
    // Simulate email send
    await new Promise((r) => setTimeout(r, 1000));
    setResending(false);
    setResendCount((c) => c + 1);
    setResendSuccess(true);
    setCooldown(COOLDOWN_SECONDS);
    setTimeout(() => setResendSuccess(false), 3000);
  }, [cooldown, resending]);

  const handleVerify = useCallback(async () => {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1200));
    setAccountStatus('verification_pending');
    setMerchantStep(2);
    setVerifying(false);
    onComplete?.();
  }, [setAccountStatus, setMerchantStep, onComplete]);

  return (
    <div className="flex flex-col gap-6">
      {/* Illustration */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[#E8E8FF] flex items-center justify-center">
            <Mail size={36} className="text-[#0000EE]" aria-hidden="true" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#10B981] flex items-center justify-center border-2 border-white">
            <CheckCircle2 size={14} className="text-white" aria-hidden="true" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Check your inbox
          </h1>
          <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed max-w-xs mx-auto">
            We sent a verification link to{' '}
            <strong className="text-[#374151] font-semibold">{maskEmail(email)}</strong>.
            Click the link to activate your account.
          </p>
        </div>
      </div>

      {/* Steps hint */}
      <div className="bg-[#F5F8FF] rounded-xl p-4 border border-[#E5E7EB]">
        <ol className="flex flex-col gap-2.5">
          {[
            'Open the email from KingsPay',
            'Click "Verify my email" in the email',
            'You\'ll be redirected back automatically',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#0000EE] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-[#374151]">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Resend success */}
      {resendSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 text-sm text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl px-4 py-3 animate-fade-in"
        >
          <CheckCircle2 size={16} className="text-[#10B981] shrink-0" aria-hidden="true" />
          Email resent successfully! Check your inbox.
        </div>
      )}

      {/* CTA buttons */}
      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={verifying}
          onClick={handleVerify}
        >
          {verifying ? 'Confirming…' : 'I\'ve verified my email'}
        </Button>

        <Button
          variant="ghost"
          size="md"
          fullWidth
          disabled={cooldown > 0}
          loading={resending}
          onClick={handleResend}
          leftIcon={<RefreshCw size={14} aria-hidden="true" />}
        >
          {resending
            ? 'Sending…'
            : cooldown > 0
            ? `Resend in ${cooldown}s`
            : resendCount > 0
            ? 'Resend again'
            : 'Resend verification email'}
        </Button>
      </div>

      {/* Help */}
      <div className="border-t border-[#E5E7EB] pt-4">
        <p className="text-xs text-[#9CA3AF] text-center leading-relaxed">
          Didn&apos;t receive the email? Check your spam folder or{' '}
          <a href="/support" className="text-[#0000EE] font-semibold hover:underline">
            contact support
          </a>
          . Email may take up to 5 minutes to arrive.
        </p>
      </div>
    </div>
  );
}

export default VerifyEmailStep;
