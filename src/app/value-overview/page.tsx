import { PageHeader } from "@/components/layout/PageHeader";

export default function ValueOverviewPage() {
  return (
    <>
      <PageHeader
        title="Value Overview"
        description="Stakeholder-specific benefit stories for clients, RIAs, carriers, and partners"
      />
      <div className="max-w-[1600px] mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-slate-brand">
          <p className="text-lg font-medium">Coming in Sprint 2</p>
          <p className="mt-2 text-sm">Presentation-quality views for Client, Money Manager, RIA, Carrier, Insurance Pro, and Tax Advisor</p>
        </div>
      </div>
    </>
  );
}
