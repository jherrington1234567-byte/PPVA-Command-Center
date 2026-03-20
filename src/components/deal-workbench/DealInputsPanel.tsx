"use client";

import { DealInputs, FundProduct } from "@/lib/calc/types";
import { NumberInput } from "@/components/ui/NumberInput";
import { formatPercent } from "@/lib/format";

interface DealInputsPanelProps {
  inputs: DealInputs;
  onUpdateField: <K extends keyof DealInputs>(field: K, value: DealInputs[K]) => void;
  onUpdateFund: (index: number, updates: Partial<FundProduct>) => void;
}

export function DealInputsPanel({ inputs, onUpdateField, onUpdateFund }: DealInputsPanelProps) {
  return (
    <div className="space-y-6 p-4">
      {/* Policy Information */}
      <section>
        <h3 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">
          Policy Information
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-brand mb-1">
              Policy Owner
            </label>
            <input
              type="text"
              value={inputs.policyOwner}
              onChange={(e) => onUpdateField("policyOwner", e.target.value)}
              placeholder="Entity name"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
            />
          </div>
          <NumberInput
            label="Total Deposit"
            value={inputs.totalDeposit}
            onChange={(v) => onUpdateField("totalDeposit", v)}
            format="currency"
            min={1000000}
            step={100000}
          />
        </div>
      </section>

      {/* Premium Structure */}
      <section>
        <h3 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">
          Premium Structure
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Premium Load"
            value={inputs.premiumLoadPct}
            onChange={(v) => onUpdateField("premiumLoadPct", v)}
            format="percent"
          />
          <NumberInput
            label="3cStructures (one-time)"
            value={inputs.threeCStructuresLoadPct}
            onChange={(v) => onUpdateField("threeCStructuresLoadPct", v)}
            format="percent"
          />
          <NumberInput
            label="Syndicated Holdback"
            value={inputs.syndicatedHoldbackPct}
            onChange={(v) => onUpdateField("syndicatedHoldbackPct", v)}
            format="percent"
          />
          <NumberInput
            label="PB Investment Holdback"
            value={inputs.pbInvestmentHoldbackPct}
            onChange={(v) => onUpdateField("pbInvestmentHoldbackPct", v)}
            format="percent"
          />
          <NumberInput
            label="PBWR Split"
            value={inputs.pbwrSplitPct}
            onChange={(v) => onUpdateField("pbwrSplitPct", v)}
            format="percent"
          />
          <NumberInput
            label="Advantage Admin Fee"
            value={inputs.advantageAdminFee}
            onChange={(v) => onUpdateField("advantageAdminFee", v)}
            format="currency"
          />
          <NumberInput
            label="Misc Fees"
            value={inputs.miscFees}
            onChange={(v) => onUpdateField("miscFees", v)}
            format="currency"
          />
        </div>
      </section>

      {/* Fund Allocations */}
      <section>
        <h3 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">
          Fund Allocation
        </h3>
        <div className="space-y-2">
          {inputs.fundAllocations.map((fund, i) => (
            <div key={fund.name} className="bg-gray-50 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">{fund.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${fund.isGuaranteed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {fund.isGuaranteed ? "Guaranteed" : "Non-Guaranteed"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <NumberInput
                  label="Allocation"
                  value={fund.allocationPct}
                  onChange={(v) => onUpdateFund(i, { allocationPct: v })}
                  format="percent"
                />
                <NumberInput
                  label="Est. Rate"
                  value={fund.estimatedRate}
                  onChange={(v) => onUpdateFund(i, { estimatedRate: v })}
                  format="percent"
                />
              </div>
            </div>
          ))}
          <div className="text-xs text-slate-brand text-right">
            Total: {formatPercent(inputs.fundAllocations.reduce((s, f) => s + f.allocationPct, 0))}
          </div>
        </div>
      </section>

      {/* Annual Charges (Ongoing Fees) */}
      <section>
        <h3 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">
          Annual Charges
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Advantage M&E"
            value={inputs.advantageMePct}
            onChange={(v) => onUpdateField("advantageMePct", v)}
            format="percent"
            step={0.0001}
          />
          <NumberInput
            label="Investment Advisor"
            value={inputs.investmentAdvisorPct}
            onChange={(v) => onUpdateField("investmentAdvisorPct", v)}
            format="percent"
            step={0.0001}
          />
          <NumberInput
            label="Money Manager"
            value={inputs.moneyManagerPct}
            onChange={(v) => onUpdateField("moneyManagerPct", v)}
            format="percent"
            step={0.0001}
          />
          <NumberInput
            label="Inspira Custodian"
            value={inputs.inspiraCustodianPct}
            onChange={(v) => onUpdateField("inspiraCustodianPct", v)}
            format="percent"
            step={0.0001}
          />
        </div>
      </section>

      {/* Client Demographics */}
      <section>
        <h3 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">
          Client Demographics
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Age"
            value={inputs.clientAge}
            onChange={(v) => onUpdateField("clientAge", v)}
            min={18}
            max={90}
          />
          <div>
            <label className="block text-xs font-medium text-slate-brand mb-1">Gender</label>
            <select
              value={inputs.clientGender}
              onChange={(e) => onUpdateField("clientGender", e.target.value as "M" | "F")}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <NumberInput
            label="Current CSV"
            value={inputs.currentCSV}
            onChange={(v) => onUpdateField("currentCSV", v)}
            format="currency"
          />
          <NumberInput
            label="Cost Basis"
            value={inputs.costBasis}
            onChange={(v) => onUpdateField("costBasis", v)}
            format="currency"
          />
          <NumberInput
            label="CSV Growth Rate"
            value={inputs.csvGrowthRate}
            onChange={(v) => onUpdateField("csvGrowthRate", v)}
            format="percent"
          />
          <NumberInput
            label="Tax Rate (Japan)"
            value={inputs.japaneseTaxRate}
            onChange={(v) => onUpdateField("japaneseTaxRate", v)}
            format="percent"
          />
          <NumberInput
            label="JPY/USD Rate"
            value={inputs.jpyUsdRate}
            onChange={(v) => onUpdateField("jpyUsdRate", v)}
            prefix="¥"
          />
        </div>
      </section>

      {/* Projection Settings */}
      <section>
        <h3 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">
          Projection Settings
        </h3>
        <div className="space-y-3">
          <NumberInput
            label="Projection Years"
            value={inputs.projectionYears}
            onChange={(v) => onUpdateField("projectionYears", v)}
            min={5}
            max={50}
          />
          <div className="grid grid-cols-3 gap-2">
            <NumberInput
              label="Low Rate"
              value={inputs.illustratedRates[0]}
              onChange={(v) => onUpdateField("illustratedRates", [v, inputs.illustratedRates[1], inputs.illustratedRates[2]])}
              format="percent"
            />
            <NumberInput
              label="Mid Rate"
              value={inputs.illustratedRates[1]}
              onChange={(v) => onUpdateField("illustratedRates", [inputs.illustratedRates[0], v, inputs.illustratedRates[2]])}
              format="percent"
            />
            <NumberInput
              label="High Rate"
              value={inputs.illustratedRates[2]}
              onChange={(v) => onUpdateField("illustratedRates", [inputs.illustratedRates[0], inputs.illustratedRates[1], v])}
              format="percent"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
