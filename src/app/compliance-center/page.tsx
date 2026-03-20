import { PageHeader } from "@/components/layout/PageHeader";

export default function ComplianceCenterPage() {
  return (
    <>
      <PageHeader
        title="Compliance Center"
        description="Interactive compliance checks for 817(h), investor control, BD/RIA separation, and more"
      />
      <div className="max-w-[1600px] mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-slate-brand">
          <p className="text-lg font-medium">Coming in Sprint 3</p>
          <p className="mt-2 text-sm">817(h) Diversification Checker, Investor Control Checklist, BD/RIA Rules, Document Matrix, Underwriting Eligibility</p>
        </div>
      </div>
    </>
  );
}
