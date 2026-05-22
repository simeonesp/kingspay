'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Smartphone,
  Monitor,
  ShoppingCart,
  Shield,
  Zap,
  Globe,
  Lock,
  TrendingUp,
  CheckCircle2,
  Star,
  Menu,
  X,
  ChevronRight,
  CreditCard,
  BarChart3,
  Building2,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="/"
      className="flex items-center gap-1.5 font-bold text-lg tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0000EE] rounded-md"
      aria-label="KingsPay home"
    >
      <span className="w-7 h-7 rounded-[8px] bg-[#0000EE] text-white text-sm font-black flex items-center justify-center">
        K
      </span>
      <span className={dark ? 'text-white' : 'text-[#111827]'}>
        Kings<span className="text-[#0000EE]">Pay</span>
      </span>
    </a>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#111827]">
      {/* ============================
          NAVBAR
      ============================ */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            <Logo />

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {['For Merchants', 'For Payers', 'Pricing', 'About'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                  className="px-3.5 py-1.5 text-sm font-medium text-[#374151] hover:text-[#111827] rounded-lg hover:bg-[#F5F8FF] transition-all"
                >
                  {link}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2">
              <a
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-[#374151] hover:text-[#111827] rounded-lg hover:bg-[#F5F8FF] transition-all"
              >
                Sign in
              </a>
              <a
                href="/onboarding"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0000EE] text-white text-sm font-semibold rounded-[10px] hover:bg-[#0000CC] transition-all shadow-sm hover:shadow-md"
              >
                Get started
                <ArrowRight size={13} aria-hidden="true" />
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg hover:bg-[#F5F8FF] text-[#374151] transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#E5E7EB] px-4 py-4 flex flex-col gap-1 animate-fade-in">
            {['For Merchants', 'For Payers', 'Pricing', 'About'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-[#374151] hover:text-[#111827] rounded-lg hover:bg-[#F5F8FF] transition-all"
              >
                {link}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-[#E5E7EB] mt-2">
              <a
                href="/login"
                className="px-3 py-2.5 text-sm font-semibold text-center text-[#374151] border border-[#E5E7EB] rounded-xl hover:bg-[#F5F8FF] transition-all"
              >
                Sign in
              </a>
              <a
                href="/onboarding"
                className="px-3 py-2.5 text-sm font-semibold text-center bg-[#0000EE] text-white rounded-xl hover:bg-[#0000CC] transition-all"
              >
                Get started — free
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ============================
          HERO
      ============================ */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 bg-white">
        {/* Background grid */}
        <div
          className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"
          aria-hidden="true"
        />
        {/* Blue glow */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0000EE]/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-[#E8E8FF] text-[#0000EE] text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
                <Zap size={11} aria-hidden="true" />
                Now in 40+ countries — instant settlement
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111827] leading-[1.05] tracking-tight">
                Payments that move at the{' '}
                <span className="text-[#0000EE]">speed of trust.</span>
              </h1>

              <p className="text-lg text-[#6B7280] leading-relaxed max-w-lg">
                KingsPay gives merchants and consumers a single platform for fast,
                secure, borderless payments. No hidden fees. No legacy friction.
                Just money moving the way it should.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/onboarding"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0000EE] text-white font-semibold rounded-[14px] hover:bg-[#0000CC] active:bg-[#0000AA] transition-all shadow-md hover:shadow-lg text-base"
                >
                  Start as a Merchant
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
                <a
                  href="/payer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-[#0000EE] text-[#0000EE] font-semibold rounded-[14px] hover:bg-[#E8E8FF] transition-all text-base"
                >
                  Download the App
                  <Smartphone size={16} aria-hidden="true" />
                </a>
              </div>

              <p className="text-xs text-[#9CA3AF]">
                No setup fees &middot; No monthly minimums &middot; Cancel anytime
              </p>
            </div>

            {/* Right: Phone mockup */}
            <div className="flex items-center justify-center lg:justify-end animate-slide-in-right">
              <div
                className="relative w-[260px] sm:w-[280px]"
                aria-hidden="true"
              >
                {/* Phone frame */}
                <div className="bg-[#111827] rounded-[40px] p-3 shadow-2xl">
                  <div className="bg-[#F5F8FF] rounded-[32px] overflow-hidden h-[520px] flex flex-col">
                    {/* Status bar */}
                    <div className="bg-white px-5 pt-3 pb-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827]">9:41</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-1.5 bg-[#111827] rounded-sm" />
                        <div className="w-1.5 h-1.5 bg-[#111827] rounded-full" />
                      </div>
                    </div>

                    {/* App content */}
                    <div className="flex-1 px-4 pt-3 pb-5 flex flex-col gap-3">
                      <p className="text-xs font-bold text-[#111827]">
                        Kings<span className="text-[#FF6B35]">Pay</span>
                      </p>

                      {/* Balance card */}
                      <div className="bg-gradient-to-br from-[#0000EE] to-[#0055FF] rounded-2xl p-4 text-white">
                        <p className="text-xs opacity-70">Available balance</p>
                        <p className="text-2xl font-black mt-0.5 tabular-nums">£2,481.50</p>
                        <div className="flex items-center gap-1 mt-2">
                          <div className="w-6 h-3.5 bg-[#F59E0B] rounded-sm opacity-90" />
                          <span className="text-xs opacity-60">•••• 4291</span>
                        </div>
                      </div>

                      {/* Quick actions */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { icon: '💸', label: 'Send' },
                          { icon: '📥', label: 'Receive' },
                          { icon: '💳', label: 'Cards' },
                        ].map((action) => (
                          <div
                            key={action.label}
                            className="bg-white rounded-xl p-2.5 flex flex-col items-center gap-1 shadow-sm border border-[#F3F4F6]"
                          >
                            <span className="text-base">{action.icon}</span>
                            <span className="text-[9px] font-semibold text-[#374151]">
                              {action.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Recent */}
                      <p className="text-xs font-bold text-[#374151]">Recent</p>
                      {[
                        { name: 'Riverside Café', amount: '-£4.80', color: '#10B981', emoji: '☕' },
                        { name: 'TechFlow Studios', amount: '-£250', color: '#0000EE', emoji: '💻' },
                        { name: 'Payout received', amount: '+£1,200', color: '#FF6B35', emoji: '✅' },
                      ].map((tx) => (
                        <div
                          key={tx.name}
                          className="bg-white rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-sm border border-[#F3F4F6]"
                        >
                          <span className="text-sm">{tx.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold text-[#111827] truncate">
                              {tx.name}
                            </p>
                            <p className="text-[9px] text-[#9CA3AF]">Today</p>
                          </div>
                          <p
                            className="text-xs font-bold tabular-nums"
                            style={{ color: tx.color }}
                          >
                            {tx.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating accent pill */}
                <div className="absolute -right-4 top-16 bg-[#00B3FF] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                  Instant ⚡
                </div>
                <div className="absolute -left-6 bottom-20 bg-white text-[#111827] text-xs font-semibold px-3 py-2 rounded-xl shadow-lg border border-[#E5E7EB]">
                  <p className="text-[10px] text-[#9CA3AF]">Settled</p>
                  <p className="font-black text-[#10B981]">+£1,200</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          TRUST BAR
      ============================ */}
      <section className="py-8 border-y border-[#E5E7EB] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              { icon: <Shield size={16} className="text-[#0000EE]" />, label: 'PCI DSS Compliant' },
              { icon: <Lock size={16} className="text-[#0000EE]" />, label: '256-bit Encryption' },
              { icon: <CheckCircle2 size={16} className="text-[#0000EE]" />, label: 'SOC 2 Type II' },
              { icon: <Zap size={16} className="text-[#0000EE]" />, label: '99.9% Uptime' },
              { icon: <Globe size={16} className="text-[#0000EE]" />, label: '40+ Countries' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm font-semibold text-[#374151]"
              >
                {icon}
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          HOW IT WORKS
      ============================ */}
      <section
        id="for-merchants"
        className="py-20 sm:py-28 bg-[#000B2E]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold text-[#00B3FF] uppercase tracking-widest mb-3">
              For Merchants
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Accept payments in minutes,
              <br className="hidden sm:block" />
              not weeks.
            </h2>
            <p className="mt-4 text-base text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
              From sign-up to your first transaction, KingsPay gets you live faster than
              any legacy payment provider.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: '01',
                icon: <Building2 size={24} className="text-[#00B3FF]" />,
                title: 'Create your account',
                description:
                  'Register your business in under 5 minutes. Our streamlined KYB process is built for modern companies.',
                detail: 'Identity verified typically in 2–3 business days.',
              },
              {
                step: '02',
                icon: <CreditCard size={24} className="text-[#00B3FF]" />,
                title: 'Connect your bank',
                description:
                  'Link your bank account for direct payouts. Supports UK, US, EU, African, and Asia-Pacific banks.',
                detail: 'Payouts land within 1–2 business days.',
              },
              {
                step: '03',
                icon: <Zap size={24} className="text-[#00B3FF]" />,
                title: 'Start accepting payments',
                description:
                  'Share a payment link, integrate our checkout API, or use the POS terminal. Take payments instantly.',
                detail: 'App, POS, and G&S Checkout all included.',
              },
            ].map((step) => (
              <div
                key={step.step}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#00B3FF]/10 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-black text-white/10 group-hover:text-white/20 transition-colors tabular-nums">
                    {step.step}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-[#94A3B8] leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <p className="text-xs text-[#00B3FF] font-medium mt-auto flex items-center gap-1">
                  <CheckCircle2 size={12} aria-hidden="true" />
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="/onboarding"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0000EE] text-white font-semibold rounded-[14px] hover:bg-[#0000CC] transition-all shadow-lg hover:shadow-xl text-base"
            >
              Create merchant account
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================
          PRODUCTS
      ============================ */}
      <section className="py-20 sm:py-28 bg-[#F5F8FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold text-[#0000EE] uppercase tracking-widest mb-3">
              Products
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
              One platform, every payment scenario
            </h2>
            <p className="mt-4 text-base text-[#6B7280] max-w-xl mx-auto leading-relaxed">
              Whether you&apos;re a solo freelancer, a high-street retailer, or a global
              SaaS business — KingsPay has the product for you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Smartphone size={22} className="text-[#0000EE]" />,
                accent: '#0000EE',
                title: 'KingsPay App',
                subtitle: 'Payer payments',
                description:
                  'Consumer-grade payment app. Send money to any merchant via link or QR code. Multi-currency, instant settlement.',
                features: [
                  'Pay via link or QR',
                  'Multi-currency',
                  'In-app card storage',
                  'Real-time notifications',
                ],
                cta: 'Learn more',
              },
              {
                icon: <Monitor size={22} className="text-[#00B3FF]" />,
                accent: '#00B3FF',
                title: 'KingsPay POS',
                subtitle: 'In-person payments',
                description:
                  'Accept contactless, chip & PIN, and QR code payments in person. Works offline. Receipt printing included.',
                features: [
                  'Tap, chip & PIN, QR',
                  'Works offline',
                  'Receipt printing',
                  'Inventory tracking',
                ],
                cta: 'Learn more',
              },
              {
                icon: <ShoppingCart size={22} className="text-[#10B981]" />,
                accent: '#10B981',
                title: 'G&S Checkout',
                subtitle: 'Online storefront',
                description:
                  'Embeddable checkout for your website or app. SDKs for React, Vue, iOS, and Android. Fraud protection included.',
                features: [
                  'Embeddable widget',
                  'React / Vue / iOS / Android SDKs',
                  'Fraud detection',
                  'Hosted checkout page',
                ],
                cta: 'Learn more',
              },
            ].map((product) => (
              <div
                key={product.title}
                className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,238,0.1)] transition-all group"
              >
                {/* Accent top border */}
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: product.accent }}
                  aria-hidden="true"
                />
                <div className="p-6 flex flex-col gap-4">
                  <div>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${product.accent}15` }}
                    >
                      {product.icon}
                    </div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-1"
                      style={{ color: product.accent }}
                    >
                      {product.subtitle}
                    </p>
                    <h3 className="text-xl font-black text-[#111827]">{product.title}</h3>
                    <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#374151]">
                        <CheckCircle2
                          size={14}
                          style={{ color: product.accent }}
                          aria-hidden="true"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-sm font-semibold mt-auto transition-all group-hover:gap-2"
                    style={{ color: product.accent }}
                  >
                    {product.cta}
                    <ChevronRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          STATS
      ============================ */}
      <section className="py-20 sm:py-28 bg-[#111827]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Trusted by merchants and payers worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                value: '$2.4B+',
                label: 'Total processed',
                icon: <TrendingUp size={20} className="text-[#00B3FF]" />,
                detail: 'Across 40+ currencies',
              },
              {
                value: '180k+',
                label: 'Active merchants',
                icon: <Building2 size={20} className="text-[#00B3FF]" />,
                detail: 'From sole traders to enterprises',
              },
              {
                value: '4.2M+',
                label: 'Registered payers',
                icon: <Users size={20} className="text-[#00B3FF]" />,
                detail: 'Making payments every day',
              },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight tabular-nums amount">
                  {stat.value}
                </p>
                <p className="text-base font-semibold text-[#E2E8F0]">{stat.label}</p>
                <p className="text-xs text-[#64748B]">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          TESTIMONIALS
      ============================ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold text-[#0000EE] uppercase tracking-widest mb-3">
              Merchant stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
              Real businesses. Real results.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "KingsPay got us taking payments within 48 hours of signing up. The dashboard is clean, payouts are reliable, and their support actually responds. We've never looked back.",
                name: 'Amara Osei',
                business: 'Riverside Café, London',
                emoji: '☕',
                stars: 5,
              },
              {
                quote:
                  "We integrated the G&S Checkout SDK in an afternoon. The developer docs are exceptional, fraud rates dropped 60% vs our old provider, and fees are genuinely lower.",
                name: 'Mikhail Petrov',
                business: 'TechFlow Studios, Berlin',
                emoji: '💻',
                stars: 5,
              },
              {
                quote:
                  "As a sole trader doing markets and pop-ups, the POS terminal changed everything. Tap payments, offline mode, instant receipts. My customers love the professionalism it brings.",
                name: 'Yewande Adeyemi',
                business: 'Lagos Textile Co., Lagos',
                emoji: '🧵',
                stars: 5,
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-[#F5F8FF] rounded-2xl border border-[#E5E7EB] p-6 flex flex-col gap-4 hover:shadow-[0_4px_24px_rgba(0,0,238,0.08)] transition-all"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-[#F59E0B] text-[#F59E0B]"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <blockquote className="text-sm text-[#374151] leading-relaxed italic flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3 pt-2 border-t border-[#E5E7EB]">
                  <div className="w-9 h-9 rounded-full bg-[#E8E8FF] flex items-center justify-center text-lg shrink-0">
                    {testimonial.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">{testimonial.name}</p>
                    <p className="text-xs text-[#9CA3AF]">{testimonial.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          DUAL CTA
      ============================ */}
      <section id="for-payers" className="py-20 sm:py-28 bg-[#F5F8FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
              Built for everyone in the payment chain
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Merchants */}
            <div className="bg-[#000B2E] rounded-2xl p-8 flex flex-col gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B3FF] uppercase tracking-widest mb-3">
                  <Building2 size={12} />
                  For Merchants
                </span>
                <h3 className="text-2xl font-black text-white leading-tight">
                  Grow revenue without growing headaches
                </h3>
                <p className="mt-2 text-sm text-[#94A3B8] leading-relaxed">
                  KingsPay gives your business every tool it needs to accept payments
                  globally, manage payouts, and understand your revenue — all in one
                  dashboard.
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {[
                  'Accept payments online, in-person, and via link',
                  'Get paid to any bank account in 40+ countries',
                  'Transparent fee structure — no surprises',
                  'Real-time dashboard & instant notifications',
                  'PCI DSS compliant infrastructure out of the box',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm text-[#CBD5E1]">
                    <CheckCircle2 size={15} className="text-[#00B3FF] shrink-0 mt-0.5" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <a
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0000EE] text-white font-semibold rounded-[12px] hover:bg-[#0000CC] transition-all mt-auto"
              >
                Start accepting payments
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>

            {/* Payers */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 flex flex-col gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B35] uppercase tracking-widest mb-3">
                  <Smartphone size={12} />
                  For Payers
                </span>
                <h3 className="text-2xl font-black text-[#111827] leading-tight">
                  Pay any merchant, anywhere, instantly
                </h3>
                <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                  The KingsPay app makes paying your favourite merchants simple, fast,
                  and secure. One tap to pay, real-time receipts, and full transaction
                  history.
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {[
                  'Pay via link, QR code, or search',
                  'Store cards securely — never re-enter details',
                  'Multi-currency with real-time conversion rates',
                  'Instant payment confirmation & digital receipts',
                  'Zero fees for standard payments',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm text-[#374151]">
                    <CheckCircle2 size={15} className="text-[#FF6B35] shrink-0 mt-0.5" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <a
                href="/payer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-[12px] hover:bg-[#E55A22] transition-all mt-auto"
              >
                Create payer account
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          FOOTER
      ============================ */}
      <footer className="bg-[#111827] text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
              <div className="flex items-center gap-1.5 font-bold text-lg">
                <span className="w-7 h-7 rounded-[8px] bg-[#0000EE] text-white text-sm font-black flex items-center justify-center">
                  K
                </span>
                <span className="text-white">
                  Kings<span className="text-[#0000EE]">Pay</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Powering payments for merchants and consumers worldwide since 2022.
              </p>
              {/* Socials */}
              <div className="flex gap-2">
                {['𝕏', 'in', 'f', '◻'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-bold text-white transition-colors"
                    aria-label={`KingsPay on ${social}`}
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {[
              {
                title: 'Products',
                links: ['App Payments', 'POS Terminal', 'G&S Checkout', 'Payment Links', 'API & SDK'],
              },
              {
                title: 'Company',
                links: ['About us', 'Careers', 'Press', 'Blog', 'Partners'],
              },
              {
                title: 'Support',
                links: ['Help centre', 'Contact us', 'System status', 'Security', 'Community'],
              },
              {
                title: 'Legal',
                links: ['Privacy policy', 'Terms of service', 'Cookie policy', 'Compliance', 'Licenses'],
              },
            ].map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs">
              © {new Date().getFullYear()} KingsPay Ltd. Registered in England & Wales. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <Shield size={11} aria-hidden="true" />
                PCI DSS Certified
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1">
                <Lock size={11} aria-hidden="true" />
                256-bit TLS
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1">
                <BarChart3 size={11} aria-hidden="true" />
                SOC 2 Type II
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
