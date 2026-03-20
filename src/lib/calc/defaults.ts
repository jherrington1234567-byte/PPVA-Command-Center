import { DealInputs, FundProduct } from "./types";

export const DEFAULT_FUND_PRODUCTS: FundProduct[] = [
  {
    name: "Intl Fixed Rate Plan Plus",
    allocationPct: 0.40,
    estimatedRate: 0.058,
    isGuaranteed: true,
    ogaCommissionPct: 0.02,
    processor95Pct: 0.019,
    regionalPct: 0.005,
  },
  {
    name: "Intl Fixed Rate Plan",
    allocationPct: 0.20,
    estimatedRate: 0.056,
    isGuaranteed: true,
    ogaCommissionPct: 0.02,
    processor95Pct: 0.019,
    regionalPct: 0.005,
  },
  {
    name: "US 5-Year FIA (AmFirst/Trailhead)",
    allocationPct: 0.15,
    estimatedRate: 0.0515,
    isGuaranteed: true,
    ogaCommissionPct: 0.02,
    processor95Pct: 0.019,
    regionalPct: 0.005,
  },
  {
    name: "AAIDX Alt Income",
    allocationPct: 0.10,
    estimatedRate: 0.07,
    isGuaranteed: false,
    ogaCommissionPct: 0,
    processor95Pct: 0,
    regionalPct: 0,
  },
  {
    name: "ACRE III CRE Fund",
    allocationPct: 0.10,
    estimatedRate: 0.12,
    isGuaranteed: false,
    ogaCommissionPct: 0,
    processor95Pct: 0,
    regionalPct: 0,
  },
  {
    name: "Cash Liquidity",
    allocationPct: 0.05,
    estimatedRate: 0.03,
    isGuaranteed: false,
    ogaCommissionPct: 0,
    processor95Pct: 0,
    regionalPct: 0,
  },
];

export const DEFAULT_DEAL_INPUTS: DealInputs = {
  policyOwner: "",
  policyIssueDate: new Date().toISOString().slice(0, 10),
  totalDeposit: 5_000_000,

  premiumLoadPct: 0.06,
  threeCStructuresLoadPct: 0.01,
  syndicatedHoldbackPct: 0.05,
  pbInvestmentHoldbackPct: 0.05,
  pbwrSplitPct: 0.50,
  advantageAdminFee: 19_500,
  miscFees: 1_500,

  fundAllocations: DEFAULT_FUND_PRODUCTS,

  advantageFeeBps: 15, // 15 bps = 0.15%
  threeCStructuresAnnualPct: 0.01,
  meChargePct: 0.0015, // 15 bps M&E

  clientAge: 50,
  clientGender: "M",
  currentCSV: 2_000_000,
  costBasis: 1_500_000,
  csvGrowthRate: 0.04,
  japaneseTaxRate: 0.2,
  jpyUsdRate: 150,

  projectionYears: 30,
  illustratedRates: [0.04, 0.06, 0.08],
};
