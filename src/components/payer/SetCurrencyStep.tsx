'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  locale?: string;
}

const CURRENCIES: Currency[] = [
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', locale: 'en-GB' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', locale: 'de-DE' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', locale: 'en-NG' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', locale: 'sw-KE' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', flag: '🇬🇭', locale: 'en-GH' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', locale: 'en-ZA' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', locale: 'en-CA' },
];

function detectLocale(): string {
  if (typeof navigator !== 'undefined') {
    return navigator.language || 'en-US';
  }
  return 'en-US';
}

function suggestCurrency(): string {
  const locale = detectLocale();
  if (locale.startsWith('en-GB')) return 'GBP';
  if (locale.startsWith('en-NG') || locale.includes('NG')) return 'NGN';
  if (locale.startsWith('sw-KE') || locale.includes('KE')) return 'KES';
  if (locale.includes('GH')) return 'GHS';
  if (locale.includes('ZA')) return 'ZAR';
  if (locale.startsWith('en-CA') || locale.includes('CA')) return 'CAD';
  if (locale.startsWith('de') || locale.startsWith('fr') || locale.startsWith('es')) return 'EUR';
  return 'USD';
}

interface SetCurrencyStepProps {
  onComplete?: () => void;
}

export function SetCurrencyStep({ onComplete }: SetCurrencyStepProps) {
  const { setCurrency, setPayerStep } = useOnboardingStore();

  const [selected, setSelected] = useState<string>(suggestCurrency());
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setCurrency(selected);
    setPayerStep(4);
    setLoading(false);
    onComplete?.();
  }

  const selectedCurrency = CURRENCIES.find((c) => c.code === selected);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#FFF0EB] flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🌍</span>
        </div>
        <h1 className="text-2xl font-black text-[#111827] tracking-tight">
          Choose your currency
        </h1>
        <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed">
          Pick your primary currency. You can always send and receive in multiple
          currencies — this is just your default.
        </p>
      </div>

      {/* Currency grid */}
      <div
        className="grid grid-cols-2 gap-2"
        role="radiogroup"
        aria-label="Select currency"
      >
        {CURRENCIES.map((currency) => {
          const isSelected = selected === currency.code;
          return (
            <button
              key={currency.code}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(currency.code)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-150 text-left',
                isSelected
                  ? 'border-[#FF6B35] bg-[#FFF0EB]'
                  : 'border-[#E5E7EB] bg-white hover:border-[#FF6B35]/40 hover:bg-[#FFFAF7]'
              )}
            >
              <span className="text-xl shrink-0" aria-hidden="true">
                {currency.flag}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-sm font-bold leading-tight',
                    isSelected ? 'text-[#FF6B35]' : 'text-[#111827]'
                  )}
                >
                  {currency.symbol} {currency.code}
                </p>
                <p className="text-xs text-[#9CA3AF] truncate">{currency.name}</p>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[#FF6B35] flex items-center justify-center shrink-0">
                  <Check size={11} className="text-white" aria-hidden="true" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected summary */}
      {selectedCurrency && (
        <div className="bg-[#F5F8FF] rounded-xl border border-[#E5E7EB] px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">{selectedCurrency.flag}</span>
          <div>
            <p className="text-sm font-semibold text-[#111827]">
              {selectedCurrency.name} ({selectedCurrency.code})
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Prices and amounts will display in {selectedCurrency.symbol}
            </p>
          </div>
        </div>
      )}

      <Button
        variant="warm"
        size="lg"
        fullWidth
        loading={loading}
        onClick={handleContinue}
      >
        {loading ? 'Saving…' : 'Set currency & finish setup'}
      </Button>
    </div>
  );
}

export default SetCurrencyStep;
