'use client';

import React, { useState } from 'react';
import { Landmark, Lock, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';

interface RegionConfig {
  label: string;
  flag: string;
  currency: string;
  fields: {
    accountNumber: { label: string; placeholder: string; helpText?: string };
    routingCode: { label: string; placeholder: string; helpText?: string };
    accountName: { label: string; placeholder: string };
  };
}

const REGIONS: Record<string, RegionConfig> = {
  UK: {
    label: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    fields: {
      accountNumber: {
        label: 'Account number',
        placeholder: '12345678',
        helpText: '8-digit bank account number',
      },
      routingCode: {
        label: 'Sort code',
        placeholder: '12-34-56',
        helpText: '6-digit sort code (XX-XX-XX)',
      },
      accountName: { label: 'Account holder name', placeholder: 'Jane Smith' },
    },
  },
  US: {
    label: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    fields: {
      accountNumber: {
        label: 'Account number',
        placeholder: '000123456789',
        helpText: 'Typically 10–12 digits',
      },
      routingCode: {
        label: 'Routing number (ABA)',
        placeholder: '021000021',
        helpText: '9-digit routing number',
      },
      accountName: { label: 'Account holder name', placeholder: 'Jane Smith' },
    },
  },
  EU: {
    label: 'European Union',
    flag: '🇪🇺',
    currency: 'EUR',
    fields: {
      accountNumber: {
        label: 'IBAN',
        placeholder: 'DE89 3704 0044 0532 0130 00',
        helpText: 'International Bank Account Number',
      },
      routingCode: {
        label: 'BIC / SWIFT code',
        placeholder: 'COBADEFFXXX',
        helpText: '8 or 11 character BIC',
      },
      accountName: { label: 'Account holder name', placeholder: 'Jane Smith' },
    },
  },
  Africa: {
    label: 'Africa',
    flag: '🌍',
    currency: 'Multi',
    fields: {
      accountNumber: {
        label: 'Bank account number',
        placeholder: '0000123456',
        helpText: 'Varies by country and bank',
      },
      routingCode: {
        label: 'Bank code / Branch code',
        placeholder: '000267',
        helpText: 'Contact your bank for this code',
      },
      accountName: { label: 'Account holder name', placeholder: 'Jane Smith' },
    },
  },
  'Asia-Pacific': {
    label: 'Asia-Pacific',
    flag: '🌏',
    currency: 'Multi',
    fields: {
      accountNumber: {
        label: 'Bank account number',
        placeholder: '0001234567890',
        helpText: 'Varies by country',
      },
      routingCode: {
        label: 'BSB / Bank code',
        placeholder: '062-000',
        helpText: 'Bank-State-Branch number or equivalent',
      },
      accountName: { label: 'Account holder name', placeholder: 'Jane Smith' },
    },
  },
};

interface PayoutSetupStepProps {
  onComplete?: () => void;
}

export function PayoutSetupStep({ onComplete }: PayoutSetupStepProps) {
  const { merchant, updateMerchantForm, setAccountStatus, setMerchantStep } =
    useOnboardingStore();

  const [region, setRegion] = useState(merchant.formData.payoutRegion || 'UK');
  const [accountNumber, setAccountNumber] = useState(
    merchant.formData.bankAccountNumber || ''
  );
  const [routingCode, setRoutingCode] = useState(
    merchant.formData.bankRoutingCode || ''
  );
  const [accountName, setAccountName] = useState(
    merchant.formData.bankAccountName || ''
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const regionConfig = REGIONS[region];

  function validate() {
    const e: Record<string, string> = {};
    if (!accountNumber.trim()) e.accountNumber = 'Account number is required';
    if (!routingCode.trim()) e.routingCode = 'Routing / sort code is required';
    if (!accountName.trim()) e.accountName = 'Account holder name is required';
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
    await new Promise((r) => setTimeout(r, 1200));
    updateMerchantForm({
      payoutRegion: region,
      bankAccountNumber: accountNumber,
      bankRoutingCode: routingCode,
      bankAccountName: accountName,
    });
    const isApproved = merchant.status === 'payout_pending';
    setAccountStatus(isApproved ? 'active' : 'payout_pending');
    setMerchantStep(4);
    setLoading(false);
    onComplete?.();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#E8E8FF] flex items-center justify-center">
            <Landmark size={16} className="text-[#0000EE]" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight">
            Connect your bank
          </h1>
        </div>
        <p className="text-sm text-[#6B7280] leading-relaxed">
          Tell us where to send your payouts. Funds are transferred directly to your
          bank account on a rolling basis.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Region selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#111827]">
            Payout region
          </label>
          <div className="relative">
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setAccountNumber('');
                setRoutingCode('');
                setErrors({});
              }}
              className={cn(
                'w-full rounded-[12px] border bg-white text-sm py-3 pl-4 pr-10',
                'appearance-none text-[#111827]',
                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                'border-[#E5E7EB] focus:border-[#0000EE] focus:ring-[#0000EE]/15 transition-all'
              )}
            >
              {Object.entries(REGIONS).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.flag} {cfg.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
              aria-hidden="true"
            />
          </div>
          {regionConfig && (
            <p className="text-xs text-[#9CA3AF]">
              Currency: {regionConfig.currency}
            </p>
          )}
        </div>

        {regionConfig && (
          <>
            <Input
              label={regionConfig.fields.accountName.label}
              type="text"
              placeholder={regionConfig.fields.accountName.placeholder}
              value={accountName}
              onChange={(e) => {
                setAccountName(e.target.value);
                if (errors.accountName)
                  setErrors((prev) => ({ ...prev, accountName: '' }));
              }}
              error={errors.accountName}
              autoComplete="name"
            />

            <Input
              label={regionConfig.fields.accountNumber.label}
              type="text"
              placeholder={regionConfig.fields.accountNumber.placeholder}
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value);
                if (errors.accountNumber)
                  setErrors((prev) => ({ ...prev, accountNumber: '' }));
              }}
              error={errors.accountNumber}
              helperText={regionConfig.fields.accountNumber.helpText}
              autoComplete="off"
            />

            <Input
              label={regionConfig.fields.routingCode.label}
              type="text"
              placeholder={regionConfig.fields.routingCode.placeholder}
              value={routingCode}
              onChange={(e) => {
                setRoutingCode(e.target.value);
                if (errors.routingCode)
                  setErrors((prev) => ({ ...prev, routingCode: '' }));
              }}
              error={errors.routingCode}
              helperText={regionConfig.fields.routingCode.helpText}
              autoComplete="off"
            />
          </>
        )}

        {/* Security note */}
        <div className="flex items-start gap-2.5 bg-[#F5F8FF] rounded-xl border border-[#E5E7EB] px-4 py-3">
          <Lock size={14} className="text-[#0000EE] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-[#6B7280] leading-relaxed">
            <strong className="text-[#374151]">Bank-grade security:</strong> Banking
            details are encrypted with AES-256 and are never stored in plaintext. Only
            our secure payment processor can access your bank credentials.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
        >
          {loading ? 'Saving securely…' : 'Save & continue'}
        </Button>

        <p className="text-center text-xs text-[#9CA3AF]">
          You can update your bank details at any time from Settings &gt; Payouts
        </p>
      </form>
    </div>
  );
}

export default PayoutSetupStep;
