'use client';

import React, { useState } from 'react';
import {
  Shield,
  Upload,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  XCircle,
  ChevronDown,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';
import type { AccountStatus } from '@/store/onboardingStore';

type VerificationOutcome = 'pending' | 'approved' | 'manual_review' | 'info_requested' | 'rejected';

const BUSINESS_TYPES = [
  'Sole Trader / Freelancer',
  'Limited Liability Company (LLC)',
  'Private Limited Company (Ltd)',
  'Public Limited Company (PLC)',
  'Partnership',
  'Non-profit / Charity',
  'Other',
];

const ID_TYPES = [
  'Passport',
  "Driver's Licence",
  'National Identity Card',
  'Residence Permit',
];

interface InfoRequestItem {
  label: string;
  description: string;
}

const INFO_REQUESTED_ITEMS: InfoRequestItem[] = [
  {
    label: 'Proof of business address',
    description: 'Utility bill or bank statement dated within the last 3 months',
  },
  {
    label: 'Shareholder register',
    description: 'List of all shareholders holding 25% or more of the company',
  },
  {
    label: 'Certified copy of ID',
    description: 'Clear, colour copy of your government-issued photo ID',
  },
];

const outcomeConfig: Record<
  VerificationOutcome,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  pending: {
    label: 'Pending',
    icon: <Shield size={14} />,
    color: 'text-[#6B7280]',
    bg: 'bg-[#F3F4F6]',
  },
  approved: {
    label: 'Approved',
    icon: <CheckCircle2 size={14} />,
    color: 'text-[#065F46]',
    bg: 'bg-[#ECFDF5]',
  },
  manual_review: {
    label: 'Under Review',
    icon: <AlertTriangle size={14} />,
    color: 'text-[#92400E]',
    bg: 'bg-[#FFFBEB]',
  },
  info_requested: {
    label: 'Info Needed',
    icon: <AlertCircle size={14} />,
    color: 'text-[#991B1B]',
    bg: 'bg-[#FFF5F5]',
  },
  rejected: {
    label: 'Rejected',
    icon: <XCircle size={14} />,
    color: 'text-[#991B1B]',
    bg: 'bg-[#FFF5F5]',
  },
};

interface VerificationStepProps {
  onComplete?: () => void;
}

export function VerificationStep({ onComplete }: VerificationStepProps) {
  const { merchant, updateMerchantForm, setAccountStatus, setMerchantStep } =
    useOnboardingStore();

  const [previewOutcome, setPreviewOutcome] = useState<VerificationOutcome>('pending');
  const [loading, setLoading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessType: merchant.formData.businessType || '',
    registrationNumber: merchant.formData.registrationNumber || '',
    businessAddress: merchant.formData.businessAddress || '',
    ownerName: merchant.formData.ownerName || '',
    ownerDob: merchant.formData.ownerDob || '',
    idType: merchant.formData.idType || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!formData.businessType) e.businessType = 'Select a business type';
    if (!formData.registrationNumber.trim())
      e.registrationNumber = 'Registration number is required';
    if (!formData.businessAddress.trim())
      e.businessAddress = 'Business address is required';
    if (!formData.ownerName.trim()) e.ownerName = 'Owner full name is required';
    if (!formData.ownerDob) e.ownerDob = 'Date of birth is required';
    if (!formData.idType) e.idType = 'Select an ID type';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    updateMerchantForm(formData);
    setAccountStatus('verification_pending');
    setMerchantStep(3);
    setLoading(false);
    onComplete?.();
  }

  function handleFakeUpload() {
    setUploadedDoc('government_id.pdf');
  }

  const statusForBanner: AccountStatus | null =
    previewOutcome === 'pending'
      ? null
      : previewOutcome === 'approved'
      ? 'payout_pending'
      : previewOutcome === 'manual_review'
      ? 'manual_review'
      : previewOutcome === 'info_requested'
      ? 'info_requested'
      : 'rejected';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#E8E8FF] flex items-center justify-center">
            <Shield size={16} className="text-[#0000EE]" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight">
            Verify your business
          </h1>
        </div>
        <p className="text-sm text-[#6B7280] leading-relaxed">
          We&apos;re required by law to verify businesses on our platform. This protects
          you and your customers. Reviews typically take{' '}
          <strong className="text-[#374151]">2–3 business days</strong>.
        </p>
      </div>

      {/* Preview outcome switcher (dev tool) */}
      <div className="bg-[#F5F8FF] rounded-xl border border-[#E5E7EB] p-3">
        <p className="text-xs font-semibold text-[#9CA3AF] mb-2 uppercase tracking-wide">
          Preview verification outcome
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(outcomeConfig) as VerificationOutcome[]).map((outcome) => {
            const cfg = outcomeConfig[outcome];
            return (
              <button
                key={outcome}
                onClick={() => setPreviewOutcome(outcome)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border',
                  previewOutcome === outcome
                    ? `${cfg.bg} ${cfg.color} border-current opacity-100`
                    : 'bg-white text-[#6B7280] border-[#E5E7EB] opacity-60 hover:opacity-100'
                )}
              >
                {cfg.icon}
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Outcome states */}
      {previewOutcome !== 'pending' && statusForBanner && (
        <div className="animate-fade-in">
          <StatusBanner status={statusForBanner} />
        </div>
      )}

      {/* Approved outcome */}
      {previewOutcome === 'approved' && (
        <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4 flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-[#10B981]" aria-hidden="true" />
            <p className="font-bold text-[#065F46]">Verification approved!</p>
          </div>
          <p className="text-sm text-[#065F46] opacity-80">
            Your business has been verified. Connect your payout account to start
            accepting payments.
          </p>
          <Button variant="primary" size="md" onClick={onComplete}>
            Continue to payout setup
          </Button>
        </div>
      )}

      {/* Info requested form */}
      {previewOutcome === 'info_requested' && (
        <div className="bg-[#FFF5F5] border border-[#FECACA] rounded-xl p-4 flex flex-col gap-3 animate-fade-in">
          <p className="font-bold text-[#991B1B] text-sm">Documents needed:</p>
          <ul className="flex flex-col gap-2.5">
            {INFO_REQUESTED_ITEMS.map((item) => (
              <li key={item.label} className="flex items-start gap-2">
                <AlertCircle
                  size={14}
                  className="text-[#EF4444] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-[#991B1B]">{item.label}</p>
                  <p className="text-xs text-[#EF4444] opacity-80">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <Button variant="danger" size="md">
            Update &amp; resubmit documents
          </Button>
        </div>
      )}

      {/* Rejected */}
      {previewOutcome === 'rejected' && (
        <div className="bg-[#FFF5F5] border border-[#FECACA] rounded-xl p-4 flex flex-col gap-3 animate-fade-in">
          <p className="text-sm text-[#991B1B] leading-relaxed">
            We were unable to verify your business based on the provided documentation.
            This may be due to incomplete, unclear, or mismatched information. Our
            decision is based on regulatory compliance requirements.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button variant="danger" size="sm">
              Contact support
            </Button>
            <Button variant="secondary" size="sm">
              Submit appeal
            </Button>
          </div>
        </div>
      )}

      {/* KYB / KYC Form — shown when pending or manual_review */}
      {(previewOutcome === 'pending' || previewOutcome === 'manual_review') && (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* Business type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#111827]">
              Business type
            </label>
            <div className="relative">
              <select
                value={formData.businessType}
                onChange={(e) => updateField('businessType', e.target.value)}
                className={cn(
                  'w-full rounded-[12px] border bg-white text-sm py-3 pl-4 pr-10',
                  'appearance-none focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all',
                  errors.businessType
                    ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
                    : 'border-[#E5E7EB] focus:border-[#0000EE] focus:ring-[#0000EE]/15',
                  !formData.businessType ? 'text-[#9CA3AF]' : 'text-[#111827]'
                )}
                aria-invalid={!!errors.businessType}
              >
                <option value="" disabled>
                  Select your business type
                </option>
                {BUSINESS_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
                aria-hidden="true"
              />
            </div>
            {errors.businessType && (
              <p role="alert" className="text-xs text-[#EF4444]">
                {errors.businessType}
              </p>
            )}
          </div>

          <Input
            label="Business registration number"
            type="text"
            placeholder="e.g. 12345678"
            value={formData.registrationNumber}
            onChange={(e) => updateField('registrationNumber', e.target.value)}
            error={errors.registrationNumber}
            helperText="Find this on your certificate of incorporation"
          />

          <Input
            label="Registered business address"
            type="text"
            placeholder="123 High Street, London, EC1A 1BB"
            value={formData.businessAddress}
            onChange={(e) => updateField('businessAddress', e.target.value)}
            error={errors.businessAddress}
          />

          <div className="border-t border-[#E5E7EB] pt-4">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">
              Principal owner / director
            </p>
            <div className="flex flex-col gap-4">
              <Input
                label="Full legal name"
                type="text"
                placeholder="Jane M. Smith"
                value={formData.ownerName}
                onChange={(e) => updateField('ownerName', e.target.value)}
                error={errors.ownerName}
                autoComplete="name"
              />

              <Input
                label="Date of birth"
                type="date"
                value={formData.ownerDob}
                onChange={(e) => updateField('ownerDob', e.target.value)}
                error={errors.ownerDob}
                helperText="Must be 18 or older"
                autoComplete="bday"
              />

              {/* ID type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#111827]">
                  Government ID type
                </label>
                <div className="relative">
                  <select
                    value={formData.idType}
                    onChange={(e) => updateField('idType', e.target.value)}
                    className={cn(
                      'w-full rounded-[12px] border bg-white text-sm py-3 pl-4 pr-10',
                      'appearance-none focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all',
                      errors.idType
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
                        : 'border-[#E5E7EB] focus:border-[#0000EE] focus:ring-[#0000EE]/15',
                      !formData.idType ? 'text-[#9CA3AF]' : 'text-[#111827]'
                    )}
                  >
                    <option value="" disabled>
                      Select ID type
                    </option>
                    {ID_TYPES.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
                {errors.idType && (
                  <p role="alert" className="text-xs text-[#EF4444]">
                    {errors.idType}
                  </p>
                )}
              </div>

              {/* Upload button */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-[#111827]">
                  Upload document
                </span>
                {uploadedDoc ? (
                  <div className="flex items-center gap-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl px-4 py-3">
                    <CheckCircle2 size={16} className="text-[#10B981] shrink-0" aria-hidden="true" />
                    <span className="text-sm text-[#065F46] font-medium">{uploadedDoc}</span>
                    <button
                      type="button"
                      onClick={() => setUploadedDoc(null)}
                      className="ml-auto text-xs text-[#6B7280] hover:text-[#EF4444] transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleFakeUpload}
                    className={cn(
                      'flex items-center gap-3 w-full rounded-xl border-2 border-dashed px-4 py-4',
                      'border-[#E5E7EB] hover:border-[#0000EE] hover:bg-[#F5F8FF]',
                      'transition-all duration-150 text-sm text-[#6B7280] hover:text-[#0000EE]',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000EE]/20'
                    )}
                  >
                    <Upload size={18} aria-hidden="true" />
                    <div className="text-left">
                      <p className="font-semibold">Upload document</p>
                      <p className="text-xs opacity-70">
                        JPG, PNG or PDF — max 10MB
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-start gap-2 bg-[#F5F8FF] rounded-xl border border-[#E5E7EB] px-3 py-2.5">
            <Shield size={14} className="text-[#0000EE] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Document data is encrypted in transit and at rest. It&apos;s only accessible
              to our compliance team and never sold to third parties.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            {loading ? 'Submitting for review…' : 'Submit for verification'}
          </Button>
        </form>
      )}
    </div>
  );
}

export default VerificationStep;
