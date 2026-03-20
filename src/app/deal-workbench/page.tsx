"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DealInputsPanel } from "@/components/deal-workbench/DealInputsPanel";
import { DealSummaryCards } from "@/components/deal-workbench/DealSummaryCards";
import { PremiumLoadWaterfall } from "@/components/deal-workbench/PremiumLoadWaterfall";
import { FundAllocationTable } from "@/components/deal-workbench/FundAllocationTable";
import { CarrierIllustration } from "@/components/deal-workbench/CarrierIllustration";
import { TaxImpactPanel } from "@/components/deal-workbench/TaxImpactPanel";
import { PortfolioBuilder } from "@/components/deal-workbench/PortfolioBuilder";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { useDealInputs } from "@/hooks/useDealInputs";
import { useDealCalculation } from "@/hooks/useDealCalculation";
import { formatCurrency, formatPercent } from "@/lib/format";
import { AnnualChargesResult, DealInputs } from "@/lib/calc/types";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/translations";
import { PortfolioFund } from "@/lib/fund-catalog";

const LANGUAGE_OPTIONS: { value: DealInputs["language"]; label: string }[] = [
  { value: "english", label: "English" },
  { value: "japanese", label: "日本語" },
  { value: "both", label: "Both / 両方" },
];

function AnnualChargesDisplay({ charges, language }: { charges: AnnualChargesResult; language: DealInputs["language"] }) {
  return (
    <div className="space-y-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-navy">
            <th className="text-left py-2 px-3 text-navy font-semibold">{t("feeType", language)}</th>
            <th className="text-right py-2 px-3 text-navy font-semibold">{t("annualAmount", language)}</th>
            <th className="text-right py-2 px-3 text-navy font-semibold">{t("rate", language)}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="py-2 px-3">{t("advantageME", language)}</td>
            <td className="py-2 px-3 text-right font-mono">{formatCurrency(charges.advantageMeFee)}</td>
            <td className="py-2 px-3 text-right font-mono text-slate-brand">0.15%</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="py-2 px-3">{t("investmentAdvisor", language)}</td>
            <td className="py-2 px-3 text-right font-mono">{formatCurrency(charges.investmentAdvisorFee)}</td>
            <td className="py-2 px-3 text-right font-mono text-slate-brand">0.15%</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="py-2 px-3">{t("inspiraCustodian", language)}</td>
            <td className="py-2 px-3 text-right font-mono">{formatCurrency(charges.inspiraCustodianFee)}</td>
            <td className="py-2 px-3 text-right font-mono text-slate-brand">0.05%</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="py-2 px-3">{t("moneyManager", language)}</td>
            <td className="py-2 px-3 text-right font-mono">{formatCurrency(charges.moneyManagerFee)}</td>
            <td className="py-2 px-3 text-right font-mono text-slate-brand">{t("configurable", language)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-navy font-semibold">
            <td className="py-2 px-3">{t("totalAnnualCharges", language)}</td>
            <td className="py-2 px-3 text-right font-mono">{formatCurrency(charges.totalAnnualCharge)}</td>
            <td className="py-2 px-3 text-right font-mono">{formatPercent(charges.totalAnnualChargePct)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default function DealWorkbenchPage() {
  const { inputs, updateField, updateFundAllocation } = useDealInputs();
  const result = useDealCalculation(inputs);
  const lang = inputs.language;
  const [portfolioFunds, setPortfolioFunds] = useState<PortfolioFund[]>([]);

  // Calculate non-guaranteed sleeve percentage from fund allocations
  const nonGuaranteedPct = inputs.fundAllocations
    .filter((f) => !f.isGuaranteed)
    .reduce((s, f) => s + f.allocationPct, 0);

  const tabs = [
    {
      label: t("waterfall", lang),
      content: (
        <Card title={t("premiumLoadWaterfall", lang)} description={t("waterfallDesc", lang)}>
          <PremiumLoadWaterfall waterfall={result.waterfall} language={lang} />
        </Card>
      ),
    },
    {
      label: t("fundAllocation", lang),
      content: (
        <div className="space-y-6">
          <Card title={t("fundAllocation", lang)} description={t("productAllocation", lang)}>
            <FundAllocationTable allocation={result.fundAllocation} language={lang} />
          </Card>
          <Card title={t("annualFundCharges", lang)} description={t("recurringFees", lang)}>
            <AnnualChargesDisplay charges={result.annualCharges} language={lang} />
          </Card>
        </div>
      ),
    },
    {
      label: "Portfolio Builder",
      content: (
        <Card
          title="Non-Guaranteed Sleeve — Portfolio Builder"
          description="Select funds from Crystal Capital, SALI platform, or enter custom funds. Set allocations within the non-guaranteed sleeve."
        >
          <PortfolioBuilder
            selectedFunds={portfolioFunds}
            onUpdateFunds={setPortfolioFunds}
            nonGuaranteedPct={nonGuaranteedPct}
          />
        </Card>
      ),
    },
    {
      label: t("carrierIllustration", lang),
      content: (
        <Card title={t("carrierIllustration", lang)} description={t("yearByYear", lang)}>
          <CarrierIllustration years={result.carrierIllustration} illustratedRates={inputs.illustratedRates} language={lang} />
        </Card>
      ),
    },
    {
      label: t("taxImpact", lang),
      content: (
        <Card title={t("taxImpactAnalysis", lang)} description={t("taxImpactDesc", lang)}>
          <TaxImpactPanel taxImpact={result.taxImpact} jpyUsdRate={inputs.jpyUsdRate} language={lang} />
        </Card>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={t("dealWorkbench", lang)}
        description={t("dealWorkbenchDesc", lang)}
      />
      <div className="max-w-[1600px] mx-auto flex h-[calc(100vh-112px)]">
        {/* Inputs Panel */}
        <aside className="w-[380px] shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
          <DealInputsPanel
            inputs={inputs}
            onUpdateField={updateField}
            onUpdateFund={updateFundAllocation}
          />
        </aside>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Language Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-brand mr-2">{t("languageMode", lang)}:</span>
            {LANGUAGE_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={inputs.language === opt.value ? "primary" : "secondary"}
                size="sm"
                onClick={() => updateField("language", opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <DealSummaryCards summary={result.summary} language={lang} />
          <Tabs tabs={tabs} />
        </div>
      </div>
    </>
  );
}
