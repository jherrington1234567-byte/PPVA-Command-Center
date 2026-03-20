import { DealInputs, WaterfallResult } from "./types";

export function calculateWaterfall(inputs: DealInputs): WaterfallResult {
  const { totalDeposit } = inputs;

  // Step 1: Premium loads from total deposit
  const grossPremiumLoad = totalDeposit * inputs.premiumLoadPct;
  const threeCStructuresAmount = totalDeposit * inputs.threeCStructuresLoadPct;

  // Step 2: Holdbacks from premium load
  const netAfterThreeC = grossPremiumLoad - threeCStructuresAmount;
  const syndicatedHoldback = netAfterThreeC * inputs.syndicatedHoldbackPct;
  const netToStephen = netAfterThreeC - syndicatedHoldback;
  const pbInvestmentHoldback = netToStephen * inputs.pbInvestmentHoldbackPct;
  const netToPBWR = netToStephen - pbInvestmentHoldback;

  // Step 3: PBWR / Ohana split
  const pbwrShare = netToPBWR * inputs.pbwrSplitPct;
  const ohanaShare = netToPBWR * (1 - inputs.pbwrSplitPct);

  // Step 4: Admin and bank fees deducted from deposit
  const adminFees = inputs.advantageAdminFee;
  const miscFees = inputs.miscFees;

  // Net to fund = total deposit minus all loads and fees
  const totalFeesAndLoads = grossPremiumLoad + threeCStructuresAmount + adminFees + miscFees;
  const netToFund = totalDeposit - grossPremiumLoad - threeCStructuresAmount - adminFees - miscFees;

  return {
    totalDeposit,
    grossPremiumLoad,
    threeCStructuresAmount,
    netAfterThreeC,
    syndicatedHoldback,
    netToStephen,
    pbInvestmentHoldback,
    netToPBWR,
    pbwrShare,
    ohanaShare,
    adminFees,
    miscFees,
    totalFeesAndLoads,
    netToFund,
  };
}
