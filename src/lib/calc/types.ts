export interface FundProduct {
  name: string;
  allocationPct: number;
  estimatedRate: number;
  isGuaranteed: boolean;
  ogaCommissionPct: number;
  processor95Pct: number;
  regionalPct: number;
}

export interface DealInputs {
  // Policy basics
  policyOwner: string;
  policyIssueDate: string;
  totalDeposit: number;

  // Premium load structure
  premiumLoadPct: number;
  threeCStructuresLoadPct: number;
  syndicatedHoldbackPct: number;
  pbInvestmentHoldbackPct: number;
  pbwrSplitPct: number;
  advantageAdminFee: number;
  miscFees: number;

  // Fund allocations
  fundAllocations: FundProduct[];

  // Annual charges
  advantageFeeBps: number;
  threeCStructuresAnnualPct: number;
  meChargePct: number;

  // Client demographics
  clientAge: number;
  clientGender: "M" | "F";
  currentCSV: number;
  costBasis: number;
  csvGrowthRate: number;
  japaneseTaxRate: number;
  jpyUsdRate: number;

  // Projection settings
  projectionYears: number;
  illustratedRates: [number, number, number];
}

export interface WaterfallResult {
  totalDeposit: number;
  grossPremiumLoad: number;
  threeCStructuresAmount: number;
  netAfterThreeC: number;
  syndicatedHoldback: number;
  netToStephen: number;
  pbInvestmentHoldback: number;
  netToPBWR: number;
  pbwrShare: number;
  ohanaShare: number;
  adminFees: number;
  miscFees: number;
  totalFeesAndLoads: number;
  netToFund: number;
}

export interface FundAllocationLine {
  name: string;
  allocationPct: number;
  amount: number;
  estimatedRate: number;
  isGuaranteed: boolean;
  ogaCommission: number;
  processorCommission: number;
  regionalCommission: number;
}

export interface FundAllocationResult {
  lines: FundAllocationLine[];
  totalGuaranteed: number;
  totalNonGuaranteed: number;
  weightedReturn: number;
  totalOgaCommission: number;
  totalProcessorCommission: number;
  totalRegionalCommission: number;
}

export interface AnnualChargesResult {
  advantageFee: number;
  threeCStructuresFee: number;
  meFee: number;
  totalAnnualCharge: number;
  totalAnnualChargePct: number;
}

export interface CarrierIllustrationYear {
  year: number;
  age: number;
  fundValueLow: number;
  fundValueMid: number;
  fundValueHigh: number;
  surrenderValueLow: number;
  surrenderValueMid: number;
  surrenderValueHigh: number;
  deathBenefitLow: number;
  deathBenefitMid: number;
  deathBenefitHigh: number;
  annualFeesDeducted: number;
}

export interface TaxImpactYear {
  year: number;
  age: number;
  existingCSV: number;
  existingGain: number;
  taxWithoutPPVA: number;
  ppvaFundValue: number;
  ppvaSurrenderValue: number;
  combinedCSVJpy: number;
  combinedGainJpy: number;
}

export interface TaxImpactResult {
  years: TaxImpactYear[];
  totalTaxSaved: number;
  totalTaxSavedJpy: number;
}

export interface DealSummary {
  totalDeposit: number;
  netToFund: number;
  loadPct: number;
  weightedReturn: number;
  totalFirstYearCommissions: number;
  projectedValue10Yr: number;
  projectedValue20Yr: number;
}

export interface DealResult {
  waterfall: WaterfallResult;
  fundAllocation: FundAllocationResult;
  annualCharges: AnnualChargesResult;
  carrierIllustration: CarrierIllustrationYear[];
  taxImpact: TaxImpactResult;
  summary: DealSummary;
}
