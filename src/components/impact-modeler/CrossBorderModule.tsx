"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { NumberInput } from "@/components/ui/NumberInput";
import { formatCurrency, formatCurrencyJPY } from "@/lib/format";
import { calculateCrossBorder } from "@/lib/calc/impact-modeler";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function CrossBorderModule() {
  const [currentCSV, setCurrentCSV] = useState(2_000_000);
  const [costBasis, setCostBasis] = useState(1_500_000);
  const [fxContrib, setFxContrib] = useState(110);
  const [fxCurrent, setFxCurrent] = useState(150);
  const [fxAnalysis, setFxAnalysis] = useState(150);
  const [growthRate, setGrowthRate] = useState(0.04);
  const [analysisYear, setAnalysisYear] = useState(5);
  const [ppvaPremium, setPpvaPremium] = useState(5_000_000);
  const [currency, setCurrency] = useState<"USD" | "JPY">("USD");

  const result = useMemo(
    () =>
      calculateCrossBorder({
        currentCSV,
        costBasis,
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

  const fmt = (v: number) => currency === "JPY" ? formatCurrencyJPY(v * fxAnalysis) : formatCurrency(v);

  const chartData = [
    {
      name: "Current Reality",
      Gain: result.existingGain,
    },
    ...result.scenarios.map((s) => ({
      name: s.name,
      Gain: s.totalGain,
    })),
  ];

  const COLORS = ["#dc2626", "#2563eb", "#16a34a", "#d97706"];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NumberInput label="Current CSV (USD)" value={currentCSV} onChange={setCurrentCSV} format="currency" />
            <NumberInput label="Cost Basis (USD)" value={costBasis} onChange={setCostBasis} format="currency" />
            <NumberInput label="New PPVA Premium" value={ppvaPremium} onChange={setPpvaPremium} format="currency" min={1000000} />
            <NumberInput label="CSV Growth Rate" value={growthRate} onChange={setGrowthRate} format="percent" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NumberInput label="FX at Contribution (¥/$)" value={fxContrib} onChange={setFxContrib} prefix="¥" />
            <NumberInput label="Current FX Rate (¥/$)" value={fxCurrent} onChange={setFxCurrent} prefix="¥" />
            <NumberInput label="FX at Analysis (¥/$)" value={fxAnalysis} onChange={setFxAnalysis} prefix="¥" />
            <div>
              <NumberInput label="Analysis Year" value={analysisYear} onChange={setAnalysisYear} min={1} max={10} />
              <input
                type="range" min={1} max={10} value={analysisYear}
                onChange={(e) => setAnalysisYear(Number(e.target.value))}
                className="w-full mt-2 accent-teal"
              />
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setCurrency("USD")}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${currency === "USD" ? "bg-navy text-white" : "bg-gray-100 text-slate-brand"}`}
            >
              USD
            </button>
            <button
              onClick={() => setCurrency("JPY")}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${currency === "JPY" ? "bg-amber-500 text-white" : "bg-gray-100 text-slate-brand"}`}
            >
              JPY (¥)
            </button>
          </div>
        </div>
      </Card>

      {/* Gain Comparison Chart */}
      <Card title="Gain / (Loss) Comparison" description={`Year ${analysisYear} — ${currency === "JPY" ? "Values in JPY" : "Values in USD"}`}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="Gain" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <rect key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Reality */}
        <div className="rounded-lg p-4 bg-red-50 border-2 border-red-200">
          <h4 className="font-semibold text-red-800 text-sm">Current Reality</h4>
          <p className="text-xs text-red-600 mb-3">No PPVA — Full Tax Exposure</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-gray-500">Existing CSV</span><span className="font-mono font-medium">{fmt(result.existingCSV)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Cost Basis</span><span className="font-mono font-medium">{fmt(costBasis)}</span></div>
            <div className="border-t border-red-200 pt-1 mt-1">
              <div className="flex justify-between font-semibold"><span className="text-red-700">Gain</span><span className="font-mono text-red-600">{fmt(result.existingGain)}</span></div>
            </div>
            <div className="flex justify-between"><span className="text-gray-500">Tax Due</span><span className="font-mono text-red-600 font-semibold">{fmt(result.existingTax)}</span></div>
          </div>
        </div>

        {/* PPVA Scenarios */}
        {result.scenarios.map((scenario, i) => {
          const colors = [
            { bg: "bg-blue-50", border: "border-blue-200", title: "text-blue-800", sub: "text-blue-600", accent: "text-blue-700", borderLine: "border-blue-200" },
            { bg: "bg-green-50", border: "border-green-200", title: "text-green-800", sub: "text-green-600", accent: "text-green-700", borderLine: "border-green-200" },
            { bg: "bg-amber-50", border: "border-amber-200", title: "text-amber-800", sub: "text-amber-600", accent: "text-amber-700", borderLine: "border-amber-200" },
          ][i];
          return (
            <div key={scenario.name} className={`rounded-lg p-4 ${colors.bg} border-2 ${colors.border}`}>
              <h4 className={`font-semibold ${colors.title} text-sm`}>{scenario.name}</h4>
              <p className={`text-xs ${colors.sub} mb-3`}>PPVA Design</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Existing CSV</span><span className="font-mono font-medium">{fmt(result.existingCSV)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">PPVA CSV</span><span className="font-mono font-medium">{fmt(scenario.ppvaCSV)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Combined CSV</span><span className="font-mono font-medium">{fmt(scenario.totalCSV)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Combined Basis</span><span className="font-mono font-medium">{fmt(scenario.totalBasis)}</span></div>
                <div className={`border-t ${colors.borderLine} pt-1 mt-1`}>
                  <div className="flex justify-between font-semibold"><span className={colors.accent}>Total Gain</span><span className={`font-mono ${colors.accent}`}>{fmt(scenario.totalGain)}</span></div>
                </div>
                {scenario.gainReduction > 0 && (
                  <div className="bg-green-100 rounded p-2 mt-2">
                    <div className="flex justify-between font-semibold text-green-700">
                      <span>Gain Reduction</span>
                      <span className="font-mono">{fmt(scenario.gainReduction)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Surrender Schedule */}
      <Card title="Surrender Charge Schedule" description="Percentage charged on early withdrawal by year">
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
