'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail,
  Clock,
  AlertTriangle,
  AlertCircle,
  XCircle,
  CreditCard,
  CheckCircle2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AccountStatus } from '@/store/onboardingStore';

interface StatusConfig {
  icon: React.ReactNode;
  bg: string;
  border: string;
  textColor: string;
  iconColor: string;
  title: string;
  message: string;
  ctaLabel?: string;
  ctaBg?: string;
  ctaText?: string;
}

const statusConfigs: Record<Exclude<AccountStatus, 'draft'>, StatusConfig> = {
  email_pending: {
    icon: <Mail size={18} aria-hidden="true" />,
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FDE68A]',
    textColor: 'text-[#92400E]',
    iconColor: 'text-[#F59E0B]',
    title: 'Verify your email to continue',
    message: 'We sent a verification link to your inbox. Please check your email and click the link to activate your account.',
    ctaLabel: 'Resend verification email',
    ctaBg: 'bg-[#F59E0B]',
    ctaText: 'text-white',
  },
  verification_pending: {
    icon: <Clock size={18} aria-hidden="true" />,
    bg: 'bg-[#EFF6FF]',
    border: 'border-[#BFDBFE]',
    textColor: 'text-[#1E40AF]',
    iconColor: 'text-[#3B82F6]',
    title: 'Identity verification in progress',
    message: 'Our compliance team is reviewing your business documents. This typically takes 2–3 business days. We\'ll email you with an update.',
    ctaLabel: 'Check status',
    ctaBg: 'bg-[#3B82F6]',
    ctaText: 'text-white',
  },
  manual_review: {
    icon: <AlertTriangle size={18} aria-hidden="true" />,
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FDE68A]',
    textColor: 'text-[#92400E]',
    iconColor: 'text-[#F59E0B]',
    title: 'Account under review — limited access enabled',
    message: 'Your account is being manually reviewed by our team. You can explore the dashboard, but payouts and live transactions are paused until review is complete.',
    ctaLabel: 'Explore dashboard',
    ctaBg: 'bg-[#F59E0B]',
    ctaText: 'text-white',
  },
  info_requested: {
    icon: <AlertCircle size={18} aria-hidden="true" />,
    bg: 'bg-[#FFF5F5]',
    border: 'border-[#FECACA]',
    textColor: 'text-[#991B1B]',
    iconColor: 'text-[#EF4444]',
    title: 'Action required: additional information needed',
    message: 'Our compliance team needs more information to complete your verification. Please provide the requested documents to avoid service interruption.',
    ctaLabel: 'Provide information',
    ctaBg: 'bg-[#EF4444]',
    ctaText: 'text-white',
  },
  rejected: {
    icon: <XCircle size={18} aria-hidden="true" />,
    bg: 'bg-[#FFF5F5]',
    border: 'border-[#FECACA]',
    textColor: 'text-[#991B1B]',
    iconColor: 'text-[#EF4444]',
    title: 'Verification declined — contact support',
    message: 'We were unable to verify your business. This decision was made based on our compliance policies. You can contact our support team or submit an appeal.',
    ctaLabel: 'Contact support',
    ctaBg: 'bg-[#EF4444]',
    ctaText: 'text-white',
  },
  payout_pending: {
    icon: <CreditCard size={18} aria-hidden="true" />,
    bg: 'bg-[#EFF6FF]',
    border: 'border-[#BFDBFE]',
    textColor: 'text-[#1E40AF]',
    iconColor: 'text-[#3B82F6]',
    title: 'Connect your payout account to go live',
    message: 'Your identity has been verified. Connect a bank account to start receiving payouts from your KingsPay transactions.',
    ctaLabel: 'Connect bank account',
    ctaBg: 'bg-[#0000EE]',
    ctaText: 'text-white',
  },
  active: {
    icon: <CheckCircle2 size={18} aria-hidden="true" />,
    bg: 'bg-[#ECFDF5]',
    border: 'border-[#A7F3D0]',
    textColor: 'text-[#065F46]',
    iconColor: 'text-[#10B981]',
    title: 'Account active',
    message: 'Your account is fully verified and active. All features are enabled.',
  },
};

export interface StatusBannerProps {
  status: AccountStatus;
  onCtaClick?: () => void;
  className?: string;
}

export function StatusBanner({ status, onCtaClick, className }: StatusBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (status === 'active') {
      const timer = setTimeout(() => setDismissed(true), 5000);
      return () => clearTimeout(timer);
    }
    setDismissed(false);
  }, [status]);

  if (status === 'draft' || dismissed) return null;

  const config = statusConfigs[status];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3.5 animate-fade-in',
        config.bg,
        config.border,
        className
      )}
    >
      <span className={cn('shrink-0 mt-0.5', config.iconColor)}>{config.icon}</span>

      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-bold leading-tight', config.textColor)}>
          {config.title}
        </p>
        <p className={cn('text-xs mt-0.5 leading-relaxed', config.textColor, 'opacity-80')}>
          {config.message}
        </p>
        {config.ctaLabel && (
          <button
            onClick={onCtaClick}
            className={cn(
              'mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90',
              config.ctaBg,
              config.ctaText
            )}
          >
            {config.ctaLabel}
          </button>
        )}
      </div>

      {status === 'active' && (
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="shrink-0 text-[#10B981] hover:opacity-70 transition-opacity"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default StatusBanner;
