import { FundProduct, FundAllocationResult, FundAllocationLine } from "./types";

export function calculateFundAllocation(
  fundAllocations: FundProduct[],
  netToFund: number
): FundAllocationResult {
  const lines: FundAllocationLine[] = fundAllocations.map((fund) => {
    const amount = netToFund * fund.allocationPct;
    return {
      name: fund.name,
      allocationPct: fund.allocationPct,
      amount,
      estimatedRate: fund.estimatedRate,
      isGuaranteed: fund.isGuaranteed,
      ogaCommission: amount * fund.ogaCommissionPct,
      processorCommission: amount * fund.processor95Pct,
      regionalCommission: amount * fund.regionalPct,
    };
  });

  const totalGuaranteed = lines
    .filter((l) => l.isGuaranteed)
    .reduce((sum, l) => sum + l.amount, 0);

  const totalNonGuaranteed = lines
    .filter((l) => !l.isGuaranteed)
    .reduce((sum, l) => sum + l.amount, 0);

  const weightedReturn = lines.reduce(
    (sum, l) => sum + l.allocationPct * l.estimatedRate,
    0
  );

  const totalOgaCommission = lines.reduce((sum, l) => sum + l.ogaCommission, 0);
  const totalProcessorCommission = lines.reduce(
    (sum, l) => sum + l.processorCommission,
    0
  );
  const totalRegionalCommission = lines.reduce(
    (sum, l) => sum + l.regionalCommission,
    0
  );

  return {
    lines,
    totalGuaranteed,
    totalNonGuaranteed,
    weightedReturn,
    totalOgaCommission,
    totalProcessorCommission,
    totalRegionalCommission,
  };
}
