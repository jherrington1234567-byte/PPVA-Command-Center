import { PageHeader } from "@/components/layout/PageHeader";

export default function ProcessTrackerPage() {
  return (
    <>
      <PageHeader
        title="Process Tracker"
        description="Interactive 4-phase, 15-step workflow tracker for PPVA case placement"
      />
      <div className="max-w-[1600px] mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-slate-brand">
          <p className="text-lg font-medium">Coming in Sprint 3</p>
          <p className="mt-2 text-sm">Interactive workflow with phase columns and dependency tracking</p>
        </div>
      </div>
    </>
  );
}
