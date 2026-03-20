"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

/**
 * Country list sourced from intern_ppva_system_reference.html country profiles.
 * Each entry includes treaty status and jurisdiction-specific requirements.
 */
const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "japan", label: "Japan" },
  { value: "uk", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "switzerland", label: "Switzerland" },
  { value: "austria", label: "Austria" },
  { value: "belgium", label: "Belgium" },
  { value: "sweden", label: "Sweden" },
  { value: "norway", label: "Norway" },
  { value: "poland", label: "Poland" },
  { value: "cyprus", label: "Cyprus" },
  { value: "uae", label: "United Arab Emirates" },
  { value: "saudi", label: "Saudi Arabia" },
  { value: "israel", label: "Israel" },
  { value: "india", label: "India" },
  { value: "china", label: "China" },
  { value: "hk", label: "Hong Kong" },
  { value: "mexico", label: "Mexico" },
  { value: "cayman", label: "Cayman Islands" },
  { value: "nigeria", label: "Nigeria" },
  { value: "other", label: "Other" },
] as const;

interface EligibilityResult {
  eligible: boolean;
  carrier: string;
  requirements: string[];
  restrictions: string[];
  treatyInfo?: string;
}

/** US tax treaty status by country (from intern reference) */
const TREATY_MAP: Record<string, string> = {
  japan: "US-Japan Treaty (Art. 17) — insurance income eligible for treaty benefits",
  uk: "US-UK Treaty (Art. 17) — favorable withholding treatment",
  germany: "US-Germany Treaty (Art. 18) — pension/annuity article applicable",
  france: "US-France Treaty (Art. 18) — annuity income covered",
  switzerland: "US-Switzerland Treaty (Art. 18) — favorable treatment for insurance structures",
  austria: "US-Austria Treaty — annuity provisions apply",
  belgium: "US-Belgium Treaty — insurance income eligible",
  sweden: "US-Sweden Treaty (Art. 19) — pension/annuity provisions",
  norway: "US-Norway Treaty — favorable withholding",
  poland: "US-Poland Treaty — limited insurance provisions",
  israel: "US-Israel Treaty — annuity provisions apply",
  india: "US-India Treaty — limited insurance provisions; additional CRS complexity",
  china: "US-China Treaty — limited provisions; enhanced compliance required",
  mexico: "US-Mexico Treaty (Art. 18) — pension/annuity article applicable",
};

function getCountrySpecificReqs(nationality: string, residency: string): string[] {
  const reqs: string[] = [];
  const isNonUS = nationality !== "us";
  const isNonUSResident = residency !== "us";

  // Non-US person requirements
  if (isNonUS) {
    reqs.push("W-8BEN / W-8BEN-E required");
    reqs.push("FATCA compliance documentation");
  }

  if (isNonUSResident) {
    reqs.push("Non-resident alien documentation");
    reqs.push("Country of residence tax ID required");
  }

  // CRS-participating jurisdictions need extra reporting
  const crsHigh = ["uk", "germany", "france", "switzerland", "austria", "belgium", "sweden", "norway", "poland", "cyprus", "japan", "india", "hk", "mexico", "cayman"];
  if (crsHigh.includes(nationality) || crsHigh.includes(residency)) {
    reqs.push("CRS (Common Reporting Standard) compliance required");
  }

  // Country-specific requirements
  switch (nationality) {
    case "japan":
      reqs.push("Japanese tax reporting coordination");
      reqs.push("PFIC analysis may be required (Form 8621)");
      break;
    case "uk":
      reqs.push("UK offshore reporting fund status review");
      reqs.push("UK deemed domicile rules review");
      break;
    case "germany":
      reqs.push("German insurance contract taxation review (Versicherungsteuergesetz)");
      break;
    case "france":
      reqs.push("French life insurance taxation review (assurance-vie rules)");
      reqs.push("French social charges assessment");
      break;
    case "switzerland":
      reqs.push("Swiss AIA (Automatic Information Exchange) compliance");
      break;
    case "uae":
      reqs.push("No income tax in UAE — focus on US-side compliance");
      reqs.push("Enhanced AML/KYC for UAE structures");
      break;
    case "saudi":
      reqs.push("Enhanced AML/KYC documentation");
      reqs.push("No US-Saudi tax treaty — withholding implications");
      break;
    case "india":
      reqs.push("FEMA (Foreign Exchange Management Act) compliance review");
      reqs.push("RBI liberalized remittance scheme limits");
      break;
    case "china":
      reqs.push("SAFE (State Administration of Foreign Exchange) approval documentation");
      reqs.push("Enhanced compliance review for PRC nationals");
      break;
    case "hk":
      reqs.push("HK territorial taxation — offshore income review");
      break;
    case "israel":
      reqs.push("Israeli reportable accounts review");
      break;
    case "nigeria":
      reqs.push("Enhanced AML/KYC — higher risk jurisdiction");
      reqs.push("No US-Nigeria tax treaty — withholding implications");
      break;
    case "mexico":
      reqs.push("Mexican tax residency documentation");
      break;
    case "cayman":
      reqs.push("Cayman beneficial ownership register compliance");
      reqs.push("No direct tax — US-side reporting focus");
      break;
  }

  return reqs;
}

function getRestrictions(nationality: string, residency: string, entityType: string): string[] {
  const restrictions: string[] = ["OFAC screening required"];

  // PEP screening for certain jurisdictions
  const pepHigh = ["uae", "saudi", "nigeria", "china", "india"];
  if (pepHigh.includes(nationality)) {
    restrictions.push("Enhanced PEP (Politically Exposed Person) screening");
  }

  // Enhanced AML for non-treaty countries
  const noTreaty = ["uae", "saudi", "nigeria", "cayman", "hk", "cyprus"];
  if (noTreaty.includes(nationality)) {
    restrictions.push("Enhanced AML due diligence — no bilateral tax treaty");
  }

  if (entityType === "llc" && residency !== "us") {
    restrictions.push("Additional AML scrutiny for non-US LLCs");
  }

  if (entityType === "trust" && residency !== "us") {
    restrictions.push("Foreign trust reporting — Form 3520/3520-A may be required");
  }

  return restrictions;
}

function checkEligibility(nationality: string, residency: string, entityType: string): EligibilityResult[] {
  const baseReqs = [
    "Minimum premium: $1,000,000",
    "KYC/AML documentation required",
    "Source of funds verification",
    "Bank statements (3 months) required",
    ...(entityType === "trust" ? ["Certified trust agreement required"] : []),
    ...(entityType === "llc" ? ["LLC operating agreement required", "Member identification required"] : []),
  ];

  const countryReqs = getCountrySpecificReqs(nationality, residency);
  const restrictions = getRestrictions(nationality, residency, entityType);
  const treatyInfo = TREATY_MAP[nationality] ?? (nationality === "us" ? undefined : "No specific US tax treaty — standard withholding rates apply");

  return [{
    eligible: true,
    carrier: "Advantage Life Puerto Rico (ALPR)",
    requirements: [...baseReqs, ...countryReqs],
    restrictions,
    treatyInfo,
  }];
}

export function UnderwritingEligibility() {
  const [nationality, setNationality] = useState("japan");
  const [residency, setResidency] = useState("japan");
  const [entityType, setEntityType] = useState("individual");

  const results = checkEligibility(nationality, residency, entityType);

  return (
    <div className="space-y-6">
      <Card title="Client Profile" description="Enter client details to check carrier eligibility and jurisdiction-specific requirements">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-brand mb-1">Nationality</label>
            <select value={nationality} onChange={(e) => setNationality(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none">
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-brand mb-1">Country of Residency</label>
            <select value={residency} onChange={(e) => setResidency(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none">
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-brand mb-1">Entity Type</label>
            <select value={entityType} onChange={(e) => setEntityType(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none">
              <option value="individual">Individual</option>
              <option value="llc">LLC</option>
              <option value="trust">Trust</option>
            </select>
          </div>
        </div>
      </Card>

      {results.map((result) => (
        <Card key={result.carrier}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${result.eligible ? "bg-green-100" : "bg-red-100"}`}>
              {result.eligible ? (
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-navy">{result.carrier}</h3>
              <p className={`text-sm font-medium ${result.eligible ? "text-green-600" : "text-red-600"}`}>
                {result.eligible ? "Eligible" : "Not Eligible"}
              </p>

              {result.treatyInfo && (
                <div className="mt-2 px-3 py-2 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-xs font-medium text-blue-700">Tax Treaty Status</p>
                  <p className="text-xs text-blue-600 mt-0.5">{result.treatyInfo}</p>
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-navy mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {result.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-brand">
                        <span className="text-teal mt-0.5">-</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                {result.restrictions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-amber-700 mb-2">Restrictions</h4>
                    <ul className="space-y-1">
                      {result.restrictions.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-amber-700">
                          <span className="mt-0.5">!</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
