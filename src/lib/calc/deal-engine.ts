import { DealInputs, DealResult } from "./types";
import { calculateWaterfall } from "./premium-waterfall";
import { calculateFundAllocation } from "./fund-allocation";
import { calculateAnnualCharges } from "./annual-charges";
import { calculateCarrierIllustration } from "./carrier-illustration";
import { calculateTaxImpact } from "./tax-impact";

export function calculateDeal(inputs: DealInputs): DealResult {
  // Step 1-2: Premium load waterfall
  const waterfall = calculateWaterfall(inputs);

  // Step 3: Fund allocation and commissions
  const fundAllocation = calculateFundAllocation(
    inputs.fundAllocations,
    waterfall.netToFund
  );

  // Step 4: Annual charges (based on initial fund value)
  const annualCharges = calculateAnnualCharges(
    waterfall.netToFund,
    inputs.advantageFeeBps,
    inputs.threeCStructuresAnnualPct,
    inputs.meChargePct
  );

  // Step 5: Carrier illustration (year-by-year projection)
  const carrierIllustration = calculateCarrierIllustration(
    waterfall.netToFund,
    inputs
  );

  // Step 6: Tax impact analysis
  const taxImpact = calculateTaxImpact(inputs, carrierIllustration);

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
