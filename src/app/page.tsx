'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Zap,
  Globe,
  Lock,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = ['Products', 'For Merchants', 'For Payers', 'Pricing', 'About'];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#030712]/90 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[7px] bg-[#0000EE] flex items-center justify-center text-white font-black text-sm">
            K
          </div>
          <span className="text-white font-semibold tracking-tight text-[15px]">
            Kings<span className="text-[#00B3FF]">Pay</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a key={l} href="#" className="text-[13px] text-white/50 hover:text-white transition-colors">
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="/onboarding" className="text-[13px] text-white/50 hover:text-white transition-colors">
            Sign in
          </a>
          <a
            href="/onboarding"
            className="h-8 px-4 rounded-full bg-white text-[#030712] text-[13px] font-semibold hover:bg-white/90 transition-colors flex items-center"
          >
            Get started
          </a>
        </div>

        <button
          className="md:hidden text-white/60 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#030712] border-t border-white/[0.06] px-6 py-5 space-y-4">
          {links.map((l) => (
            <a key={l} href="#" className="block text-white/60 hover:text-white text-sm">{l}</a>
          ))}
          <a href="/onboarding" className="block w-full text-center h-10 rounded-full bg-white text-[#030712] text-sm font-semibold leading-10 mt-2">
            Get started
          </a>
        </div>
      )}
    </header>
  );
}

/* ── Hero ── */
function Hero() {
  return (
    <section className="relative min-h-screen bg-[#030712] overflow-hidden flex flex-col items-center justify-center pt-16">
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,179,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,179,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#0000EE]/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[#00B3FF]/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0000EE]/40 bg-[#0000EE]/10 text-[#00B3FF] text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B3FF] animate-pulse" />
          Now live in 40+ countries — instant settlement
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-bold text-white leading-[1.06] tracking-tight max-w-4xl mx-auto mb-6">
          Payments that move<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000EE] to-[#00B3FF]">
            at the speed of trust.
          </span>
        </h1>

        <p className="text-white/50 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          KingsPay gives merchants and consumers a single platform for fast, secure,
          borderless payments. No hidden fees. No legacy friction.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <a
            href="/onboarding"
            className="h-12 px-7 rounded-full bg-[#0000EE] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#0000CC] transition-colors"
          >
            Start as a Merchant <ArrowRight size={15} />
          </a>
          <a
            href="/payer"
            className="h-12 px-7 rounded-full border border-white/15 text-white text-sm font-medium flex items-center gap-2 hover:border-white/30 hover:bg-white/5 transition-colors"
          >
            Download the App <ArrowUpRight size={15} />
          </a>
        </div>

        {/* Phone mockup */}
        <div className="relative mx-auto max-w-[320px]">
          <div className="absolute -left-24 top-16 hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm">
            <span className="text-[11px] text-[#10B981] font-medium">+£1,200.00 Settled</span>
          </div>
          <div className="absolute -right-28 top-32 hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0000EE]/20 border border-[#0000EE]/30 backdrop-blur-sm">
            <Zap size={12} className="text-[#00B3FF]" />
            <span className="text-[11px] text-white/70">Instant</span>
          </div>

          <div className="rounded-[36px] bg-[#0A0F1E] border border-white/10 shadow-2xl overflow-hidden p-2">
            <div className="rounded-[28px] bg-[#0D1424] overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <span className="text-white/50 text-[11px] font-medium">9:41</span>
                <div className="w-20 h-4 rounded-full bg-black" />
                <div className="w-4 h-2.5 rounded-sm border border-white/30" />
              </div>

              <div className="px-5 pb-3 flex items-center justify-between">
                <span className="text-white font-semibold text-[15px]">Kings<span className="text-[#00B3FF]">Pay</span></span>
                <div className="w-7 h-7 rounded-full bg-[#0000EE]/30 border border-[#0000EE]/50 flex items-center justify-center">
                  <span className="text-[#00B3FF] text-[10px] font-bold">K</span>
                </div>
              </div>

              <div className="mx-4 mb-4 rounded-2xl bg-gradient-to-br from-[#0000EE] to-[#00B3FF] p-4">
                <p className="text-white/70 text-[11px] mb-1">Available balance</p>
                <p className="text-white font-bold text-2xl tracking-tight tabular-nums">£2,481.50</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-white/60 text-[11px] font-mono">•••• 4291</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mx-4 mb-5">
                {['Send', 'Receive', 'Cards'].map((a) => (
                  <div key={a} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="w-8 h-8 rounded-lg bg-[#0000EE]/20 border border-[#0000EE]/20" />
                    <span className="text-white/60 text-[10px]">{a}</span>
                  </div>
                ))}
              </div>

              <div className="px-4 pb-6 space-y-1">
                <p className="text-white/40 text-[11px] font-medium mb-3 uppercase tracking-wider">Recent</p>
                {[
                  { name: 'Riverside Café', amount: '−£4.80', pos: false },
                  { name: 'TechFlow Studios', amount: '−£250', pos: false },
                  { name: 'Payout received', amount: '+£1,200', pos: true },
                ].map((t) => (
                  <div key={t.name} className="flex items-center justify-between py-2.5 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-white/[0.06]" />
                      <div>
                        <p className="text-white/80 text-[12px] font-medium">{t.name}</p>
                        <p className="text-white/30 text-[10px]">Today</p>
                      </div>
                    </div>
                    <span className={cn('text-[12px] font-semibold tabular-nums', t.pos ? 'text-[#10B981]' : 'text-white/60')}>{t.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent" />
    </section>
  );
}

/* ── Partner bar ── */
function PartnerBar() {
  const items = ['PCI DSS', 'SOC 2 Type II', '256-bit TLS', '99.9% Uptime', '40+ Countries', 'ISO 27001', 'GDPR Ready', 'Instant Settlement'];
  return (
    <section className="bg-[#030712] border-y border-white/[0.05] py-5 overflow-hidden">
      <div className="flex items-center gap-10 px-8 whitespace-nowrap">
        {[...items, ...items].map((p, i) => (
          <span key={i} className="text-white/20 text-[11px] font-medium uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-white/15" />
            {p}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ── Reusable product section ── */
function ProductSection({
  eyebrow, headline, body, link, visual, reverse = false,
}: {
  eyebrow: string; headline: string; body: string; link: string;
  visual: React.ReactNode; reverse?: boolean;
}) {
  return (
    <section className="bg-[#030712] py-24 border-b border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6">
        <div className={cn('flex flex-col lg:flex-row items-center gap-16', reverse && 'lg:flex-row-reverse')}>
          <div className="flex-1 max-w-lg">
            <p className="text-[#00B3FF] text-xs font-semibold uppercase tracking-widest mb-4">{eyebrow}</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-5">{headline}</h2>
            <p className="text-white/45 text-base leading-relaxed mb-8">{body}</p>
            <a href="#" className="inline-flex items-center gap-2 text-white text-sm font-medium hover:text-[#00B3FF] transition-colors">
              {link} <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="flex-1 w-full max-w-xl">{visual}</div>
        </div>
      </div>
    </section>
  );
}

/* ── Dashboard visual ── */
function DashboardVisual() {
  const rows = [
    { desc: 'Payment from Sarah J.', amount: '+£249.99', status: 'Completed', color: '#10B981' },
    { desc: 'Weekly payout to Barclays', amount: '−£1,842.50', status: 'Payout', color: '#00B3FF' },
    { desc: 'Payment from Acme Corp', amount: '+£7,500.00', status: 'Completed', color: '#10B981' },
    { desc: 'Refund — Order #8821', amount: '−£89.99', status: 'Refunded', color: '#F59E0B' },
    { desc: 'Platform fee — May 2026', amount: '−£29.99', status: 'Fee', color: '#6B7280' },
  ];
  return (
    <div className="rounded-2xl bg-[#080D1A] border border-white/[0.07] overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#0000EE]/20 border border-[#0000EE]/30 flex items-center justify-center">
            <span className="text-[#00B3FF] text-[8px] font-bold">K</span>
          </div>
          <span className="text-white/50 text-xs">KingsPay Dashboard</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-white/30 text-[11px]">Live</span>
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-white/[0.05] border-b border-white/[0.06]">
        {[{ label: 'Revenue', val: '£48,291.40' }, { label: 'Transactions', val: '1,847' }, { label: 'Pending', val: '£3,210.00' }].map((s) => (
          <div key={s.label} className="px-4 py-4">
            <p className="text-white/25 text-[10px] uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-white font-semibold text-sm tabular-nums">{s.val}</p>
          </div>
        ))}
      </div>
      <div className="divide-y divide-white/[0.04]">
        {rows.map((r) => (
          <div key={r.desc} className="flex items-center justify-between px-5 py-3">
            <p className="text-white/60 text-[12px]">{r.desc}</p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] tabular-nums text-white/45">{r.amount}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: r.color, backgroundColor: `${r.color}18` }}>{r.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Network visual ── */
function NetworkVisual() {
  const nodes = [
    { label: 'KingsPay', x: 50, y: 50, primary: true },
    { label: 'UK', x: 22, y: 22 }, { label: 'US', x: 78, y: 22 },
    { label: 'Nigeria', x: 15, y: 72 }, { label: 'Kenya', x: 85, y: 72 },
    { label: 'EU', x: 50, y: 88 }, { label: 'India', x: 50, y: 12 },
  ];
  return (
    <div className="rounded-2xl bg-[#080D1A] border border-white/[0.07] overflow-hidden aspect-square max-w-sm mx-auto relative">
      <svg className="absolute inset-0 w-full h-full">
        {nodes.filter(n => !n.primary).map((n, i) => (
          <line key={i} x1="50%" y1="50%" x2={`${n.x}%`} y2={`${n.y}%`}
            stroke="rgba(0,179,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
        ))}
      </svg>
      {nodes.map((n) => (
        <div key={n.label} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}>
          <div className={cn('rounded-full border flex items-center justify-center text-[10px] font-bold',
            n.primary
              ? 'w-12 h-12 bg-[#0000EE] border-[#0000EE]/60 text-white shadow-lg'
              : 'w-8 h-8 bg-[#0000EE]/10 border-[#0000EE]/20 text-[#00B3FF]')}>
            {n.primary ? 'K' : n.label[0]}
          </div>
          {!n.primary && <span className="text-white/25 text-[9px]">{n.label}</span>}
        </div>
      ))}
      <div className="absolute bottom-5 left-5 right-5">
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3">
          <p className="text-white/25 text-[10px] uppercase tracking-wider mb-0.5">Active corridors</p>
          <p className="text-white font-semibold">40+ Countries</p>
        </div>
      </div>
    </div>
  );
}

/* ── Security visual ── */
function SecurityVisual() {
  const checks = [
    'PCI DSS Level 1 certified',
    '256-bit TLS encryption in transit',
    'SOC 2 Type II audited annually',
    'Zero plaintext storage of card data',
    'Biometric & 2FA authentication',
    'Real-time fraud detection engine',
  ];
  return (
    <div className="rounded-2xl bg-[#080D1A] border border-white/[0.07] overflow-hidden p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#0000EE]/15 border border-[#0000EE]/25 flex items-center justify-center">
          <Lock size={18} className="text-[#00B3FF]" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Enterprise Security</p>
          <p className="text-white/35 text-xs">Bank-grade protection by default</p>
        </div>
      </div>
      <div className="space-y-0">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0">
            <CheckCircle2 size={13} className="text-[#10B981] flex-shrink-0" />
            <span className="text-white/50 text-sm">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Feature columns ── */
function Features() {
  const cols = [
    { icon: <Zap size={17} className="text-[#00B3FF]" />, title: 'Instant', body: 'Money moves in real time across borders, networks, and currencies — infrastructure built to power always-on, global payments.' },
    { icon: <Globe size={17} className="text-[#00B3FF]" />, title: 'Open', body: 'KingsPay works with stablecoins, fiat, and everything in between. No gatekeepers, no proprietary rails, no lock-in.' },
    { icon: <Lock size={17} className="text-[#00B3FF]" />, title: 'Simple', body: 'Easily integrate with commerce tools your teams use. One dashboard, fully focused on what matters: payments that work.' },
  ];
  return (
    <section className="bg-[#030712] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-white/30 text-sm text-center mb-12">
          Making global money movement instant, open, and simple.
        </p>
        <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.05]">
          {cols.map((c) => (
            <div key={c.title} className="bg-[#030712] px-8 py-10">
              <div className="w-9 h-9 rounded-xl bg-[#0000EE]/12 border border-[#0000EE]/18 flex items-center justify-center mb-5">
                {c.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">{c.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Stats ── */
function Stats() {
  const items = [
    { val: '$2.4B+', label: 'Processed annually' },
    { val: '180k+', label: 'Active merchants' },
    { val: '4.2M+', label: 'Payers worldwide' },
    { val: '99.97%', label: 'Uptime SLA' },
  ];
  return (
    <section className="bg-[#05080F] border-y border-white/[0.05] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-white tabular-nums mb-2">{s.val}</p>
              <p className="text-white/30 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Dual CTA card ── */
function CTACard() {
  return (
    <section className="bg-[#030712] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-3xl overflow-hidden grid md:grid-cols-2">
          <div className="bg-[#0000EE] px-10 py-14">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">For Merchants</p>
            <h3 className="text-white font-bold text-3xl leading-tight mb-4">Start accepting payments today.</h3>
            <p className="text-white/55 text-sm leading-relaxed mb-8">
              No setup fees, no monthly minimums. Go live in minutes with one integration across online, in-person, and mobile.
            </p>
            <a href="/onboarding" className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white text-[#0000EE] text-sm font-semibold hover:bg-white/90 transition-colors">
              Create merchant account <ArrowRight size={14} />
            </a>
          </div>
          <div className="bg-[#080D1A] border border-white/[0.07] px-10 py-14">
            <p className="text-[#00B3FF] text-xs font-semibold uppercase tracking-widest mb-4">For Payers</p>
            <h3 className="text-white font-bold text-3xl leading-tight mb-4">Pay any organisation, instantly.</h3>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Send money to merchants worldwide. No card fees, no delays. Fast, secure payments that arrive the same second you send them.
            </p>
            <a href="/payer" className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white/[0.08] border border-white/15 text-white text-sm font-semibold hover:bg-white/12 transition-colors">
              Download the app <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Talk to sales ── */
function TalkToSales() {
  return (
    <section className="bg-[#030712] pb-24 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-white/35 text-sm mb-3">
          Processing over £10M/month?{' '}
          <a href="#" className="text-white underline underline-offset-4 hover:text-[#00B3FF] transition-colors">Talk to sales.</a>{' '}
          Learn more about how KingsPay can help your enterprise.
        </p>
        <a href="#" className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-white/12 text-white/60 text-sm hover:border-white/25 hover:text-white transition-colors">
          Contact us <ChevronRight size={14} />
        </a>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  const cols = [
    { heading: 'Products', links: ['KingsPay App', 'POS Terminal', 'G&S Checkout', 'API', 'SDK'] },
    { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
    { heading: 'Developers', links: ['Documentation', 'API Reference', 'Status', 'Changelog', 'GitHub'] },
    { heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance'] },
  ];
  return (
    <footer className="bg-[#030712] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-[7px] bg-[#0000EE] flex items-center justify-center text-white font-black text-sm">K</div>
              <span className="text-white font-semibold">Kings<span className="text-[#00B3FF]">Pay</span></span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed">The payments platform built for the speed of now.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {cols.map((c) => (
              <div key={c.heading}>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">{c.heading}</p>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}><a href="#" className="text-white/25 text-sm hover:text-white/55 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/[0.05]">
          <p className="text-white/18 text-xs">© 2026 KingsPay Ltd. All rights reserved.</p>
          <p className="text-white/18 text-xs">Regulated by the FCA · PCI DSS Level 1</p>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="overflow-hidden">
        <p
          className="text-center font-bold select-none leading-none pb-0"
          style={{ fontSize: 'clamp(72px, 16vw, 220px)', letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.04)' }}
        >
          KingsPay
        </p>
      </div>
    </footer>
  );
}

/* ── Page ── */
export default function LandingPage() {
  return (
    <main className="bg-[#030712]">
      <Navbar />
      <Hero />
      <PartnerBar />
      <ProductSection
        eyebrow="Merchant Dashboard"
        headline="Your payments command centre."
        body="Real-time transactions, instant payouts, and product controls — all in one place. Built for merchants who move fast and need clarity at a glance."
        link="Explore the dashboard"
        visual={<DashboardVisual />}
      />
      <ProductSection
        eyebrow="Global Coverage"
        headline="Send and receive anywhere in the world."
        body="40+ country corridors, multi-currency support, and instant cross-border settlement. KingsPay connects every market without the legacy friction."
        link="See all corridors"
        visual={<NetworkVisual />}
        reverse
      />
      <ProductSection
        eyebrow="Security"
        headline="Bank-grade security, by default."
        body="PCI DSS Level 1, SOC 2 Type II, and zero plaintext storage. Every transaction is encrypted end-to-end from the moment it leaves your device."
        link="Read our security docs"
        visual={<SecurityVisual />}
      />
      <Features />
      <Stats />
      <CTACard />
      <TalkToSales />
      <Footer />
    </main>
  );
}
