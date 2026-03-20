import { DealSummary } from "@/lib/calc/types";
import { formatCurrency, formatPercent, formatCompact } from "@/lib/format";

interface DealSummaryCardsProps {
  summary: DealSummary;
}

const metrics = [
  { key: "totalDeposit" as const, label: "Total Deposit", format: formatCurrency },
  { key: "netToFund" as const, label: "Net to Fund", format: formatCurrency },
  { key: "loadPct" as const, label: "Total Load", format: (v: number) => formatPercent(v) },
  { key: "weightedReturn" as const, label: "Weighted Return", format: (v: number) => formatPercent(v) },
  { key: "totalFirstYearCommissions" as const, label: "Year 1 Commissions", format: formatCurrency },
  { key: "projectedValue10Yr" as const, label: "10-Year Value (Mid)", format: (v: number) => formatCompact(v) },
];

export function DealSummaryCards({ summary }: DealSummaryCardsProps) {
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
