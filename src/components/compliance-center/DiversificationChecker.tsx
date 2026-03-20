"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { NumberInput } from "@/components/ui/NumberInput";
import { formatPercent } from "@/lib/format";

interface Allocation {
  name: string;
  pct: number;
}

interface RuleResult {
  rule: string;
  passed: boolean;
  detail: string;
}

function check817h(allocations: Allocation[]): { passed: boolean; rules: RuleResult[] } {
  const sorted = [...allocations].filter((a) => a.pct > 0).sort((a, b) => b.pct - a.pct);
  const count = sorted.length;

  const rules: RuleResult[] = [
    {
      rule: "Minimum 5 investments",
      passed: count >= 5,
      detail: `${count} investments (need >= 5)`,
    },
    {
      rule: "No single investment > 55%",
      passed: !sorted[0] || sorted[0].pct <= 0.55,
      detail: sorted[0] ? `Largest: ${formatPercent(sorted[0].pct)} (${sorted[0].name})` : "N/A",
    },
    {
      rule: "No two investments > 70%",
      passed: sorted.length < 2 || sorted[0].pct + sorted[1].pct <= 0.70,
      detail: sorted.length >= 2 ? `Top 2: ${formatPercent(sorted[0].pct + sorted[1].pct)}` : "N/A",
    },
    {
      rule: "No three investments > 80%",
      passed: sorted.length < 3 || sorted[0].pct + sorted[1].pct + sorted[2].pct <= 0.80,
      detail: sorted.length >= 3 ? `Top 3: ${formatPercent(sorted[0].pct + sorted[1].pct + sorted[2].pct)}` : "N/A",
    },
    {
      rule: "No four investments > 90%",
      passed: sorted.length < 4 || sorted.slice(0, 4).reduce((s, a) => s + a.pct, 0) <= 0.90,
      detail: sorted.length >= 4 ? `Top 4: ${formatPercent(sorted.slice(0, 4).reduce((s, a) => s + a.pct, 0))}` : "N/A",
    },
  ];

  return { passed: rules.every((r) => r.passed), rules };
}

export function DiversificationChecker() {
  const [allocations, setAllocations] = useState<Allocation[]>([
    { name: "Intl Fixed Rate Plan Plus", pct: 0.40 },
    { name: "Intl Fixed Rate Plan", pct: 0.20 },
    { name: "US 5-Year FIA", pct: 0.15 },
    { name: "AAIDX Alt Income", pct: 0.10 },
    { name: "ACRE III CRE Fund", pct: 0.10 },
    { name: "Cash Liquidity", pct: 0.05 },
  ]);

  const result = check817h(allocations);
  const total = allocations.reduce((s, a) => s + a.pct, 0);

  return (
    <div className="space-y-6">
      {/* Pass/Fail Banner */}
      <div className={`rounded-lg p-5 text-center ${result.passed ? "bg-green-50 border-2 border-green-300" : "bg-red-50 border-2 border-red-300"}`}>
        <p className={`text-2xl font-bold ${result.passed ? "text-green-700" : "text-red-700"}`}>
          {result.passed ? "PASS" : "FAIL"}
        </p>
        <p className={`text-sm mt-1 ${result.passed ? "text-green-600" : "text-red-600"}`}>
          817(h) Diversification {result.passed ? "Requirements Met" : "Violation Detected"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocations Input */}
        <Card title="Investment Allocations" description="Adjust percentages to test compliance">
          <div className="space-y-3">
            {allocations.map((alloc, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  value={alloc.name}
                  onChange={(e) => {
                    const next = [...allocations];
                    next[i] = { ...next[i], name: e.target.value };
                    setAllocations(next);
                  }}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                />
                <NumberInput
                  label=""
                  value={alloc.pct}
                  onChange={(v) => {
                    const next = [...allocations];
                    next[i] = { ...next[i], pct: v };
                    setAllocations(next);
                  }}
                  format="percent"
                  className="w-24"
                />
              </div>
            ))}
            <button
              onClick={() => setAllocations([...allocations, { name: `Investment ${allocations.length + 1}`, pct: 0 }])}
              className="text-xs text-teal font-medium hover:underline"
            >
              + Add Investment
            </button>
            <p className={`text-xs text-right ${Math.abs(total - 1) > 0.001 ? "text-red-500 font-semibold" : "text-slate-brand"}`}>
              Total: {formatPercent(total)}
            </p>
          </div>
        </Card>

        {/* Rules Check */}
        <Card title="817(h) Rules" description="Each rule must pass for the portfolio to qualify">
          <div className="space-y-3">
            {result.rules.map((rule, i) => (
              <div key={i} className={`rounded-lg p-3 flex items-start gap-3 ${rule.passed ? "bg-green-50" : "bg-red-50"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${rule.passed ? "bg-green-500" : "bg-red-500"}`}>
                  {rule.passed ? (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${rule.passed ? "text-green-800" : "text-red-800"}`}>{rule.rule}</p>
                  <p className={`text-xs mt-0.5 ${rule.passed ? "text-green-600" : "text-red-600"}`}>{rule.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
