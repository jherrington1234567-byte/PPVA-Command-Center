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
  ppvaNetPremium: number;
  ppvaCSV: number;
  totalCSV: number;
  totalBasis: number;
  totalGain: number;
  gainReduction: number;
}

export interface CrossBorderResult {
  // Current reality (no PPVA)
  existingCSV: number;
  existingGain: number;
  existingGainJpy: number;
  existingTax: number;
  existingTaxJpy: number;

  // Scenarios
  scenarios: CrossBorderScenario[];

  // JPY values
  existingCSVJpy: number;
  existingBasisJpy: number;
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
    premiumChargePct, japaneseTaxRate,
  } = inputs;

  // Project existing CSV
  const existingCSV = currentCSV * Math.pow(1 + csvGrowthRate, analysisYear);
  const existingGain = Math.max(0, existingCSV - costBasis);
  const existingTax = existingGain * japaneseTaxRate;

  // JPY conversions
  const existingCSVJpy = existingCSV * fxRateAtAnalysis;
  const existingBasisJpy = costBasis * fxRateAtContribution;
  const existingGainJpy = Math.max(0, existingCSVJpy - existingBasisJpy);
  const existingTaxJpy = existingGainJpy * japaneseTaxRate;

  // Build scenarios
  const scenarios: CrossBorderScenario[] = Object.entries(SURRENDER_SCHEDULES).map(
    ([name, schedule]) => {
      const ppvaNetPremium = newPPVAPremium * (1 - premiumChargePct);
      const grownValue = ppvaNetPremium * Math.pow(1 + csvGrowthRate, analysisYear);
      const surrenderCharge = analysisYear <= schedule.length ? schedule[analysisYear - 1] : 0;
      const ppvaCSV = grownValue * (1 - surrenderCharge);

      const totalCSV = existingCSV + ppvaCSV;
      const totalBasis = costBasis + newPPVAPremium;
      const totalGain = Math.max(0, totalCSV - totalBasis);
      const gainReduction = existingGain - totalGain;

      return {
        name,
        surrenderSchedule: schedule,
        ppvaNetPremium,
        ppvaCSV,
        totalCSV,
        totalBasis,
        totalGain,
        gainReduction,
      };
    }
  );

  return {
    existingCSV,
    existingGain,
    existingGainJpy,
    existingTax,
    existingTaxJpy,
    scenarios,
    existingCSVJpy,
    existingBasisJpy,
  };
}
