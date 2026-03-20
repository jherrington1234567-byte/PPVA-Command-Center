import { TaxImpactResult, DealInputs } from "@/lib/calc/types";
import { formatCurrency, formatCurrencyJPY } from "@/lib/format";

interface TaxImpactPanelProps {
  taxImpact: TaxImpactResult;
  jpyUsdRate: number;
  language: DealInputs["language"];
}

export function TaxImpactPanel({ taxImpact, jpyUsdRate, language }: TaxImpactPanelProps) {
  const showJpy = language !== "english";

  // Show key years only
  const keyYears = taxImpact.years.filter(
    (y) => y.year <= 10 || y.year % 5 === 0
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className={`grid gap-4 ${showJpy ? "grid-cols-2" : "grid-cols-1"}`}>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-xs font-medium text-green-700 uppercase">
            Cumulative Tax Deferred (USD)
          </p>
          <p className="mt-1 text-2xl font-semibold text-green-800">
            {formatCurrency(taxImpact.totalTaxSaved)}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Total tax deferred through PPVA wrapper over projection period
          </p>
        </div>
        {showJpy && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-xs font-medium text-green-700 uppercase">
              Cumulative Tax Deferred (JPY)
            </p>
            <p className="mt-1 text-2xl font-semibold text-green-800">
              {formatCurrencyJPY(taxImpact.totalTaxSavedJpy)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              At current exchange rate of ¥{jpyUsdRate}/USD
            </p>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-navy">
              <th className="text-left py-2 px-2 text-navy font-semibold">Year</th>
              <th className="text-left py-2 px-2 text-navy font-semibold">Age</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">Existing CSV</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">Existing Gain</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">Tax (No PPVA)</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">PPVA Value</th>
              {showJpy && (
                <th className="text-right py-2 px-2 text-navy font-semibold">Combined (JPY)</th>
              )}
            </tr>
          </thead>
          <tbody>
            {keyYears.map((y) => (
              <tr key={y.year} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-1.5 px-2 font-mono">{y.year}</td>
                <td className="py-1.5 px-2 font-mono">{y.age}</td>
                <td className="py-1.5 px-2 text-right font-mono">{formatCurrency(y.existingCSV)}</td>
                <td className="py-1.5 px-2 text-right font-mono">{formatCurrency(y.existingGain)}</td>
                <td className="py-1.5 px-2 text-right font-mono text-red-600">{formatCurrency(y.taxWithoutPPVA)}</td>
                <td className="py-1.5 px-2 text-right font-mono text-teal font-semibold">{formatCurrency(y.ppvaFundValue)}</td>
                {showJpy && (
                  <td className="py-1.5 px-2 text-right font-mono">{formatCurrencyJPY(y.combinedCSVJpy)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
