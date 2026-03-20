"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StakeholderCard } from "@/components/value-overview/StakeholderCard";

const stakeholders = [
  {
    id: "client",
    label: "Client",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "For the Client",
    subtitle: "Tax-efficient wealth accumulation",
    accentColor: "bg-navy",
    keyMetric: { label: "Core Benefit", value: "Eliminate annual tax drag on portfolio growth" },
    benefits: [
      { title: "Tax-Deferred Growth", description: "No annual capital gains, dividends, or interest tax. Your portfolio compounds at the gross rate, not after-tax." },
      { title: "Professional Investment Management", description: "Choose your own RIA to manage a customized Separately Managed Account (SMA) with institutional-grade strategies." },
      { title: "Estate Planning Efficiency", description: "Death benefit provides tax-efficient wealth transfer. Probate bypass and enhanced privacy within the insurance wrapper." },
      { title: "Cross-Border Flexibility", description: "Optimized for international clients. USD/JPY currency management and favorable treaty treatment for Japanese nationals." },
      { title: "Privacy & Asset Protection", description: "Assets held within the insurance carrier's structure, providing an additional layer of privacy and creditor protection." },
      { title: "Customized SMA", description: "Unlike retail products, your portfolio is a separately managed account tailored to your specific investment objectives." },
    ],
  },
  {
    id: "money-manager",
    label: "Money Manager",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "For the Money Manager",
    subtitle: "Grow AUM through institutional platform",
    accentColor: "bg-teal",
    keyMetric: { label: "Opportunity", value: "Access $1M-$50M+ SMA allocations per case" },
    benefits: [
      { title: "AUM Growth", description: "Each PPVA case adds significant assets under management through SMA allocations. Typical minimums start at $1M." },
      { title: "Institutional Platform", description: "BNY Mellon custodian with full data feeds and reporting. Institutional-grade infrastructure for your strategies." },
      { title: "Discretionary Management", description: "No client control issues. RIA exercises full independent discretion over the portfolio — no client interference." },
      { title: "Multiple Product Types", description: "Allocate across FIAs, mutual funds, alternative investments, and cash. Diversified product suite under one structure." },
      { title: "Recurring Relationship", description: "Long-duration policies mean ongoing AUM and management fees for the life of the policy. Not a one-time transaction." },
    ],
  },
  {
    id: "ria",
    label: "RIA",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "For the RIA",
    subtitle: "New recurring fee-based revenue stream",
    accentColor: "bg-sky",
    keyMetric: { label: "Revenue Model", value: "0-2% advisory fees on growing, tax-deferred AUM" },
    benefits: [
      { title: "Recurring Revenue Stream", description: "Advisory fees (0-2%) on SMA assets that compound tax-deferred. Growing fee base without additional capital from the client." },
      { title: "Fiduciary Role You Know", description: "Same discretionary management role, just inside an insurance wrapper. No new licenses or capabilities required." },
      { title: "No Placement Burden", description: "The BD handles Phase 1 case placement. TPBC coordinates the entire process. You start managing money only after funding." },
      { title: "Clean BD/RIA Separation", description: "Strict temporal separation between broker-dealer and RIA phases protects your fiduciary status. No dual-hat conflicts." },
      { title: "Growing Fee Base", description: "As assets compound tax-deferred, your fee base grows faster than a taxable account. More AUM, more revenue, same client." },
    ],
  },
  {
    id: "carrier",
    label: "Carrier",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "For the Carrier (Advantage)",
    subtitle: "Premium flow and recurring administration revenue",
    accentColor: "bg-dark-gray",
    keyMetric: { label: "Revenue Sources", value: "Admin fees + M&E charges + compliance monitoring" },
    benefits: [
      { title: "Policy Volume & Premium Flow", description: "Each case brings $1M-$50M+ in premium deposits. Growing pipeline of HNW and UHNW clients." },
      { title: "Recurring Administrative Revenue", description: "Annual admin fees (15 bps) and M&E charges provide stable, predictable recurring revenue on growing fund values." },
      { title: "SMA Infrastructure", description: "Carrier-owned entity structure with BNY Mellon custodian. Full compliance monitoring and reporting infrastructure." },
      { title: "Long-Duration Policies", description: "PPVA policies are designed to last for the life of the insured. Decades of ongoing fee revenue from each case." },
    ],
  },
  {
    id: "insurance-pro",
    label: "Insurance Pro",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "For the Insurance Professional",
    subtitle: "Placement comp with no ongoing management burden",
    accentColor: "bg-teal",
    keyMetric: { label: "Compensation", value: "0-2% placement fees, up to 50% Ohana share" },
    benefits: [
      { title: "Placement Compensation", description: "Earn 0-2% placement fees on premium deposits. Ohana firm can receive up to 50% of the PBWR share." },
      { title: "No Ongoing Management", description: "Your work ends after the case is placed and funded. The RIA takes over for ongoing portfolio management." },
      { title: "Sophisticated HNW Product", description: "Offer your high-net-worth clients a genuinely differentiated planning solution. Not another generic insurance product." },
      { title: "TPBC Tools & Process", description: "Use TPBC's Command Center, deal models, and established process. No need to build your own infrastructure." },
      { title: "Strengthened Client Relationships", description: "Introducing this solution positions you as a sophisticated advisor who brings institutional-grade strategies to your clients." },
    ],
  },
  {
    id: "tax-advisor",
    label: "Tax Advisor",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
      </svg>
    ),
    title: "For the Tax Advisor",
    subtitle: "Client retention through sophisticated planning",
    accentColor: "bg-navy",
    keyMetric: { label: "Planning Opportunity", value: "Tax deferral, entity structuring, cross-border" },
    benefits: [
      { title: "Client Retention", description: "Offering sophisticated planning solutions keeps HNW clients engaged and prevents them from seeking alternatives elsewhere." },
      { title: "Referral Compensation", description: "Earn referral fees for introducing qualified clients to the PPVA structure. Direct economic benefit for your practice." },
      { title: "Tax Planning Opportunities", description: "Rich advisory opportunities around distribution planning, entity structuring, cross-border implications, and estate strategies." },
      { title: "Differentiation", description: "Stand out from other CPAs by bringing institutional-grade tax planning solutions to your high-net-worth clients." },
      { title: "Ongoing Advisory Role", description: "As policies mature and clients consider distributions, your ongoing tax advisory role becomes even more valuable." },
    ],
  },
];

export default function ValueOverviewPage() {
  const [activeStakeholder, setActiveStakeholder] = useState("client");
  const active = stakeholders.find((s) => s.id === activeStakeholder) ?? stakeholders[0];

  return (
    <>
      <PageHeader
        title="Value Overview"
        description="Presentation-quality stakeholder benefit views — pull this up in partner meetings"
      />
      <div className="max-w-[1600px] mx-auto p-6">
        {/* Stakeholder Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {stakeholders.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStakeholder(s.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeStakeholder === s.id
                  ? "bg-navy text-white shadow-md"
                  : "bg-white text-slate-brand border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Active Stakeholder Card */}
        <div className="max-w-3xl">
          <StakeholderCard
            icon={active.icon}
            title={active.title}
            subtitle={active.subtitle}
            accentColor={active.accentColor}
            benefits={active.benefits}
            keyMetric={active.keyMetric}
          />
        </div>

        {/* All Cards Grid */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-navy mb-4">All Stakeholder Views</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {stakeholders.map((s) => (
              <StakeholderCard
                key={s.id}
                icon={s.icon}
                title={s.title}
                subtitle={s.subtitle}
                accentColor={s.accentColor}
                benefits={s.benefits.slice(0, 3)}
                keyMetric={s.keyMetric}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
