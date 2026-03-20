"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { RESOURCES, CATEGORIES } from "@/lib/resource-data";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  pdf: (
    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  document: (
    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  spreadsheet: (
    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  template: (
    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  guide: (
    <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
};

export default function ResourceLibraryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let results = RESOURCES;
    if (selectedCategory) {
      results = results.filter((r) => r.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.tags.some((t) => t.includes(q)) ||
          r.category.toLowerCase().includes(q)
      );
    }
    return results;
  }, [search, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    RESOURCES.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <>
      <PageHeader
        title="Resource Library"
        description={`${RESOURCES.length} resources across ${CATEGORIES.length} categories`}
      />
      <div className="max-w-[1600px] mx-auto p-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <div className="mb-4 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources..."
                className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
              />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${!selectedCategory ? "bg-navy text-white" : "text-foreground hover:bg-gray-50"}`}
              >
                All Resources ({RESOURCES.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`w-full text-left px-4 py-2.5 text-sm border-t border-gray-100 transition-colors ${selectedCategory === cat ? "bg-teal/10 text-teal font-medium" : "text-foreground hover:bg-gray-50"}`}
                >
                  {cat} <span className="text-xs text-slate-brand">({categoryCounts[cat] || 0})</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <p className="text-sm text-slate-brand mb-4">
              {filtered.length} resource{filtered.length !== 1 ? "s" : ""} found
              {selectedCategory && ` in "${selectedCategory}"`}
              {search && ` matching "${search}"`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((resource) => {
                const hasFile = !!resource.sourceFile;
                const fileUrl = hasFile ? `/api/resources?file=${encodeURIComponent(resource.sourceFile!)}` : undefined;
                return (
                  <a
                    key={resource.id}
                    href={fileUrl}
                    target={hasFile ? "_blank" : undefined}
                    rel={hasFile ? "noopener noreferrer" : undefined}
                    className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow block ${hasFile ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{TYPE_ICONS[resource.type]}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-navy truncate">{resource.title}</h3>
                        <p className="text-xs text-teal font-medium mt-0.5">{resource.category}</p>
                        <p className="text-xs text-slate-brand mt-2 line-clamp-2">{resource.summary}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {resource.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="text-xs bg-gray-100 text-slate-brand px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>
                        {resource.sourceFile ? (
                          <p className="text-xs text-teal mt-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open file
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-2">Built-in reference</p>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-brand">
                <p className="text-lg font-medium">No resources found</p>
                <p className="text-sm mt-1">Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
