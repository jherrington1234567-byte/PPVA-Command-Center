"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { NumberInput } from "@/components/ui/NumberInput";
import { formatCurrency, formatCurrencyJPY } from "@/lib/format";
import { calculateCrossBorder } from "@/lib/calc/impact-modeler";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

export function CrossBorderModule() {
  const [currentCSV, setCurrentCSV] = useState(18_963_106);
  const [costBasis, setCostBasis] = useState(16_195_676);
  const [fxContrib, setFxContrib] = useState(110);
  const [fxCurrent, setFxCurrent] = useState(150);
  const [fxAnalysis, setFxAnalysis] = useState(160);
  const [growthRate, setGrowthRate] = useState(0.06);
  const [analysisYear, setAnalysisYear] = useState(1);
  const [ppvaPremium, setPpvaPremium] = useState(7_000_000);
  const [currency, setCurrency] = useState<"USD" | "JPY">("USD");

  const result = useMemo(
    () =>
      calculateCrossBorder({
        currentCSV, costBasis,
        fxRateAtContribution: fxContrib,
        currentFxRate: fxCurrent,
        fxRateAtAnalysis: fxAnalysis,
        csvGrowthRate: growthRate,
        analysisYear,
        newPPVAPremium: ppvaPremium,
        premiumChargePct: 0.07,
        japaneseTaxRate: 0.20,
      }),
    [currentCSV, costBasis, fxContrib, fxCurrent, fxAnalysis, growthRate, analysisYear, ppvaPremium]
  );

  // Format helper: USD or JPY depending on toggle
  const fmt = (usd: number, jpy: number) => {
    if (currency === "JPY") return formatCurrencyJPY(jpy);
    return formatCurrency(usd);
  };
  const fmtSingle = (usd: number) => formatCurrency(usd);

  const COLORS = ["#dc2626", "#2563eb", "#16a34a", "#d97706"];

  // Chart data — gain values in selected currency
  const chartGains = [
    { name: "Current Reality", value: currency === "JPY" ? result.crGainJpy : result.crGainUsd },
    ...result.scenarios.map((s) => ({
      name: s.name,
      value: currency === "JPY" ? s.gainJpy : s.gainUsd,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NumberInput label="Current CSV (USD)" value={currentCSV} onChange={setCurrentCSV} format="currency" />
            <NumberInput label="Current Basis (USD)" value={costBasis} onChange={setCostBasis} format="currency" />
            <NumberInput label="New PPVA Premium" value={ppvaPremium} onChange={setPpvaPremium} format="currency" min={1000000} />
            <NumberInput label="CSV Growth Rate" value={growthRate} onChange={setGrowthRate} format="percent" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NumberInput label="FX at Initial Contribution (¥/$)" value={fxContrib} onChange={setFxContrib} prefix="¥" />
            <NumberInput label="Current FX Rate (¥/$)" value={fxCurrent} onChange={setFxCurrent} prefix="¥" />
            <NumberInput label="FX at Analysis Year (¥/$)" value={fxAnalysis} onChange={setFxAnalysis} prefix="¥" />
            <div>
              <NumberInput label="Analysis Year" value={analysisYear} onChange={setAnalysisYear} min={1} max={10} />
              <input type="range" min={1} max={10} value={analysisYear} onChange={(e) => setAnalysisYear(Number(e.target.value))} className="w-full mt-2 accent-teal" />
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button onClick={() => setCurrency("USD")} className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${currency === "USD" ? "bg-navy text-white" : "bg-gray-100 text-slate-brand"}`}>$ USD</button>
            <button onClick={() => setCurrency("JPY")} className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${currency === "JPY" ? "bg-amber-500 text-white" : "bg-gray-100 text-slate-brand"}`}>¥ JPY</button>
          </div>
        </div>
      </Card>

      {/* Gain Comparison Chart */}
      <Card title={`Gain / (Loss) Comparison (${currency})`} description={`Year ${analysisYear} analysis`}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartGains} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => currency === "JPY" ? `¥${(v / 1_000_000).toFixed(0)}M` : `$${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => currency === "JPY" ? formatCurrencyJPY(Number(value)) : formatCurrency(Number(value))} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartGains.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Scenario Cards — matching reference tool layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Reality (Performance Result) */}
        <div className="rounded-lg p-4 bg-red-50 border-2 border-red-200">
          <h4 className="font-semibold text-red-800 text-sm">Performance Result</h4>
          <p className="text-xs text-red-600 mb-3">No PPVA — Current Portfolio</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-gray-500">Original Basis</span><span className="font-mono font-medium">{fmt(result.crBasisUsd, result.crBasisJpy)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">+ Policy Growth</span><span className="font-mono font-medium">{fmt(result.crGrowthUsd, result.crGrowthJpy)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">+ FX Impact</span><span className="font-mono font-medium">{fmt(result.crFxImpactUsd, result.crFxImpactJpy)}</span></div>
            <div className="border-t border-red-200 pt-1">
              <div className="flex justify-between font-medium"><span className="text-gray-600">Cash Surrender Value</span><span className="font-mono">{fmt(result.crCsvUsd, result.crCsvJpy)}</span></div>
            </div>
            <div className="flex justify-between"><span className="text-gray-500">- Less Basis</span><span className="font-mono">{fmt(-result.crBasisUsd, -result.crBasisJpy)}</span></div>
            <div className="border-t-2 border-red-300 pt-1.5 mt-1">
              <div className="flex justify-between font-bold"><span className="text-red-700">Gain / (Loss)</span><span className="font-mono text-red-600">{fmt(result.crGainUsd, result.crGainJpy)}</span></div>
            </div>
          </div>
        </div>

        {/* PPVA Design Scenarios */}
        {result.scenarios.map((s, i) => {
          const colors = [
            { bg: "bg-blue-50", border: "border-blue-200", title: "text-blue-800", sub: "text-blue-600", accent: "text-blue-700", line: "border-blue-200", totalLine: "border-blue-300" },
            { bg: "bg-green-50", border: "border-green-200", title: "text-green-800", sub: "text-green-600", accent: "text-green-700", line: "border-green-200", totalLine: "border-green-300" },
            { bg: "bg-amber-50", border: "border-amber-200", title: "text-amber-800", sub: "text-amber-600", accent: "text-amber-700", line: "border-amber-200", totalLine: "border-amber-300" },
          ][i];
          return (
            <div key={s.name} className={`rounded-lg p-4 ${colors.bg} border-2 ${colors.border}`}>
              <h4 className={`font-semibold ${colors.title} text-sm`}>{s.name} — {(s.surrenderChargePct * 100).toFixed(0)}% Surrender</h4>
              <p className={`text-xs ${colors.sub} mb-3`}>PPVA Design</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Original Basis</span><span className="font-mono font-medium">{fmt(s.basisOrigUsd, s.basisOrigJpy)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">+ New PPVA Premium</span><span className="font-mono font-medium">{fmt(s.premiumUsd, s.premiumJpy)}</span></div>
                <div className={`border-t ${colors.line} pt-1`}>
                  <div className="flex justify-between font-medium"><span className="text-gray-600">Combined Basis</span><span className="font-mono">{fmt(s.combinedBasisUsd, s.combinedBasisJpy)}</span></div>
                </div>
                <div className="flex justify-between mt-1"><span className="text-gray-500">Existing CSV</span><span className="font-mono font-medium">{fmt(s.existingCsvUsd, s.existingCsvJpy)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">+ PPVA Surrender Value</span><span className="font-mono font-medium">{fmt(s.ppvaCsvUsd, s.ppvaCsvJpy)}</span></div>
                <div className={`border-t ${colors.line} pt-1`}>
                  <div className="flex justify-between font-medium"><span className="text-gray-600">Total CSV</span><span className="font-mono">{fmt(s.totalCsvUsd, s.totalCsvJpy)}</span></div>
                </div>
                <div className="flex justify-between"><span className="text-gray-500">- Less Combined Basis</span><span className="font-mono">{fmt(-s.combinedBasisUsd, -s.combinedBasisJpy)}</span></div>
                <div className={`border-t-2 ${colors.totalLine} pt-1.5 mt-1`}>
                  <div className="flex justify-between font-bold"><span className={colors.accent}>Gain / (Loss)</span><span className={`font-mono ${colors.accent}`}>{fmt(s.gainUsd, s.gainJpy)}</span></div>
                </div>
                <div className="bg-green-100 rounded p-2 mt-2">
                  <div className="flex justify-between font-semibold text-green-700">
                    <span>Value Difference</span>
                    <span className="font-mono">{fmt(s.valueDiffUsd, s.valueDiffJpy)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Surrender Schedule */}
      <Card title="Surrender Charge Schedule" description={`Year ${analysisYear} highlighted — 7% premium charge applied`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-navy">
              <th className="text-left py-2 px-3 text-navy font-semibold">Design</th>
              {Array.from({ length: 10 }, (_, i) => (
                <th key={i} className={`text-center py-2 px-3 font-semibold ${i + 1 === analysisYear ? "bg-sky/20 text-navy" : "text-navy"}`}>
                  Yr {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.scenarios.map((s) => (
              <tr key={s.name} className="border-b border-gray-100">
                <td className="py-2 px-3 font-medium">{s.name}</td>
                {s.surrenderSchedule.map((charge, i) => (
                  <td key={i} className={`py-2 px-3 text-center font-mono ${i + 1 === analysisYear ? "bg-sky/20 font-bold" : ""}`}>
                    {charge > 0 ? `${(charge * 100).toFixed(0)}%` : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
