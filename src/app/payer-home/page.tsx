'use client';

import React, { useState } from 'react';
import {
  Send,
  CreditCard,
  Search,
  Lock,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { formatCurrency, formatShortDate } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';

type PaymentStep = 'home' | 'pick_org' | 'enter_amount' | 'confirm' | 'success' | 'declined' | 'insufficient' | 'currency_mismatch';

interface Org {
  id: string;
  name: string;
  category: string;
  emoji: string;
  acceptedCurrencies: string[];
}

const ORGS: Org[] = [
  { id: 'org_01', name: 'Riverside Café', category: 'Food & Drink', emoji: '☕', acceptedCurrencies: ['GBP', 'EUR'] },
  { id: 'org_02', name: 'TechFlow Studios', category: 'Software', emoji: '💻', acceptedCurrencies: ['GBP', 'USD', 'EUR'] },
  { id: 'org_03', name: 'Metro Gym & Wellness', category: 'Health', emoji: '🏋️', acceptedCurrencies: ['GBP'] },
  { id: 'org_04', name: 'Lagos Textile Co.', category: 'Retail', emoji: '🧵', acceptedCurrencies: ['NGN', 'USD'] },
  { id: 'org_05', name: 'Nordic Print Works', category: 'Creative', emoji: '🖨️', acceptedCurrencies: ['EUR', 'GBP'] },
  { id: 'org_06', name: 'Quick Fix Repairs', category: 'Services', emoji: '🔧', acceptedCurrencies: ['GBP', 'USD', 'EUR', 'NGN'] },
];

interface RecentPayment {
  id: string;
  org: string;
  emoji: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const RECENT_PAYMENTS: RecentPayment[] = [
  { id: 'p1', org: 'Riverside Café', emoji: '☕', amount: 4.80, currency: 'GBP', date: '2026-05-21', status: 'completed' },
  { id: 'p2', org: 'TechFlow Studios', emoji: '💻', amount: 250.00, currency: 'GBP', date: '2026-05-19', status: 'completed' },
  { id: 'p3', org: 'Metro Gym & Wellness', emoji: '🏋️', amount: 45.00, currency: 'GBP', date: '2026-05-15', status: 'completed' },
  { id: 'p4', org: 'Quick Fix Repairs', emoji: '🔧', amount: 89.99, currency: 'GBP', date: '2026-05-10', status: 'failed' },
];

export default function PayerHomePage() {
  const { payer } = useOnboardingStore();
  const [step, setStep] = useState<PaymentStep>('home');
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [orgSearch, setOrgSearch] = useState('');
  const [sending, setSending] = useState(false);

  const cardLinked = payer.cardLinked;
  const userCurrency = payer.currency || 'GBP';

  const filteredOrgs = ORGS.filter(
    (org) =>
      org.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
      org.category.toLowerCase().includes(orgSearch.toLowerCase())
  );

  async function handleConfirmPayment() {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);

    // Simulate different error states based on amount for demo
    const numAmount = parseFloat(amount);
    if (numAmount > 10000) {
      setStep('insufficient');
    } else if (numAmount === 999) {
      setStep('declined');
    } else {
      setStep('success');
    }
  }

  function resetFlow() {
    setStep('home');
    setSelectedOrg(null);
    setAmount('');
    setNote('');
    setOrgSearch('');
  }

  // ---- HOME ----
  if (step === 'home') {
    return (
      <div className="min-h-screen bg-[#F5F8FF] flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-[#E5E7EB] px-4 py-4">
          <div className="max-w-sm mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-black text-xl text-[#111827] tracking-tight">
                Kings<span className="text-[#FF6B35]">Pay</span>
              </h1>
              <p className="text-xs text-[#9CA3AF]">Good morning 👋</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#FF6B35] font-bold text-sm">
              P
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 max-w-sm mx-auto w-full flex flex-col gap-5">
          {/* Card status */}
          {!cardLinked ? (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 flex gap-3">
              <AlertTriangle size={18} className="text-[#F59E0B] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-bold text-[#92400E]">No card linked</p>
                <p className="text-xs text-[#92400E] opacity-80 mt-0.5">
                  Add a card to make payments instantly.
                </p>
                <a
                  href="/payer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#FF6B35] hover:underline"
                >
                  Add a card <ChevronRight size={11} aria-hidden="true" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-4 flex gap-3">
              <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-[#065F46]">Card linked</p>
                <p className="text-xs text-[#065F46] opacity-80 mt-0.5">
                  Ready to pay any KingsPay merchant.
                </p>
              </div>
            </div>
          )}

          {/* Big CTA */}
          <Button
            variant="warm"
            size="lg"
            fullWidth
            leftIcon={<Send size={16} aria-hidden="true" />}
            onClick={() => setStep('pick_org')}
          >
            Send a payment
          </Button>

          {/* Quick tip */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E8E8FF] flex items-center justify-center shrink-0">
              <Zap size={14} className="text-[#0000EE]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#111827]">Instant payments</p>
              <p className="text-xs text-[#6B7280] leading-relaxed mt-0.5">
                Payments arrive within seconds. No delays, no daily limits for verified accounts.
              </p>
            </div>
          </div>

          {/* Recent payments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-[#111827]">Recent payments</p>
              <button className="text-xs text-[#FF6B35] font-semibold hover:underline">
                View all
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              {RECENT_PAYMENTS.map((payment, i) => (
                <div
                  key={payment.id}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3',
                    i < RECENT_PAYMENTS.length - 1 && 'border-b border-[#F3F4F6]'
                  )}
                >
                  <span className="text-xl shrink-0" aria-hidden="true">{payment.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111827] truncate">{payment.org}</p>
                    <p className="text-xs text-[#9CA3AF]">{formatShortDate(payment.date)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <p className={cn(
                      'text-sm font-bold tabular-nums amount',
                      payment.status === 'failed' ? 'text-[#EF4444]' : 'text-[#111827]'
                    )}>
                      {payment.status === 'failed' ? '' : '-'}
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                    {payment.status !== 'completed' && (
                      <Badge variant={payment.status === 'pending' ? 'amber' : 'red'} size="sm">
                        {payment.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ---- PICK ORG ----
  if (step === 'pick_org') {
    return (
      <div className="min-h-screen bg-[#F5F8FF] flex flex-col">
        <header className="bg-white border-b border-[#E5E7EB] px-4 py-4">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => setStep('home')}
                className="w-8 h-8 rounded-lg hover:bg-[#F5F8FF] flex items-center justify-center text-[#6B7280] transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={16} aria-hidden="true" />
              </button>
              <h1 className="font-black text-lg text-[#111827]">Pay a merchant</h1>
            </div>
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search merchants…"
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                aria-label="Search merchants"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-4 max-w-sm mx-auto w-full">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">
            {filteredOrgs.length} merchant{filteredOrgs.length !== 1 ? 's' : ''}
          </p>
          <div className="flex flex-col gap-2">
            {filteredOrgs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 text-center">
                <p className="text-sm text-[#6B7280]">No merchants found for &ldquo;{orgSearch}&rdquo;</p>
              </div>
            ) : (
              filteredOrgs.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    setSelectedOrg(org);
                    setStep('enter_amount');
                  }}
                  className="flex items-center gap-3 bg-white rounded-2xl border border-[#E5E7EB] p-4 text-left hover:border-[#FF6B35]/50 hover:shadow-[0_4px_16px_rgba(255,107,53,0.08)] transition-all group"
                >
                  <span className="text-2xl shrink-0" aria-hidden="true">{org.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111827] group-hover:text-[#FF6B35] transition-colors">
                      {org.name}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">{org.category}</p>
                  </div>
                  <ChevronRight size={15} className="text-[#D1D5DB] group-hover:text-[#FF6B35] transition-colors shrink-0" aria-hidden="true" />
                </button>
              ))
            )}
          </div>
        </main>
      </div>
    );
  }

  // ---- ENTER AMOUNT ----
  if (step === 'enter_amount' && selectedOrg) {
    const currencyMismatch = !selectedOrg.acceptedCurrencies.includes(userCurrency);

    return (
      <div className="min-h-screen bg-[#F5F8FF] flex flex-col">
        <header className="bg-white border-b border-[#E5E7EB] px-4 py-4">
          <div className="max-w-sm mx-auto flex items-center gap-3">
            <button
              onClick={() => setStep('pick_org')}
              className="w-8 h-8 rounded-lg hover:bg-[#F5F8FF] flex items-center justify-center text-[#6B7280]"
              aria-label="Go back"
            >
              <ArrowLeft size={16} aria-hidden="true" />
            </button>
            <div>
              <h1 className="font-black text-lg text-[#111827]">
                {selectedOrg.emoji} {selectedOrg.name}
              </h1>
              <p className="text-xs text-[#9CA3AF]">{selectedOrg.category}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 max-w-sm mx-auto w-full flex flex-col gap-5">
          {currencyMismatch && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 flex gap-3">
              <AlertTriangle size={16} className="text-[#F59E0B] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-[#92400E]">Currency mismatch</p>
                <p className="text-xs text-[#92400E] opacity-80 mt-0.5">
                  {selectedOrg.name} accepts {selectedOrg.acceptedCurrencies.join(', ')}, but your
                  default currency is {userCurrency}. A conversion fee may apply.
                </p>
              </div>
            </div>
          )}

          {/* Amount input */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-[#9CA3AF] mb-2">Amount to pay</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-black text-[#9CA3AF]">
                  {userCurrency === 'GBP' ? '£' : userCurrency === 'USD' ? '$' : userCurrency === 'EUR' ? '€' : userCurrency}
                </span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-5xl font-black text-[#111827] w-40 text-center bg-transparent focus:outline-none border-b-2 border-[#E5E7EB] focus:border-[#FF6B35] pb-1 tabular-nums amount transition-colors"
                  aria-label="Payment amount"
                  autoFocus
                />
              </div>
              {amount && parseFloat(amount) > 0 && (
                <p className="text-sm text-[#9CA3AF] mt-2">
                  {formatCurrency(parseFloat(amount), userCurrency)} to {selectedOrg.name}
                </p>
              )}
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 flex-wrap justify-center">
              {['5', '10', '20', '50', '100'].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-semibold border transition-all',
                    amount === v
                      ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                      : 'bg-white text-[#374151] border-[#E5E7EB] hover:border-[#FF6B35]'
                  )}
                >
                  {userCurrency === 'GBP' ? '£' : userCurrency === 'USD' ? '$' : ''}
                  {v}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Payment note (optional)"
            type="text"
            placeholder="e.g. Invoice #1234, Monthly subscription"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            helperText="This note will be shown to the merchant"
          />

          <Button
            variant="warm"
            size="lg"
            fullWidth
            disabled={!amount || parseFloat(amount) <= 0}
            onClick={() => {
              if (!selectedOrg.acceptedCurrencies.includes(userCurrency) &&
                  !selectedOrg.acceptedCurrencies.some(() => true)) {
                setStep('currency_mismatch');
              } else {
                setStep('confirm');
              }
            }}
          >
            Continue to review
          </Button>
        </main>
      </div>
    );
  }

  // ---- CONFIRM ----
  if (step === 'confirm' && selectedOrg) {
    const numAmount = parseFloat(amount);
    const fee = numAmount >= 100 ? 0 : 0;

    return (
      <div className="min-h-screen bg-[#F5F8FF] flex flex-col">
        <header className="bg-white border-b border-[#E5E7EB] px-4 py-4">
          <div className="max-w-sm mx-auto flex items-center gap-3">
            <button
              onClick={() => setStep('enter_amount')}
              className="w-8 h-8 rounded-lg hover:bg-[#F5F8FF] flex items-center justify-center text-[#6B7280]"
              aria-label="Go back"
            >
              <ArrowLeft size={16} aria-hidden="true" />
            </button>
            <h1 className="font-black text-lg text-[#111827]">Review payment</h1>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 max-w-sm mx-auto w-full flex flex-col gap-4">
          {/* Summary card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] p-5 text-center">
              <p className="text-white text-sm font-medium opacity-80">You&apos;re sending</p>
              <p className="text-white text-4xl font-black mt-1 tabular-nums amount">
                {formatCurrency(numAmount, userCurrency)}
              </p>
              <p className="text-white text-sm mt-1 opacity-80">to {selectedOrg.name}</p>
            </div>

            <div className="px-5 py-4 flex flex-col gap-3">
              {[
                { label: 'Recipient', value: `${selectedOrg.emoji} ${selectedOrg.name}` },
                { label: 'Amount', value: formatCurrency(numAmount, userCurrency) },
                { label: 'Transaction fee', value: fee === 0 ? 'Free' : formatCurrency(fee, userCurrency) },
                { label: 'Total charged', value: formatCurrency(numAmount + fee, userCurrency) },
                ...(note ? [{ label: 'Note', value: note }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-[#9CA3AF]">{label}</span>
                  <span className="text-sm font-semibold text-[#111827] tabular-nums amount">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Security cues */}
          <div className="flex items-center justify-center gap-4">
            {[
              { icon: <Lock size={13} />, label: '256-bit secure' },
              { icon: <Shield size={13} />, label: 'PCI DSS' },
              { icon: <Zap size={13} />, label: 'Instant' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                <span className="text-[#10B981]">{icon}</span>
                {label}
              </div>
            ))}
          </div>

          <Button
            variant="warm"
            size="lg"
            fullWidth
            loading={sending}
            onClick={handleConfirmPayment}
            leftIcon={<Lock size={14} aria-hidden="true" />}
          >
            {sending ? 'Processing…' : 'Confirm & pay'}
          </Button>

          <p className="text-center text-xs text-[#9CA3AF]">
            By confirming, you authorise KingsPay to debit your linked payment method.
          </p>
        </main>
      </div>
    );
  }

  // ---- SUCCESS ----
  if (step === 'success' && selectedOrg) {
    return (
      <div className="min-h-screen bg-[#F5F8FF] flex flex-col items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-8 text-center flex flex-col gap-5 animate-fade-in-scale">
          <div className="w-20 h-20 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} className="text-[#10B981]" aria-hidden="true" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#111827] tracking-tight">
              Payment sent!
            </h1>
            <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed">
              {formatCurrency(parseFloat(amount), userCurrency)} to{' '}
              <strong>{selectedOrg.name}</strong> was processed instantly.
            </p>
          </div>

          <div className="bg-[#F5F8FF] rounded-xl p-4 flex flex-col gap-2.5 text-left">
            {[
              { label: 'Amount', value: formatCurrency(parseFloat(amount), userCurrency) },
              { label: 'Merchant', value: `${selectedOrg.emoji} ${selectedOrg.name}` },
              { label: 'Status', value: '✅ Completed' },
              { label: 'Reference', value: `KP${Date.now().toString().slice(-8)}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-xs text-[#9CA3AF]">{label}</span>
                <span className="text-xs font-semibold text-[#111827]">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="warm" size="lg" fullWidth onClick={resetFlow}>
              Make another payment
            </Button>
            <Button variant="ghost" size="md" fullWidth onClick={resetFlow}>
              Back to home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---- DECLINED ----
  if (step === 'declined') {
    return (
      <div className="min-h-screen bg-[#F5F8FF] flex flex-col items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-[#FECACA] shadow-[0_8px_32px_rgba(239,68,68,0.08)] p-8 text-center flex flex-col gap-5 animate-fade-in-scale">
          <div className="w-20 h-20 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto">
            <XCircle size={36} className="text-[#EF4444]" aria-hidden="true" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#111827] tracking-tight">
              Card declined
            </h1>
            <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed">
              Your card was declined by the issuing bank. This is usually due to
              insufficient funds, security restrictions, or a temporary block.
            </p>
          </div>

          <div className="bg-[#FFF5F5] rounded-xl p-4 text-left">
            <p className="text-sm font-bold text-[#991B1B] mb-2">What to do:</p>
            <ul className="flex flex-col gap-1.5">
              {[
                'Check your card balance with your bank',
                'Try a different card',
                'Contact your bank to lift any temporary holds',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-[#991B1B]">
                  <span className="mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="warm" size="lg" fullWidth onClick={() => setStep('confirm')}>
              <RefreshCw size={14} aria-hidden="true" />
              Try again
            </Button>
            <Button variant="ghost" size="md" fullWidth onClick={resetFlow}>
              Cancel payment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---- INSUFFICIENT FUNDS ----
  if (step === 'insufficient') {
    return (
      <div className="min-h-screen bg-[#F5F8FF] flex flex-col items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-[#FDE68A] shadow-[0_8px_32px_rgba(245,158,11,0.08)] p-8 text-center flex flex-col gap-5 animate-fade-in-scale">
          <div className="w-20 h-20 rounded-full bg-[#FEF3C7] flex items-center justify-center mx-auto">
            <AlertTriangle size={36} className="text-[#F59E0B]" aria-hidden="true" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#111827] tracking-tight">
              Insufficient funds
            </h1>
            <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed">
              Your account doesn&apos;t have enough funds for this payment of{' '}
              <strong>{formatCurrency(parseFloat(amount), userCurrency)}</strong>.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setStep('enter_amount')}
            >
              Enter a smaller amount
            </Button>
            <Button variant="ghost" size="md" fullWidth onClick={resetFlow}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---- CURRENCY MISMATCH ----
  if (step === 'currency_mismatch' && selectedOrg) {
    return (
      <div className="min-h-screen bg-[#F5F8FF] flex flex-col items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-[#BFDBFE] shadow-[0_8px_32px_rgba(59,130,246,0.08)] p-8 text-center flex flex-col gap-5 animate-fade-in-scale">
          <div className="w-20 h-20 rounded-full bg-[#EFF6FF] flex items-center justify-center mx-auto">
            <span className="text-3xl">💱</span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#111827] tracking-tight">
              Currency conversion needed
            </h1>
            <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed">
              {selectedOrg.name} doesn&apos;t accept {userCurrency}.
              Your payment will be converted to{' '}
              <strong>{selectedOrg.acceptedCurrencies[0]}</strong>.
            </p>
          </div>

          <div className="bg-[#EFF6FF] rounded-xl p-4 text-left flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#9CA3AF]">You pay</span>
              <span className="font-bold text-[#111827]">
                {formatCurrency(parseFloat(amount), userCurrency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#9CA3AF]">Merchant receives</span>
              <span className="font-bold text-[#111827]">
                ~{formatCurrency(parseFloat(amount) * 1.18, selectedOrg.acceptedCurrencies[0])}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#9CA3AF]">Conversion fee</span>
              <span className="font-semibold text-[#374151]">1.5%</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={sending}
              onClick={handleConfirmPayment}
            >
              Accept conversion & pay
            </Button>
            <Button variant="ghost" size="md" fullWidth onClick={() => setStep('enter_amount')}>
              Go back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
