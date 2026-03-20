import { DealInputs, FundAllocationResult } from "@/lib/calc/types";
import { formatCurrency, formatPercent } from "@/lib/format";
import { t } from "@/lib/translations";

interface FundAllocationTableProps {
  allocation: FundAllocationResult;
  language: DealInputs["language"];
}

export function FundAllocationTable({ allocation, language }: FundAllocationTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-navy">
            <th className="text-left py-2 px-3 text-navy font-semibold">{t("product", language)}</th>
            <th className="text-center py-2 px-3 text-navy font-semibold">{t("type", language)}</th>
            <th className="text-right py-2 px-3 text-navy font-semibold">{t("allocation", language)}</th>
            <th className="text-right py-2 px-3 text-navy font-semibold">{t("amount", language)}</th>
            <th className="text-right py-2 px-3 text-navy font-semibold">{t("estRate", language)}</th>
            <th className="text-right py-2 px-3 text-navy font-semibold">{t("ogaComm", language)}</th>
            <th className="text-right py-2 px-3 text-navy font-semibold">{t("processor", language)}</th>
            <th className="text-right py-2 px-3 text-navy font-semibold">{t("regional", language)}</th>
          </tr>
        </thead>
        <tbody>
          {allocation.lines.map((line, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-3 font-medium">{line.name}</td>
              <td className="py-2 px-3 text-center">
                <span className={`text-xs px-1.5 py-0.5 rounded ${line.isGuaranteed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {line.isGuaranteed ? t("guar", language) : t("nonG", language)}
                </span>
              </td>
              <td className="py-2 px-3 text-right font-mono">{formatPercent(line.allocationPct)}</td>
              <td className="py-2 px-3 text-right font-mono">{formatCurrency(line.amount)}</td>
              <td className="py-2 px-3 text-right font-mono">{formatPercent(line.estimatedRate)}</td>
              <td className="py-2 px-3 text-right font-mono">{formatCurrency(line.ogaCommission)}</td>
              <td className="py-2 px-3 text-right font-mono">{formatCurrency(line.processorCommission)}</td>
              <td className="py-2 px-3 text-right font-mono">{formatCurrency(line.regionalCommission)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-navy font-semibold">
            <td className="py-2 px-3">{t("total", language)}</td>
            <td />
            <td className="py-2 px-3 text-right font-mono">100.00%</td>
            <td className="py-2 px-3 text-right font-mono">
              {formatCurrency(allocation.totalGuaranteed + allocation.totalNonGuaranteed)}
            </td>
            <td className="py-2 px-3 text-right font-mono">{formatPercent(allocation.weightedReturn)}</td>
            <td className="py-2 px-3 text-right font-mono">{formatCurrency(allocation.totalOgaCommission)}</td>
            <td className="py-2 px-3 text-right font-mono">{formatCurrency(allocation.totalProcessorCommission)}</td>
            <td className="py-2 px-3 text-right font-mono">{formatCurrency(allocation.totalRegionalCommission)}</td>
          </tr>
        </tfoot>
      </table>
      <div className="mt-3 flex gap-4 text-xs text-slate-brand">
        <span>{t("guaranteed", language)}: {formatCurrency(allocation.totalGuaranteed)}</span>
        <span>{t("nonGuaranteed", language)}: {formatCurrency(allocation.totalNonGuaranteed)}</span>
      </div>
    </div>
  );
}
