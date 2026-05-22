'use client';

import React, { useState } from 'react';
import { Dashboard } from '@/components/merchant/Dashboard';
import { useOnboardingStore } from '@/store/onboardingStore';
import type { AccountStatus } from '@/store/onboardingStore';
import { cn } from '@/lib/utils';

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

export default function DashboardPage() {
  const { merchant, setAccountStatus } = useOnboardingStore();
  const [isFirstRun, setIsFirstRun] = useState(false);

  const merchantName =
    merchant.formData.businessName || 'Demo Business';

  return (
    <div className="relative">
      {/* Dev controls overlay */}
      <div className="fixed bottom-4 left-4 z-50 bg-white border border-[#E5E7EB] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-3 max-w-xs w-full">
        <p className="text-xs font-bold text-[#374151] mb-2 uppercase tracking-wide">
          Dev Controls
        </p>

        {/* View toggle */}
        <div className="flex gap-1 mb-2">
          <button
            onClick={() => setIsFirstRun(false)}
            className={cn(
              'flex-1 text-xs py-1 px-2 rounded-md font-medium transition-all border',
              !isFirstRun
                ? 'bg-[#0000EE] text-white border-[#0000EE]'
                : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#0000EE]'
            )}
          >
            Live view
          </button>
          <button
            onClick={() => setIsFirstRun(true)}
            className={cn(
              'flex-1 text-xs py-1 px-2 rounded-md font-medium transition-all border',
              isFirstRun
                ? 'bg-[#0000EE] text-white border-[#0000EE]'
                : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#0000EE]'
            )}
          >
            First run
          </button>
        </div>

        {/* Status switcher */}
        <p className="text-[10px] text-[#9CA3AF] mb-1.5">Account status:</p>
        <div className="flex flex-wrap gap-1">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setAccountStatus(s)}
              className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] font-medium border transition-all',
                merchant.status === s
                  ? 'bg-[#0000EE] text-white border-[#0000EE]'
                  : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#0000EE]'
              )}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <Dashboard
        firstRun={isFirstRun}
        merchantName={merchantName}
        status={merchant.status}
      />
    </div>
  );
}
