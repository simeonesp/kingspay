'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressSteps, type Step } from '@/components/ui/ProgressSteps';

export interface OnboardingLayoutProps {
  children: React.ReactNode;
  steps: Step[];
  currentStep: number;
  onBack?: () => void;
  mode?: 'merchant' | 'payer';
  className?: string;
}

export function OnboardingLayout({
  children,
  steps,
  currentStep,
  onBack,
  mode = 'merchant',
  className,
}: OnboardingLayoutProps) {
  const accentColor = mode === 'payer' ? '#FF6B35' : '#0000EE';
  const accentLight = mode === 'payer' ? '#FFF0EB' : '#E8E8FF';

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col bg-[#F5F8FF]',
        className
      )}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-4 sm:px-6">
        <div className="max-w-2xl mx-auto h-14 flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-1.5 font-bold text-lg tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000EE] rounded-md"
            aria-label="KingsPay home"
          >
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-[8px] text-white text-sm font-black"
              style={{ backgroundColor: accentColor }}
              aria-hidden="true"
            >
              K
            </span>
            <span className="text-[#111827]">
              Kings<span style={{ color: accentColor }}>Pay</span>
            </span>
          </a>

          {/* Mode badge */}
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: accentLight, color: accentColor }}
          >
            {mode === 'merchant' ? 'Merchant Setup' : 'Payer Setup'}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <ProgressSteps steps={steps} currentStep={currentStep} />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center py-6 sm:py-10 px-4">
        <div className="w-full max-w-md sm:max-w-lg">
          {/* Back button */}
          {currentStep > 0 && onBack && (
            <button
              onClick={onBack}
              className={cn(
                'inline-flex items-center gap-1.5 mb-4 text-sm font-medium text-[#6B7280]',
                'hover:text-[#374151] transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000EE] rounded-md px-1 py-0.5'
              )}
              aria-label="Go back to previous step"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Back
            </button>
          )}

          {/* Card shell */}
          <div
            className={cn(
              'bg-white rounded-2xl border border-[#E5E7EB]',
              'shadow-[0_4px_24px_rgba(0,0,0,0.07)]',
              'p-6 sm:p-8',
              'animate-fade-in'
            )}
          >
            {children}
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-[#9CA3AF] mt-4">
            Protected by 256-bit TLS encryption &middot; PCI DSS Compliant
          </p>
        </div>
      </main>
    </div>
  );
}

export default OnboardingLayout;
