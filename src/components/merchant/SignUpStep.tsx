'use client';

import React, { useState } from 'react';
import { Building2, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: '#EF4444' };
  if (score === 2) return { score, label: 'Fair', color: '#F59E0B' };
  if (score === 3) return { score, label: 'Good', color: '#3B82F6' };
  return { score, label: 'Strong', color: '#10B981' };
}

interface SignUpStepProps {
  onComplete?: () => void;
}

export function SignUpStep({ onComplete }: SignUpStepProps) {
  const { updateMerchantForm, setAccountStatus, setMerchantStep } = useOnboardingStore();

  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = getPasswordStrength(password);

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Business email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Please enter a valid email address';
    if (!businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    else if (strength.score < 2)
      newErrors.password = 'Please choose a stronger password';
    if (!agreed) newErrors.agreed = 'You must accept the terms to continue';
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 1000));
    updateMerchantForm({ email, businessName, password });
    setAccountStatus('email_pending');
    setMerchantStep(1);
    setLoading(false);
    onComplete?.();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight leading-tight">
          Create your merchant account
        </h1>
        <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed">
          Start accepting payments worldwide in minutes. No setup fees, no surprises.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Business name"
          type="text"
          placeholder="Acme Corp Ltd"
          value={businessName}
          onChange={(e) => {
            setBusinessName(e.target.value);
            if (errors.businessName) setErrors((prev) => ({ ...prev, businessName: '' }));
          }}
          iconLeft={<Building2 size={16} aria-hidden="true" />}
          error={errors.businessName}
          autoComplete="organization"
          required
        />

        <Input
          label="Business email"
          type="email"
          placeholder="you@yourbusiness.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
          }}
          iconLeft={<Mail size={16} aria-hidden="true" />}
          error={errors.email}
          autoComplete="email"
          required
        />

        <div className="flex flex-col gap-1.5">
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
            }}
            iconLeft={<Lock size={16} aria-hidden="true" />}
            error={errors.password}
            showPasswordToggle
            autoComplete="new-password"
            required
          />

          {/* Password strength indicator */}
          {password.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div
                    key={bar}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        bar <= strength.score ? strength.color : '#E5E7EB',
                    }}
                  />
                ))}
              </div>
              <span
                className="text-xs font-semibold"
                style={{ color: strength.color }}
              >
                {strength.label}
              </span>
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="flex flex-col gap-1">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: '' }));
                }}
                className="sr-only peer"
                aria-required="true"
              />
              <div
                className={cn(
                  'w-4.5 h-4.5 rounded-[5px] border-2 transition-all duration-150',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-[#0000EE]/20 peer-focus-visible:ring-offset-1',
                  agreed
                    ? 'bg-[#0000EE] border-[#0000EE]'
                    : errors.agreed
                    ? 'border-[#EF4444]'
                    : 'border-[#D1D5DB] group-hover:border-[#0000EE]'
                )}
                aria-hidden="true"
              >
                {agreed && (
                  <svg
                    viewBox="0 0 10 8"
                    fill="none"
                    className="w-full p-0.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-[#374151] leading-snug">
              I agree to KingsPay&apos;s{' '}
              <a href="#" className="text-[#0000EE] font-semibold hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#0000EE] font-semibold hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.agreed && (
            <p role="alert" className="text-xs text-[#EF4444] ml-7">
              {errors.agreed}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
        >
          {loading ? 'Creating account…' : 'Create merchant account'}
        </Button>
      </form>

      {/* Sign in link */}
      <p className="text-center text-sm text-[#6B7280]">
        Already have an account?{' '}
        <a href="/login" className="text-[#0000EE] font-semibold hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}

export default SignUpStep;
