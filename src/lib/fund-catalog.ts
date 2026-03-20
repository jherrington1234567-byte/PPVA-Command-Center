/**
 * Fund Catalog — seeded from Crystal Capital Partners portfolio proposal
 * and SALI Investment Options.  Advisors can also add custom funds.
 */

export type FundSource = "crystal" | "sali" | "custom";
export type FundStrategy =
  | "Hedge Fund"
  | "Private Equity"
  | "Private Credit"
  | "Real Estate"
  | "Fixed Income"
  | "Managed Futures"
  | "Multi-Strategy"
  | "Venture Capital"
  | "Life Settlements"
  | "Mezzanine"
  | "Wealth Management"
  | "Other";

export interface CatalogFund {
  id: string;
  name: string;
  firmName: string;
  source: FundSource;
  strategy: FundStrategy;
  expectedReturn: number;       // decimal e.g. 0.12
  historicalVolatility: number;  // decimal e.g. 0.08
  managementFeePct: number;     // decimal e.g. 0.02
  performanceFeePct: number;    // decimal e.g. 0.20
  minimumInvestment: number;
  lockupMonths: number;
  lifeSettlements: boolean;
  mezzanine: boolean;
  description: string;
}

// ─── Crystal Capital Partners — from Detailed Portfolio Proposal ───
export const CRYSTAL_FUNDS: CatalogFund[] = [
  {
    id: "crystal-millennium",
    name: "Millennium Fund",
    firmName: "Millennium Management",
    source: "crystal",
    strategy: "Multi-Strategy",
    expectedReturn: 0.128,
    historicalVolatility: 0.045,
    managementFeePct: 0.02,
    performanceFeePct: 0.20,
    minimumInvestment: 500_000,
    lockupMonths: 12,
    lifeSettlements: false,
    mezzanine: false,
    description: "Multi-strategy platform with 300+ trading teams across equities, fixed income, commodities, and quantitative strategies.",
  },
  {
    id: "crystal-balyasny",
    name: "Balyasny Atlas Global Enhanced Fund",
    firmName: "Balyasny Asset Management",
    source: "crystal",
    strategy: "Multi-Strategy",
    expectedReturn: 0.115,
    historicalVolatility: 0.055,
    managementFeePct: 0.02,
    performanceFeePct: 0.20,
    minimumInvestment: 500_000,
    lockupMonths: 12,
    lifeSettlements: false,
    mezzanine: false,
    description: "Fundamental equity, macro, and quantitative strategies across global markets with robust risk management framework.",
  },
  {
    id: "crystal-coatue",
    name: "Coatue Qualified Partners Fund",
    firmName: "Coatue Management",
    source: "crystal",
    strategy: "Hedge Fund",
    expectedReturn: 0.142,
    historicalVolatility: 0.12,
    managementFeePct: 0.02,
    performanceFeePct: 0.20,
    minimumInvestment: 1_000_000,
    lockupMonths: 12,
    lifeSettlements: false,
    mezzanine: false,
    description: "Technology-focused long/short equity fund with deep fundamental research across global technology, media, and telecom sectors.",
  },
  {
    id: "crystal-deshaw",
    name: "D.E. Shaw Lithic Fund",
    firmName: "D.E. Shaw & Co.",
    source: "crystal",
    strategy: "Multi-Strategy",
    expectedReturn: 0.108,
    historicalVolatility: 0.04,
    managementFeePct: 0.025,
    performanceFeePct: 0.25,
    minimumInvestment: 1_000_000,
    lockupMonths: 24,
    lifeSettlements: false,
    mezzanine: false,
    description: "Systematic and discretionary strategies across equities, fixed income, and commodities with quantitative risk controls.",
  },
  {
    id: "crystal-point72",
    name: "Point72 Turion Fund",
    firmName: "Point72 Asset Management",
    source: "crystal",
    strategy: "Hedge Fund",
    expectedReturn: 0.118,
    historicalVolatility: 0.065,
    managementFeePct: 0.02,
    performanceFeePct: 0.20,
    minimumInvestment: 1_000_000,
    lockupMonths: 12,
    lifeSettlements: false,
    mezzanine: false,
    description: "Fundamental long/short equity with quantitative overlay, deep sector specialization across healthcare, TMT, industrials, and consumer.",
  },
];

// ─── SALI Investment Options — from SALI Investment Options and Overview ───
function saliStrategy(focus: string, mezz: boolean, lifeSett: boolean): FundStrategy {
  if (lifeSett) return "Life Settlements";
  if (mezz) return "Mezzanine";
  const f = focus.toLowerCase();
  if (f.includes("real estate")) return "Real Estate";
  if (f.includes("private equity")) return "Private Equity";
  if (f.includes("private credit") || f.includes("credit investment")) return "Private Credit";
  if (f.includes("hedge fund") || f.includes("alternative investment")) return "Hedge Fund";
  if (f.includes("venture capital")) return "Venture Capital";
  if (f.includes("managed futures") || f.includes("futures")) return "Managed Futures";
  if (f.includes("fixed income") || f.includes("fixed-income")) return "Fixed Income";
  if (f.includes("wealth management") || f.includes("financial planning")) return "Wealth Management";
  if (f.includes("multi") || f.includes("various")) return "Multi-Strategy";
  return "Other";
}

interface SaliRow {
  firm: string;
  focus: string;
  lifeSettlements: boolean;
  mezzanine: boolean;
  summary: string;
}

const SALI_RAW: SaliRow[] = [
  { firm: "Allen Investment Management, LLC", focus: "Asset management, equity, and fixed-income investments", lifeSettlements: false, mezzanine: false, summary: "Asset management, equity, and fixed-income investments" },
  { firm: "AllianceBernstein, LP", focus: "Global investment management, various asset classes", lifeSettlements: false, mezzanine: false, summary: "Global investment management, various asset classes" },
  { firm: "Alpine Associates Management, Inc.", focus: "Value-oriented investment strategies, equity markets", lifeSettlements: false, mezzanine: false, summary: "Value-oriented investment strategies, equity markets" },
  { firm: "Apogem Capital, LLC", focus: "Private equity and credit investments, mezzanine debt", lifeSettlements: false, mezzanine: true, summary: "Private equity and credit investments, mezzanine debt" },
  { firm: "Arcadia Funds, LLC", focus: "Investment portfolios, equity and fixed-income securities", lifeSettlements: false, mezzanine: false, summary: "Investment portfolios, equity and fixed-income securities" },
  { firm: "Arena Investors, LP", focus: "Credit and real estate investments", lifeSettlements: false, mezzanine: false, summary: "Private equity and credit investments, real estate" },
  { firm: "Ares Management, LLC", focus: "Investment strategies in credit, private equity, and real estate", lifeSettlements: false, mezzanine: false, summary: "Private equity, credit, and real estate investments" },
  { firm: "Audax Management Company (NY), LLC", focus: "Private equity, middle market", lifeSettlements: false, mezzanine: false, summary: "Middle market private equity, private equity investments" },
  { firm: "A.W. Jones Advisors, LLC", focus: "Investment advisory, equity and fixed-income strategies", lifeSettlements: false, mezzanine: false, summary: "Equity and fixed-income strategies, investment advisory" },
  { firm: "Bain Capital, LP", focus: "Private investment firm, private equity, credit, and venture capital", lifeSettlements: false, mezzanine: false, summary: "Private equity, credit, and venture capital investments" },
  { firm: "Balentine, LLC", focus: "Wealth management, personalized portfolios", lifeSettlements: false, mezzanine: false, summary: "Wealth management, personalized portfolio solutions" },
  { firm: "Bernstein Private Wealth Management", focus: "Comprehensive wealth management, investment advisory", lifeSettlements: false, mezzanine: false, summary: "Comprehensive wealth management, investment advisory" },
  { firm: "Bessemer Trust Company, N.A.", focus: "Investment management, fiduciary services", lifeSettlements: false, mezzanine: false, summary: "Investment management, fiduciary services, wealth advisory" },
  { firm: "BentallGreenOak Strategic Capital Partners, LLC", focus: "Real estate investment management", lifeSettlements: false, mezzanine: false, summary: "Real estate investment management, equity, and debt strategies" },
  { firm: "Bienville Capital Management, LLC", focus: "Investment advisory, equity markets", lifeSettlements: false, mezzanine: false, summary: "Long-term equity strategies and growth-focused investments" },
  { firm: "BlackRock Financial Management, Inc.", focus: "Global asset management, credit and private equity", lifeSettlements: false, mezzanine: false, summary: "Global asset management, private equity, and credit" },
  { firm: "Blackstone ISG II Advisors, LLC", focus: "Investment advisory services, various asset classes", lifeSettlements: false, mezzanine: false, summary: "Comprehensive investment advisory services, equity, and fixed income" },
  { firm: "BluePointe Capital Management, LLC", focus: "Investment advisory services, portfolio management", lifeSettlements: false, mezzanine: false, summary: "Alternative investment solutions, credit, and equity markets" },
  { firm: "BMO Family Office", focus: "Wealth management and investment services", lifeSettlements: false, mezzanine: false, summary: "Wealth management and investment advisory services" },
  { firm: "Boothbay Fund Management, LLC", focus: "Alternative investment strategies, credit and equity", lifeSettlements: false, mezzanine: false, summary: "Private equity, real estate, credit investments, and wealth management" },
  { firm: "Bowie Capital Management, LLC", focus: "Investment advisory, equity and fixed-income strategies", lifeSettlements: false, mezzanine: false, summary: "Alternative investment strategies, real estate, credit" },
  { firm: "Brookfield Asset Management Private Institutional Capital Adviser (Credit), LLC", focus: "Credit division, mezzanine financing", lifeSettlements: false, mezzanine: true, summary: "Private equity, lower-middle-market companies, and growth investments" },
  { firm: "Brown Brothers Harriman & Co.", focus: "Investment management, private banking", lifeSettlements: false, mezzanine: false, summary: "Private equity, hedge funds, and diversified alternatives" },
  { firm: "CAPTRUST Financial Advisors", focus: "Wealth management, retirement plan advisory", lifeSettlements: false, mezzanine: false, summary: "Investment advisory services with a focus on alternatives" },
  { firm: "Carlyle IDF Management, LLC", focus: "Insurance dedicated fund management", lifeSettlements: false, mezzanine: true, summary: "Credit investments, mezzanine debt, and structured credit" },
  { firm: "CAZ Investments, LP", focus: "Private equity and credit investments", lifeSettlements: false, mezzanine: false, summary: "Equity, fixed income, and alternative investment advisory" },
  { firm: "Chalkstream Capital Group, LP", focus: "Alternative investment strategies, private equity and credit", lifeSettlements: false, mezzanine: false, summary: "Managed futures, alternative investment strategies, and portfolio management" },
  { firm: "Checchi Capital Advisers, LLC", focus: "Wealth management and investment advisory services", lifeSettlements: false, mezzanine: false, summary: "Private equity, real estate, and credit, including IDFs" },
  { firm: "Clarion Partners, LLC", focus: "Real estate investments, equity and debt strategies", lifeSettlements: false, mezzanine: false, summary: "Alternative investments, private equity, hedge funds, and structured products" },
  { firm: "Clarion Capital Partners, LLC", focus: "Private equity, lower-middle-market companies", lifeSettlements: false, mezzanine: false, summary: "Institutional investment management, credit, and private equity" },
  { firm: "Commonfund Capital, Inc.", focus: "Alternative investments, private equity and hedge funds", lifeSettlements: false, mezzanine: false, summary: "Alternative investment strategies in hedge funds and private equity" },
  { firm: "Corient Capital Partners, LLC", focus: "Investment advisory services, credit and equity markets", lifeSettlements: false, mezzanine: false, summary: "Real estate, private equity, and credit investments" },
  { firm: "Covenant Multi Family Offices, LLC", focus: "Wealth management services", lifeSettlements: false, mezzanine: true, summary: "Private debt, mezzanine finance, and direct lending" },
  { firm: "Crescent Capital Group, LP", focus: "Credit investments, mezzanine debt and private loans", lifeSettlements: false, mezzanine: true, summary: "Private debt and mezzanine finance, opportunistic credit strategies" },
  { firm: "Chilton Investment Services, LLC", focus: "Wealth management, equity and fixed-income markets", lifeSettlements: false, mezzanine: false, summary: "Private equity, debt investments, and corporate lending" },
  { firm: "DUNN Capital Management, LLC", focus: "Alternative investment strategies, managed futures", lifeSettlements: false, mezzanine: true, summary: "Private equity, mezzanine financing, and credit-focused funds" },
  { firm: "Durbin Bennett Private Wealth Management", focus: "Wealth management and financial planning", lifeSettlements: false, mezzanine: true, summary: "Private debt, mezzanine finance, and real estate investments" },
  { firm: "EnTrust Global Partners Offshore, LP", focus: "Private equity, credit, and real estate", lifeSettlements: false, mezzanine: false, summary: "Private debt and credit-focused investment strategies, hedge funds" },
  { firm: "Evercore Wealth Management, LLC", focus: "Investment management and advisory services", lifeSettlements: false, mezzanine: false, summary: "Private equity, real estate, and infrastructure investments" },
  { firm: "Forester Capital, LLC", focus: "Alternative investments, credit and private equity", lifeSettlements: false, mezzanine: false, summary: "Institutional investment management, private equity, and credit" },
  { firm: "Galaxy Investment Management, LLC", focus: "Asset management, diverse portfolio of alternative assets", lifeSettlements: false, mezzanine: false, summary: "Institutional investment advisory, private equity, and real estate" },
  { firm: "GC Advisors, LLC", focus: "Investment advisory services, alternative investments", lifeSettlements: false, mezzanine: false, summary: "Private equity, infrastructure, and credit-focused investments" },
  { firm: "GoldenTree Asset Management, LP", focus: "Credit and fixed-income investments, mezzanine debt", lifeSettlements: false, mezzanine: true, summary: "Wealth management, alternative assets, and customized portfolio solutions" },
  { firm: "Goldman Sachs Asset Management, LP", focus: "Global investment management, various asset classes", lifeSettlements: false, mezzanine: true, summary: "Private debt, mezzanine finance, and corporate credit" },
  { firm: "Gresham Investment Management, LLC", focus: "Fixed income and equity strategies", lifeSettlements: false, mezzanine: false, summary: "Private equity, credit, and alternative asset management" },
  { firm: "Hamilton Lane Advisors, LLC", focus: "Private markets investment management", lifeSettlements: false, mezzanine: true, summary: "Mezzanine debt, private equity, and credit-focused strategies" },
  { firm: "HPS Investment Partners, LLC", focus: "Alternative investments, mezzanine debt and private equity", lifeSettlements: false, mezzanine: true, summary: "Private credit, mezzanine financing, and equity investments" },
  { firm: "Hudson Bay Capital Management, LP", focus: "Hedge fund strategies, credit and equity markets", lifeSettlements: false, mezzanine: true, summary: "Distressed debt, private equity, and mezzanine finance" },
  { firm: "Integrity Financial Corporation", focus: "Wealth management and financial advisory services", lifeSettlements: false, mezzanine: false, summary: "Alternative investments in asset-backed securities and structured finance" },
  { firm: "Ironwood Capital Management", focus: "Investment advisory, growth strategies", lifeSettlements: false, mezzanine: false, summary: "Private equity, alternative investments, and wealth management" },
  { firm: "Kaleidoscope Capital, LP", focus: "Investment solutions, alternative assets", lifeSettlements: false, mezzanine: false, summary: "Alternative investments, private equity, and hedge fund strategies" },
  { firm: "Kintegral Asset Management", focus: "Investment management, alternative assets", lifeSettlements: false, mezzanine: true, summary: "Mezzanine finance, distressed debt, and credit investments" },
  { firm: "Kohlberg Kravis Roberts & Co., Inc.", focus: "Private equity, credit, and real estate", lifeSettlements: false, mezzanine: false, summary: "Alternative investments in energy and natural resources" },
  { firm: "Kore Advisors, LP", focus: "Alternative investments, private equity and real estate", lifeSettlements: false, mezzanine: false, summary: "Private equity, growth-focused investments, and direct lending" },
  { firm: "Kynikos Associates, LP", focus: "Hedge fund strategies, equity and credit markets", lifeSettlements: false, mezzanine: false, summary: "Global equity and credit investment strategies" },
  { firm: "Landmark Equity Advisors, LLC", focus: "Equity investments, long-term capital growth", lifeSettlements: false, mezzanine: false, summary: "Real estate-focused equity investments and credit strategies" },
  { firm: "Luxor Capital Group, LP", focus: "Alternative asset management", lifeSettlements: false, mezzanine: false, summary: "Private equity, venture capital, and high-growth startups" },
  { firm: "Magnitude Capital, LLC", focus: "Alternative investment strategies", lifeSettlements: false, mezzanine: false, summary: "Private equity, credit markets, and distressed assets" },
  { firm: "M Financial Asset Management, Inc.", focus: "Wealth management services, insurance solutions", lifeSettlements: false, mezzanine: false, summary: "Hedge funds and alternative credit strategies" },
  { firm: "Main Management, LLC", focus: "Investment advisory services, equity strategies", lifeSettlements: false, mezzanine: true, summary: "Mezzanine debt and structured credit investments" },
  { firm: "Main Street Advisors, Inc.", focus: "Financial planning and wealth management", lifeSettlements: false, mezzanine: false, summary: "Real estate, equity investments, and credit solutions" },
  { firm: "MGG Investment Group, LP", focus: "Private debt and mezzanine finance investments", lifeSettlements: false, mezzanine: true, summary: "Private equity, infrastructure, and operational-focused funds" },
  { firm: "Monroe Capital Management Advisors, LLC", focus: "Private credit and equity investments, mezzanine debt", lifeSettlements: false, mezzanine: true, summary: "Private credit, debt restructuring, and distressed opportunities" },
  { firm: "Morgan Stanley Investment Management", focus: "Global investment management, various asset classes", lifeSettlements: false, mezzanine: false, summary: "Alternative investment opportunities in emerging markets" },
  { firm: "Mount Lucas Management, LP", focus: "Alternative investment strategies, futures and commodity trading", lifeSettlements: false, mezzanine: true, summary: "Direct lending, private debt, and mezzanine capital solutions" },
  { firm: "Neuberger Berman", focus: "Asset management services, private equity and credit", lifeSettlements: false, mezzanine: false, summary: "Equity and fixed income investments, wealth management" },
  { firm: "Newbrook Capital Advisors, LP", focus: "Private equity and credit investments", lifeSettlements: false, mezzanine: false, summary: "Diversified credit and equity portfolios for institutional clients" },
  { firm: "Oaktree Capital Management, L.P.", focus: "Credit and alternative investments, mezzanine finance", lifeSettlements: false, mezzanine: true, summary: "Venture capital, private equity, and international investments" },
  { firm: "Pacific Alternative Asset Management Company, LLC", focus: "Alternative investment strategies, private equity and credit", lifeSettlements: false, mezzanine: false, summary: "Private debt solutions for institutional and high-net-worth investors" },
  { firm: "Partners Capital Investment Group, LLC", focus: "Institutional investment management, alternative assets", lifeSettlements: false, mezzanine: false, summary: "Structured investment solutions for emerging market opportunities" },
  { firm: "Partners Group (USA), Inc.", focus: "Private equity, infrastructure, and credit", lifeSettlements: false, mezzanine: false, summary: "Credit markets, asset-backed securities, and structured finance" },
  { firm: "Phoenix Investment Adviser, LLC", focus: "Asset management and financial planning services", lifeSettlements: false, mezzanine: false, summary: "Equity and debt investments in energy and natural resource sectors" },
  { firm: "PineBridge Investments, LLC", focus: "Investment management across various asset classes, mezzanine finance", lifeSettlements: false, mezzanine: true, summary: "Private equity and asset management strategies for high-net-worth clients" },
  { firm: "Pine River Capital Management, LP", focus: "Alternative investments, credit strategies", lifeSettlements: false, mezzanine: true, summary: "Growth capital, mezzanine financing, and special situations investments" },
  { firm: "Proficio Capital Partners, LLC", focus: "Investment advisory services, alternative investments", lifeSettlements: false, mezzanine: false, summary: "Comprehensive alternative investment solutions for institutional clients" },
  { firm: "Provenio Capital Management, Inc.", focus: "Global investment strategies, private equity and credit", lifeSettlements: false, mezzanine: false, summary: "Asset management, equity, and fixed-income investments" },
  { firm: "Quantedge Capital Pte. Ltd.", focus: "Global hedge fund, alternative investment strategies", lifeSettlements: false, mezzanine: false, summary: "Global investment management, various asset classes" },
  { firm: "Rand Advisors, LLC", focus: "Wealth management and investment advisory services", lifeSettlements: false, mezzanine: false, summary: "Value-oriented investment strategies, equity markets" },
  { firm: "Revere Capital Management, LLC", focus: "Credit investments, mezzanine finance", lifeSettlements: false, mezzanine: true, summary: "Private equity and credit investments, mezzanine debt" },
  { firm: "SCS Capital Management, LLC", focus: "Alternative investment strategies, private equity and credit", lifeSettlements: false, mezzanine: false, summary: "Investment portfolios, equity and fixed-income securities" },
  { firm: "Seven Bridges Advisors, LLC", focus: "Wealth management services", lifeSettlements: false, mezzanine: false, summary: "Private equity and credit investments, real estate" },
  { firm: "Seven Post Investment Office, LP", focus: "Alternative investment strategies", lifeSettlements: false, mezzanine: false, summary: "Private equity, credit, and real estate investments" },
  { firm: "Shenkman Capital Management, Inc.", focus: "Investment management across various asset classes", lifeSettlements: false, mezzanine: false, summary: "Middle market private equity, private equity investments" },
  { firm: "Solus Alternative Asset Management, LP", focus: "Distressed debt and credit investments, mezzanine finance", lifeSettlements: false, mezzanine: true, summary: "Equity and fixed-income strategies, investment advisory" },
  { firm: "The Commerce Trust Company", focus: "Wealth management services", lifeSettlements: false, mezzanine: false, summary: "Private equity, credit, and venture capital investments" },
  { firm: "Tolleson Private Wealth Management, LP", focus: "Wealth management services", lifeSettlements: false, mezzanine: false, summary: "Wealth management, personalized portfolio solutions" },
  { firm: "Value Monitoring, Inc.", focus: "Investment monitoring and analysis services", lifeSettlements: false, mezzanine: false, summary: "Comprehensive wealth management, investment advisory" },
  { firm: "Vector Capital Management, LP", focus: "Investment advisory services, alternative assets", lifeSettlements: false, mezzanine: false, summary: "Investment management, fiduciary services, wealth advisory" },
  { firm: "Vida Capital Management, LLC", focus: "Life settlements, managing life insurance portfolios", lifeSettlements: true, mezzanine: false, summary: "Real estate investment management, equity, and debt strategies" },
  { firm: "Vontobel Asset Management, Inc.", focus: "Asset management across equities and fixed income", lifeSettlements: false, mezzanine: false, summary: "Long-term equity strategies and growth-focused investments" },
  { firm: "801 West Capital Management, LLC", focus: "Wealth management and investment advisory services", lifeSettlements: false, mezzanine: false, summary: "Global asset management, private equity, and credit" },
  { firm: "Western Asset Management Company", focus: "Fixed-income investment strategies", lifeSettlements: false, mezzanine: false, summary: "Comprehensive investment advisory services, equity, and fixed income" },
  { firm: "Worth Venture Partners, LLC", focus: "Venture capital and private equity", lifeSettlements: false, mezzanine: false, summary: "Alternative investment solutions, credit, and equity markets" },
  { firm: "York Managed Holdings, LLC", focus: "Asset management, alternative investments", lifeSettlements: false, mezzanine: false, summary: "Wealth management and investment advisory services" },
  { firm: "Yukon Partners Management, LLC", focus: "Private equity and mezzanine financing", lifeSettlements: false, mezzanine: true, summary: "Private equity, real estate, credit investments, and wealth management" },
];

export const SALI_FUNDS: CatalogFund[] = SALI_RAW.map((row, i) => ({
  id: `sali-${i}`,
  name: row.firm.replace(/, (LLC|LP|Inc\.|L\.P\.|N\.A\.|Pte\. Ltd\.)$/i, ""),
  firmName: row.firm,
  source: "sali" as FundSource,
  strategy: saliStrategy(row.focus, row.mezzanine, row.lifeSettlements),
  expectedReturn: 0,          // Not provided in SALI data — advisor enters
  historicalVolatility: 0,    // Not provided — advisor enters
  managementFeePct: 0,        // Not provided — advisor enters
  performanceFeePct: 0,       // Not provided — advisor enters
  minimumInvestment: 0,
  lockupMonths: 0,
  lifeSettlements: row.lifeSettlements,
  mezzanine: row.mezzanine,
  description: row.summary,
}));

/** All seeded catalog funds */
export const FUND_CATALOG: CatalogFund[] = [...CRYSTAL_FUNDS, ...SALI_FUNDS];

/** Strategy options for filtering */
export const ALL_STRATEGIES: FundStrategy[] = [
  "Hedge Fund",
  "Multi-Strategy",
  "Private Equity",
  "Private Credit",
  "Real Estate",
  "Fixed Income",
  "Managed Futures",
  "Venture Capital",
  "Life Settlements",
  "Mezzanine",
  "Wealth Management",
  "Other",
];

/** Create a blank custom fund */
export function createCustomFund(name: string): CatalogFund {
  return {
    id: `custom-${Date.now()}`,
    name,
    firmName: name,
    source: "custom",
    strategy: "Other",
    expectedReturn: 0.08,
    historicalVolatility: 0.10,
    managementFeePct: 0.02,
    performanceFeePct: 0.20,
    minimumInvestment: 0,
    lockupMonths: 0,
    lifeSettlements: false,
    mezzanine: false,
    description: "Custom fund entered by advisor",
  };
}

/** A selected fund in the portfolio with allocation */
export interface PortfolioFund {
  catalogFund: CatalogFund;
  allocationPct: number; // decimal, e.g. 0.25 = 25%
}

/** Calculate blended portfolio metrics */
export function calculatePortfolioMetrics(funds: PortfolioFund[]) {
  const totalAlloc = funds.reduce((s, f) => s + f.allocationPct, 0);

  if (totalAlloc === 0 || funds.length === 0) {
    return {
      totalAllocation: 0,
      blendedReturn: 0,
      blendedVolatility: 0,
      blendedMgmtFee: 0,
      sharpeRatio: null as number | null,
      fundCount: 0,
    };
  }

  const blendedReturn = funds.reduce(
    (s, f) => s + f.catalogFund.expectedReturn * (f.allocationPct / totalAlloc),
    0
  );
  const blendedVolatility = funds.reduce(
    (s, f) => s + f.catalogFund.historicalVolatility * (f.allocationPct / totalAlloc),
    0
  );
  const blendedMgmtFee = funds.reduce(
    (s, f) => s + f.catalogFund.managementFeePct * (f.allocationPct / totalAlloc),
    0
  );

  const riskFreeRate = 0.04; // approximate
  const sharpeRatio =
    blendedVolatility > 0
      ? (blendedReturn - riskFreeRate) / blendedVolatility
      : null;

  return {
    totalAllocation: totalAlloc,
    blendedReturn,
    blendedVolatility,
    blendedMgmtFee,
    sharpeRatio,
    fundCount: funds.length,
  };
}
