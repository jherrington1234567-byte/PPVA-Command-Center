import { DealInputs, DealSummary } from "@/lib/calc/types";
import { formatCurrency, formatPercent, formatCompact } from "@/lib/format";
import { t } from "@/lib/translations";

interface DealSummaryCardsProps {
  summary: DealSummary;
  language: DealInputs["language"];
}

export function DealSummaryCards({ summary, language }: DealSummaryCardsProps) {
  const metrics = [
    { key: "totalDeposit" as const, label: t("totalDeposit", language), format: formatCurrency },
    { key: "netToFund" as const, label: t("netToFund", language), format: formatCurrency },
    { key: "loadPct" as const, label: t("totalLoad", language), format: (v: number) => formatPercent(v) },
    { key: "weightedReturn" as const, label: t("weightedReturn", language), format: (v: number) => formatPercent(v) },
    { key: "totalFirstYearCommissions" as const, label: t("year1Commissions", language), format: formatCurrency },
    { key: "projectedValue10Yr" as const, label: t("tenYearValueMid", language), format: (v: number) => formatCompact(v) },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((m) => (
        <div key={m.key} className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-slate-brand uppercase tracking-wider">{m.label}</p>
          <p className="mt-1 text-xl font-semibold text-navy">
            {m.format(summary[m.key])}
          </p>
        </div>
      ))}
    </div>
  );
}
