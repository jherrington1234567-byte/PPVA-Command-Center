import { PageHeader } from "@/components/layout/PageHeader";

export default function ImpactModelerPage() {
  return (
    <>
      <PageHeader
        title="Impact Modeler"
        description="Client-facing visualization showing the power of tax deferral and cross-border impact"
      />
      <div className="max-w-[1600px] mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-slate-brand">
          <p className="text-lg font-medium">Coming in Sprint 2</p>
          <p className="mt-2 text-sm">Tax Deferral Power and Cross-Border / JPY Module</p>
        </div>
      </div>
    </>
  );
}
