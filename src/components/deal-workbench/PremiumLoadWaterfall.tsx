import { DealInputs, WaterfallResult } from "@/lib/calc/types";
import { formatCurrency, formatPercent } from "@/lib/format";
import { t } from "@/lib/translations";

interface PremiumLoadWaterfallProps {
  waterfall: WaterfallResult;
  language: DealInputs["language"];
}

interface WaterfallStep {
  label: string;
  amount: number;
  pct?: number;
  indent?: number;
  highlight?: boolean;
  color?: string;
}

export function PremiumLoadWaterfall({ waterfall, language }: PremiumLoadWaterfallProps) {
  const steps: WaterfallStep[] = [
    { label: t("totalDeposit", language), amount: waterfall.totalDeposit, highlight: true, color: "bg-navy" },
    { label: t("premiumLoadGross", language), amount: waterfall.grossPremiumLoad, pct: waterfall.grossPremiumLoad / waterfall.totalDeposit, color: "bg-teal" },
    { label: t("threeCStructuresLoad", language), amount: waterfall.threeCStructuresAmount, pct: waterfall.threeCStructuresAmount / waterfall.totalDeposit, indent: 1, color: "bg-sky" },
    { label: t("syndicatedCapitalHoldback", language), amount: waterfall.syndicatedHoldback, indent: 1, color: "bg-sky" },
    { label: t("netToStephen", language), amount: waterfall.netToStephen, indent: 1, color: "bg-teal" },
    { label: t("pbInvestmentHoldback", language), amount: waterfall.pbInvestmentHoldback, indent: 2, color: "bg-sky" },
    { label: t("netToPBWR", language), amount: waterfall.netToPBWR, indent: 2, color: "bg-teal" },
    { label: t("pbwrShare", language), amount: waterfall.pbwrShare, indent: 3, color: "bg-slate-brand" },
    { label: t("ohanaShare", language), amount: waterfall.ohanaShare, indent: 3, color: "bg-slate-brand" },
    { label: t("adminFeesAdvantage", language), amount: waterfall.adminFees, color: "bg-dark-gray" },
    { label: t("miscBankSetupFees", language), amount: waterfall.miscFees, color: "bg-dark-gray" },
    { label: t("netToFund", language), amount: waterfall.netToFund, highlight: true, color: "bg-navy" },
  ];

  const maxAmount = waterfall.totalDeposit;

  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={i} className={`flex items-center gap-3 ${step.highlight ? "py-2" : "py-1"}`} style={{ paddingLeft: `${(step.indent ?? 0) * 20}px` }}>
          <div className="w-64 shrink-0">
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
