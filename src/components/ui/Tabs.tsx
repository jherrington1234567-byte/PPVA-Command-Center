"use client";

import { useState } from "react";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultIndex?: number;
  className?: string;
}

export function Tabs({ tabs, defaultIndex = 0, className = "" }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="flex gap-0 -mb-px">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveIndex(i)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                i === activeIndex
                  ? "border-teal text-teal"
                  : "border-transparent text-slate-brand hover:text-navy hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-4">{tabs[activeIndex]?.content}</div>
    </div>
  );
}
