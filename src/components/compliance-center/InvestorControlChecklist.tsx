"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

interface CheckItem {
  text: string;
  type: "green" | "red";
  category: string;
}

const CHECKLIST_ITEMS: CheckItem[] = [
  // Green - Allowed
  { text: "Client selects advisor/RIA before policy placement", type: "green", category: "Pre-Placement" },
  { text: "Client communicates general investment objectives", type: "green", category: "Pre-Placement" },
  { text: "RIA exercises independent discretion over portfolio", type: "green", category: "Management" },
  { text: "Carrier owns all assets within the policy", type: "green", category: "Structure" },
  { text: "RIA manages as fiduciary with full authority", type: "green", category: "Management" },
  { text: "Client receives periodic performance reports", type: "green", category: "Reporting" },
  { text: "Investment policy statement guides (not directs) management", type: "green", category: "Management" },
  // Red - Prohibited
  { text: "Client directs specific trades or transactions", type: "red", category: "Trading" },
  { text: "Client chooses specific investments for the portfolio", type: "red", category: "Trading" },
  { text: "Client approves or vetoes individual trades", type: "red", category: "Trading" },
  { text: "Client has authority to hire/fire fund managers", type: "red", category: "Management" },
  { text: "Client contacts custodian directly about investments", type: "red", category: "Communication" },
  { text: "Client receives real-time trade notifications", type: "red", category: "Reporting" },
  { text: "Client negotiates fees with underlying fund managers", type: "red", category: "Fees" },
];

export function InvestorControlChecklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggleCheck = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const greenItems = CHECKLIST_ITEMS.filter((item) => item.type === "green");
  const redItems = CHECKLIST_ITEMS.filter((item) => item.type === "red");
  const redFlagged = redItems.some((_, i) => checked.has(greenItems.length + i));

  return (
    <div className="space-y-6">
      {redFlagged && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-800">Investor Control Violation Detected</p>
            <p className="text-xs text-red-600 mt-0.5">One or more prohibited activities are checked. This could jeopardize the policy&apos;s tax-deferred status.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Permitted Activities" description="These are allowed under investor control doctrine">
          <div className="space-y-2">
            {greenItems.map((item, i) => (
              <label key={i} className="flex items-start gap-3 p-2 rounded hover:bg-green-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked.has(i)}
                  onChange={() => toggleCheck(i)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600"
                />
                <div>
                  <span className="text-sm text-foreground">{item.text}</span>
                  <span className="ml-2 text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded">{item.category}</span>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <Card title="Prohibited Activities" description="These violate investor control doctrine — red flags">
          <div className="space-y-2">
            {redItems.map((item, i) => {
              const globalIndex = greenItems.length + i;
              const isChecked = checked.has(globalIndex);
              return (
                <label key={i} className={`flex items-start gap-3 p-2 rounded cursor-pointer ${isChecked ? "bg-red-50" : "hover:bg-red-50/50"}`}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(globalIndex)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 accent-red-600"
                  />
                  <div>
                    <span className={`text-sm ${isChecked ? "text-red-700 font-medium" : "text-foreground"}`}>{item.text}</span>
                    <span className="ml-2 text-xs text-red-600 bg-red-100 px-1.5 py-0.5 rounded">{item.category}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
