'use client';

import React, { useState } from 'react';
import { CreditCard, Lock, Shield } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';

function detectCardBrand(number: string): string {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  if (/^6(?:011|5)/.test(n)) return 'Discover';
  return '';
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

interface LinkCardStepProps {
  onComplete?: () => void;
}

export function LinkCardStep({ onComplete }: LinkCardStepProps) {
  const { setCardLinked, setSkipCard, setPayerStep } = useOnboardingStore();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const cardBrand = detectCardBrand(cardNumber);

  function validate() {
    const e: Record<string, string> = {};
    const digits = cardNumber.replace(/\s/g, '');
    if (!digits) e.cardNumber = 'Card number is required';
    else if (digits.length < 13 || digits.length > 16)
      e.cardNumber = 'Enter a valid 13–16 digit card number';

    if (!expiry) e.expiry = 'Expiry date is required';
    else {
      const [mm, yy] = expiry.split('/');
      const month = parseInt(mm, 10);
      const year = parseInt(`20${yy}`, 10);
      const now = new Date();
      if (month < 1 || month > 12) e.expiry = 'Invalid month';
      else if (
        year < now.getFullYear() ||
        (year === now.getFullYear() && month < now.getMonth() + 1)
      )
        e.expiry = 'This card has expired';
    }

    if (!cvv) e.cvv = 'CVV is required';
    else if (cvv.length < 3) e.cvv = 'CVV must be 3–4 digits';

    return e;
  }

  async function handleAdd(ev: React.FormEvent) {
    ev.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setCardLinked(true);
    setPayerStep(3);
    setLoading(false);
    onComplete?.();
  }

  function handleSkip() {
    setSkipCard(true);
    setPayerStep(3);
    onComplete?.();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFF0EB] flex items-center justify-center">
            <CreditCard size={16} className="text-[#FF6B35]" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight">
            Add a payment card
          </h1>
        </div>
        <p className="text-sm text-[#6B7280] leading-relaxed">
          Link a debit or credit card to pay merchants instantly. You can add more cards
          later.
        </p>
      </div>

      {/* Card preview */}
      <div
        className={cn(
          'relative h-28 rounded-2xl overflow-hidden p-5 flex flex-col justify-between',
          'bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827]'
        )}
        aria-hidden="true"
      >
        <div className="flex items-center justify-between">
          <div className="w-8 h-5 rounded-sm bg-[#F59E0B] opacity-80" />
          {cardBrand && (
            <span className="text-white text-xs font-bold tracking-wider opacity-70">
              {cardBrand.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex items-end justify-between">
          <p className="text-white font-mono text-sm tracking-[0.15em] opacity-80">
            {cardNumber
              ? cardNumber.padEnd(19, '·').slice(0, 19)
              : '•••• •••• •••• ••••'}
          </p>
          <p className="text-white text-xs opacity-50">
            {expiry || 'MM/YY'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleAdd} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Input
            label="Card number"
            type="text"
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(formatCardNumber(e.target.value));
              if (errors.cardNumber) setErrors((p) => ({ ...p, cardNumber: '' }));
            }}
            iconLeft={<CreditCard size={16} aria-hidden="true" />}
            error={errors.cardNumber}
            autoComplete="cc-number"
            maxLength={19}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Expiry date"
            type="text"
            inputMode="numeric"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => {
              setExpiry(formatExpiry(e.target.value));
              if (errors.expiry) setErrors((p) => ({ ...p, expiry: '' }));
            }}
            error={errors.expiry}
            autoComplete="cc-exp"
            maxLength={5}
          />
          <Input
            label="CVV"
            type="password"
            inputMode="numeric"
            placeholder="•••"
            value={cvv}
            onChange={(e) => {
              setCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
              if (errors.cvv) setErrors((p) => ({ ...p, cvv: '' }));
            }}
            error={errors.cvv}
            autoComplete="cc-csc"
            maxLength={4}
          />
        </div>

        {/* PCI note */}
        <div className="flex items-start gap-2.5 bg-[#F5F8FF] rounded-xl border border-[#E5E7EB] px-3 py-2.5">
          <Shield size={14} className="text-[#0000EE] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-[#6B7280] leading-relaxed">
            <strong className="text-[#374151]">PCI DSS compliant:</strong> Your card
            data is encrypted and tokenised immediately. We never store raw card numbers.
          </p>
        </div>

        <Button
          type="submit"
          variant="warm"
          size="lg"
          fullWidth
          loading={loading}
          leftIcon={<Lock size={14} aria-hidden="true" />}
        >
          {loading ? 'Adding card securely…' : 'Add card'}
        </Button>
      </form>

      <button
        onClick={handleSkip}
        className="text-sm text-center text-[#6B7280] hover:text-[#374151] transition-colors font-medium"
      >
        Skip for now — add later
      </button>
    </div>
  );
}

export default LinkCardStep;
