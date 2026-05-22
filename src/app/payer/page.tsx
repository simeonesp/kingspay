'use client';

import React from 'react';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { CreateAccountStep } from '@/components/payer/CreateAccountStep';
import { VerifyCodeStep } from '@/components/payer/VerifyCodeStep';
import { LinkCardStep } from '@/components/payer/LinkCardStep';
import { SetCurrencyStep } from '@/components/payer/SetCurrencyStep';
import { useOnboardingStore } from '@/store/onboardingStore';
import { cn } from '@/lib/utils';

const PAYER_STEPS = [
  { label: 'Create account', description: 'Phone or email' },
  { label: 'Verify code', description: 'One-time code' },
  { label: 'Add a card', description: 'Optional' },
  { label: 'Set currency', description: 'Your default' },
  { label: 'All done!', description: 'Ready to pay' },
];

export default function PayerOnboardingPage() {
  const { payer, setPayerStep, resetPayer } = useOnboardingStore();
  const { currentStep } = payer;

  function handleBack() {
    if (currentStep > 0) setPayerStep(currentStep - 1);
  }

  function renderStep() {
    switch (currentStep) {
      case 0:
        return <CreateAccountStep onComplete={() => setPayerStep(1)} />;
      case 1:
        return <VerifyCodeStep onComplete={() => setPayerStep(2)} />;
      case 2:
        return <LinkCardStep onComplete={() => setPayerStep(3)} />;
      case 3:
        return <SetCurrencyStep onComplete={() => setPayerStep(4)} />;
      case 4:
        return (
          <div className="flex flex-col items-center gap-6 text-center py-4">
            <div className="w-20 h-20 rounded-full bg-[#FFF0EB] flex items-center justify-center mx-auto">
              <span className="text-4xl">🚀</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#111827] tracking-tight">
                You&apos;re ready to pay!
              </h1>
              <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed max-w-xs mx-auto">
                Your KingsPay account is set up. Start making instant, secure payments
                to any merchant.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2">
              <a
                href="/payer-home"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-[#FF6B35] text-white text-base font-semibold rounded-[14px] hover:bg-[#E55A22] transition-colors w-full"
              >
                Start paying
              </a>
              {payer.skipCard && (
                <a
                  href="/payer-home"
                  className="inline-flex items-center justify-center px-7 py-2.5 border-2 border-[#FF6B35] text-[#FF6B35] text-sm font-semibold rounded-[14px] hover:bg-[#FFF0EB] transition-colors w-full"
                >
                  Add a card later
                </a>
              )}
            </div>

            <button
              onClick={resetPayer}
              className="text-sm text-[#9CA3AF] hover:text-[#6B7280]"
            >
              Reset demo
            </button>
          </div>
        );
      default:
        return <CreateAccountStep />;
    }
  }

  return (
    <OnboardingLayout
      steps={PAYER_STEPS}
      currentStep={Math.min(currentStep, PAYER_STEPS.length - 1)}
      onBack={currentStep > 0 && currentStep < 4 ? handleBack : undefined}
      mode="payer"
    >
      {/* Dev: step jumper */}
      <div className="mb-5 -mx-2">
        <details className="group">
          <summary className="cursor-pointer text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide list-none flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#F5F8FF] select-none">
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            Dev: Step navigator
          </summary>
          <div className="mt-2 flex flex-wrap gap-1.5 px-2">
            {PAYER_STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => setPayerStep(i)}
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium border transition-all',
                  currentStep === i
                    ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#FF6B35]'
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
