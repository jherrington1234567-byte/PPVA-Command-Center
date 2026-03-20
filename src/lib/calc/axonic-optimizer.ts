// Historical S&P 500 annual returns (2000-2024) from the Axonic illustrator
const SP500_RETURNS = [
  -0.0910, -0.1189, -0.2210, 0.2868, 0.1088, 0.0491, 0.1579, 0.0549,
  -0.3700, 0.2646, 0.1506, 0.0211, 0.1600, 0.3239, 0.1369, 0.0138,
  0.1196, 0.2183, -0.0438, 0.3149, 0.1840, 0.2871, -0.1811, 0.2623, 0.2502,
];

// Axonic product rates from the illustrator
export const AXONIC_PRODUCTS = {
  guaranteedFixed: { name: "Axonic Guaranteed Fixed", rate: 0.055, guaranteed: true, volatility: 0 },
  index: { name: "Axonic Index (0% floor / 10% cap)", rate: 0.068, guaranteed: false, volatility: 0.06 },
  portfolio: { name: "Axonic Portfolio Management", rate: 0.0825, guaranteed: false, volatility: 0.12 },
  otherPortfolio: { name: "Other Portfolio (Market)", rate: 0.09, guaranteed: false, volatility: 0.16 },
};

export interface AllocationScenario {
  name: string;
  guaranteedFixedPct: number;
  indexPct: number;
  portfolioPct: number;
  otherPct: number;
}

export interface ScenarioResult {
  scenario: AllocationScenario;
  blendedReturn: number;
  guaranteedFloor: number;
  blendedVolatility: number;
  sharpeRatio: number;
  historicalReturns: number[];
  worstYear: number;
  bestYear: number;
  yearsNegative: number;
  projectedValues: number[];
  finalValue: number;
  maxDrawdown: number;
}

const RISK_FREE_RATE = 0.04; // approximate for Sharpe calculation

function applyIndexFloorCap(marketReturn: number): number {
  return Math.max(0, Math.min(0.10, marketReturn));
}

export function analyzeScenario(
  scenario: AllocationScenario,
  premium: number,
  years: number
): ScenarioResult {
  const { guaranteedFixedPct, indexPct, portfolioPct, otherPct } = scenario;

  // Blended expected return
  const blendedReturn =
    guaranteedFixedPct * AXONIC_PRODUCTS.guaranteedFixed.rate +
    indexPct * AXONIC_PRODUCTS.index.rate +
    portfolioPct * AXONIC_PRODUCTS.portfolio.rate +
    otherPct * AXONIC_PRODUCTS.otherPortfolio.rate;

  // Guaranteed floor = guaranteed portion's contribution
  const guaranteedFloor = guaranteedFixedPct * AXONIC_PRODUCTS.guaranteedFixed.rate;

  // Blended volatility (guaranteed portion has zero vol)
  const blendedVolatility = Math.sqrt(
    Math.pow(indexPct * AXONIC_PRODUCTS.index.volatility, 2) +
    Math.pow(portfolioPct * AXONIC_PRODUCTS.portfolio.volatility, 2) +
    Math.pow(otherPct * AXONIC_PRODUCTS.otherPortfolio.volatility, 2)
  );

  // Sharpe ratio
  const sharpeRatio = blendedVolatility > 0
    ? (blendedReturn - RISK_FREE_RATE) / blendedVolatility
    : blendedReturn > RISK_FREE_RATE ? Infinity : 0;

  // Simulate historical returns through the portfolio blend
  const historicalReturns = SP500_RETURNS.map((spReturn) => {
    const guaranteedReturn = guaranteedFixedPct * 0.055; // always 5.5%
    const indexReturn = indexPct * applyIndexFloorCap(spReturn);
    const portfolioReturn = portfolioPct * (spReturn * 0.8 + 0.02); // ~80% market correlation + alpha
    const otherReturn = otherPct * spReturn;
    return guaranteedReturn + indexReturn + portfolioReturn + otherReturn;
  });

  const worstYear = Math.min(...historicalReturns);
  const bestYear = Math.max(...historicalReturns);
  const yearsNegative = historicalReturns.filter((r) => r < 0).length;

  // Max drawdown from historical
  let peak = 1;
  let maxDrawdown = 0;
  let cumulative = 1;
  for (const r of historicalReturns) {
    cumulative *= (1 + r);
    if (cumulative > peak) peak = cumulative;
    const drawdown = (peak - cumulative) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  // Project forward using blended return
  const projectedValues: number[] = [];
  let value = premium;
  for (let y = 0; y < years; y++) {
    value = value * (1 + blendedReturn);
    projectedValues.push(value);
  }

  return {
    scenario,
    blendedReturn,
    guaranteedFloor,
    blendedVolatility,
    sharpeRatio,
    historicalReturns,
    worstYear,
    bestYear,
    yearsNegative,
    projectedValues,
    finalValue: projectedValues[projectedValues.length - 1] ?? premium,
    maxDrawdown,
  };
}

export const PRESET_SCENARIOS: AllocationScenario[] = [
  { name: "100% Market", guaranteedFixedPct: 0, indexPct: 0, portfolioPct: 0, otherPct: 1.0 },
  { name: "20% Axonic Fixed + 80% Market", guaranteedFixedPct: 0.20, indexPct: 0, portfolioPct: 0, otherPct: 0.80 },
  { name: "40% Axonic Fixed + 60% Market", guaranteedFixedPct: 0.40, indexPct: 0, portfolioPct: 0, otherPct: 0.60 },
  { name: "Balanced Axonic (40/20/20/20)", guaranteedFixedPct: 0.40, indexPct: 0.20, portfolioPct: 0.20, otherPct: 0.20 },
  { name: "60% Axonic Fixed + 40% Market", guaranteedFixedPct: 0.60, indexPct: 0, portfolioPct: 0, otherPct: 0.40 },
  { name: "100% Axonic Fixed", guaranteedFixedPct: 1.0, indexPct: 0, portfolioPct: 0, otherPct: 0 },
];
