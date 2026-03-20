import { PageHeader } from "@/components/layout/PageHeader";

export default function ResourceLibraryPage() {
  return (
    <>
      <PageHeader
        title="Resource Library"
        description="Searchable knowledge base of product guides, compliance references, and templates"
      />
      <div className="max-w-[1600px] mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-slate-brand">
          <p className="text-lg font-medium">Coming in Sprint 4</p>
          <p className="mt-2 text-sm">Full-text search across all PPVA resources with category filtering</p>
        </div>
      </div>
    </>
  );
}
