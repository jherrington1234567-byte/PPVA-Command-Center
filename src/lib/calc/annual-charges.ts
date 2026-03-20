import { DealInputs, AnnualChargesResult } from "./types";

export function calculateAnnualCharges(
  fundValue: number,
  inputs: DealInputs
): AnnualChargesResult {
  const advantageMeFee = fundValue * inputs.advantageMePct;
  const investmentAdvisorFee = fundValue * inputs.investmentAdvisorPct;
  const inspiraCustodianFee = fundValue * inputs.inspiraCustodianPct;
  const moneyManagerFee = fundValue * inputs.moneyManagerPct;
  const totalAnnualCharge = advantageMeFee + investmentAdvisorFee + inspiraCustodianFee + moneyManagerFee;
  const totalAnnualChargePct = fundValue > 0 ? totalAnnualCharge / fundValue : 0;

  return {
    advantageMeFee,
    investmentAdvisorFee,
    inspiraCustodianFee,
    moneyManagerFee,
    totalAnnualCharge,
    totalAnnualChargePct,
  };
}
