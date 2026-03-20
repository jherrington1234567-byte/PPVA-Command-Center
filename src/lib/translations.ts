/**
 * Japanese translations for Deal Workbench.
 * Language modes:
 *   "english"  → English only
 *   "japanese" → Japanese only
 *   "both"     → English + Japanese (bilingual)
 */

import { DealInputs } from "./calc/types";

type Lang = DealInputs["language"];

const dict = {
  // Page-level
  dealWorkbench: { en: "Deal Workbench", ja: "ディールワークベンチ" },
  dealWorkbenchDesc: {
    en: "Structure and analyze PPVA deals — Advantage Life Puerto Rico (ALPR)",
    ja: "PPVAディールの構成と分析 — Advantage Life Puerto Rico (ALPR)",
  },
  languageMode: { en: "Language Mode", ja: "言語モード" },

  // Tabs
  waterfall: { en: "Waterfall", ja: "ウォーターフォール" },
  fundAllocation: { en: "Fund Allocation", ja: "ファンド配分" },
  carrierIllustration: { en: "Generic Illustration", ja: "一般イラストレーション" },
  taxImpact: { en: "Tax Impact", ja: "税務インパクト" },

  // Summary cards
  totalDeposit: { en: "Total Deposit", ja: "預入総額" },
  netToFund: { en: "Net to Fund", ja: "ファンドへの純投入額" },
  totalLoad: { en: "Total Load", ja: "総ロード" },
  weightedReturn: { en: "Weighted Return", ja: "加重リターン" },
  year1Commissions: { en: "Year 1 Commissions", ja: "初年度手数料" },
  tenYearValueMid: { en: "10-Year Value (Mid)", ja: "10年後価値（中位）" },

  // Input panel sections
  policyInformation: { en: "Policy Information", ja: "保険契約情報" },
  policyOwner: { en: "Policy Owner", ja: "保険契約者" },
  entityNamePlaceholder: { en: "Entity name", ja: "法人名" },
  premiumStructure: { en: "Premium Structure", ja: "保険料構成" },
  premiumLoad: { en: "Premium Load", ja: "プレミアムロード" },
  threeCStructuresOneTime: { en: "3cStructures (one-time)", ja: "3cStructures（一回払い）" },
  syndicatedHoldback: { en: "B/D Holdback", ja: "B/Dホールドバック" },
  pbInvestmentHoldback: { en: "OSJ Holdback", ja: "OSJホールドバック" },
  pbwrSplit: { en: "PBWR Split", ja: "PBWRスプリット" },
  advantageAdminFee: { en: "Advantage Admin Fee", ja: "Advantage管理手数料" },
  miscFees: { en: "Misc Fees", ja: "その他手数料" },

  // Fund allocation
  allocation: { en: "Allocation", ja: "配分" },
  estRate: { en: "Est. Rate", ja: "予想利率" },
  guaranteed: { en: "Guaranteed", ja: "保証付き" },
  nonGuaranteed: { en: "Non-Guaranteed", ja: "非保証" },
  total: { en: "Total", ja: "合計" },

  // Annual charges
  annualCharges: { en: "Annual Charges", ja: "年間手数料" },
  advantageME: { en: "Advantage M&E", ja: "Advantage M&E" },
  investmentAdvisor: { en: "Investment Advisor", ja: "投資アドバイザー" },
  moneyManager: { en: "Money Manager", ja: "マネーマネージャー" },
  inspiraCustodian: { en: "Inspira Custodian", ja: "Inspiraカストディアン" },
  totalAnnualCharges: { en: "Total Annual Charges", ja: "年間手数料合計" },
  annualFundCharges: { en: "Annual Fund Charges", ja: "年間ファンド手数料" },
  recurringFees: {
    en: "Recurring fees deducted from fund value annually",
    ja: "ファンド価値から毎年控除される経常手数料",
  },
  feeType: { en: "Fee Type", ja: "手数料種別" },
  annualAmount: { en: "Annual Amount", ja: "年間金額" },
  rate: { en: "Rate", ja: "料率" },
  configurable: { en: "configurable", ja: "設定可" },

  // Client demographics
  clientDemographics: { en: "Client Demographics", ja: "顧客情報" },
  age: { en: "Age", ja: "年齢" },
  gender: { en: "Gender", ja: "性別" },
  male: { en: "Male", ja: "男性" },
  female: { en: "Female", ja: "女性" },
  currentCSV: { en: "Current CSV", ja: "現在の解約返戻金" },
  costBasis: { en: "Cost Basis", ja: "取得原価" },
  csvGrowthRate: { en: "CSV Growth Rate", ja: "解約返戻金成長率" },
  taxRateJapan: { en: "Tax Rate (Japan)", ja: "税率（日本）" },
  jpyUsdRate: { en: "JPY/USD Rate", ja: "円/ドルレート" },

  // Projection settings
  projectionSettings: { en: "Projection Settings", ja: "予測設定" },
  projectionYears: { en: "Projection Years", ja: "予測年数" },
  lowRate: { en: "Low Rate", ja: "低位利率" },
  midRate: { en: "Mid Rate", ja: "中位利率" },
  highRate: { en: "High Rate", ja: "高位利率" },

  // Waterfall labels
  premiumLoadGross: { en: "Premium Load (Gross)", ja: "プレミアムロード（総額）" },
  threeCStructuresLoad: { en: "3cStructures Load", ja: "3cStructuresロード" },
  syndicatedCapitalHoldback: { en: "B/D Holdback", ja: "B/Dホールドバック" },
  netToStephen: { en: "Net to Stephen", ja: "スティーブンへの純額" },
  netToPBWR: { en: "Net to PBWR", ja: "PBWRへの純額" },
  pbwrShare: { en: "PBWR Share (50%)", ja: "PBWRシェア（50%）" },
  ohanaShare: { en: "Ohana Share (50%)", ja: "大花シェア（50%）" },
  adminFeesAdvantage: { en: "Admin Fees (Advantage)", ja: "管理手数料（Advantage）" },
  miscBankSetupFees: { en: "Misc Bank/Setup Fees", ja: "その他銀行・設定手数料" },
  premiumLoadWaterfall: { en: "Premium Load Waterfall", ja: "プレミアムロードウォーターフォール" },
  waterfallDesc: {
    en: "Step-by-step breakdown of deposit allocation",
    ja: "預入配分の段階的内訳",
  },

  // Fund allocation table
  product: { en: "Product", ja: "商品" },
  type: { en: "Type", ja: "種別" },
  amount: { en: "Amount", ja: "金額" },
  ogaComm: { en: "OGA Allowance", ja: "OGAアローワンス" },
  processor: { en: "Processor", ja: "プロセッサー" },
  regional: { en: "Regional", ja: "地域" },
  guar: { en: "Guar.", ja: "保証" },
  nonG: { en: "Non-G.", ja: "非保証" },
  productAllocation: { en: "Product allocation, estimated returns, and marketing allowance", ja: "商品配分、予想リターン、マーケティングアローワンス" },

  // Carrier illustration
  year: { en: "Year", ja: "年" },
  fundLow: { en: "Fund (Low)", ja: "ファンド（低位）" },
  fundMid: { en: "Fund (Mid)", ja: "ファンド（中位）" },
  fundHigh: { en: "Fund (High)", ja: "ファンド（高位）" },
  surrenderMid: { en: "Surrender (Mid)", ja: "解約返戻金（中位）" },
  deathBenefit: { en: "Death Benefit", ja: "死亡保険金" },
  fees: { en: "Fees", ja: "手数料" },
  yearByYear: {
    en: "Year-by-year fund value projection at three return rates",
    ja: "3つのリターン率での年別ファンド価値予測",
  },
  rateLabel: { en: "Rate", ja: "利率" },

  // Tax impact
  cumulativeTaxDeferredUSD: { en: "Cumulative Tax Deferred (USD)", ja: "累積税繰延額（米ドル）" },
  cumulativeTaxDeferredJPY: { en: "Cumulative Tax Deferred (JPY)", ja: "累積税繰延額（円）" },
  totalTaxDeferredDesc: {
    en: "Total tax deferred through PPVA wrapper over projection period",
    ja: "予測期間におけるPPVAラッパーによる累積税繰延額",
  },
  atCurrentRate: { en: "At current exchange rate of", ja: "現在の為替レート" },
  perUSD: { en: "/USD", ja: "/米ドル" },
  existingCSV: { en: "Existing CSV", ja: "既存解約返戻金" },
  existingGain: { en: "Existing Gain", ja: "既存含み益" },
  taxNoPPVA: { en: "Tax (No PPVA)", ja: "税金（PPVA無し）" },
  ppvaValue: { en: "PPVA Value", ja: "PPVA価値" },
  combinedJPY: { en: "Combined (JPY)", ja: "合算（円）" },
  taxImpactAnalysis: { en: "Tax Impact Analysis", ja: "税務インパクト分析" },
  taxImpactDesc: {
    en: "Existing portfolio vs. PPVA — tax deferral benefit",
    ja: "既存ポートフォリオ vs PPVA — 税繰延効果",
  },
} as const;

type DictKey = keyof typeof dict;

/**
 * Returns the translated string for the given key based on language mode.
 * - "english"  → English only
 * - "japanese" → Japanese only
 * - "both"     → "English / 日本語"
 */
export function t(key: DictKey, language: Lang): string {
  const entry = dict[key];
  if (!entry) return key;
  switch (language) {
    case "english":
      return entry.en;
    case "japanese":
      return entry.ja;
    case "both":
      return `${entry.en} / ${entry.ja}`;
  }
}
