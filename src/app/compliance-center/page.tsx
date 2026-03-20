"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { DiversificationChecker } from "@/components/compliance-center/DiversificationChecker";
import { InvestorControlChecklist } from "@/components/compliance-center/InvestorControlChecklist";
import { BdRiaSeparation } from "@/components/compliance-center/BdRiaSeparation";
import { DocumentMatrix } from "@/components/compliance-center/DocumentMatrix";
import { UnderwritingEligibility } from "@/components/compliance-center/UnderwritingEligibility";

export default function ComplianceCenterPage() {
  const tabs = [
    { label: "817(h) Diversification", content: <DiversificationChecker /> },
    { label: "Investor Control", content: <InvestorControlChecklist /> },
    { label: "BD/RIA Separation", content: <BdRiaSeparation /> },
    { label: "Document Matrix", content: <DocumentMatrix /> },
    { label: "Underwriting", content: <UnderwritingEligibility /> },
  ];

  return (
    <>
      <PageHeader
        title="Compliance Center"
        description="Interactive compliance checks — 817(h), investor control, BD/RIA separation, documents, and underwriting"
      />
      <div className="max-w-[1600px] mx-auto p-6">
        <Tabs tabs={tabs} />
      </div>
    </>
  );
}
