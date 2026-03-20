# PPVA Command Center — Claude Code Project Brief

## Project Owner
Joshua Herrington, The Pacific Bridge Companies (TPBC)

## What This Is
A full-stack web application that serves as the operational command center for TPBC's Private Placement Variable Annuity (PPVA) business. This replaces static Word documents and disconnected spreadsheets with a single interactive platform that producers, partners, and leadership use daily.

## Tech Stack (Recommended)
- **Frontend:** Next.js (React) with TypeScript
- **Backend:** Next.js API routes
- **Database:** SQLite (via Prisma or Drizzle) for portability — can migrate to PostgreSQL later
- **Charts:** Recharts for financial visualizations
- **Styling:** Tailwind CSS with TPBC brand tokens
- **Deployment:** Start local, deploy to Vercel when ready

## TPBC Brand
- **Primary colors:** Navy #003661, Teal #0086A3, White #FFFFFF
- **Secondary:** Sky #00ADEE, Slate #4C5C68, Dark Gray #46494C
- **Font:** Brandon Grotesque (Century Gothic as system fallback)
- **Logo:** Diamond icon with calabash/bridge motif + "TPBC" wordmark

---

## The Seven Modules

### Module 1: Deal Workbench
**Purpose:** Central workspace for structuring a PPVA deal. Input client details, see everything computed.

**Inputs (from the Deal Model Excel):**
- Policy Owner (entity name)
- Policy Issue Date
- Total Deposit (minimum $1M)
- Policy Type (Variable Annuity PPVA)
- Premium Load % (default 6%)
- 3cStructures load % (default 1%)
- Syndicated Capital holdback % (default 5%)
- PB Investment Services holdback % (default 5%)
- PBWR split % of net to PB (default 50%)
- Advantage annuity admin fee (default $19,500)
- Misc bank/setup fees (default $1,500)
- Fund allocation: 6 products with allocation %, estimated rates
  - Intl Fixed Rate Plan Plus (default 35%, 5.8%)
  - Intl Fixed Rate Plan (default 25%, 5.6%)
  - US 5-Year FIA AmFirst/Trailhead (default 15%, 5.15%)
  - AAIDX Alt Income (default 10%, 7.0%)
  - ACRE III CRE Fund (default 10%, 12.0%)
  - Cash Liquidity (default 5%, 3.0%)
- Annuity commission rates by product (OGA %, Processor 95% %, Regional %)
- Annual fund charges (Advantage fee bps by tier, 3cStructures annual %)
- Client demographics (age, gender, current CSV, basis, tax rates)
- JPY/USD exchange rate
- Projection years

**Computed Outputs (replicate Deal Model Excel logic):**
- Step 1: Premium Load Waterfall (total load → Syndicated holdback → net to Stephen → PB Investment holdback → PBWR/Ohana split)
- Step 2: Admin & Bank Fees (net wired to Inspira)
- Step 3: Fund Allocation Table (guaranteed vs non-guaranteed, amounts, weighted returns, OGA commissions, processor commissions)
- Step 4: Annual Fund Charges
- Step 5: Carrier Illustration (year-by-year projection table: age, net deposit, fund value at 3 return rates, surrender value, death benefit — up to 50+ years)
- Step 6: Tax Impact Analysis (existing CSV growth, gain, tax without PPVA, PPVA fund value, PPVA surrender value, combined CSV in JPY, combined gain in JPY)
- Summary dashboard with key metrics

**Carrier:** Advantage Life Puerto Rico (ALPR) only. The system is built around this carrier's fee structure and process.

**Data source:** `/source-data/PPVA_Deal_Model - Master Build.xlsx` — this Excel file IS the canonical logic. Replicate its formulas in JavaScript/TypeScript.

---

### Module 2: Impact Modeler
**Purpose:** Client-facing presentation tool showing the power of tax deferral. Two sub-modules.

**Sub-module 2a: Tax Deferral Power**
- Interactive visualization showing how tax-deferred compounding outperforms taxable compounding over time
- Inputs: premium amount, gross return rate, tax rate, time horizon
- Output: Two growth curves (taxable vs PPVA) with the gap clearly visualized
- Show year-by-year breakdown: portfolio value, annual tax paid (taxable), cumulative tax saved (PPVA), and the dollar difference
- Interactive sliders so the user can adjust assumptions in real time
- Key metric callouts: "After 20 years, the PPVA portfolio is $X larger" / "Total tax deferred: $X"
- This should be presentation-quality — something you show a client on screen

**Sub-module 2b: Cross-Border / JPY Module**
- USD/JPY conversion with adjustable exchange rate
- Yen carry trade consequences from tax events
- Show how currency movements affect the tax impact for Japanese clients
- Combined CSV analysis (existing policies + PPVA) in both currencies
- Data source: Tax Impact sheet from Deal Model Excel

**Charts:** Recharts line charts, area charts for the gap visualization, animated number counters for key metrics.

---

### Module 3: Comp Calculator
**Purpose:** Every partner models their own economics. Driven by the Deal Model Excel.

**Inputs:**
- Total deposit amount
- Premium load % (adjustable, default 6%)
- Partner role selection (affects which waterfall path to show)
- Fee/commission parameters per the ohana split structure

**Waterfall Visualization:**
Total Deposit → Premium Load (6%) → 3cStructures (1%) → Admin Fees → Net to Fund
Premium Load → Syndicated Capital Holdback (5%) → Net to Stephen → PB Investment Holdback (5%) → Net to PBWR → PBWR Share (50%) / Ohana Share (50%)

**Per-product commission table:**
Show OGA %, Processor (95%) %, and Regional % for each annuity product, with dollar amounts calculated from the allocation.

**Annual recurring:**
Show annual fund charges by tier (Advantage bps + 3cStructures %) applied to projected fund values over time.

**Output:** Clean table showing every party's compensation — one-time and recurring. Let the user toggle between different deposit amounts to see how economics scale.

**Data source:** Inputs sheet (rows 10-50) + Calculations sheet (Steps 1-4) from Deal Model Excel, plus Ohana split sheets from OneDrive dump.

---

### Module 4: Process Tracker
**Purpose:** Interactive 4-phase, 15-step workflow tracker.

**Visual:** Horizontal timeline or Kanban-style board with 4 phase columns.

**Each step shows:**
- Step number and name
- Owner(s)
- Prerequisites (which steps must complete first)
- Documents required
- Typical timing
- Checkbox for completion tracking
- Click to expand for full details

**The 15 steps:**
Phase 0 (Coordination): 1. Client/Advisor Confirmation, 2. Documentation Gathering, 3. Discretionary Management Agreement, 4. Account Opening Plan
Phase 1 (Placement): 5. Secure Data Link, 6. Prepare Application Package, 7. Client Signs, 8. Carrier Compliance Approval
Transition (SMA Setup): 9. Open Custodian Account, 10. Execute Discretionary Agreements, 11. Greenlight to Fund, 12. Funds Received
Phase 2 (Management): 13. Portfolio Allocation, 14. Policy Delivery, 15. Compensation Finalized

**Key rules:**
- BD role ends completely after Step 12 — NO ongoing involvement
- Transition window: ~3 business days, no broker or RIA activity
- RIA begins in Step 13 only after transition completes
- Dependencies: Step 9 requires Steps 5+7, Step 11 requires Steps 8+9+10, Step 13 requires Step 12

**Data source:** `docs/Detailed_15_Step_Task_List.md` and `docs/Policy_Placement_Workflow_Narrative_Guide.md`

---

### Module 5: Resource Library
**Purpose:** Searchable knowledge base organized by category.

**Categories:**
- **Product Knowledge:** PPVA overview, PPLI basics, PPVA vs PPLI comparison, PPVUL structure
- **Carrier Profiles:** Advantage/ALPR (primary), Axcelus factsheet, Lombard guidelines
- **Investment Universe:** Fund lists (SALI, VIT), allocation frameworks, Crystal Funds performance data
- **Compliance References:** 817(h) rules, investor control doctrine, BD/RIA separation, KYC/AML requirements
- **Partner Guides:** RIA guide, Insurance Pro guide, Tax Advisor guide, Money Manager pitch
- **Process Documents:** Workflow narrative, 15-step task list, application assembly guide, signature routing
- **Templates:** Intake form, due diligence questionnaire, signature checklist, deal sizing worksheet
- **Case Materials:** Anonymized case study, illustration examples, presentation decks
- **Fee Structures:** Ohana split sheets, commission schedules, fund charge tiers

**Implementation:** Each resource is a database entry with title, category, tags, summary, and either embedded content or link to source file. Full-text search across all resources. Tag-based filtering.

**Backend:** Admin interface to add/edit/remove resources without code changes.

**Data sources:** All Word docs from the playbook build, all PDFs from OneDrive dump, all Excel files.

---

### Module 6: Compliance Center
**Purpose:** Interactive compliance reference and checking tools.

**6a: 817(h) Diversification Checker**
- Input: allocation percentages across investments
- Rules: No single >55%, no two >70%, no three >80%, no four >90%, minimum 5 investments
- Output: Pass/Fail with specific rule violations highlighted
- Visual: allocation pie chart with pass/fail overlay

**6b: Investor Control Checklist**
- Interactive checklist of do's and don'ts
- Red flags: client directing trades, choosing specific investments, approving/vetoing trades
- Green: client selects advisor pre-placement, RIA exercises independent discretion, carrier owns assets
- Printable format for case files

**6c: BD/RIA Separation Rules**
- Visual timeline showing when each role is active
- Phase 1: BD only (commission, transactional, ends at funding)
- Transition: Neither active
- Phase 2: RIA only (fee-based, fiduciary, ongoing)
- Comparison table: BD vs RIA across all dimensions

**6d: Document Requirements Matrix**
- Table: Document × Required By × Who Completes × Who Signs × Routing
- Filter by case type (individual, LLC, trust, international)
- Checkbox to mark as obtained

**6e: Underwriting Eligibility**
- Based on International PPVA Underwriting Guidance
- Input: client nationality, residency, entity type
- Output: eligible carriers, requirements, restrictions

---

### Module 7: Value Overview
**Purpose:** High-level benefit story for each stakeholder. The "why" module.

**Stakeholder perspectives (each gets a dedicated view):**

**For the Client:**
- Tax-deferred growth (no annual capital gains, dividends, interest tax)
- Professional investment management through chosen RIA
- Customized SMA with institutional-grade strategies
- Estate planning efficiency (death benefit, probate bypass)
- Cross-border flexibility
- Privacy and asset protection within insurance wrapper
- Visual: "Your $X portfolio generates $Y in annual tax. Over Z years, that's $W lost to tax drag. The PPVA eliminates it."

**For the Money Manager:**
- AUM growth through SMA allocations
- Institutional investment platform
- No client-control — discretionary management through RIA
- Multiple product types (FIAs, mutual funds, alternatives)
- Custodian integration and data feeds
- Recurring relationship with carrier

**For the RIA:**
- New recurring revenue stream (0-2% advisory fees on SMA)
- Fiduciary role they already know — just inside an insurance wrapper
- No case placement burden (BD handles Phase 1, TPBC coordinates)
- Growing fee base as assets compound tax-deferred
- Clean BD/RIA separation protects fiduciary status

**For the Carrier (Advantage):**
- Policy volume and premium flow
- Administrative fee revenue (annual, recurring)
- SMA infrastructure under their entity structure
- Compliance monitoring revenue
- Long-duration policies (ongoing for life)

**For the Insurance Professional:**
- Placement compensation (0-2% fees, up to 50% ohana firm comp)
- No ongoing management burden
- Access to sophisticated product for HNW clients
- Strengthened client relationship
- Use TPBC's tools and process — no need to build their own

**For the Tax Advisor:**
- Client retention through sophisticated planning solution
- Referral compensation
- Tax planning opportunities around distributions, entity structuring, cross-border
- Differentiation from other CPAs
- Ongoing advisory role as policies mature

**Implementation:** Tab interface or card layout. Each stakeholder gets a clean, visual summary with key metrics and talking points. Should be presentation-quality — this is what you pull up in a partner meeting.

---

## Source Data Files

### Critical (copy to project /source-data/):
1. `PPVA_Deal_Model - Master Build.xlsx` — THE calculation engine. All financial logic lives here.
2. `Ohana split.xlsx` and `Ohana split (1).xlsx` — Fee sharing structure
3. `Policy_Placement_Workflow_Narrative_Guide.md` — Complete 4-phase process architecture
4. `Detailed_15_Step_Task_List.md` — Execution roadmap with owners and timing
5. `ppli-ppva-intake-2025-3-fillable.pdf` — Client intake form structure
6. `Statement of Understanding. PPLI Onshore. 3c - OGA - Advantage.pdf` — Fee schedule
7. `PPVA_Impact_Analysis_Tool_v10.html` — Existing impact analysis tool (reference for Module 2)
8. `International PPVA Underwriting Guidance as of July 2020.xlsx` — Underwriting matrix

### Reference (copy to project /docs/):
9. All TPBC_Module_*.docx files — Playbook content for Resource Library
10. `TPBC_PPVA_Master_Playbook_Phase*.docx` — Master playbook parts
11. `Ppli_ppva Master — Advantage_axcelus Opportunity Brief.docx` — Product brief
12. `PPVA Overview - July 2024.pdf` — Product overview
13. `PPLI basic.pdf` — PPLI education
14. `Current-Build-Private-Placement-at-TPBC.pdf` — TPBC positioning
15. `The Pacific Bridge Companies - PPLI Implementation Process.pdf` — Implementation steps
16. `VUL Due Diligence Document.pdf` — Due diligence framework
17. `Detailed Portfolio Proposal (Advantage Insurance).pdf` — Performance data
18. `Axcelus Financial Fact Sheet - July 2024.pdf` — Carrier background
19. `SALI Investment Options and Overview.xlsx` — Investment universe (~80 managers)
20. Brand guide images from /Branding/ folder

---

## Key Business Rules

### Carrier
- **Advantage Life Puerto Rico (ALPR)** is the primary and featured carrier
- The system is built around Advantage's fee structure, process, and entity architecture
- Other carriers exist but are not modeled in the system

### Compensation
- Fee range: 0-2%
- Ohana firm comp: up to 50%
- The Deal Model Excel drives all compensation calculations
- Partners use the Comp Calculator to model their own economics

### Minimums
- Minimum premium: $1,000,000
- Typical range: $1M to $50M+

### Compliance
- Investor control doctrine: client does NOT direct investments
- 817(h) diversification: must be maintained at all times
- BD/RIA role separation: strictly sequential, never concurrent
- Transition window: ~3 business days between BD exit and RIA start

### Language
- System supports English and Japanese (the Deal Model Excel is bilingual)
- F1 cell on Inputs sheet controls language toggle

### Anonymization
- Case study references use "Kenji Nakamura / Pacific Ventures LLC" (fictional)
- Real client names never appear in the system

---

## Build Sequence (Recommended)

### Sprint 1: Foundation
- Project scaffolding (Next.js + Tailwind + DB)
- Brand tokens and component library
- Navigation shell with 7 module tabs
- Module 1 (Deal Workbench) — this is the most complex and most used
- Module 3 (Comp Calculator) — driven by same Deal Model logic

### Sprint 2: Presentation Tools
- Module 2 (Impact Modeler) — both sub-modules
- Module 7 (Value Overview) — stakeholder benefit views

### Sprint 3: Operations
- Module 4 (Process Tracker) — interactive workflow
- Module 6 (Compliance Center) — all 5 sub-modules

### Sprint 4: Knowledge Base
- Module 5 (Resource Library) — with admin backend
- Content seeding from all source documents

### Sprint 5: Polish
- Responsive design
- Print/export capabilities
- Data persistence and backup
- User preferences

---

## Notes for Claude Code

1. The Deal Model Excel has Japanese sheet names (e.g., '入力 Inputs', '計算 Calculations'). Parse carefully.
2. The Excel uses IF statements for bilingual labels — the calculation logic is in column B references.
3. Array formulas exist in the Carrier Illustration sheet — handle these when replicating.
4. The premium load waterfall is the core financial logic: Deposit → Load → Holdbacks → Splits → Net to Fund.
5. Fund allocation uses a guaranteed/non-guaranteed split (75/25 in the Takata case, but should be adjustable).
6. The carrier illustration projects year-by-year using: (prior year value - prior year value × annual fee % - fixed admin fee × (1 + inflation)) × (1 + return rate).
7. All pitch sheets (Ohana, PBWR, Advisor, MM) are essentially filtered views of the same calculation data — they should be rendered as different views in the app, not separate modules.
