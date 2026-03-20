"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DealInputsPanel } from "@/components/deal-workbench/DealInputsPanel";
import { DealSummaryCards } from "@/components/deal-workbench/DealSummaryCards";
import { PremiumLoadWaterfall } from "@/components/deal-workbench/PremiumLoadWaterfall";
import { FundAllocationTable } from "@/components/deal-workbench/FundAllocationTable";
import { CarrierIllustration } from "@/components/deal-workbench/CarrierIllustration";
import { TaxImpactPanel } from "@/components/deal-workbench/TaxImpactPanel";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { useDealInputs } from "@/hooks/useDealInputs";
import { useDealCalculation } from "@/hooks/useDealCalculation";
import { formatCurrency, formatPercent } from "@/lib/format";
import { AnnualChargesResult } from "@/lib/calc/types";

function AnnualChargesDisplay({ charges }: { charges: AnnualChargesResult }) {
  return (
    <div className="space-y-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-navy">
            <th className="text-left py-2 px-3 text-navy font-semibold">Fee Type</th>
            <th className="text-right py-2 px-3 text-navy font-semibold">Annual Amount</th>
            <th className="text-right py-2 px-3 text-navy font-semibold">Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="py-2 px-3">Advantage M&E</td>
            <td className="py-2 px-3 text-right font-mono">{formatCurrency(charges.advantageMeFee)}</td>
            <td className="py-2 px-3 text-right font-mono text-slate-brand">0.15%</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="py-2 px-3">Investment Advisor (RIA)</td>
            <td className="py-2 px-3 text-right font-mono">{formatCurrency(charges.investmentAdvisorFee)}</td>
            <td className="py-2 px-3 text-right font-mono text-slate-brand">0.15%</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="py-2 px-3">Inspira Custodian</td>
            <td className="py-2 px-3 text-right font-mono">{formatCurrency(charges.inspiraCustodianFee)}</td>
            <td className="py-2 px-3 text-right font-mono text-slate-brand">0.05%</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="py-2 px-3">Money Manager</td>
            <td className="py-2 px-3 text-right font-mono">{formatCurrency(charges.moneyManagerFee)}</td>
            <td className="py-2 px-3 text-right font-mono text-slate-brand">configurable</td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-navy font-semibold">
            <td className="py-2 px-3">Total Annual Charges</td>
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

  const tabs = [
    {
      label: "Waterfall",
      content: (
        <Card title="Premium Load Waterfall" description="Step-by-step breakdown of deposit allocation">
          <PremiumLoadWaterfall waterfall={result.waterfall} />
        </Card>
      ),
    },
    {
      label: "Fund Allocation",
      content: (
        <div className="space-y-6">
          <Card title="Fund Allocation" description="Product allocation, estimated returns, and commissions">
            <FundAllocationTable allocation={result.fundAllocation} />
          </Card>
          <Card title="Annual Fund Charges" description="Recurring fees deducted from fund value annually">
            <AnnualChargesDisplay charges={result.annualCharges} />
          </Card>
        </div>
      ),
    },
    {
      label: "Carrier Illustration",
      content: (
        <Card title="Carrier Illustration" description="Year-by-year fund value projection at three return rates">
          <CarrierIllustration years={result.carrierIllustration} illustratedRates={inputs.illustratedRates} />
        </Card>
      ),
    },
    {
      label: "Tax Impact",
      content: (
        <Card title="Tax Impact Analysis" description="Existing portfolio vs. PPVA — tax deferral benefit">
          <TaxImpactPanel taxImpact={result.taxImpact} jpyUsdRate={inputs.jpyUsdRate} />
        </Card>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Deal Workbench"
        description="Structure and analyze PPVA deals — Advantage Life Puerto Rico (ALPR)"
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
          <DealSummaryCards summary={result.summary} />
          <Tabs tabs={tabs} />
        </div>
      </div>
    </>
  );
}
