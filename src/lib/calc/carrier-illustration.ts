import { DealInputs, CarrierIllustrationYear } from "./types";

const INFLATION_RATE = 0.03;

export function calculateCarrierIllustration(
  netToFund: number,
  inputs: DealInputs
): CarrierIllustrationYear[] {
  const { projectionYears, illustratedRates, clientAge } = inputs;
  const [rateLow, rateMid, rateHigh] = illustratedRates;
  const annualFeePct =
    inputs.advantageFeeBps / 10000 +
    inputs.threeCStructuresAnnualPct +
    inputs.meChargePct;
  const baseAdminFee = inputs.advantageAdminFee;

  const years: CarrierIllustrationYear[] = [];

  let prevLow = netToFund;
  let prevMid = netToFund;
  let prevHigh = netToFund;

  for (let y = 1; y <= projectionYears; y++) {
    const adminFeeThisYear = baseAdminFee * Math.pow(1 + INFLATION_RATE, y - 1);

    // Deduct fees from prior year value, then grow
    const afterFeesLow = Math.max(0, prevLow - prevLow * annualFeePct - adminFeeThisYear);
    const afterFeesMid = Math.max(0, prevMid - prevMid * annualFeePct - adminFeeThisYear);
    const afterFeesHigh = Math.max(0, prevHigh - prevHigh * annualFeePct - adminFeeThisYear);

    const fundValueLow = afterFeesLow * (1 + rateLow);
    const fundValueMid = afterFeesMid * (1 + rateMid);
    const fundValueHigh = afterFeesHigh * (1 + rateHigh);

    // Surrender value = fund value (no surrender charge schedule modeled in Sprint 1)
    const surrenderValueLow = fundValueLow;
    const surrenderValueMid = fundValueMid;
    const surrenderValueHigh = fundValueHigh;

    // Death benefit = max of fund value and net deposit
    const deathBenefitLow = Math.max(fundValueLow, netToFund);
    const deathBenefitMid = Math.max(fundValueMid, netToFund);
    const deathBenefitHigh = Math.max(fundValueHigh, netToFund);

    const annualFeesDeducted =
      prevMid * annualFeePct + adminFeeThisYear;

    years.push({
      year: y,
      age: clientAge + y,
      fundValueLow,
      fundValueMid,
      fundValueHigh,
      surrenderValueLow,
      surrenderValueMid,
      surrenderValueHigh,
      deathBenefitLow,
      deathBenefitMid,
      deathBenefitHigh,
      annualFeesDeducted,
    });

    prevLow = fundValueLow;
    prevMid = fundValueMid;
    prevHigh = fundValueHigh;
  }

  return years;
}
