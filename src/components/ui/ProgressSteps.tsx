import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  label: string;
  description?: string;
}

export interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  compact?: boolean;
}

export function ProgressSteps({
  steps,
  currentStep,
  className,
  compact = false,
}: ProgressStepsProps) {
  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      {/* Mobile compact version */}
      <div className={cn('flex flex-col gap-1', compact ? '' : 'sm:hidden')}>
        <div className="flex items-center justify-between text-xs text-[#6B7280]">
          <span className="font-semibold text-[#0000EE]">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="font-medium">{steps[currentStep]?.label}</span>
        </div>
        <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0000EE] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-label={`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep]?.label}`}
          />
        </div>
      </div>

      {/* Desktop horizontal steps */}
      <ol
        className={cn(
          'flex items-start gap-0',
          compact ? 'hidden' : 'hidden sm:flex'
        )}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <li key={step.label} className="flex items-start flex-1 relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-4 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-0.5 transition-colors duration-300',
                    isCompleted ? 'bg-[#0000EE]' : 'bg-[#E5E7EB]'
                  )}
                  aria-hidden="true"
                />
              )}

              <div className="flex flex-col items-center gap-2 flex-1 relative z-10">
                {/* Circle */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-sm font-bold',
                    isCompleted && 'bg-[#0000EE] text-white',
                    isActive && 'bg-[#0000EE] text-white ring-4 ring-[#E8E8FF]',
                    isPending && 'bg-white border-2 border-[#E5E7EB] text-[#9CA3AF]'
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Label */}
                <div className="text-center px-1">
                  <p
                    className={cn(
                      'text-xs font-semibold leading-tight',
                      isActive ? 'text-[#0000EE]' : isCompleted ? 'text-[#374151]' : 'text-[#9CA3AF]'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5 leading-tight">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Hidden accessible summary */}
      <p className="sr-only">
        {steps.filter((_, i) => i < currentStep).length} of {steps.length} steps completed.
        Currently on step {currentStep + 1}: {steps[currentStep]?.label}.
      </p>
    </nav>
  );
}

export default ProgressSteps;
