import { WaterfallResult } from "@/lib/calc/types";
import { formatCurrency, formatPercent } from "@/lib/format";

interface PremiumLoadWaterfallProps {
  waterfall: WaterfallResult;
}

interface WaterfallStep {
  label: string;
  amount: number;
  pct?: number;
  indent?: number;
  highlight?: boolean;
  color?: string;
}

export function PremiumLoadWaterfall({ waterfall }: PremiumLoadWaterfallProps) {
  const steps: WaterfallStep[] = [
    { label: "Total Deposit", amount: waterfall.totalDeposit, highlight: true, color: "bg-navy" },
    { label: "Premium Load (Gross)", amount: waterfall.grossPremiumLoad, pct: waterfall.grossPremiumLoad / waterfall.totalDeposit, color: "bg-teal" },
    { label: "3cStructures Load", amount: waterfall.threeCStructuresAmount, pct: waterfall.threeCStructuresAmount / waterfall.totalDeposit, indent: 1, color: "bg-sky" },
    { label: "Syndicated Capital Holdback", amount: waterfall.syndicatedHoldback, indent: 1, color: "bg-sky" },
    { label: "Net to Stephen", amount: waterfall.netToStephen, indent: 1, color: "bg-teal" },
    { label: "PB Investment Holdback", amount: waterfall.pbInvestmentHoldback, indent: 2, color: "bg-sky" },
    { label: "Net to PBWR", amount: waterfall.netToPBWR, indent: 2, color: "bg-teal" },
    { label: "PBWR Share (50%)", amount: waterfall.pbwrShare, indent: 3, color: "bg-slate-brand" },
    { label: "Ohana Share (50%)", amount: waterfall.ohanaShare, indent: 3, color: "bg-slate-brand" },
    { label: "Admin Fees (Advantage)", amount: waterfall.adminFees, color: "bg-dark-gray" },
    { label: "Misc Bank/Setup Fees", amount: waterfall.miscFees, color: "bg-dark-gray" },
    { label: "Net to Fund", amount: waterfall.netToFund, highlight: true, color: "bg-navy" },
  ];

  const maxAmount = waterfall.totalDeposit;

  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={i} className={`flex items-center gap-3 ${step.highlight ? "py-2" : "py-1"}`} style={{ paddingLeft: `${(step.indent ?? 0) * 20}px` }}>
          <div className="w-52 shrink-0">
            <span className={`text-sm ${step.highlight ? "font-semibold text-navy" : "text-foreground"}`}>
              {step.label}
            </span>
          </div>
          <div className="flex-1 h-6 bg-gray-100 rounded-sm overflow-hidden relative">
            <div
              className={`h-full ${step.color ?? "bg-teal"} rounded-sm transition-all duration-300 ${step.highlight ? "opacity-100" : "opacity-75"}`}
              style={{ width: `${Math.max((step.amount / maxAmount) * 100, 1)}%` }}
            />
          </div>
          <div className="w-32 text-right shrink-0">
            <span className={`text-sm font-mono ${step.highlight ? "font-semibold text-navy" : "text-foreground"}`}>
              {formatCurrency(step.amount)}
            </span>
          </div>
          {step.pct !== undefined && (
            <div className="w-16 text-right shrink-0">
              <span className="text-xs text-slate-brand">{formatPercent(step.pct)}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
