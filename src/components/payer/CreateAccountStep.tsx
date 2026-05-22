'use client';

import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';

interface CreateAccountStepProps {
  onComplete?: () => void;
}

export function CreateAccountStep({ onComplete }: CreateAccountStepProps) {
  const { setPayerContact, setPayerStep } = useOnboardingStore();

  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!value.trim()) {
      return mode === 'phone' ? 'Phone number is required' : 'Email address is required';
    }
    if (mode === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) {
        return 'Please enter a valid phone number';
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setPayerContact(mode, value);
    setPayerStep(1);
    setLoading(false);
    onComplete?.();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#FFF0EB] flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💳</span>
        </div>
        <h1 className="text-2xl font-black text-[#111827] tracking-tight">
          Join millions paying smarter
        </h1>
        <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed">
          Pay any KingsPay merchant instantly. No fees, no hassle. Just fast, secure payments.
        </p>
      </div>

      {/* Toggle phone / email */}
      <div className="flex bg-[#F3F4F6] rounded-[12px] p-1 gap-1">
        {(['phone', 'email'] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setValue('');
              setError('');
            }}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-[9px] text-sm font-semibold transition-all duration-150',
              mode === m
                ? 'bg-white text-[#111827] shadow-sm'
                : 'text-[#6B7280] hover:text-[#374151]'
            )}
            aria-pressed={mode === m}
          >
            {m === 'phone' ? (
              <Phone size={14} aria-hidden="true" />
            ) : (
              <Mail size={14} aria-hidden="true" />
            )}
            {m === 'phone' ? 'Phone number' : 'Email address'}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {mode === 'phone' ? (
          <Input
            label="Mobile number"
            type="tel"
            placeholder="+44 7700 900000"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            iconLeft={<Phone size={16} aria-hidden="true" />}
            error={error}
            helperText="We'll send a verification code"
            autoComplete="tel"
            autoFocus
            required
          />
        ) : (
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            iconLeft={<Mail size={16} aria-hidden="true" />}
            error={error}
            helperText="We'll send a one-time verification code"
            autoComplete="email"
            autoFocus
            required
          />
        )}

        <Button
          type="submit"
          variant="warm"
          size="lg"
          fullWidth
          loading={loading}
        >
          {loading ? 'Sending code…' : 'Continue'}
        </Button>
      </form>

      {/* Trust signals */}
      <div className="flex justify-center gap-4 flex-wrap">
        {['No credit check', 'Free to join', '256-bit secure'].map((trust) => (
          <span key={trust} className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            <span className="text-[#10B981]">✓</span>
            {trust}
          </span>
        ))}
      </div>

      <p className="text-center text-xs text-[#9CA3AF]">
        Already have an account?{' '}
        <a href="/login" className="text-[#FF6B35] font-semibold hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}

export default CreateAccountStep;
