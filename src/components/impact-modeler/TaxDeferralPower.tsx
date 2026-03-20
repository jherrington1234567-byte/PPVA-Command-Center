"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { NumberInput } from "@/components/ui/NumberInput";
import { formatCurrency, formatCompact, formatPercent } from "@/lib/format";
import { calculateTaxDeferral } from "@/lib/calc/impact-modeler";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function TaxDeferralPower() {
  const [premium, setPremium] = useState(5_000_000);
  const [returnRate, setReturnRate] = useState(0.06);
  const [taxRate, setTaxRate] = useState(0.20);
  const [horizon, setHorizon] = useState(20);

  const result = useMemo(
    () => calculateTaxDeferral({ premiumAmount: premium, grossReturnRate: returnRate, taxRate, timeHorizon: horizon }),
    [premium, returnRate, taxRate, horizon]
  );

  const chartData = result.years.map((y) => ({
    year: y.year,
    "Taxable Portfolio": y.taxableValue,
    "PPVA (Tax-Deferred)": y.ppvaValue,
    "Tax Drag": y.dollarDifference,
  }));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <NumberInput
              label="Premium Amount"
              value={premium}
              onChange={setPremium}
              format="currency"
              min={1000000}
              step={500000}
            />
            <input
              type="range"
              min={1000000}
              max={50000000}
              step={500000}
              value={premium}
              onChange={(e) => setPremium(Number(e.target.value))}
              className="w-full mt-2 accent-teal"
            />
          </div>
          <div>
            <NumberInput
              label="Gross Annual Return"
              value={returnRate}
              onChange={setReturnRate}
              format="percent"
              min={0.01}
              max={0.20}
              step={0.5}
            />
            <input
              type="range"
              min={1}
              max={20}
              step={0.5}
              value={returnRate * 100}
              onChange={(e) => setReturnRate(Number(e.target.value) / 100)}
              className="w-full mt-2 accent-teal"
            />
          </div>
          <div>
            <NumberInput
              label="Annual Tax Rate"
              value={taxRate}
              onChange={setTaxRate}
              format="percent"
              min={0.05}
              max={0.50}
              step={1}
            />
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={taxRate * 100}
              onChange={(e) => setTaxRate(Number(e.target.value) / 100)}
              className="w-full mt-2 accent-teal"
            />
          </div>
          <div>
            <NumberInput
              label="Time Horizon (Years)"
              value={horizon}
              onChange={setHorizon}
              min={5}
              max={50}
            />
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="w-full mt-2 accent-teal"
            />
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border-2 border-teal p-5 text-center">
          <p className="text-xs font-medium text-slate-brand uppercase tracking-wider">PPVA Portfolio Value</p>
          <p className="mt-2 text-2xl font-bold text-teal">{formatCompact(result.finalPPVAValue)}</p>
          <p className="text-xs text-slate-brand mt-1">After {horizon} years</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
          <p className="text-xs font-medium text-slate-brand uppercase tracking-wider">Taxable Portfolio Value</p>
          <p className="mt-2 text-2xl font-bold text-dark-gray">{formatCompact(result.finalTaxableValue)}</p>
          <p className="text-xs text-slate-brand mt-1">After {horizon} years</p>
        </div>
        <div className="bg-green-50 rounded-lg border-2 border-green-300 p-5 text-center">
          <p className="text-xs font-medium text-green-700 uppercase tracking-wider">PPVA Advantage</p>
          <p className="mt-2 text-2xl font-bold text-green-700">{formatCompact(result.dollarAdvantage)}</p>
          <p className="text-xs text-green-600 mt-1">{formatPercent(result.percentAdvantage)} more</p>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-5 text-center">
          <p className="text-xs font-medium text-red-700 uppercase tracking-wider">Total Tax Drag</p>
          <p className="mt-2 text-2xl font-bold text-red-600">{formatCompact(result.totalTaxPaid)}</p>
          <p className="text-xs text-red-500 mt-1">Lost to annual taxation</p>
        </div>
      </div>

      {/* Chart */}
      <Card title="Growth Comparison" description="Tax-deferred vs. annually-taxed compounding">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
              <defs>
                <linearGradient id="ppvaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0086A3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0086A3" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="taxableGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4C5C68" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4C5C68" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(l) => `Year ${l}`} />
              <Legend />
              <Area type="monotone" dataKey="PPVA (Tax-Deferred)" stroke="#0086A3" strokeWidth={2.5} fill="url(#ppvaGrad)" />
              <Area type="monotone" dataKey="Taxable Portfolio" stroke="#4C5C68" strokeWidth={2} strokeDasharray="5 5" fill="url(#taxableGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Year-by-Year Breakdown */}
      <Card title="Year-by-Year Breakdown">
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b-2 border-navy">
                <th className="text-left py-2 px-3 text-navy font-semibold">Year</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Taxable Value</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">PPVA Value</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Annual Tax Paid</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Cumulative Tax Saved</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">PPVA Advantage</th>
              </tr>
            </thead>
            <tbody>
              {result.years
                .filter((y) => y.year <= 10 || y.year % 5 === 0)
                .map((y) => (
                  <tr key={y.year} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-1.5 px-3 font-mono">{y.year}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-dark-gray">{formatCurrency(y.taxableValue)}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-teal font-semibold">{formatCurrency(y.ppvaValue)}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-red-500">{formatCurrency(y.annualTaxPaid)}</td>
                    <td className="py-1.5 px-3 text-right font-mono text-green-600">{formatCurrency(y.cumulativeTaxSaved)}</td>
                    <td className="py-1.5 px-3 text-right font-mono font-semibold text-green-700">{formatCurrency(y.dollarDifference)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
