"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { NumberInput } from "@/components/ui/NumberInput";
import { formatCurrency, formatPercent, formatCompact } from "@/lib/format";
import { analyzeScenario, PRESET_SCENARIOS, AllocationScenario, DEFAULT_GUARANTEED_RATE } from "@/lib/calc/axonic-optimizer";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";

const SCENARIO_COLORS = ["#dc2626", "#f59e0b", "#0086A3", "#003661", "#16a34a", "#7c3aed"];

export function AxonicOptimizer() {
  const [premium, setPremium] = useState(10_000_000);
  const [years, setYears] = useState(20);
  const [guaranteedRate, setGuaranteedRate] = useState(DEFAULT_GUARANTEED_RATE);
  const [customAlloc, setCustomAlloc] = useState<AllocationScenario>({
    name: "Custom",
    guaranteedFixedPct: 0.30,
    indexPct: 0.20,
    portfolioPct: 0.20,
    otherPct: 0.30,
  });
  const [showCustom, setShowCustom] = useState(false);

  const scenarios = useMemo(() => {
    const list = showCustom ? [...PRESET_SCENARIOS, customAlloc] : PRESET_SCENARIOS;
    return list.map((s) => analyzeScenario(s, premium, years, guaranteedRate));
  }, [premium, years, guaranteedRate, customAlloc, showCustom]);

  // Sharpe ratio comparison chart data
  const sharpeData = scenarios.map((r, i) => ({
    name: r.scenario.name.length > 20 ? r.scenario.name.slice(0, 20) + "..." : r.scenario.name,
    fullName: r.scenario.name,
    Sharpe: r.sharpeRatio ?? 0,
    Return: r.blendedReturn,
    Volatility: r.blendedVolatility,
    color: SCENARIO_COLORS[i % SCENARIO_COLORS.length],
  }));

  // Growth projection chart data
  const projectionData = Array.from({ length: years }, (_, y) => {
    const point: Record<string, number | string> = { year: y + 1 };
    scenarios.forEach((r) => {
      point[r.scenario.name] = r.projectedValues[y];
    });
    return point;
  });

  // Historical stress test data
  const stressLabels = Array.from({ length: 25 }, (_, i) => 2000 + i);
  const stressData = stressLabels.map((yr, i) => {
    const point: Record<string, number | string> = { year: yr };
    scenarios.forEach((r) => {
      point[r.scenario.name] = r.historicalReturns[i] ?? 0;
    });
    return point;
  });

  const pureMarket = scenarios[0];
  // Best Sharpe among scenarios that actually have measurable volatility (exclude pure guaranteed)
  const bestSharpe = scenarios
    .filter((r) => r.sharpeRatio !== null)
    .reduce((best, r) => (r.sharpeRatio ?? 0) > (best.sharpeRatio ?? 0) ? r : best, scenarios[0]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <div className="flex flex-wrap items-end gap-6">
          <NumberInput label="Premium Amount" value={premium} onChange={setPremium} format="currency" min={1000000} className="w-48" />
          <NumberInput label="Projection Years" value={years} onChange={setYears} min={5} max={40} className="w-32" />
          <NumberInput
            label="Axonic Guaranteed Rate"
            value={guaranteedRate}
            onChange={setGuaranteedRate}
            format="percent"
            step={0.0025}
            min={0.01}
            max={0.15}
            className="w-44"
          />
          <label className="flex items-center gap-2 pb-1">
            <input type="checkbox" checked={showCustom} onChange={(e) => setShowCustom(e.target.checked)} className="accent-teal" />
            <span className="text-sm text-foreground">Show custom allocation</span>
          </label>
        </div>
        {showCustom && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-navy mb-3">Custom Allocation</p>
            <div className="grid grid-cols-4 gap-4">
              <NumberInput label="Axonic Guaranteed Fixed" value={customAlloc.guaranteedFixedPct} onChange={(v) => setCustomAlloc((p) => ({ ...p, guaranteedFixedPct: v }))} format="percent" />
              <NumberInput label="Axonic Index (0/10 cap)" value={customAlloc.indexPct} onChange={(v) => setCustomAlloc((p) => ({ ...p, indexPct: v }))} format="percent" />
              <NumberInput label="Axonic Portfolio Mgmt" value={customAlloc.portfolioPct} onChange={(v) => setCustomAlloc((p) => ({ ...p, portfolioPct: v }))} format="percent" />
              <NumberInput label="Other Portfolio (Market)" value={customAlloc.otherPct} onChange={(v) => setCustomAlloc((p) => ({ ...p, otherPct: v }))} format="percent" />
            </div>
            <p className="text-xs text-slate-brand mt-2 text-right">
              Total: {formatPercent(customAlloc.guaranteedFixedPct + customAlloc.indexPct + customAlloc.portfolioPct + customAlloc.otherPct)}
            </p>
          </div>
        )}
      </Card>

      {/* Key Insight Banner */}
      <div className="bg-gradient-to-r from-navy to-teal rounded-xl p-6 text-white">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-white/70">Best Risk-Adjusted Scenario</p>
            <p className="text-lg font-bold mt-1">{bestSharpe.scenario.name}</p>
            <p className="text-sm text-white/80 mt-0.5">Sharpe Ratio: {bestSharpe.sharpeRatio?.toFixed(2) ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-white/70">Sharpe Improvement vs Pure Market</p>
            <p className="text-2xl font-bold mt-1">
              {pureMarket.sharpeRatio && bestSharpe.sharpeRatio
                ? `+${(((bestSharpe.sharpeRatio / pureMarket.sharpeRatio) - 1) * 100).toFixed(0)}%`
                : "N/A"}
            </p>
            <p className="text-sm text-white/80 mt-0.5">Market Sharpe: {pureMarket.sharpeRatio?.toFixed(2) ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-white/70">Axonic Guaranteed Rate</p>
            <p className="text-2xl font-bold mt-1">{formatPercent(guaranteedRate)}</p>
            <p className="text-sm text-white/80 mt-0.5">Lifetime guaranteed, zero volatility</p>
          </div>
        </div>
      </div>

      {/* Sharpe Ratio Comparison */}
      <Card title="Sharpe Ratio by Allocation" description="Higher = better risk-adjusted return. Axonic guaranteed allocation reduces volatility faster than it reduces return.">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sharpeData} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} label={{ value: "Sharpe Ratio", angle: -90, position: "insideLeft", fontSize: 12 }} />
              <Tooltip formatter={(value) => Number(value).toFixed(2)} labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""} />
              <Bar dataKey="Sharpe" radius={[4, 4, 0, 0]}>
                {sharpeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Projections */}
        <Card title="Projected Growth" description={`${years}-year projection at blended expected returns`}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(l) => `Year ${l}`} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {scenarios.map((r, i) => (
                  <Line
                    key={r.scenario.name}
                    type="monotone"
                    dataKey={r.scenario.name}
                    stroke={SCENARIO_COLORS[i % SCENARIO_COLORS.length]}
                    strokeWidth={r.scenario.name === "100% Market" ? 2 : 1.5}
                    strokeDasharray={r.scenario.name === "100% Market" ? "5 5" : undefined}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Historical Stress Test */}
        <Card title="Historical Stress Test (2000-2009)" description="Dot-com crash through financial crisis — how each allocation would have performed through actual S&P returns">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stressData.slice(0, 10)} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => formatPercent(Number(value))} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {scenarios.slice(0, 4).map((r, i) => (
                  <Area
                    key={r.scenario.name}
                    type="monotone"
                    dataKey={r.scenario.name}
                    stroke={SCENARIO_COLORS[i]}
                    fill={SCENARIO_COLORS[i]}
                    fillOpacity={0.1}
                    strokeWidth={1.5}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Scenario Comparison Table */}
      <Card title="Scenario Comparison" description="Side-by-side metrics across all allocation strategies">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-navy">
                <th className="text-left py-2 px-3 text-navy font-semibold">Scenario</th>
                <th className="text-center py-2 px-3 text-navy font-semibold">Axonic Fixed %</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Blended Return</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Guaranteed Floor</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Volatility</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Sharpe Ratio</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Worst Year</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Max Drawdown</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">Neg. Years</th>
                <th className="text-right py-2 px-3 text-navy font-semibold">{years}-Yr Value</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((r, i) => {
                const isBest = r === bestSharpe && r.sharpeRatio !== null;
                return (
                  <tr key={r.scenario.name} className={`border-b border-gray-100 ${isBest ? "bg-teal/5" : "hover:bg-gray-50"}`}>
                    <td className="py-2 px-3 font-medium">
                      <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: SCENARIO_COLORS[i % SCENARIO_COLORS.length] }} />
                      {r.scenario.name}
                      {isBest && <span className="ml-2 text-xs bg-teal text-white px-1.5 py-0.5 rounded">Best Sharpe</span>}
                    </td>
                    <td className="py-2 px-3 text-center font-mono">{formatPercent(r.scenario.guaranteedFixedPct)}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatPercent(r.blendedReturn)}</td>
                    <td className="py-2 px-3 text-right font-mono text-green-600">{formatPercent(r.guaranteedFloor)}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatPercent(r.blendedVolatility)}</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-teal">
                      {r.sharpeRatio !== null ? r.sharpeRatio.toFixed(2) : "N/A"}
                    </td>
                    <td className={`py-2 px-3 text-right font-mono ${r.worstYear < 0 ? "text-red-600" : "text-green-600"}`}>
                      {formatPercent(r.worstYear)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-red-500">{formatPercent(r.maxDrawdown)}</td>
                    <td className="py-2 px-3 text-right font-mono">
                      {r.yearsNegative} / 25
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">{formatCompact(r.finalValue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* How It Works */}
      <Card title="How Axonic Guaranteed Fixed Improves Sharpe Ratio">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-navy/5 rounded-lg p-4">
            <p className="font-semibold text-navy mb-2">1. Reduces Portfolio Volatility</p>
            <p className="text-slate-brand">The guaranteed {formatPercent(guaranteedRate)} fixed rate has zero volatility. Every dollar allocated to Axonic Fixed removes that dollar from market risk entirely. Volatility drops proportionally.</p>
          </div>
          <div className="bg-teal/5 rounded-lg p-4">
            <p className="font-semibold text-teal mb-2">2. Maintains Meaningful Return</p>
            <p className="text-slate-brand">At {formatPercent(guaranteedRate)} guaranteed, Axonic Fixed still contributes strong absolute returns — well above risk-free rates. The return reduction is smaller than the volatility reduction.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="font-semibold text-green-700 mb-2">3. Net Effect: Higher Sharpe</p>
            <p className="text-slate-brand">Because volatility drops faster than return, the Sharpe ratio improves. A 40% Axonic Fixed allocation typically achieves the optimal risk-return tradeoff.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
