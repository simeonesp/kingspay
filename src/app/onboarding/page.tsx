'use client';

import React from 'react';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { SignUpStep } from '@/components/merchant/SignUpStep';
import { VerifyEmailStep } from '@/components/merchant/VerifyEmailStep';
import { VerificationStep } from '@/components/merchant/VerificationStep';
import { PayoutSetupStep } from '@/components/merchant/PayoutSetupStep';
import { useOnboardingStore } from '@/store/onboardingStore';
import type { AccountStatus } from '@/store/onboardingStore';
import { cn } from '@/lib/utils';

const MERCHANT_STEPS = [
  { label: 'Create account', description: 'Email & password' },
  { label: 'Verify email', description: 'Confirm your inbox' },
  { label: 'Verify business', description: 'KYB/KYC' },
  { label: 'Connect bank', description: 'Payout setup' },
  { label: 'Done!', description: 'Go live' },
];

const ALL_STATUSES: AccountStatus[] = [
  'draft',
  'email_pending',
  'verification_pending',
  'manual_review',
  'info_requested',
  'rejected',
  'payout_pending',
  'active',
];

const STATUS_LABELS: Record<AccountStatus, string> = {
  draft: 'Draft',
  email_pending: 'Email pending',
  verification_pending: 'Verif. pending',
  manual_review: 'Manual review',
  info_requested: 'Info requested',
  rejected: 'Rejected',
  payout_pending: 'Payout pending',
  active: 'Active',
};

export default function OnboardingPage() {
  const {
    merchant,
    setMerchantStep,
    setAccountStatus,
    resetMerchant,
  } = useOnboardingStore();

  const { currentStep } = merchant;

  function handleBack() {
    if (currentStep > 0) setMerchantStep(currentStep - 1);
  }

  function renderStep() {
    switch (currentStep) {
      case 0:
        return <SignUpStep onComplete={() => setMerchantStep(1)} />;
      case 1:
        return <VerifyEmailStep onComplete={() => setMerchantStep(2)} />;
      case 2:
        return <VerificationStep onComplete={() => setMerchantStep(3)} />;
      case 3:
        return <PayoutSetupStep onComplete={() => setMerchantStep(4)} />;
      case 4:
        return (
          <div className="flex flex-col items-center gap-6 text-center py-4">
            <div className="w-20 h-20 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto">
              <span className="text-4xl">🎉</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#111827] tracking-tight">
                You&apos;re all set!
              </h1>
              <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed max-w-xs mx-auto">
                Your merchant account is active. Head to your dashboard to take your
                first payment.
              </p>
            </div>
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-[#0000EE] text-white text-base font-semibold rounded-[14px] hover:bg-[#0000CC] transition-colors w-full"
            >
              Go to dashboard
            </a>
            <button
              onClick={resetMerchant}
              className="text-sm text-[#9CA3AF] hover:text-[#6B7280]"
            >
              Reset demo
            </button>
          </div>
        );
      default:
        return <SignUpStep />;
    }
  }

  return (
    <OnboardingLayout
      steps={MERCHANT_STEPS}
      currentStep={Math.min(currentStep, MERCHANT_STEPS.length - 1)}
      onBack={currentStep > 0 && currentStep < 4 ? handleBack : undefined}
      mode="merchant"
    >
      {/* Dev status switcher */}
      <div className="mb-5 -mx-2">
        <details className="group">
          <summary className="cursor-pointer text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide list-none flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#F5F8FF] select-none">
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            Dev: Account status switcher
          </summary>
          <div className="mt-2 flex flex-wrap gap-1.5 px-2">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setAccountStatus(s)}
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium border transition-all',
                  merchant.status === s
                    ? 'bg-[#0000EE] text-white border-[#0000EE]'
                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#0000EE]'
                )}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 px-2">
            <span className="text-xs text-[#9CA3AF]">Jump to step:</span>
            {MERCHANT_STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => setMerchantStep(i)}
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium border transition-all',
                  currentStep === i
                    ? 'bg-[#0000EE] text-white border-[#0000EE]'
                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#0000EE]'
                )}
              >
                {i}: {step.label}
              </button>
            ))}
          </div>
        </details>
      </div>

      {renderStep()}
    </OnboardingLayout>
  );
}
