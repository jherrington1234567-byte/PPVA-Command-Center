"use client";

import { PageHeader} from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NumberInput } from "@/components/ui/NumberInput";
import { useDealInputs } from "@/hooks/useDealInputs";
import { useDealCalculation } from "@/hooks/useDealCalculation";
import { formatCurrency, formatPercent } from "@/lib/format";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const QUICK_AMOUNTS = [1_000_000, 5_000_000, 10_000_000, 25_000_000, 50_000_000];

const WATERFALL_COLORS = [
  "#003661", // navy - Total Deposit
  "#0086A3", // teal - Premium Load
  "#00ADEE", // sky - 3cStructures
  "#00ADEE", // sky - Syndicated Capital
  "#4C5C68", // slate - PB Investment Services
  "#0086A3", // teal - PBWR
  "#4C5C68", // slate - Ohana
  "#46494C", // dark gray - Admin
  "#46494C", // dark gray - Misc
  "#003661", // navy - Net to Fund
];

export default function CompCalculatorPage() {
  const { inputs, updateField } = useDealInputs();
  const result = useDealCalculation(inputs);
  const w = result.waterfall;

  const waterfallData = [
    { name: "Premium Load", value: w.grossPremiumLoad },
    { name: "3cStructures (one-time)", value: w.threeCStructuresAmount },
    { name: "Syndicated Capital", value: w.syndicatedHoldback },
    { name: "PB Investment Services", value: w.pbInvestmentHoldback },
    { name: "PBWR Share", value: w.pbwrShare },
    { name: "Ohana Share", value: w.ohanaShare },
    { name: "Advantage Admin", value: w.adminFees },
    { name: "Misc Fees", value: w.miscFees },
    { name: "Net to Fund", value: w.netToFund },
  ];

  return (
    <>
      <PageHeader
        title="Comp Calculator"
        description="Model partner economics across the premium load waterfall"
      />
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Quick Controls */}
        <Card>
          <div className="flex flex-wrap items-end gap-4">
            <NumberInput
              label="Total Deposit"
              value={inputs.totalDeposit}
              onChange={(v) => updateField("totalDeposit", v)}
              format="currency"
              className="w-48"
            />
            <NumberInput
              label="Premium Load"
              value={inputs.premiumLoadPct}
              onChange={(v) => updateField("premiumLoadPct", v)}
              format="percent"
              className="w-32"
            />
            <div className="flex gap-2 pb-0.5">
              {QUICK_AMOUNTS.map((amt) => (
                <Button
                  key={amt}
                  variant={inputs.totalDeposit === amt ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => updateField("totalDeposit", amt)}
                >
                  ${(amt / 1_000_000).toFixed(0)}M
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Waterfall Chart */}
          <Card title="Compensation Waterfall" description="How the premium load flows to each party">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {waterfallData.map((_, i) => (
                      <Cell key={i} fill={WATERFALL_COLORS[i + 1]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Compensation Table */}
          <Card title="One-Time Compensation" description="First-year payments to each party">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-navy">
                  <th className="text-left py-2 px-3 text-navy font-semibold">Party</th>
                  <th className="text-right py-2 px-3 text-navy font-semibold">Amount</th>
                  <th className="text-right py-2 px-3 text-navy font-semibold">% of Deposit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { party: "3cStructures (one-time)", amount: w.threeCStructuresAmount },
                  { party: "Syndicated Capital", amount: w.syndicatedHoldback },
                  { party: "PB Investment Services", amount: w.pbInvestmentHoldback },
                  { party: "PBWR", amount: w.pbwrShare },
                  { party: "Ohana", amount: w.ohanaShare },
                  { party: "Advantage (Admin Fee)", amount: w.adminFees },
                  { party: "Bank / Setup", amount: w.miscFees },
                ].map((row) => (
                  <tr key={row.party} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium">{row.party}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCurrency(row.amount)}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-brand">
                      {formatPercent(row.amount / w.totalDeposit)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-navy font-semibold">
                  <td className="py-2 px-3">Total Loads & Fees</td>
                  <td className="py-2 px-3 text-right font-mono">{formatCurrency(w.totalFeesAndLoads)}</td>
                  <td className="py-2 px-3 text-right font-mono">{formatPercent(w.totalFeesAndLoads / w.totalDeposit)}</td>
                </tr>
                <tr className="font-semibold text-teal">
                  <td className="py-2 px-3">Net to Fund</td>
                  <td className="py-2 px-3 text-right font-mono">{formatCurrency(w.netToFund)}</td>
                  <td className="py-2 px-3 text-right font-mono">{formatPercent(w.netToFund / w.totalDeposit)}</td>
                </tr>
              </tfoot>
            </table>
          </Card>
        </div>

        {/* Per-Product Commissions */}
        <Card title="Per-Product Commissions" description="Commission breakdown by fund product">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-navy">
                <th className="text-left py-2 px-3 text-navy font-semibold">Product</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Allocation</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Amount</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">OGA</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Processor (95%)</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Regional</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Total Comm.</th>
              </tr>
            </thead>
            <tbody>
              {result.fundAllocation.lines.map((line, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">{line.name}</td>
                  <td className="py-2 px-3 text-right font-mono">{formatPercent(line.allocationPct)}</td>
                  <td className="py-2 px-3 text-right font-mono">{formatCurrency(line.amount)}</td>
                  <td className="py-2 px-3 text-right font-mono">{formatCurrency(line.ogaCommission)}</td>
                  <td className="py-2 px-3 text-right font-mono">{formatCurrency(line.processorCommission)}</td>
                  <td className="py-2 px-3 text-right font-mono">{formatCurrency(line.regionalCommission)}</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">
                    {formatCurrency(line.ogaCommission + line.processorCommission + line.regionalCommission)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-navy font-semibold">
                <td className="py-2 px-3" colSpan={3}>Total Commissions</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(result.fundAllocation.totalOgaCommission)}</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(result.fundAllocation.totalProcessorCommission)}</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(result.fundAllocation.totalRegionalCommission)}</td>
                <td className="py-2 px-3 text-right font-mono">
                  {formatCurrency(result.summary.totalFirstYearCommissions)}
                </td>
              </tr>
            </tfoot>
          </table>
        </Card>

        {/* Annual Recurring Charges — with editable inputs */}
        <Card title="Annual Recurring Charges" description="Ongoing fees deducted from fund value each year (adjust rates below)">
          {/* Fee Rate Inputs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <NumberInput
              label="Advantage M&E Rate"
              value={inputs.advantageMePct}
              onChange={(v) => updateField("advantageMePct", v)}
              format="percent"
              step={0.0001}
            />
            <NumberInput
              label="Investment Advisor Fee"
              value={inputs.investmentAdvisorPct}
              onChange={(v) => updateField("investmentAdvisorPct", v)}
              format="percent"
              step={0.0001}
            />
            <NumberInput
              label="Money Manager Fee"
              value={inputs.moneyManagerPct}
              onChange={(v) => updateField("moneyManagerPct", v)}
              format="percent"
              step={0.0001}
            />
            <NumberInput
              label="Inspira Custodian Fee"
              value={inputs.inspiraCustodianPct}
              onChange={(v) => updateField("inspiraCustodianPct", v)}
              format="percent"
              step={0.0001}
            />
          </div>

          {/* Fee Summary Tiles */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-brand uppercase">Advantage M&E</p>
              <p className="mt-1 text-lg font-semibold text-navy">{formatCurrency(result.annualCharges.advantageMeFee)}</p>
              <p className="text-xs text-slate-brand">{formatPercent(inputs.advantageMePct)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-brand uppercase">Investment Advisor</p>
              <p className="mt-1 text-lg font-semibold text-navy">{formatCurrency(result.annualCharges.investmentAdvisorFee)}</p>
              <p className="text-xs text-slate-brand">{formatPercent(inputs.investmentAdvisorPct)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-brand uppercase">Money Manager</p>
              <p className="mt-1 text-lg font-semibold text-navy">{formatCurrency(result.annualCharges.moneyManagerFee)}</p>
              <p className="text-xs text-slate-brand">{formatPercent(inputs.moneyManagerPct)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-brand uppercase">Inspira Custodian</p>
              <p className="mt-1 text-lg font-semibold text-navy">{formatCurrency(result.annualCharges.inspiraCustodianFee)}</p>
              <p className="text-xs text-slate-brand">{formatPercent(inputs.inspiraCustodianPct)}</p>
            </div>
            <div className="bg-navy rounded-lg p-4">
              <p className="text-xs font-medium text-white/80 uppercase">Total Annual</p>
              <p className="mt-1 text-lg font-semibold text-white">{formatCurrency(result.annualCharges.totalAnnualCharge)}</p>
              <p className="text-xs text-white/70">{formatPercent(result.annualCharges.totalAnnualChargePct)}</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
