'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Package,
  Settings,
  CheckCircle2,
  Circle,
  ChevronRight,
  Download,
  Bell,
  Search,
  Smartphone,
  Monitor,
  ShoppingCart,
  RefreshCw,
  AlertTriangle,
  Filter,
  ChevronDown,
  Building2,
  Calendar,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Globe,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Plus,
  ExternalLink,
  CreditCard,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { cn } from '@/lib/utils';
import { formatCurrency, formatShortDate } from '@/lib/utils';
import type { AccountStatus } from '@/store/onboardingStore';

/* ── Types ── */
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  type: 'payment' | 'payout' | 'refund' | 'fee';
  customer?: string;
  reference?: string;
}

/* ── Mock data ── */
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'txn_001', date: '2026-05-21', description: 'Payment from Sarah Johnson', amount: 249.99, currency: 'GBP', status: 'completed', type: 'payment', customer: 'Sarah Johnson', reference: 'REF-8821' },
  { id: 'txn_002', date: '2026-05-21', description: 'Weekly payout to Barclays ••1234', amount: -1842.5, currency: 'GBP', status: 'completed', type: 'payout', reference: 'PAY-0042' },
  { id: 'txn_003', date: '2026-05-20', description: 'Payment from Acme Supplies Ltd', amount: 7500.0, currency: 'GBP', status: 'completed', type: 'payment', customer: 'Acme Supplies Ltd', reference: 'REF-8820' },
  { id: 'txn_004', date: '2026-05-20', description: 'Refund — Order #8821', amount: -89.99, currency: 'GBP', status: 'refunded', type: 'refund', customer: 'Sarah Johnson', reference: 'REF-8819' },
  { id: 'txn_005', date: '2026-05-19', description: 'Payment from Marcus Webb', amount: 120.0, currency: 'GBP', status: 'completed', type: 'payment', customer: 'Marcus Webb', reference: 'REF-8818' },
  { id: 'txn_006', date: '2026-05-19', description: 'Payment from Riverside Café', amount: 556.4, currency: 'GBP', status: 'pending', type: 'payment', customer: 'Riverside Café', reference: 'REF-8817' },
  { id: 'txn_007', date: '2026-05-18', description: 'Platform fee — May 2026', amount: -29.99, currency: 'GBP', status: 'completed', type: 'fee', reference: 'FEE-0512' },
  { id: 'txn_008', date: '2026-05-18', description: 'Payment from Global Tech GmbH', amount: 3200.0, currency: 'EUR', status: 'completed', type: 'payment', customer: 'Global Tech GmbH', reference: 'REF-8816' },
  { id: 'txn_009', date: '2026-05-17', description: 'Payment from Nguyen Textiles', amount: 910.0, currency: 'USD', status: 'failed', type: 'payment', customer: 'Nguyen Textiles', reference: 'REF-8815' },
  { id: 'txn_010', date: '2026-05-16', description: 'Payment from Sunrise Bakery', amount: 48.5, currency: 'GBP', status: 'completed', type: 'payment', customer: 'Sunrise Bakery', reference: 'REF-8814' },
  { id: 'txn_011', date: '2026-05-15', description: 'Payment from TechFlow Studios', amount: 1250.0, currency: 'GBP', status: 'completed', type: 'payment', customer: 'TechFlow Studios', reference: 'REF-8813' },
  { id: 'txn_012', date: '2026-05-14', description: 'Weekly payout to Barclays ••1234', amount: -2100.0, currency: 'GBP', status: 'completed', type: 'payout', reference: 'PAY-0041' },
];

const MOCK_PAYOUTS = [
  { id: 'pay_001', date: '2026-05-21', amount: 1842.5, currency: 'GBP', bank: 'Barclays ••1234', status: 'completed', arrived: '2026-05-22' },
  { id: 'pay_002', date: '2026-05-14', amount: 2100.0, currency: 'GBP', bank: 'Barclays ••1234', status: 'completed', arrived: '2026-05-15' },
  { id: 'pay_003', date: '2026-05-07', amount: 3450.0, currency: 'GBP', bank: 'Barclays ••1234', status: 'completed', arrived: '2026-05-08' },
  { id: 'pay_004', date: '2026-04-30', amount: 1920.0, currency: 'GBP', bank: 'Barclays ••1234', status: 'completed', arrived: '2026-05-01' },
  { id: 'pay_005', date: '2026-04-23', amount: 2780.0, currency: 'GBP', bank: 'Barclays ••1234', status: 'completed', arrived: '2026-04-24' },
];

const statusBadgeVariant: Record<Transaction['status'], 'green' | 'amber' | 'red' | 'gray'> = {
  completed: 'green', pending: 'amber', failed: 'red', refunded: 'gray',
};

const typeIcons: Record<Transaction['type'], React.ReactNode> = {
  payment: <ArrowDownLeft size={14} className="text-[#10B981]" />,
  payout: <ArrowUpRight size={14} className="text-[#0000EE]" />,
  refund: <RefreshCw size={14} className="text-[#6B7280]" />,
  fee: <AlertTriangle size={14} className="text-[#F59E0B]" />,
};

/* ── Shared card wrapper ── */
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.04)]', className)}>
      {children}
    </div>
  );
}

/* ── Section header ── */
function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-[#9CA3AF] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ══════════════════════════════════════════
   TRANSACTIONS VIEW
══════════════════════════════════════════ */
function TransactionsView() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [search, setSearch] = useState('');

  const filtered = MOCK_TRANSACTIONS.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Transactions"
        subtitle={`${MOCK_TRANSACTIONS.length} transactions this month`}
        action={
          <Button variant="secondary" size="sm" leftIcon={<Download size={13} />}>
            Export CSV
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total in', value: '£13,834.39', color: 'text-[#10B981]' },
          { label: 'Total out', value: '£1,962.48', color: 'text-[#6B7280]' },
          { label: 'Pending', value: '£556.40', color: 'text-[#F59E0B]' },
          { label: 'Failed', value: '£910.00', color: 'text-[#EF4444]' },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-xs text-[#9CA3AF] mb-1">{s.label}</p>
            <p className={cn('text-lg font-black tabular-nums', s.color)}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        {/* Filters */}
        <div className="px-5 py-3 border-b border-[#F3F4F6] flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[160px]">
            <Search size={14} className="text-[#9CA3AF]" />
            <input
              type="search"
              placeholder="Search transactions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none bg-transparent w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-[#9CA3AF]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs text-[#374151] border border-[#E5E7EB] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#0000EE] bg-white"
            >
              <option value="all">All statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs text-[#374151] border border-[#E5E7EB] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#0000EE] bg-white"
            >
              <option value="all">All types</option>
              <option value="payment">Payment</option>
              <option value="payout">Payout</option>
              <option value="refund">Refund</option>
              <option value="fee">Fee</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F3F4F6]">
                {['Date', 'Description', 'Customer', 'Reference', 'Amount', 'Status', 'Type'].map((h) => (
                  <th key={h} className={cn('text-left text-xs font-semibold text-[#9CA3AF] px-4 py-3', h === 'Amount' && 'text-right', ['Customer', 'Reference'].includes(h) && 'hidden lg:table-cell')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-[#9CA3AF]">No transactions match your filters.</td>
                </tr>
              ) : (
                filtered.map((txn, i) => (
                  <tr
                    key={txn.id}
                    onClick={() => setSelected(txn)}
                    className={cn('border-b border-[#F9FAFB] hover:bg-[#F9FAFB] transition-colors cursor-pointer', i === filtered.length - 1 && 'border-b-0')}
                  >
                    <td className="px-4 py-3 text-xs text-[#9CA3AF] whitespace-nowrap">{formatShortDate(txn.date)}</td>
                    <td className="px-4 py-3 text-[#111827] font-medium max-w-[180px] truncate">{txn.description}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7280] hidden lg:table-cell">{txn.customer ?? '—'}</td>
                    <td className="px-4 py-3 text-xs font-mono text-[#9CA3AF] hidden lg:table-cell">{txn.reference ?? '—'}</td>
                    <td className={cn('px-4 py-3 text-right font-bold tabular-nums whitespace-nowrap', txn.amount > 0 ? 'text-[#111827]' : 'text-[#6B7280]')}>
                      {txn.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(txn.amount), txn.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant[txn.status]} size="sm" dot>
                        {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {typeIcons[txn.type]}
                        <span className="text-xs text-[#6B7280] capitalize">{txn.type}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="px-5 py-3 border-t border-[#F3F4F6] flex items-center justify-between">
          <p className="text-xs text-[#9CA3AF]">Showing {filtered.length} of {MOCK_TRANSACTIONS.length} transactions</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={cn('w-7 h-7 rounded-lg text-xs font-medium transition-colors', p === 1 ? 'bg-[#0000EE] text-white' : 'text-[#6B7280] hover:bg-[#F5F8FF]')}>{p}</button>
            ))}
          </div>
        </div>
      </Card>

      {/* Transaction detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelected(null)}>
          <div className="flex-1 bg-black/30 backdrop-blur-sm" />
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
              <h2 className="font-bold text-[#111827]">Transaction detail</h2>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg hover:bg-[#F5F8FF] flex items-center justify-center text-[#6B7280]">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="text-center">
                <p className={cn('text-3xl font-black tabular-nums', selected.amount > 0 ? 'text-[#111827]' : 'text-[#6B7280]')}>
                  {selected.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(selected.amount), selected.currency)}
                </p>
                <div className="mt-2">
                  <Badge variant={statusBadgeVariant[selected.status]} dot>{selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}</Badge>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Description', value: selected.description },
                  { label: 'Date', value: formatShortDate(selected.date) },
                  { label: 'Reference', value: selected.reference ?? '—' },
                  { label: 'Customer', value: selected.customer ?? '—' },
                  { label: 'Type', value: selected.type.charAt(0).toUpperCase() + selected.type.slice(1) },
                  { label: 'Currency', value: selected.currency },
                  { label: 'Transaction ID', value: selected.id },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-start gap-4 py-3 border-b border-[#F3F4F6] last:border-0">
                    <span className="text-sm text-[#9CA3AF]">{row.label}</span>
                    <span className="text-sm font-medium text-[#111827] text-right font-mono">{row.value}</span>
                  </div>
                ))}
              </div>
              {selected.status === 'completed' && selected.type === 'payment' && (
                <Button variant="secondary" size="sm" fullWidth leftIcon={<RefreshCw size={13} />}>
                  Issue refund
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   PAYOUTS VIEW
══════════════════════════════════════════ */
function PayoutsView() {
  const [requesting, setRequesting] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Payouts"
        subtitle="Your earnings, settled to your bank"
        action={
          <Button variant="primary" size="sm" onClick={() => setRequesting(true)}>
            Request payout
          </Button>
        }
      />

      {/* Top cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: 'Available to pay out', value: '£3,210.00', note: 'Ready now', noteColor: 'text-[#10B981]' },
          { label: 'In transit', value: '£1,842.50', note: 'Arrives Mon 26 May', noteColor: 'text-[#F59E0B]' },
          { label: 'Paid out this month', value: '£9,312.50', note: '5 payouts', noteColor: 'text-[#6B7280]' },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-xs text-[#9CA3AF] mb-1">{s.label}</p>
            <p className="text-2xl font-black text-[#111827] tabular-nums">{s.value}</p>
            <p className={cn('text-xs mt-1 font-medium', s.noteColor)}>{s.note}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Payout history */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#111827]">Payout history</h2>
              <Button variant="secondary" size="sm" leftIcon={<Download size={12} />}>Export</Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F3F4F6]">
                  {['Initiated', 'Amount', 'Bank account', 'Arrived', 'Status'].map((h) => (
                    <th key={h} className={cn('text-left text-xs font-semibold text-[#9CA3AF] px-4 py-3', h === 'Amount' && 'text-right', h === 'Arrived' && 'hidden sm:table-cell')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_PAYOUTS.map((p, i) => (
                  <tr key={p.id} className={cn('border-b border-[#F9FAFB] hover:bg-[#F9FAFB] transition-colors', i === MOCK_PAYOUTS.length - 1 && 'border-b-0')}>
                    <td className="px-4 py-3 text-xs text-[#9CA3AF]">{formatShortDate(p.date)}</td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums text-[#111827]">{formatCurrency(p.amount, p.currency)}</td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{p.bank}</td>
                    <td className="px-4 py-3 text-xs text-[#9CA3AF] hidden sm:table-cell">{formatShortDate(p.arrived)}</td>
                    <td className="px-4 py-3"><Badge variant="green" size="sm" dot>Completed</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Payout settings card */}
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-[#111827]">Payout account</p>
              <button className="text-xs text-[#0000EE] font-semibold hover:underline">Change</button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F8FF] border border-[#E5E7EB]">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center">
                <Building2 size={16} className="text-[#374151]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">Barclays Bank</p>
                <p className="text-xs text-[#9CA3AF] font-mono">•••• •••• 1234</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-bold text-[#111827] mb-4">Payout schedule</p>
            <div className="space-y-3">
              {[
                { icon: <Calendar size={14} className="text-[#0000EE]" />, label: 'Frequency', value: 'Weekly' },
                { icon: <Clock size={14} className="text-[#0000EE]" />, label: 'Day', value: 'Every Wednesday' },
                { icon: <TrendingUp size={14} className="text-[#0000EE]" />, label: 'Min. amount', value: '£100.00' },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
                  <div className="flex items-center gap-2">
                    {r.icon}
                    <span className="text-sm text-[#374151]">{r.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#111827]">{r.value}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 text-xs text-[#0000EE] font-semibold hover:underline">Edit schedule</button>
          </Card>
        </div>
      </div>

      {/* Request payout modal */}
      {requesting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setRequesting(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-[#111827]">Request payout</h2>
              <button onClick={() => setRequesting(false)} className="w-8 h-8 rounded-lg hover:bg-[#F5F8FF] flex items-center justify-center text-[#6B7280]"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F5F8FF] border border-[#E5E7EB]">
                <p className="text-xs text-[#9CA3AF] mb-1">Available to pay out</p>
                <p className="text-2xl font-black text-[#111827] tabular-nums">£3,210.00</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#374151] mb-1.5 block">Payout to</label>
                <div className="flex items-center gap-2 p-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
                  <Building2 size={14} className="text-[#6B7280]" />
                  <span className="text-sm text-[#374151]">Barclays •••• 1234</span>
                </div>
              </div>
              <p className="text-xs text-[#9CA3AF]">Funds typically arrive in 1–2 business days.</p>
              <Button variant="primary" fullWidth onClick={() => setRequesting(false)}>
                Confirm payout of £3,210.00
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   PRODUCTS VIEW
══════════════════════════════════════════ */
function ProductsView() {
  const [toggles, setToggles] = useState({ app: true, pos: false, gs: true });
  const [showKey, setShowKey] = useState(false);

  const toggle = (k: keyof typeof toggles) => setToggles((p) => ({ ...p, [k]: !p[k] }));

  const products = [
    {
      key: 'app' as const,
      icon: <Smartphone size={22} className="text-[#0000EE]" />,
      iconBg: 'bg-[#E8E8FF]',
      name: 'App Payments',
      tagline: 'Mobile & payment link',
      description: 'Let customers pay via the KingsPay app or a shareable link. Perfect for freelancers, service businesses, and anyone who collects payments remotely.',
      stats: [{ label: 'This month', value: '£11,320.00' }, { label: 'Transactions', value: '142' }],
      docs: 'View docs',
    },
    {
      key: 'pos' as const,
      icon: <Monitor size={22} className="text-[#00B3FF]" />,
      iconBg: 'bg-[#E0F6FF]',
      name: 'POS Terminal',
      tagline: 'In-person card reader',
      description: 'Accept contactless, chip, and swipe payments at your physical location. Works offline and syncs automatically when reconnected.',
      stats: [{ label: 'This month', value: '—' }, { label: 'Transactions', value: '—' }],
      docs: 'Order device',
    },
    {
      key: 'gs' as const,
      icon: <ShoppingCart size={22} className="text-[#10B981]" />,
      iconBg: 'bg-[#D1FAE5]',
      name: 'G&S Checkout',
      tagline: 'Online storefront',
      description: 'Embed a fully hosted checkout on your website or e-commerce store. Supports 30+ currencies and card types out of the box.',
      stats: [{ label: 'This month', value: '£2,514.39' }, { label: 'Transactions', value: '31' }],
      docs: 'Integration guide',
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Products"
        subtitle="Enable and configure the KingsPay products for your business"
      />

      {/* Product cards */}
      <div className="flex flex-col gap-4">
        {products.map((p) => (
          <Card key={p.key} className={cn('p-6 transition-all', !toggles[p.key] && 'opacity-60')}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0', p.iconBg)}>
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-[#111827]">{p.name}</h3>
                  <span className="text-xs text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded-full">{p.tagline}</span>
                  {toggles[p.key] && <Badge variant="green" size="sm" dot>Active</Badge>}
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{p.description}</p>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-4">
                  {p.stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-xs text-[#9CA3AF]">{s.label}</p>
                      <p className="text-base font-bold text-[#111827] tabular-nums">{s.value}</p>
                    </div>
                  ))}
                </div>

                <a href="#" className="inline-flex items-center gap-1 text-xs text-[#0000EE] font-semibold hover:underline">
                  {p.docs} <ExternalLink size={11} />
                </a>
              </div>

              {/* Toggle */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => toggle(p.key)}
                  role="switch"
                  aria-checked={toggles[p.key]}
                  aria-label={`Toggle ${p.name}`}
                  className={cn('relative w-11 h-6 rounded-full transition-all duration-200', toggles[p.key] ? 'bg-[#0000EE]' : 'bg-[#E5E7EB]')}
                >
                  <span className={cn('absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200', toggles[p.key] ? 'left-6' : 'left-1')} />
                </button>
                <span className="text-xs text-[#9CA3AF]">{toggles[p.key] ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* API Keys */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-[#111827]">API Keys</h3>
            <p className="text-sm text-[#9CA3AF] mt-0.5">Use these keys to integrate KingsPay into your application</p>
          </div>
          <Button variant="secondary" size="sm" leftIcon={<Plus size={13} />}>New key</Button>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Live secret key', key: 'sk_live_••••••••••••••••••••••••••••4a2f', env: 'live' },
            { label: 'Live publishable key', key: 'pk_live_••••••••••••••••••••••••••••9c1e', env: 'live' },
            { label: 'Test secret key', key: 'sk_test_••••••••••••••••••••••••••••7d3b', env: 'test' },
          ].map((k) => (
            <div key={k.label} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F8FF] border border-[#E5E7EB]">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#374151] mb-0.5">{k.label}</p>
                <p className="text-xs font-mono text-[#9CA3AF] truncate">{showKey ? k.key.replace(/•/g, 'x') : k.key}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', k.env === 'live' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]')}>{k.env}</span>
                <button onClick={() => setShowKey(!showKey)} className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-[#9CA3AF]">
                  {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-[#9CA3AF]">
                  <Copy size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   SETTINGS VIEW
══════════════════════════════════════════ */
function SettingsView() {
  const [notifications, setNotifications] = useState({ payments: true, payouts: true, failures: true, marketing: false });
  const toggleNotif = (k: keyof typeof notifications) => setNotifications((p) => ({ ...p, [k]: !p[k] }));

  function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
    return (
      <button onClick={onToggle} role="switch" aria-checked={on}
        className={cn('relative w-10 h-5 rounded-full transition-all duration-200 shrink-0', on ? 'bg-[#0000EE]' : 'bg-[#E5E7EB]')}>
        <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200', on ? 'left-5' : 'left-0.5')} />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <SectionHeader title="Settings" subtitle="Manage your account and preferences" />

      {/* Business profile */}
      <Card className="p-6">
        <h3 className="font-bold text-[#111827] mb-4">Business profile</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Business name', value: 'Demo Business Ltd', icon: <Building2 size={14} /> },
            { label: 'Business email', value: 'hello@demobusiness.co.uk', icon: <Mail size={14} /> },
            { label: 'Website', value: 'demobusiness.co.uk', icon: <Globe size={14} /> },
            { label: 'Country', value: 'United Kingdom', icon: <Globe size={14} /> },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-xs font-semibold text-[#9CA3AF] block mb-1.5">{f.label}</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
                <span className="text-[#9CA3AF]">{f.icon}</span>
                <span className="text-sm text-[#374151]">{f.value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#F3F4F6] flex justify-end">
          <Button variant="secondary" size="sm">Save changes</Button>
        </div>
      </Card>

      {/* Payout account */}
      <Card className="p-6">
        <h3 className="font-bold text-[#111827] mb-4">Payout account</h3>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F5F8FF] border border-[#E5E7EB] mb-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center">
            <CreditCard size={18} className="text-[#374151]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#111827]">Barclays Bank PLC</p>
            <p className="text-xs text-[#9CA3AF] font-mono">Sort: 20-00-00 · Account: •••• 1234</p>
          </div>
          <Badge variant="green" size="sm" dot>Verified</Badge>
        </div>
        <button className="text-sm text-[#0000EE] font-semibold hover:underline">Change payout account</button>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h3 className="font-bold text-[#111827] mb-4">Notifications</h3>
        <div className="space-y-0">
          {[
            { key: 'payments' as const, label: 'Payment received', desc: 'Get notified every time a customer pays you' },
            { key: 'payouts' as const, label: 'Payout sent', desc: 'Confirmation when a payout reaches your bank' },
            { key: 'failures' as const, label: 'Failed payments', desc: 'Alert when a payment attempt fails' },
            { key: 'marketing' as const, label: 'Product updates', desc: 'News about new features and improvements' },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between py-4 border-b border-[#F3F4F6] last:border-0">
              <div>
                <p className="text-sm font-semibold text-[#111827]">{n.label}</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">{n.desc}</p>
              </div>
              <Toggle on={notifications[n.key]} onToggle={() => toggleNotif(n.key)} />
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <h3 className="font-bold text-[#111827] mb-4">Security</h3>
        <div className="space-y-3">
          {[
            { icon: <Lock size={15} className="text-[#0000EE]" />, label: 'Change password', desc: 'Last changed 3 months ago', action: 'Update' },
            { icon: <Smartphone size={15} className="text-[#10B981]" />, label: 'Two-factor authentication', desc: 'Enabled via authenticator app', action: 'Manage' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 p-4 rounded-xl bg-[#F5F8FF] border border-[#E5E7EB]">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center">{s.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#111827]">{s.label}</p>
                <p className="text-xs text-[#9CA3AF]">{s.desc}</p>
              </div>
              <button className="text-xs text-[#0000EE] font-semibold hover:underline shrink-0">{s.action}</button>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="p-6 border-[#FEE2E2]">
        <h3 className="font-bold text-[#EF4444] mb-1">Danger zone</h3>
        <p className="text-sm text-[#9CA3AF] mb-4">These actions are irreversible. Proceed with caution.</p>
        <button className="inline-flex items-center gap-2 text-sm text-[#EF4444] font-semibold border border-[#FEE2E2] rounded-xl px-4 py-2 hover:bg-[#FEF2F2] transition-colors">
          <Trash2 size={14} />
          Close merchant account
        </button>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
══════════════════════════════════════════ */
interface DashboardProps {
  firstRun?: boolean;
  merchantName?: string;
  status?: AccountStatus;
}

export function Dashboard({ firstRun = false, merchantName = 'Merchant', status = 'active' }: DashboardProps) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [productToggles, setProductToggles] = useState({ app: true, pos: false, gs: true });

  const toggleProduct = (key: keyof typeof productToggles) =>
    setProductToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'transactions', label: 'Transactions', icon: <ArrowUpRight size={16} /> },
    { id: 'payouts', label: 'Payouts', icon: <TrendingUp size={16} /> },
    { id: 'products', label: 'Products', icon: <Package size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F5F8FF]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 lg:w-60 bg-white border-r border-[#E5E7EB] py-6 px-3 shrink-0 sticky top-0 h-screen">
        <a href="/" className="flex items-center gap-1.5 font-bold text-lg px-3 mb-8">
          <span className="w-7 h-7 rounded-[8px] bg-[#0000EE] text-white text-sm font-black flex items-center justify-center">K</span>
          <span className="text-[#111827]">Kings<span className="text-[#0000EE]">Pay</span></span>
        </a>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-left transition-all',
                activeNav === item.id ? 'bg-[#E8E8FF] text-[#0000EE]' : 'text-[#374151] hover:bg-[#F5F8FF] hover:text-[#111827]'
              )}
              aria-current={activeNav === item.id ? 'page' : undefined}
            >
              <span className={cn('shrink-0', activeNav === item.id ? 'text-[#0000EE]' : 'text-[#6B7280]')}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E8E8FF] flex items-center justify-center text-[#0000EE] font-bold text-sm shrink-0">
              {merchantName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#111827] truncate">{merchantName}</p>
              <p className="text-xs text-[#9CA3AF]">Merchant account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <Search size={16} className="text-[#9CA3AF] shrink-0" />
            <input type="search" placeholder="Search transactions…" className="flex-1 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none bg-transparent" />
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg hover:bg-[#F5F8FF] flex items-center justify-center text-[#6B7280] transition-colors"><Bell size={16} /></button>
            <div className="w-8 h-8 rounded-full bg-[#E8E8FF] flex items-center justify-center text-[#0000EE] font-bold text-sm">{merchantName.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 flex flex-col gap-5">
          {status !== 'active' && status !== 'draft' && <StatusBanner status={status} />}

          {/* Route to correct view */}
          {activeNav === 'transactions' && <TransactionsView />}
          {activeNav === 'payouts' && <PayoutsView />}
          {activeNav === 'products' && <ProductsView />}
          {activeNav === 'settings' && <SettingsView />}

          {/* Dashboard (overview) */}
          {activeNav === 'dashboard' && (
            firstRun ? (
              <div className="flex flex-col gap-6 max-w-2xl">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">Welcome to KingsPay, {merchantName}!</h1>
                  <p className="mt-1 text-sm text-[#6B7280]">You&apos;re almost ready to accept your first payment. Complete these steps to go live.</p>
                </div>
                <Card className="p-6">
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-4">Setup checklist</p>
                  <div className="flex flex-col gap-4">
                    {[
                      { done: true, label: 'Create your account', description: 'Business details registered' },
                      { done: true, label: 'Complete identity verification', description: 'Business verified successfully' },
                      { done: false, label: 'Take your first payment', description: 'Share your payment link with a customer', cta: 'Get payment link' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                          {item.done ? <CheckCircle2 size={20} className="text-[#10B981]" /> : <Circle size={20} className="text-[#E5E7EB]" />}
                        </div>
                        <div className="flex-1">
                          <p className={cn('text-sm font-semibold', item.done ? 'text-[#6B7280] line-through' : 'text-[#111827]')}>{item.label}</p>
                          <p className="text-xs text-[#9CA3AF] mt-0.5">{item.description}</p>
                        </div>
                        {item.cta && <Button variant="primary" size="sm">{item.cta} <ChevronRight size={12} /></Button>}
                      </div>
                    ))}
                  </div>
                </Card>
                <div>
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">Quick actions</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: <Smartphone size={20} className="text-[#0000EE]" />, label: 'Share payment link', desc: 'Get paid via link or QR code' },
                      { icon: <Monitor size={20} className="text-[#00B3FF]" />, label: 'Try the POS terminal', desc: 'In-person card acceptance' },
                      { icon: <ShoppingCart size={20} className="text-[#10B981]" />, label: 'Integrate checkout', desc: 'Embed payments on your site' },
                      { icon: <Settings size={20} className="text-[#6B7280]" />, label: 'Customise settings', desc: 'Notifications, branding, API keys' },
                    ].map((action) => (
                      <button key={action.label} className="flex items-start gap-3 bg-white rounded-xl border border-[#E5E7EB] p-4 text-left hover:border-[#0000EE] hover:shadow-[0_4px_16px_rgba(0,0,238,0.08)] transition-all group">
                        <div className="w-9 h-9 rounded-lg bg-[#F5F8FF] flex items-center justify-center shrink-0 group-hover:bg-[#E8E8FF] transition-colors">{action.icon}</div>
                        <div>
                          <p className="text-sm font-semibold text-[#111827]">{action.label}</p>
                          <p className="text-xs text-[#9CA3AF] mt-0.5">{action.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">Dashboard</h1>
                    <p className="text-sm text-[#9CA3AF] mt-0.5">Last updated: May 21, 2026 at 09:42 AM</p>
                  </div>
                  <Button variant="secondary" size="sm" leftIcon={<Download size={13} />}>Export</Button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Total revenue', value: '£48,291.40', change: '+12.4%', up: true },
                    { label: 'Transactions', value: '1,847', change: '+8.2%', up: true },
                    { label: 'Pending payouts', value: '£3,210.00', change: '', up: null },
                    { label: 'Active products', value: '2 / 3', change: '', up: null },
                  ].map((stat) => (
                    <Card key={stat.label} className="p-4">
                      <p className="text-xs text-[#9CA3AF] font-medium">{stat.label}</p>
                      <p className="text-xl font-black text-[#111827] mt-1 tabular-nums">{stat.value}</p>
                      {stat.change && <p className={cn('text-xs font-semibold mt-0.5', stat.up ? 'text-[#10B981]' : 'text-[#EF4444]')}>{stat.change} this month</p>}
                    </Card>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
                      <h2 className="text-sm font-bold text-[#111827]">Recent transactions</h2>
                      <button onClick={() => setActiveNav('transactions')} className="text-xs text-[#0000EE] font-semibold hover:underline">View all</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#F3F4F6]">
                            {['Date', 'Description', 'Amount', 'Status', 'Type'].map((h) => (
                              <th key={h} className={cn('text-left text-xs font-semibold text-[#9CA3AF] px-5 py-3', h === 'Amount' && 'text-right', ['Type'].includes(h) && 'hidden md:table-cell')}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {MOCK_TRANSACTIONS.slice(0, 8).map((txn, i) => (
                            <tr key={txn.id} className={cn('border-b border-[#F9FAFB] hover:bg-[#F9FAFB] transition-colors', i === 7 && 'border-b-0')}>
                              <td className="px-5 py-3 text-xs text-[#9CA3AF] whitespace-nowrap">{formatShortDate(txn.date)}</td>
                              <td className="px-2 py-3 text-[#111827] font-medium max-w-[160px] truncate">{txn.description}</td>
                              <td className={cn('px-2 py-3 text-right font-bold tabular-nums whitespace-nowrap', txn.amount > 0 ? 'text-[#111827]' : 'text-[#6B7280]')}>
                                {txn.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(txn.amount), txn.currency)}
                              </td>
                              <td className="px-2 py-3 hidden sm:table-cell"><Badge variant={statusBadgeVariant[txn.status]} size="sm" dot>{txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}</Badge></td>
                              <td className="px-5 py-3 hidden md:table-cell">
                                <div className="flex items-center gap-1.5">{typeIcons[txn.type]}<span className="text-xs text-[#6B7280] capitalize">{txn.type}</span></div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Card className="p-5">
                      <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">Next payout</p>
                      <p className="text-2xl font-black text-[#111827] tabular-nums">£3,210.00</p>
                      <p className="text-xs text-[#9CA3AF] mt-1 mb-4">Estimated: Mon, 26 May 2026</p>
                      <Button variant="primary" size="sm" fullWidth onClick={() => setActiveNav('payouts')}>Request payout now</Button>
                      <p className="text-xs text-center text-[#9CA3AF] mt-2">Funds arrive in 1–2 business days</p>
                    </Card>
                    <Card className="p-5">
                      <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">Active products</p>
                      <div className="flex flex-col gap-3">
                        {[
                          { key: 'app' as const, icon: <Smartphone size={15} className="text-[#0000EE]" />, label: 'App Payments', desc: 'Mobile & link payments' },
                          { key: 'pos' as const, icon: <Monitor size={15} className="text-[#00B3FF]" />, label: 'POS Terminal', desc: 'In-person card reader' },
                          { key: 'gs' as const, icon: <ShoppingCart size={15} className="text-[#10B981]" />, label: 'G&S Checkout', desc: 'Online storefront payments' },
                        ].map((product) => (
                          <div key={product.key} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F5F8FF] flex items-center justify-center shrink-0">{product.icon}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#111827]">{product.label}</p>
                              <p className="text-[10px] text-[#9CA3AF]">{product.desc}</p>
                            </div>
                            <button onClick={() => toggleProduct(product.key)} role="switch" aria-checked={productToggles[product.key]}
                              className={cn('relative w-9 h-5 rounded-full transition-all duration-200 shrink-0', productToggles[product.key] ? 'bg-[#0000EE]' : 'bg-[#E5E7EB]')}>
                              <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200', productToggles[product.key] ? 'left-4' : 'left-0.5')} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
