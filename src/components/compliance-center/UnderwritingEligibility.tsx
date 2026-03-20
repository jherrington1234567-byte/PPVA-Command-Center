"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

interface EligibilityResult {
  eligible: boolean;
  carrier: string;
  requirements: string[];
  restrictions: string[];
}

function checkEligibility(nationality: string, residency: string, entityType: string): EligibilityResult[] {
  const results: EligibilityResult[] = [];

  // Advantage ALPR - primary carrier
  const isUSResident = residency === "us";
  const isJapanese = nationality === "japan";

  results.push({
    eligible: true,
    carrier: "Advantage Life Puerto Rico (ALPR)",
    requirements: [
      "Minimum premium: $1,000,000",
      "KYC/AML documentation required",
      "Source of funds verification",
      ...(isJapanese ? ["W-8BEN required", "Japanese tax reporting coordination"] : []),
      ...(entityType === "trust" ? ["Certified trust agreement required"] : []),
      ...(entityType === "llc" ? ["LLC operating agreement required", "Member identification required"] : []),
      ...(!isUSResident ? ["Non-resident alien documentation", "FATCA compliance"] : []),
    ],
    restrictions: [
      ...(entityType === "llc" && !isUSResident ? ["Additional AML scrutiny for non-US LLCs"] : []),
      "OFAC screening required",
    ],
  });

  return results;
}

export function UnderwritingEligibility() {
  const [nationality, setNationality] = useState("japan");
  const [residency, setResidency] = useState("japan");
  const [entityType, setEntityType] = useState("individual");

  const results = checkEligibility(nationality, residency, entityType);

  return (
    <div className="space-y-6">
      <Card title="Client Profile" description="Enter client details to check carrier eligibility">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-brand mb-1">Nationality</label>
            <select value={nationality} onChange={(e) => setNationality(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none">
              <option value="us">United States</option>
              <option value="japan">Japan</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-brand mb-1">Country of Residency</label>
            <select value={residency} onChange={(e) => setResidency(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none">
              <option value="us">United States</option>
              <option value="japan">Japan</option>
              <option value="other">Other</option>
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
