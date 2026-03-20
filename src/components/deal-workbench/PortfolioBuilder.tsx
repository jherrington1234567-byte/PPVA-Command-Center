"use client";

import { useState, useMemo } from "react";
import {
  FUND_CATALOG,
  CRYSTAL_FUNDS,
  ALL_STRATEGIES,
  CatalogFund,
  FundSource,
  FundStrategy,
  PortfolioFund,
  calculatePortfolioMetrics,
  createCustomFund,
} from "@/lib/fund-catalog";
import { formatPercent } from "@/lib/format";

/* ──────────────────── Types ──────────────────── */
interface PortfolioBuilderProps {
  selectedFunds: PortfolioFund[];
  onUpdateFunds: (funds: PortfolioFund[]) => void;
  nonGuaranteedPct: number; // What % of the total deposit is in the non-guaranteed sleeve
}

type ViewMode = "catalog" | "portfolio";

/* ──────────────────── Source badge ──────────────────── */
function SourceBadge({ source }: { source: FundSource }) {
  const styles: Record<FundSource, string> = {
    crystal: "bg-purple-100 text-purple-700",
    sali: "bg-blue-100 text-blue-700",
    custom: "bg-amber-100 text-amber-700",
  };
  const labels: Record<FundSource, string> = {
    crystal: "Crystal Capital",
    sali: "SALI",
    custom: "Custom",
  };
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ${styles[source]}`}>
      {labels[source]}
    </span>
  );
}

function StrategyBadge({ strategy }: { strategy: FundStrategy }) {
  return (
    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
      {strategy}
    </span>
  );
}

/* ──────────────────── Fund Catalog Browser ──────────────────── */
function FundCatalog({
  selectedIds,
  onAddFund,
}: {
  selectedIds: Set<string>;
  onAddFund: (fund: CatalogFund) => void;
}) {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<FundSource | "all">("all");
  const [strategyFilter, setStrategyFilter] = useState<FundStrategy | "all">("all");

  const filtered = useMemo(() => {
    return FUND_CATALOG.filter((f) => {
      if (sourceFilter !== "all" && f.source !== sourceFilter) return false;
      if (strategyFilter !== "all" && f.strategy !== strategyFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          f.name.toLowerCase().includes(q) ||
          f.firmName.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, sourceFilter, strategyFilter]);

  return (
    <div className="space-y-3">
      {/* Search + Filters */}
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search funds..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
        />
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as FundSource | "all")}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
        >
          <option value="all">All Sources</option>
          <option value="crystal">Crystal Capital</option>
          <option value="sali">SALI</option>
          <option value="custom">Custom</option>
        </select>
        <select
          value={strategyFilter}
          onChange={(e) => setStrategyFilter(e.target.value as FundStrategy | "all")}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
        >
          <option value="all">All Strategies</option>
          {ALL_STRATEGIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <div className="text-xs text-slate-500">
        {filtered.length} fund{filtered.length !== 1 ? "s" : ""} found
        {search && ` for "${search}"`}
      </div>

      {/* Fund list */}
      <div className="max-h-[400px] overflow-y-auto space-y-1">
        {filtered.map((fund) => {
          const isSelected = selectedIds.has(fund.id);
          return (
            <div
              key={fund.id}
              className={`flex items-center justify-between p-3 rounded-md border transition-colors ${
                isSelected
                  ? "border-teal bg-teal/5"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-foreground truncate">
                    {fund.name}
                  </span>
                  <SourceBadge source={fund.source} />
                  <StrategyBadge strategy={fund.strategy} />
                </div>
                <p className="text-xs text-slate-500 truncate">{fund.description}</p>
                {fund.source === "crystal" && (
                  <div className="flex gap-3 mt-1 text-xs text-slate-600">
                    <span>Expected: <strong>{formatPercent(fund.expectedReturn)}</strong></span>
                    <span>Vol: <strong>{formatPercent(fund.historicalVolatility)}</strong></span>
                    <span>Mgmt: <strong>{formatPercent(fund.managementFeePct)}</strong></span>
                    <span>Perf: <strong>{formatPercent(fund.performanceFeePct)}</strong></span>
                  </div>
                )}
              </div>
              <button
                onClick={() => onAddFund(fund)}
                disabled={isSelected}
                className={`ml-3 shrink-0 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-teal text-white hover:bg-teal/90"
                }`}
              >
                {isSelected ? "Added" : "Add"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────── Custom Fund Entry ──────────────────── */
function CustomFundEntry({ onAdd }: { onAdd: (fund: CatalogFund) => void }) {
  const [name, setName] = useState("");
  const [strategy, setStrategy] = useState<FundStrategy>("Other");
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [volatility, setVolatility] = useState(10);
  const [mgmtFee, setMgmtFee] = useState(2);
  const [perfFee, setPerfFee] = useState(20);

  const handleAdd = () => {
    if (!name.trim()) return;
    const fund = createCustomFund(name.trim());
    fund.strategy = strategy;
    fund.expectedReturn = expectedReturn / 100;
    fund.historicalVolatility = volatility / 100;
    fund.managementFeePct = mgmtFee / 100;
    fund.performanceFeePct = perfFee / 100;
    onAdd(fund);
    setName("");
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
      <h4 className="text-sm font-semibold text-amber-800">Add Custom Fund</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Fund Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. ABC Private Credit Fund II"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Strategy</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as FundStrategy)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
          >
            {ALL_STRATEGIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Expected Return (%)</label>
          <input
            type="number"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(parseFloat(e.target.value) || 0)}
            step={0.5}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Volatility (%)</label>
          <input
            type="number"
            value={volatility}
            onChange={(e) => setVolatility(parseFloat(e.target.value) || 0)}
            step={0.5}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Mgmt Fee (%)</label>
          <input
            type="number"
            value={mgmtFee}
            onChange={(e) => setMgmtFee(parseFloat(e.target.value) || 0)}
            step={0.25}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Perf Fee (%)</label>
          <input
            type="number"
            value={perfFee}
            onChange={(e) => setPerfFee(parseFloat(e.target.value) || 0)}
            step={5}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
          />
        </div>
      </div>
      <button
        onClick={handleAdd}
        disabled={!name.trim()}
        className="w-full py-2 rounded-md bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Add Custom Fund to Portfolio
      </button>
    </div>
  );
}

/* ──────────────────── Portfolio Allocation Editor ──────────────────── */
function PortfolioEditor({
  funds,
  onUpdateFunds,
  nonGuaranteedPct,
}: {
  funds: PortfolioFund[];
  onUpdateFunds: (funds: PortfolioFund[]) => void;
  nonGuaranteedPct: number;
}) {
  const metrics = calculatePortfolioMetrics(funds);
  const allocOk = Math.abs(metrics.totalAllocation - 1.0) < 0.001;

  const updateAllocation = (index: number, pct: number) => {
    const updated = [...funds];
    updated[index] = { ...updated[index], allocationPct: pct / 100 };
    onUpdateFunds(updated);
  };

  const updateFundField = (index: number, field: keyof CatalogFund, value: number) => {
    const updated = [...funds];
    updated[index] = {
      ...updated[index],
      catalogFund: { ...updated[index].catalogFund, [field]: value / 100 },
    };
    onUpdateFunds(updated);
  };

  const removeFund = (index: number) => {
    const updated = funds.filter((_, i) => i !== index);
    onUpdateFunds(updated);
  };

  const equalWeight = () => {
    if (funds.length === 0) return;
    const w = 1 / funds.length;
    onUpdateFunds(funds.map((f) => ({ ...f, allocationPct: w })));
  };

  return (
    <div className="space-y-4">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-navy/5 rounded-lg p-3 text-center">
          <div className="text-[10px] font-medium text-slate-500 uppercase">Funds</div>
          <div className="text-lg font-bold text-navy">{metrics.fundCount}</div>
        </div>
        <div className={`rounded-lg p-3 text-center ${allocOk ? "bg-green-50" : "bg-red-50"}`}>
          <div className="text-[10px] font-medium text-slate-500 uppercase">Total Alloc</div>
          <div className={`text-lg font-bold ${allocOk ? "text-green-700" : "text-red-700"}`}>
            {(metrics.totalAllocation * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-teal/5 rounded-lg p-3 text-center">
          <div className="text-[10px] font-medium text-slate-500 uppercase">Blended Return</div>
          <div className="text-lg font-bold text-teal">{formatPercent(metrics.blendedReturn)}</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <div className="text-[10px] font-medium text-slate-500 uppercase">Blended Vol</div>
          <div className="text-lg font-bold text-amber-700">{formatPercent(metrics.blendedVolatility)}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-[10px] font-medium text-slate-500 uppercase">Sharpe Ratio</div>
          <div className="text-lg font-bold text-purple-700">
            {metrics.sharpeRatio !== null ? metrics.sharpeRatio.toFixed(2) : "N/A"}
          </div>
        </div>
      </div>

      {!allocOk && funds.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-700">
          Allocations must sum to 100%. Currently at {(metrics.totalAllocation * 100).toFixed(1)}%.
          <button onClick={equalWeight} className="ml-2 underline font-medium">
            Equal weight
          </button>
        </div>
      )}

      {/* Sleeve context */}
      <div className="bg-navy/5 border border-navy/10 rounded-md px-3 py-2 text-xs text-navy">
        This portfolio represents the <strong>non-guaranteed sleeve</strong> ({formatPercent(nonGuaranteedPct)} of total deposit).
        Allocations below are <em>within</em> this sleeve.
      </div>

      {/* Equal weight button */}
      {funds.length > 1 && (
        <div className="flex justify-end">
          <button
            onClick={equalWeight}
            className="text-xs text-teal font-medium hover:underline"
          >
            Equal Weight All ({(100 / funds.length).toFixed(1)}% each)
          </button>
        </div>
      )}

      {/* Fund cards */}
      {funds.length === 0 ? (
        <div className="text-center py-8 text-sm text-slate-400">
          No funds selected. Browse the catalog or add a custom fund to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {funds.map((pf, i) => (
            <div key={pf.catalogFund.id} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {pf.catalogFund.name}
                    </span>
                    <SourceBadge source={pf.catalogFund.source} />
                    <StrategyBadge strategy={pf.catalogFund.strategy} />
                  </div>
                </div>
                <button
                  onClick={() => removeFund(i)}
                  className="ml-2 text-red-400 hover:text-red-600 text-sm"
                  title="Remove fund"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                    Allocation %
                  </label>
                  <input
                    type="number"
                    value={parseFloat((pf.allocationPct * 100).toFixed(2))}
                    onChange={(e) => updateAllocation(i, parseFloat(e.target.value) || 0)}
                    step={5}
                    min={0}
                    max={100}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-right font-mono focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                    Exp. Return %
                  </label>
                  <input
                    type="number"
                    value={parseFloat((pf.catalogFund.expectedReturn * 100).toFixed(2))}
                    onChange={(e) => updateFundField(i, "expectedReturn", parseFloat(e.target.value) || 0)}
                    step={0.5}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-right font-mono focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                    Volatility %
                  </label>
                  <input
                    type="number"
                    value={parseFloat((pf.catalogFund.historicalVolatility * 100).toFixed(2))}
                    onChange={(e) => updateFundField(i, "historicalVolatility", parseFloat(e.target.value) || 0)}
                    step={0.5}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-right font-mono focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                    Mgmt Fee %
                  </label>
                  <input
                    type="number"
                    value={parseFloat((pf.catalogFund.managementFeePct * 100).toFixed(2))}
                    onChange={(e) => updateFundField(i, "managementFeePct", parseFloat(e.target.value) || 0)}
                    step={0.25}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-right font-mono focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
                    Perf Fee %
                  </label>
                  <input
                    type="number"
                    value={parseFloat((pf.catalogFund.performanceFeePct * 100).toFixed(2))}
                    onChange={(e) => updateFundField(i, "performanceFeePct", parseFloat(e.target.value) || 0)}
                    step={5}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-right font-mono focus:border-teal focus:ring-1 focus:ring-teal outline-none"
                  />
                </div>
              </div>

              {/* Allocation bar */}
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal rounded-full transition-all"
                  style={{ width: `${Math.min(pf.allocationPct * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────── Main Component ──────────────────── */
export function PortfolioBuilder({ selectedFunds, onUpdateFunds, nonGuaranteedPct }: PortfolioBuilderProps) {
  const [view, setView] = useState<ViewMode>("portfolio");
  const selectedIds = useMemo(() => new Set(selectedFunds.map((f) => f.catalogFund.id)), [selectedFunds]);

  const addFund = (fund: CatalogFund) => {
    if (selectedIds.has(fund.id)) return;
    onUpdateFunds([...selectedFunds, { catalogFund: fund, allocationPct: 0 }]);
  };

  // Quick-add Crystal portfolio (all 5 funds equally weighted)
  const addCrystalPortfolio = () => {
    const crystalNotYetAdded = CRYSTAL_FUNDS.filter((f) => !selectedIds.has(f.id));
    if (crystalNotYetAdded.length === 0) return;
    const totalFunds = selectedFunds.length + crystalNotYetAdded.length;
    const weight = 1 / totalFunds;
    const updated = [
      ...selectedFunds.map((f) => ({ ...f, allocationPct: weight })),
      ...crystalNotYetAdded.map((cf) => ({ catalogFund: cf, allocationPct: weight })),
    ];
    onUpdateFunds(updated);
  };

  return (
    <div className="space-y-4">
      {/* View toggle + Quick actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setView("portfolio")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              view === "portfolio" ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            My Portfolio ({selectedFunds.length})
          </button>
          <button
            onClick={() => setView("catalog")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              view === "catalog" ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Fund Catalog ({FUND_CATALOG.length})
          </button>
        </div>

        {view === "catalog" && (
          <button
            onClick={addCrystalPortfolio}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
          >
            + Add Crystal Portfolio (5 funds)
          </button>
        )}
      </div>

      {/* Content */}
      {view === "catalog" ? (
        <div className="space-y-4">
          <FundCatalog selectedIds={selectedIds} onAddFund={addFund} />
          <CustomFundEntry onAdd={addFund} />
        </div>
      ) : (
        <div className="space-y-4">
          <PortfolioEditor
            funds={selectedFunds}
            onUpdateFunds={onUpdateFunds}
            nonGuaranteedPct={nonGuaranteedPct}
          />
          <CustomFundEntry onAdd={addFund} />
        </div>
      )}
    </div>
  );
}
