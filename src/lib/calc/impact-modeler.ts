export interface TaxDeferralInputs {
  premiumAmount: number;
  grossReturnRate: number;
  taxRate: number;
  timeHorizon: number;
}

export interface TaxDeferralYear {
  year: number;
  taxableValue: number;
  ppvaValue: number;
  annualTaxPaid: number;
  cumulativeTaxSaved: number;
  dollarDifference: number;
}

export interface TaxDeferralResult {
  years: TaxDeferralYear[];
  finalTaxableValue: number;
  finalPPVAValue: number;
  totalTaxPaid: number;
  totalTaxDeferred: number;
  dollarAdvantage: number;
  percentAdvantage: number;
}

export function calculateTaxDeferral(inputs: TaxDeferralInputs): TaxDeferralResult {
  const { premiumAmount, grossReturnRate, taxRate, timeHorizon } = inputs;
  const years: TaxDeferralYear[] = [];

  let taxableValue = premiumAmount;
  let ppvaValue = premiumAmount;
  let cumulativeTaxSaved = 0;
  let totalTaxPaid = 0;

  for (let y = 1; y <= timeHorizon; y++) {
    // Taxable: grow, then pay tax on gains each year
    const taxableGrowth = taxableValue * grossReturnRate;
    const annualTaxPaid = taxableGrowth * taxRate;
    taxableValue = taxableValue + taxableGrowth - annualTaxPaid;
    totalTaxPaid += annualTaxPaid;

    // PPVA: tax-deferred compounding — no annual tax
    ppvaValue = ppvaValue * (1 + grossReturnRate);

    // Tax saved this year = what would have been paid
    cumulativeTaxSaved += annualTaxPaid;
    const dollarDifference = ppvaValue - taxableValue;

    years.push({
      year: y,
      taxableValue,
      ppvaValue,
      annualTaxPaid,
      cumulativeTaxSaved,
      dollarDifference,
    });
  }

  const finalTaxableValue = taxableValue;
  const finalPPVAValue = ppvaValue;

  return {
    years,
    finalTaxableValue,
    finalPPVAValue,
    totalTaxPaid,
    totalTaxDeferred: cumulativeTaxSaved,
    dollarAdvantage: finalPPVAValue - finalTaxableValue,
    percentAdvantage: finalTaxableValue > 0 ? (finalPPVAValue - finalTaxableValue) / finalTaxableValue : 0,
  };
}

export interface CrossBorderInputs {
  currentCSV: number;
  costBasis: number;
  fxRateAtContribution: number;
  currentFxRate: number;
  fxRateAtAnalysis: number;
  csvGrowthRate: number;
  analysisYear: number;
  newPPVAPremium: number;
  premiumChargePct: number;
  japaneseTaxRate: number;
}

export interface CrossBorderScenario {
  name: string;
  surrenderSchedule: number[];
  surrenderChargePct: number;
  ppvaNetPremium: number;
  ppvaCsvUsd: number;
  ppvaCsvJpy: number;
  // Basis
  basisOrigUsd: number;
  basisOrigJpy: number;
  premiumUsd: number;
  premiumJpy: number;
  combinedBasisUsd: number;
  combinedBasisJpy: number;
  // CSV
  existingCsvUsd: number;
  existingCsvJpy: number;
  totalCsvUsd: number;
  totalCsvJpy: number;
  // Gain — computed in JPY first (tax jurisdiction), then converted
  gainJpy: number;
  gainUsd: number;
  // Value difference vs current reality
  valueDiffJpy: number;
  valueDiffUsd: number;
}

export interface CrossBorderResult {
  // Current reality (no PPVA)
  crBasisUsd: number;
  crBasisJpy: number;
  crGrowthUsd: number;
  crGrowthJpy: number;
  crFxImpactUsd: number;
  crFxImpactJpy: number;
  crCsvUsd: number;
  crCsvJpy: number;
  crGainJpy: number;
  crGainUsd: number;

  // Scenarios
  scenarios: CrossBorderScenario[];
}

const SURRENDER_SCHEDULES: Record<string, number[]> = {
  "5-Year 95%": [0.95, 0.90, 0.80, 0.70, 0.60, 0, 0, 0, 0, 0],
  "5-Year 90%": [0.90, 0.70, 0.50, 0.30, 0.10, 0, 0, 0, 0, 0],
  "10-Year 90%": [0.90, 0.80, 0.70, 0.60, 0.50, 0.40, 0.30, 0.20, 0.10, 0],
};

export function calculateCrossBorder(inputs: CrossBorderInputs): CrossBorderResult {
  const {
    currentCSV, costBasis, fxRateAtContribution, currentFxRate,
    fxRateAtAnalysis, csvGrowthRate, analysisYear, newPPVAPremium,
    premiumChargePct,
  } = inputs;

  const growthFactor = Math.pow(1 + csvGrowthRate, analysisYear);

  // === Current Reality (no PPVA) ===
  const crBasisUsd = costBasis;
  const crBasisJpy = costBasis * fxRateAtContribution;
  const crGrowthUsd = currentCSV * (growthFactor - 1);
  const crGrowthJpy = crGrowthUsd * fxRateAtAnalysis;
  const crCsvUsd = currentCSV * growthFactor;
  const crCsvJpy = crCsvUsd * fxRateAtAnalysis;
  const crFxImpactJpy = crCsvUsd * (fxRateAtAnalysis - fxRateAtContribution);
  const crFxImpactUsd = crFxImpactJpy / fxRateAtAnalysis;
  // Gain computed in JPY first (Japanese tax jurisdiction), then back to USD
  const crGainJpy = crCsvJpy - crBasisJpy;
  const crGainUsd = crGainJpy / fxRateAtAnalysis;

  // === PPVA Design Scenarios ===
  const scenarios: CrossBorderScenario[] = Object.entries(SURRENDER_SCHEDULES).map(
    ([name, schedule]) => {
      const ppvaNetPremium = newPPVAPremium * (1 - premiumChargePct);
      const surrenderChargePct = analysisYear <= schedule.length ? schedule[analysisYear - 1] : 0;
      const ppvaAccumUsd = ppvaNetPremium * growthFactor;
      const ppvaCsvUsd = ppvaAccumUsd * (1 - surrenderChargePct);
      const ppvaCsvJpy = ppvaCsvUsd * fxRateAtAnalysis;

      // Basis: original at contribution FX, new premium at current FX
      const basisOrigUsd = costBasis;
      const basisOrigJpy = costBasis * fxRateAtContribution;
      const premiumUsd = newPPVAPremium;
      const premiumJpy = newPPVAPremium * currentFxRate;
      const combinedBasisUsd = basisOrigUsd + premiumUsd;
      const combinedBasisJpy = basisOrigJpy + premiumJpy;

      // CSV
      const existingCsvUsd = crCsvUsd;
      const existingCsvJpy = crCsvJpy;
      const totalCsvUsd = existingCsvUsd + ppvaCsvUsd;
      const totalCsvJpy = totalCsvUsd * fxRateAtAnalysis;

      // Gain in JPY first (tax jurisdiction), then convert to USD
      const gainJpy = totalCsvJpy - combinedBasisJpy;
      const gainUsd = gainJpy / fxRateAtAnalysis;

      // Value difference: how much less gain vs current reality
      const valueDiffJpy = crGainJpy - gainJpy;
      const valueDiffUsd = crGainUsd - gainUsd;

      return {
        name,
        surrenderSchedule: schedule,
        surrenderChargePct,
        ppvaNetPremium,
        ppvaCsvUsd,
        ppvaCsvJpy,
        basisOrigUsd,
        basisOrigJpy,
        premiumUsd,
        premiumJpy,
        combinedBasisUsd,
        combinedBasisJpy,
        existingCsvUsd,
        existingCsvJpy,
        totalCsvUsd,
        totalCsvJpy,
        gainJpy,
        gainUsd,
        valueDiffJpy,
        valueDiffUsd,
      };
    }
  );

  return {
    crBasisUsd,
    crBasisJpy,
    crGrowthUsd,
    crGrowthJpy,
    crFxImpactUsd,
    crFxImpactJpy,
    crCsvUsd,
    crCsvJpy,
    crGainJpy,
    crGainUsd,
    scenarios,
  };
}
