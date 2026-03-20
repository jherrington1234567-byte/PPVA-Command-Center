import { AnnualChargesResult } from "./types";

export function calculateAnnualCharges(
  fundValue: number,
  advantageFeeBps: number,
  threeCStructuresAnnualPct: number,
  meChargePct: number
): AnnualChargesResult {
  const advantageFee = fundValue * (advantageFeeBps / 10000);
  const threeCStructuresFee = fundValue * threeCStructuresAnnualPct;
  const meFee = fundValue * meChargePct;
  const totalAnnualCharge = advantageFee + threeCStructuresFee + meFee;
  const totalAnnualChargePct = fundValue > 0 ? totalAnnualCharge / fundValue : 0;

  return {
    advantageFee,
    threeCStructuresFee,
    meFee,
    totalAnnualCharge,
    totalAnnualChargePct,
  };
}
