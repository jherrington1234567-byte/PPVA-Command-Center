import { DealInputs, DealResult } from "./types";
import { calculateWaterfall } from "./premium-waterfall";
import { calculateFundAllocation } from "./fund-allocation";
import { calculateAnnualCharges } from "./annual-charges";
import { calculateCarrierIllustration } from "./carrier-illustration";
import { calculateTaxImpact } from "./tax-impact";

/**
 * Calculate the blended return from portfolio builder selections.
 * Returns null if no valid portfolio is configured.
 */
function getPortfolioBlendedReturn(inputs: DealInputs): number | null {
  const { portfolioFunds, usePortfolioReturn } = inputs;
  if (!usePortfolioReturn || !portfolioFunds || portfolioFunds.length === 0) {
    return null;
  }

  const totalAlloc = portfolioFunds.reduce((s, f) => s + f.allocationPct, 0);
  if (totalAlloc <= 0) return null;

  // Weighted average expected return across selected portfolio funds
  const blendedReturn = portfolioFunds.reduce(
    (s, f) => s + f.expectedReturn * (f.allocationPct / totalAlloc),
    0
  );

  return blendedReturn;
}

/**
 * Build effective illustrated rates.
 * When portfolio builder is active:
 *   - Calculate blended return from guaranteed sleeve + portfolio sleeve
 *   - Use that as the "mid" illustrated rate
 *   - Low = mid - 2%, High = mid + 2%
 */
function getEffectiveRates(
  inputs: DealInputs,
  portfolioReturn: number | null
): [number, number, number] {
  if (portfolioReturn === null) {
    return inputs.illustratedRates;
  }

  // Calculate the overall blended return:
  // guaranteed sleeve weighted return + non-guaranteed sleeve portfolio return
  const guaranteedFunds = inputs.fundAllocations.filter((f) => f.isGuaranteed);
  const nonGuaranteedFunds = inputs.fundAllocations.filter((f) => !f.isGuaranteed);

  const guaranteedPct = guaranteedFunds.reduce((s, f) => s + f.allocationPct, 0);
  const nonGuaranteedPct = nonGuaranteedFunds.reduce((s, f) => s + f.allocationPct, 0);

  const guaranteedReturn = guaranteedPct > 0
    ? guaranteedFunds.reduce((s, f) => s + f.estimatedRate * f.allocationPct, 0) / guaranteedPct
    : 0;

  // Blend: guaranteed sleeve return + portfolio builder return
  const totalPct = guaranteedPct + nonGuaranteedPct;
  const blendedMid = totalPct > 0
    ? (guaranteedReturn * guaranteedPct + portfolioReturn * nonGuaranteedPct) / totalPct
    : portfolioReturn;

  // Spread: low = mid - 2%, high = mid + 2%
  const spread = 0.02;
  return [
    Math.max(0, blendedMid - spread),
    blendedMid,
    blendedMid + spread,
  ];
}

export function calculateDeal(inputs: DealInputs): DealResult {
  // Step 1-2: Premium load waterfall
  const waterfall = calculateWaterfall(inputs);

  // Portfolio blended return (if active)
  const portfolioReturn = getPortfolioBlendedReturn(inputs);

  // Effective illustrated rates (portfolio-driven or manual)
  const effectiveRates = getEffectiveRates(inputs, portfolioReturn);

  // Build effective inputs with portfolio-driven rates
  const effectiveInputs: DealInputs = {
    ...inputs,
    illustratedRates: effectiveRates,
  };

  // If portfolio is active, also update non-guaranteed fund estimated rates
  // so the Fund Allocation table reflects the portfolio selections
  if (portfolioReturn !== null) {
    effectiveInputs.fundAllocations = inputs.fundAllocations.map((fund) => {
      if (!fund.isGuaranteed) {
        return { ...fund, estimatedRate: portfolioReturn };
      }
      return fund;
    });
  }

  // Step 3: Fund allocation and commissions
  const fundAllocation = calculateFundAllocation(
    effectiveInputs.fundAllocations,
    waterfall.netToFund
  );

  // Step 4: Annual charges (based on initial fund value)
  const annualCharges = calculateAnnualCharges(waterfall.netToFund, effectiveInputs);

  // Step 5: Carrier illustration (year-by-year projection)
  const carrierIllustration = calculateCarrierIllustration(
    waterfall.netToFund,
    effectiveInputs
  );

  // Step 6: Tax impact analysis
  const taxImpact = calculateTaxImpact(effectiveInputs, carrierIllustration);

  // Summary metrics
  const totalFirstYearCommissions =
    fundAllocation.totalOgaCommission +
    fundAllocation.totalProcessorCommission +
    fundAllocation.totalRegionalCommission;

  const year10 = carrierIllustration.find((y) => y.year === 10);
  const year20 = carrierIllustration.find((y) => y.year === 20);

  const summary = {
    totalDeposit: inputs.totalDeposit,
    netToFund: waterfall.netToFund,
    loadPct: waterfall.totalFeesAndLoads / inputs.totalDeposit,
    weightedReturn: fundAllocation.weightedReturn,
    totalFirstYearCommissions,
    projectedValue10Yr: year10?.fundValueMid ?? 0,
    projectedValue20Yr: year20?.fundValueMid ?? 0,
  };

  return {
    waterfall,
    fundAllocation,
    annualCharges,
    carrierIllustration,
    taxImpact,
    summary,
  };
}
