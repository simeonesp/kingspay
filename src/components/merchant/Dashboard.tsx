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
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { cn } from '@/lib/utils';
import { formatCurrency, formatShortDate } from '@/lib/utils';
import type { AccountStatus } from '@/store/onboardingStore';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  type: 'payment' | 'payout' | 'refund' | 'fee';
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_001',
    date: '2026-05-21',
    description: 'Payment from Sarah Johnson',
    amount: 249.99,
    currency: 'GBP',
    status: 'completed',
    type: 'payment',
  },
  {
    id: 'txn_002',
    date: '2026-05-21',
    description: 'Weekly payout to Barclays ••1234',
    amount: -1842.5,
    currency: 'GBP',
    status: 'completed',
    type: 'payout',
  },
  {
    id: 'txn_003',
    date: '2026-05-20',
    description: 'Payment from Acme Supplies Ltd',
    amount: 7500.0,
    currency: 'GBP',
    status: 'completed',
    type: 'payment',
  },
  {
    id: 'txn_004',
    date: '2026-05-20',
    description: 'Refund — Order #8821',
    amount: -89.99,
    currency: 'GBP',
    status: 'refunded',
    type: 'refund',
  },
  {
    id: 'txn_005',
    date: '2026-05-19',
    description: 'Payment from Marcus Webb',
    amount: 120.0,
    currency: 'GBP',
    status: 'completed',
    type: 'payment',
  },
  {
    id: 'txn_006',
    date: '2026-05-19',
    description: 'Payment from Riverside Café',
    amount: 556.4,
    currency: 'GBP',
    status: 'pending',
    type: 'payment',
  },
  {
    id: 'txn_007',
    date: '2026-05-18',
    description: 'Platform fee — May 2026',
    amount: -29.99,
    currency: 'GBP',
    status: 'completed',
    type: 'fee',
  },
  {
    id: 'txn_008',
    date: '2026-05-18',
    description: 'Payment from Global Tech GmbH',
    amount: 3200.0,
    currency: 'EUR',
    status: 'completed',
    type: 'payment',
  },
  {
    id: 'txn_009',
    date: '2026-05-17',
    description: 'Payment from Nguyen Textiles',
    amount: 910.0,
    currency: 'USD',
    status: 'failed',
    type: 'payment',
  },
  {
    id: 'txn_010',
    date: '2026-05-16',
    description: 'Payment from Sunrise Bakery',
    amount: 48.5,
    currency: 'GBP',
    status: 'completed',
    type: 'payment',
  },
];

const statusBadgeVariant: Record<
  Transaction['status'],
  'green' | 'amber' | 'red' | 'gray'
> = {
  completed: 'green',
  pending: 'amber',
  failed: 'red',
  refunded: 'gray',
};

const typeIcons: Record<Transaction['type'], React.ReactNode> = {
  payment: <ArrowDownLeft size={14} className="text-[#10B981]" aria-hidden="true" />,
  payout: <ArrowUpRight size={14} className="text-[#0000EE]" aria-hidden="true" />,
  refund: <RefreshCw size={14} className="text-[#6B7280]" aria-hidden="true" />,
  fee: <AlertTriangle size={14} className="text-[#F59E0B]" aria-hidden="true" />,
};

interface DashboardProps {
  firstRun?: boolean;
  merchantName?: string;
  status?: AccountStatus;
}

export function Dashboard({
  firstRun = false,
  merchantName = 'Merchant',
  status = 'active',
}: DashboardProps) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [productToggles, setProductToggles] = useState({
    app: true,
    pos: false,
    gs: true,
  });

  const toggleProduct = (key: keyof typeof productToggles) => {
    setProductToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex min-h-screen bg-[#F5F8FF]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 lg:w-60 bg-white border-r border-[#E5E7EB] py-6 px-3 shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-1.5 font-bold text-lg px-3 mb-8"
          aria-label="KingsPay home"
        >
          <span className="w-7 h-7 rounded-[8px] bg-[#0000EE] text-white text-sm font-black flex items-center justify-center">
            K
          </span>
          <span className="text-[#111827]">
            Kings<span className="text-[#0000EE]">Pay</span>
          </span>
        </a>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 flex-1" aria-label="Dashboard navigation">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
            { id: 'transactions', label: 'Transactions', icon: <ArrowUpRight size={16} /> },
            { id: 'payouts', label: 'Payouts', icon: <TrendingUp size={16} /> },
            { id: 'products', label: 'Products', icon: <Package size={16} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-left transition-all',
                activeNav === item.id
                  ? 'bg-[#E8E8FF] text-[#0000EE]'
                  : 'text-[#374151] hover:bg-[#F5F8FF] hover:text-[#111827]'
              )}
              aria-current={activeNav === item.id ? 'page' : undefined}
            >
              <span
                className={cn(
                  'shrink-0',
                  activeNav === item.id ? 'text-[#0000EE]' : 'text-[#6B7280]'
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Account info */}
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

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <Search size={16} className="text-[#9CA3AF] shrink-0" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search transactions…"
              className="flex-1 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none bg-transparent"
              aria-label="Search transactions"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-lg hover:bg-[#F5F8FF] flex items-center justify-center text-[#6B7280] transition-colors"
              aria-label="Notifications"
            >
              <Bell size={16} aria-hidden="true" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#E8E8FF] flex items-center justify-center text-[#0000EE] font-bold text-sm">
              {merchantName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 flex flex-col gap-5">
          {/* Status banner */}
          {status !== 'active' && status !== 'draft' && (
            <StatusBanner status={status} />
          )}

          {firstRun ? (
            /* ---- FIRST-RUN / EMPTY STATE ---- */
            <div className="flex flex-col gap-6 max-w-2xl">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
                  Welcome to KingsPay, {merchantName}! 👋
                </h1>
                <p className="mt-1 text-sm text-[#6B7280]">
                  You&apos;re almost ready to accept your first payment. Complete these
                  steps to go live.
                </p>
              </div>

              {/* Setup checklist */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6">
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-4">
                  Setup checklist
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      done: true,
                      label: 'Create your account',
                      description: 'Business details registered',
                    },
                    {
                      done: true,
                      label: 'Complete identity verification',
                      description: 'Business verified successfully',
                    },
                    {
                      done: false,
                      label: 'Take your first payment',
                      description: 'Share your payment link with a customer',
                      cta: 'Get payment link',
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {item.done ? (
                          <CheckCircle2
                            size={20}
                            className="text-[#10B981]"
                            aria-hidden="true"
                          />
                        ) : (
                          <Circle
                            size={20}
                            className="text-[#E5E7EB]"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            'text-sm font-semibold',
                            item.done ? 'text-[#6B7280] line-through' : 'text-[#111827]'
                          )}
                        >
                          {item.label}
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">{item.description}</p>
                      </div>
                      {item.cta && (
                        <Button variant="primary" size="sm">
                          {item.cta}
                          <ChevronRight size={12} aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div>
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">
                  Quick actions
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      icon: <Smartphone size={20} className="text-[#0000EE]" />,
                      label: 'Share payment link',
                      desc: 'Get paid via link or QR code',
                    },
                    {
                      icon: <Monitor size={20} className="text-[#00B3FF]" />,
                      label: 'Try the POS terminal',
                      desc: 'In-person card acceptance',
                    },
                    {
                      icon: <ShoppingCart size={20} className="text-[#10B981]" />,
                      label: 'Integrate checkout',
                      desc: 'Embed payments on your site',
                    },
                    {
                      icon: <Settings size={20} className="text-[#6B7280]" />,
                      label: 'Customise settings',
                      desc: 'Notifications, branding, API keys',
                    },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="flex items-start gap-3 bg-white rounded-xl border border-[#E5E7EB] p-4 text-left hover:border-[#0000EE] hover:shadow-[0_4px_16px_rgba(0,0,238,0.08)] transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#F5F8FF] flex items-center justify-center shrink-0 group-hover:bg-[#E8E8FF] transition-colors">
                        {action.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">
                          {action.label}
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">{action.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ---- LIVE DASHBOARD ---- */
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                    Dashboard
                  </h1>
                  <p className="text-sm text-[#9CA3AF] mt-0.5">
                    Last updated: May 21, 2026 at 09:42 AM
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Download size={13} aria-hidden="true" />}
                >
                  Export
                </Button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    label: 'Total revenue',
                    value: '£48,291.40',
                    change: '+12.4%',
                    up: true,
                  },
                  {
                    label: 'Transactions',
                    value: '1,847',
                    change: '+8.2%',
                    up: true,
                  },
                  {
                    label: 'Pending payouts',
                    value: '£3,210.00',
                    change: '',
                    up: null,
                  },
                  {
                    label: 'Active products',
                    value: '2 / 3',
                    change: '',
                    up: null,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-4"
                  >
                    <p className="text-xs text-[#9CA3AF] font-medium">{stat.label}</p>
                    <p className="text-xl font-black text-[#111827] mt-1 amount tabular-nums">
                      {stat.value}
                    </p>
                    {stat.change && (
                      <p
                        className={cn(
                          'text-xs font-semibold mt-0.5',
                          stat.up ? 'text-[#10B981]' : 'text-[#EF4444]'
                        )}
                      >
                        {stat.change} this month
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Main grid */}
              <div className="grid lg:grid-cols-3 gap-5">
                {/* Transactions table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
                    <h2 className="text-sm font-bold text-[#111827]">Recent transactions</h2>
                    <button className="text-xs text-[#0000EE] font-semibold hover:underline">
                      View all
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" role="table">
                      <thead>
                        <tr className="border-b border-[#F3F4F6]">
                          <th className="text-left text-xs font-semibold text-[#9CA3AF] px-5 py-3">
                            Date
                          </th>
                          <th className="text-left text-xs font-semibold text-[#9CA3AF] px-2 py-3">
                            Description
                          </th>
                          <th className="text-right text-xs font-semibold text-[#9CA3AF] px-2 py-3">
                            Amount
                          </th>
                          <th className="text-left text-xs font-semibold text-[#9CA3AF] px-2 py-3 hidden sm:table-cell">
                            Status
                          </th>
                          <th className="text-left text-xs font-semibold text-[#9CA3AF] px-5 py-3 hidden md:table-cell">
                            Type
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_TRANSACTIONS.map((txn, i) => (
                          <tr
                            key={txn.id}
                            className={cn(
                              'border-b border-[#F9FAFB] hover:bg-[#F9FAFB] transition-colors',
                              i === MOCK_TRANSACTIONS.length - 1 && 'border-b-0'
                            )}
                          >
                            <td className="px-5 py-3 text-xs text-[#9CA3AF] whitespace-nowrap">
                              {formatShortDate(txn.date)}
                            </td>
                            <td className="px-2 py-3 text-[#111827] font-medium max-w-[140px] truncate">
                              {txn.description}
                            </td>
                            <td
                              className={cn(
                                'px-2 py-3 text-right font-bold tabular-nums amount whitespace-nowrap',
                                txn.amount > 0 ? 'text-[#111827]' : 'text-[#6B7280]'
                              )}
                            >
                              {txn.amount > 0 ? '+' : ''}
                              {formatCurrency(Math.abs(txn.amount), txn.currency)}
                            </td>
                            <td className="px-2 py-3 hidden sm:table-cell">
                              <Badge
                                variant={statusBadgeVariant[txn.status]}
                                size="sm"
                                dot
                              >
                                {txn.status.charAt(0).toUpperCase() +
                                  txn.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-5 py-3 hidden md:table-cell">
                              <div className="flex items-center gap-1.5">
                                {typeIcons[txn.type]}
                                <span className="text-xs text-[#6B7280] capitalize">
                                  {txn.type}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-4">
                  {/* Payout card */}
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">
                      Next payout
                    </p>
                    <p className="text-2xl font-black text-[#111827] amount tabular-nums">
                      £3,210.00
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-1 mb-4">
                      Estimated: Mon, 26 May 2026
                    </p>
                    <Button variant="primary" size="sm" fullWidth>
                      Request payout now
                    </Button>
                    <p className="text-xs text-center text-[#9CA3AF] mt-2">
                      Funds arrive in 1–2 business days
                    </p>
                  </div>

                  {/* Products panel */}
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">
                      Active products
                    </p>
                    <div className="flex flex-col gap-3">
                      {[
                        {
                          key: 'app' as const,
                          icon: <Smartphone size={15} className="text-[#0000EE]" />,
                          label: 'App Payments',
                          desc: 'Mobile & link payments',
                        },
                        {
                          key: 'pos' as const,
                          icon: <Monitor size={15} className="text-[#00B3FF]" />,
                          label: 'POS Terminal',
                          desc: 'In-person card reader',
                        },
                        {
                          key: 'gs' as const,
                          icon: <ShoppingCart size={15} className="text-[#10B981]" />,
                          label: 'G&S Checkout',
                          desc: 'Online storefront payments',
                        },
                      ].map((product) => (
                        <div
                          key={product.key}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#F5F8FF] flex items-center justify-center shrink-0">
                            {product.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#111827]">
                              {product.label}
                            </p>
                            <p className="text-[10px] text-[#9CA3AF]">{product.desc}</p>
                          </div>
                          <button
                            onClick={() => toggleProduct(product.key)}
                            role="switch"
                            aria-checked={productToggles[product.key]}
                            aria-label={`Toggle ${product.label}`}
                            className={cn(
                              'relative w-9 h-5 rounded-full transition-all duration-200 shrink-0',
                              productToggles[product.key]
                                ? 'bg-[#0000EE]'
                                : 'bg-[#E5E7EB]'
                            )}
                          >
                            <span
                              className={cn(
                                'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200',
                                productToggles[product.key] ? 'left-4.5' : 'left-0.5'
                              )}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
