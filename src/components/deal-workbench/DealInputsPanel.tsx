"use client";

import { DealInputs, FundProduct } from "@/lib/calc/types";
import { NumberInput } from "@/components/ui/NumberInput";
import { formatPercent } from "@/lib/format";
import { t } from "@/lib/translations";

interface DealInputsPanelProps {
  inputs: DealInputs;
  onUpdateField: <K extends keyof DealInputs>(field: K, value: DealInputs[K]) => void;
  onUpdateFund: (index: number, updates: Partial<FundProduct>) => void;
}

export function DealInputsPanel({ inputs, onUpdateField, onUpdateFund }: DealInputsPanelProps) {
  const lang = inputs.language;

  return (
    <div className="space-y-6 p-4">
      {/* Policy Information */}
      <section>
        <h3 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">
          {t("policyInformation", lang)}
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-brand mb-1">
              {t("policyOwner", lang)}
            </label>
            <input
              type="text"
              value={inputs.policyOwner}
              onChange={(e) => onUpdateField("policyOwner", e.target.value)}
              placeholder={t("entityNamePlaceholder", lang)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
            />
          </div>
          <NumberInput
            label={t("totalDeposit", lang)}
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
          {t("premiumStructure", lang)}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label={t("premiumLoad", lang)}
            value={inputs.premiumLoadPct}
            onChange={(v) => onUpdateField("premiumLoadPct", v)}
            format="percent"
          />
          <NumberInput
            label={t("threeCStructuresOneTime", lang)}
            value={inputs.threeCStructuresLoadPct}
            onChange={(v) => onUpdateField("threeCStructuresLoadPct", v)}
            format="percent"
          />
          <NumberInput
            label={t("syndicatedHoldback", lang)}
            value={inputs.syndicatedHoldbackPct}
            onChange={(v) => onUpdateField("syndicatedHoldbackPct", v)}
            format="percent"
          />
          <NumberInput
            label={t("pbInvestmentHoldback", lang)}
            value={inputs.pbInvestmentHoldbackPct}
            onChange={(v) => onUpdateField("pbInvestmentHoldbackPct", v)}
            format="percent"
          />
          <NumberInput
            label={t("pbwrSplit", lang)}
            value={inputs.pbwrSplitPct}
            onChange={(v) => onUpdateField("pbwrSplitPct", v)}
            format="percent"
          />
          <NumberInput
            label={t("advantageAdminFee", lang)}
            value={inputs.advantageAdminFee}
            onChange={(v) => onUpdateField("advantageAdminFee", v)}
            format="currency"
          />
          <NumberInput
            label={t("miscFees", lang)}
            value={inputs.miscFees}
            onChange={(v) => onUpdateField("miscFees", v)}
            format="currency"
          />
        </div>
      </section>

      {/* Fund Allocations */}
      <section>
        <h3 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">
          {t("fundAllocation", lang)}
        </h3>
        <div className="space-y-2">
          {inputs.fundAllocations.map((fund, i) => (
            <div key={fund.name} className="bg-gray-50 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">{fund.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${fund.isGuaranteed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {fund.isGuaranteed ? t("guaranteed", lang) : t("nonGuaranteed", lang)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <NumberInput
                  label={t("allocation", lang)}
                  value={fund.allocationPct}
                  onChange={(v) => onUpdateFund(i, { allocationPct: v })}
                  format="percent"
                />
                <NumberInput
                  label={t("estRate", lang)}
                  value={fund.estimatedRate}
                  onChange={(v) => onUpdateFund(i, { estimatedRate: v })}
                  format="percent"
                />
              </div>
            </div>
          ))}
          <div className="text-xs text-slate-brand text-right">
            {t("total", lang)}: {formatPercent(inputs.fundAllocations.reduce((s, f) => s + f.allocationPct, 0))}
          </div>
        </div>
      </section>

      {/* Annual Charges (Ongoing Fees) */}
      <section>
        <h3 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">
          {t("annualCharges", lang)}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label={t("advantageME", lang)}
            value={inputs.advantageMePct}
            onChange={(v) => onUpdateField("advantageMePct", v)}
            format="percent"
            step={0.0001}
          />
          <NumberInput
            label={t("investmentAdvisor", lang)}
            value={inputs.investmentAdvisorPct}
            onChange={(v) => onUpdateField("investmentAdvisorPct", v)}
            format="percent"
            step={0.0001}
          />
          <NumberInput
            label={t("moneyManager", lang)}
            value={inputs.moneyManagerPct}
            onChange={(v) => onUpdateField("moneyManagerPct", v)}
            format="percent"
            step={0.0001}
          />
          <NumberInput
            label={t("inspiraCustodian", lang)}
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
          {t("clientDemographics", lang)}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label={t("age", lang)}
            value={inputs.clientAge}
            onChange={(v) => onUpdateField("clientAge", v)}
            min={18}
            max={90}
          />
          <div>
            <label className="block text-xs font-medium text-slate-brand mb-1">{t("gender", lang)}</label>
            <select
              value={inputs.clientGender}
              onChange={(e) => onUpdateField("clientGender", e.target.value as "M" | "F")}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
            >
              <option value="M">{t("male", lang)}</option>
              <option value="F">{t("female", lang)}</option>
            </select>
          </div>
          <NumberInput
            label={t("currentCSV", lang)}
            value={inputs.currentCSV}
            onChange={(v) => onUpdateField("currentCSV", v)}
            format="currency"
          />
          <NumberInput
            label={t("costBasis", lang)}
            value={inputs.costBasis}
            onChange={(v) => onUpdateField("costBasis", v)}
            format="currency"
          />
          <NumberInput
            label={t("csvGrowthRate", lang)}
            value={inputs.csvGrowthRate}
            onChange={(v) => onUpdateField("csvGrowthRate", v)}
            format="percent"
          />
          {lang !== "english" && (
            <>
              <NumberInput
                label={t("taxRateJapan", lang)}
                value={inputs.japaneseTaxRate}
                onChange={(v) => onUpdateField("japaneseTaxRate", v)}
                format="percent"
              />
              <NumberInput
                label={t("jpyUsdRate", lang)}
                value={inputs.jpyUsdRate}
                onChange={(v) => onUpdateField("jpyUsdRate", v)}
                prefix="¥"
              />
            </>
          )}
        </div>
      </section>

      {/* Projection Settings */}
      <section>
        <h3 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">
          {t("projectionSettings", lang)}
        </h3>
        <div className="space-y-3">
          <NumberInput
            label={t("projectionYears", lang)}
            value={inputs.projectionYears}
            onChange={(v) => onUpdateField("projectionYears", v)}
            min={5}
            max={50}
          />
          <div className="grid grid-cols-3 gap-2">
            <NumberInput
              label={t("lowRate", lang)}
              value={inputs.illustratedRates[0]}
              onChange={(v) => onUpdateField("illustratedRates", [v, inputs.illustratedRates[1], inputs.illustratedRates[2]])}
              format="percent"
            />
            <NumberInput
              label={t("midRate", lang)}
              value={inputs.illustratedRates[1]}
              onChange={(v) => onUpdateField("illustratedRates", [inputs.illustratedRates[0], v, inputs.illustratedRates[2]])}
              format="percent"
            />
            <NumberInput
              label={t("highRate", lang)}
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
