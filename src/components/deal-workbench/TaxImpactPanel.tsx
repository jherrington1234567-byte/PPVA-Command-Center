import { TaxImpactResult, DealInputs } from "@/lib/calc/types";
import { formatCurrency, formatCurrencyJPY } from "@/lib/format";
import { t } from "@/lib/translations";

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
            {t("cumulativeTaxDeferredUSD", language)}
          </p>
          <p className="mt-1 text-2xl font-semibold text-green-800">
            {formatCurrency(taxImpact.totalTaxSaved)}
          </p>
          <p className="text-xs text-green-600 mt-1">
            {t("totalTaxDeferredDesc", language)}
          </p>
        </div>
        {showJpy && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-xs font-medium text-green-700 uppercase">
              {t("cumulativeTaxDeferredJPY", language)}
            </p>
            <p className="mt-1 text-2xl font-semibold text-green-800">
              {formatCurrencyJPY(taxImpact.totalTaxSavedJpy)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {t("atCurrentRate", language)} ¥{jpyUsdRate}{t("perUSD", language)}
            </p>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-navy">
              <th className="text-left py-2 px-2 text-navy font-semibold">{t("year", language)}</th>
              <th className="text-left py-2 px-2 text-navy font-semibold">{t("age", language)}</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">{t("existingCSV", language)}</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">{t("existingGain", language)}</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">{t("taxNoPPVA", language)}</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">{t("ppvaValue", language)}</th>
              {showJpy && (
                <th className="text-right py-2 px-2 text-navy font-semibold">{t("combinedJPY", language)}</th>
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
