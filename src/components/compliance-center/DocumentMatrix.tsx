"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

interface DocRequirement {
  document: string;
  requiredBy: string;
  whoCompletes: string;
  whoSigns: string;
  routing: string;
  caseTypes: string[];
}

const DOCUMENTS: DocRequirement[] = [
  { document: "Annuity Application", requiredBy: "Carrier", whoCompletes: "3cStructures", whoSigns: "Client", routing: "Client → PR Counsel → 3cStructures → Advantage", caseTypes: ["individual", "llc", "trust", "international"] },
  { document: "Client Identification (Passport/ID)", requiredBy: "KYC/AML", whoCompletes: "Client", whoSigns: "N/A", routing: "Uploaded to secure portal", caseTypes: ["individual", "llc", "trust", "international"] },
  { document: "Source of Funds Statement", requiredBy: "AML Compliance", whoCompletes: "Client", whoSigns: "Client", routing: "Submitted with application", caseTypes: ["individual", "llc", "trust", "international"] },
  { document: "Bank Statements (3 months)", requiredBy: "AML Compliance", whoCompletes: "Client", whoSigns: "N/A", routing: "Uploaded to secure portal", caseTypes: ["individual", "llc", "trust", "international"] },
  { document: "Trust Agreement (Certified Copy)", requiredBy: "Carrier", whoCompletes: "Client Attorney", whoSigns: "Trustee", routing: "Uploaded to secure portal", caseTypes: ["trust"] },
  { document: "LLC Operating Agreement", requiredBy: "Carrier", whoCompletes: "Client Attorney", whoSigns: "Members", routing: "Uploaded to secure portal", caseTypes: ["llc"] },
  { document: "Discretionary Management Agreement", requiredBy: "RIA Compliance", whoCompletes: "TPBC", whoSigns: "RIA, Advantage", routing: "Internal execution", caseTypes: ["individual", "llc", "trust", "international"] },
  { document: "No Client Control Affirmation", requiredBy: "Investor Control", whoCompletes: "TPBC", whoSigns: "RIA", routing: "Filed with carrier", caseTypes: ["individual", "llc", "trust", "international"] },
  { document: "Address Verification", requiredBy: "KYC", whoCompletes: "Client", whoSigns: "N/A", routing: "Uploaded to secure portal", caseTypes: ["individual", "llc", "trust", "international"] },
  { document: "W-8BEN / W-8BEN-E", requiredBy: "Tax Reporting", whoCompletes: "Client", whoSigns: "Client", routing: "Filed with custodian", caseTypes: ["international"] },
  { document: "Due Diligence Questionnaire", requiredBy: "Carrier Compliance", whoCompletes: "TPBC", whoSigns: "N/A", routing: "Submitted to Advantage", caseTypes: ["individual", "llc", "trust", "international"] },
  { document: "Wiring Instructions", requiredBy: "Funding", whoCompletes: "Advantage", whoSigns: "N/A", routing: "Sent to client/advisor", caseTypes: ["individual", "llc", "trust", "international"] },
  { document: "Policy Document (PDF)", requiredBy: "Delivery", whoCompletes: "Advantage", whoSigns: "N/A", routing: "Advantage → RIA → Client", caseTypes: ["individual", "llc", "trust", "international"] },
];

export function DocumentMatrix() {
  const [caseType, setCaseType] = useState("individual");
  const [obtained, setObtained] = useState<Set<string>>(new Set());

  const filtered = DOCUMENTS.filter((d) => d.caseTypes.includes(caseType));
  const obtainedCount = filtered.filter((d) => obtained.has(d.document)).length;

  return (
    <div className="space-y-6">
      {/* Case Type Filter */}
      <Card>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-navy">Case Type:</span>
          {["individual", "llc", "trust", "international"].map((type) => (
            <button
              key={type}
              onClick={() => setCaseType(type)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                caseType === type ? "bg-navy text-white" : "bg-gray-100 text-slate-brand hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
          <span className="ml-auto text-sm text-slate-brand">
            {obtainedCount} / {filtered.length} obtained
          </span>
        </div>
      </Card>

      {/* Document Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-navy">
                <th className="text-center py-2 px-2 text-navy font-semibold w-10">Got</th>
                <th className="text-left py-2 px-3 text-navy font-semibold">Document</th>
                <th className="text-left py-2 px-3 text-navy font-semibold">Required By</th>
                <th className="text-left py-2 px-3 text-navy font-semibold">Completes</th>
                <th className="text-left py-2 px-3 text-navy font-semibold">Signs</th>
                <th className="text-left py-2 px-3 text-navy font-semibold">Routing</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.document} className={`border-b border-gray-100 ${obtained.has(doc.document) ? "bg-green-50/50" : ""}`}>
                  <td className="py-2 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={obtained.has(doc.document)}
                      onChange={() => {
                        setObtained((prev) => {
                          const next = new Set(prev);
                          if (next.has(doc.document)) next.delete(doc.document);
                          else next.add(doc.document);
                          return next;
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal accent-teal"
                    />
                  </td>
                  <td className={`py-2 px-3 font-medium ${obtained.has(doc.document) ? "line-through text-gray-400" : ""}`}>{doc.document}</td>
                  <td className="py-2 px-3 text-slate-brand">{doc.requiredBy}</td>
                  <td className="py-2 px-3 text-slate-brand">{doc.whoCompletes}</td>
                  <td className="py-2 px-3 text-slate-brand">{doc.whoSigns}</td>
                  <td className="py-2 px-3 text-slate-brand text-xs">{doc.routing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
