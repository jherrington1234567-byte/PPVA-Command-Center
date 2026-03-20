import { DealInputs, CarrierIllustrationYear, TaxImpactResult, TaxImpactYear } from "./types";

export function calculateTaxImpact(
  inputs: DealInputs,
  carrierIllustration: CarrierIllustrationYear[]
): TaxImpactResult {
  const {
    currentCSV,
    costBasis,
    csvGrowthRate,
    japaneseTaxRate,
    jpyUsdRate,
    clientAge,
  } = inputs;

  const years: TaxImpactYear[] = [];
  let totalTaxSaved = 0;

  for (const illustYear of carrierIllustration) {
    const y = illustYear.year;

    // Existing portfolio projection (without PPVA — subject to annual tax)
    const existingCSV = currentCSV * Math.pow(1 + csvGrowthRate, y);
    const existingGain = Math.max(0, existingCSV - costBasis);
    const taxWithoutPPVA = existingGain * japaneseTaxRate;

    // PPVA values (tax-deferred — no annual tax)
    const ppvaFundValue = illustYear.fundValueMid;
    const ppvaSurrenderValue = illustYear.surrenderValueMid;

    // Combined CSV in JPY
    const combinedCSVJpy = (existingCSV + ppvaFundValue) * jpyUsdRate;
    const combinedBasisJpy = (costBasis + inputs.totalDeposit) * jpyUsdRate;
    const combinedGainJpy = Math.max(0, combinedCSVJpy - combinedBasisJpy);

    // Tax saved = tax that would have been paid on PPVA gains if not deferred
    const ppvaGain = Math.max(0, ppvaFundValue - inputs.totalDeposit);
    const ppvaTaxIfNotDeferred = ppvaGain * japaneseTaxRate;
    totalTaxSaved += ppvaTaxIfNotDeferred;

    years.push({
      year: y,
      age: clientAge + y,
      existingCSV,
      existingGain,
      taxWithoutPPVA,
      ppvaFundValue,
      ppvaSurrenderValue,
      combinedCSVJpy,
      combinedGainJpy,
    });
  }

  return {
    years,
    totalTaxSaved,
    totalTaxSavedJpy: totalTaxSaved * jpyUsdRate,
  };
}
