import { Card } from "@/components/ui/Card";

const phases = [
  {
    name: "Phase 1: Broker-Dealer",
    role: "BD Only",
    color: "bg-teal",
    textColor: "text-teal",
    items: [
      { dimension: "Role", value: "Broker-Dealer (commission-based)" },
      { dimension: "Activity", value: "Case placement & application" },
      { dimension: "Compensation", value: "One-time commission on placement" },
      { dimension: "Relationship", value: "Transactional — ends at funding" },
      { dimension: "Oversight", value: "Faith (BD compliance)" },
      { dimension: "Duration", value: "Steps 1-8" },
    ],
  },
  {
    name: "Transition Window",
    role: "Neither Active",
    color: "bg-amber-500",
    textColor: "text-amber-600",
    items: [
      { dimension: "Role", value: "No broker or RIA activity" },
      { dimension: "Activity", value: "Account opening & infrastructure setup" },
      { dimension: "Compensation", value: "N/A" },
      { dimension: "Relationship", value: "Administrative only" },
      { dimension: "Oversight", value: "Carrier (Advantage/DeAnn)" },
      { dimension: "Duration", value: "~3 business days (Steps 9-12)" },
    ],
  },
  {
    name: "Phase 2: RIA",
    role: "RIA Only",
    color: "bg-navy",
    textColor: "text-navy",
    items: [
      { dimension: "Role", value: "RIA (fee-based fiduciary)" },
      { dimension: "Activity", value: "Discretionary portfolio management" },
      { dimension: "Compensation", value: "Ongoing advisory fees (0-2%)" },
      { dimension: "Relationship", value: "Ongoing fiduciary — for life" },
      { dimension: "Oversight", value: "Faith (RIA compliance)" },
      { dimension: "Duration", value: "Steps 13-15 and beyond" },
    ],
  },
];

export function BdRiaSeparation() {
  return (
    <div className="space-y-6">
      {/* Visual Timeline */}
      <Card title="BD/RIA Temporal Separation" description="Strict sequential roles — never concurrent">
        <div className="flex items-center gap-0 overflow-x-auto">
          {phases.map((phase, i) => (
            <div key={i} className="flex-1 min-w-[200px]">
              <div className={`${phase.color} text-white text-center py-3 ${i === 0 ? "rounded-l-lg" : ""} ${i === phases.length - 1 ? "rounded-r-lg" : ""}`}>
                <p className="text-sm font-semibold">{phase.name}</p>
                <p className="text-xs text-white/80 mt-0.5">{phase.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-0 mt-1">
          {phases.map((_, i) => (
            <div key={i} className="flex-1 flex justify-center">
              {i < phases.length - 1 && (
                <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Comparison Table */}
      <Card title="Role Comparison" description="BD vs RIA across all dimensions">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-navy">
                <th className="text-left py-2 px-3 text-navy font-semibold w-32">Dimension</th>
                {phases.map((p) => (
                  <th key={p.name} className={`text-left py-2 px-3 font-semibold ${p.textColor}`}>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {phases[0].items.map((_, rowIdx) => (
                <tr key={rowIdx} className="border-b border-gray-100">
                  <td className="py-2 px-3 font-medium text-navy">{phases[0].items[rowIdx].dimension}</td>
                  {phases.map((phase) => (
                    <td key={phase.name} className="py-2 px-3 text-foreground">{phase.items[rowIdx].value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Key Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-teal/5 border border-teal/20 rounded-lg p-4">
          <p className="text-sm font-semibold text-teal">Phase 1 Rule</p>
          <p className="text-xs text-slate-brand mt-1">BD role is commission-based and transactional. NO ongoing involvement, NO renewals, NO trail commissions. Uses &quot;Administrative Access&quot; not &quot;Broker of Record.&quot;</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-amber-700">Transition Rule</p>
          <p className="text-xs text-slate-brand mt-1">~3 business days of NO broker activity and NO RIA activity. Only infrastructure setup (account opening, agreements, funding).</p>
        </div>
        <div className="bg-navy/5 border border-navy/20 rounded-lg p-4">
          <p className="text-sm font-semibold text-navy">Phase 2 Rule</p>
          <p className="text-xs text-slate-brand mt-1">RIA begins ONLY after transition completes. Fee-based fiduciary with ongoing discretionary authority. Clean separation protects fiduciary status.</p>
        </div>
      </div>
    </div>
  );
}
