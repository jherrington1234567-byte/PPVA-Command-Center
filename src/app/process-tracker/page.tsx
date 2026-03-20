"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PHASES, PROCESS_STEPS } from "@/lib/process-data";

export default function ProcessTrackerPage() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleComplete = (stepNum: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(stepNum)) next.delete(stepNum);
      else next.add(stepNum);
      return next;
    });
  };

  const canStart = (step: typeof PROCESS_STEPS[0]) =>
    step.prerequisites.every((p) => completed.has(p));

  const getStepStatus = (step: typeof PROCESS_STEPS[0]) => {
    if (completed.has(step.number)) return "completed";
    if (!canStart(step)) return "blocked";
    return "available";
  };

  return (
    <>
      <PageHeader
        title="Process Tracker"
        description="Interactive 4-phase, 15-step PPVA placement workflow — BD role ends at Step 12"
      />
      <div className="max-w-[1600px] mx-auto p-6">
        {/* Progress Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {PHASES.map((phase) => {
            const phaseSteps = PROCESS_STEPS.filter((s) => s.phase === phase.id);
            const completedCount = phaseSteps.filter((s) => completed.has(s.number)).length;
            return (
              <div key={phase.id} className={`bg-white rounded-lg border-l-4 ${phase.borderColor} p-4`}>
                <p className="text-xs font-medium text-slate-brand uppercase">{phase.name}</p>
                <p className="mt-1 text-lg font-semibold text-navy">
                  {completedCount} / {phaseSteps.length}
                </p>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${phase.color} rounded-full transition-all`}
                    style={{ width: `${phaseSteps.length > 0 ? (completedCount / phaseSteps.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* BD/RIA Separation Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">BD/RIA Separation Rule</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Broker-dealer role ends completely after Step 12 (Funds Received). The transition window (~3 business days) has NO broker or RIA activity.
              RIA begins in Step 13 only after transition completes.
            </p>
          </div>
        </div>

        {/* Phase Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {PHASES.map((phase) => {
            const phaseSteps = PROCESS_STEPS.filter((s) => s.phase === phase.id);
            return (
              <div key={phase.id}>
                <div className={`${phase.color} text-white rounded-t-lg px-4 py-2.5`}>
                  <h3 className="text-sm font-semibold">{phase.name}</h3>
                </div>
                <div className="bg-white rounded-b-lg border border-t-0 border-gray-200 divide-y divide-gray-100">
                  {phaseSteps.map((step) => {
                    const status = getStepStatus(step);
                    const isExpanded = expandedStep === step.number;
                    return (
                      <div key={step.number} className={`p-3 ${status === "blocked" ? "opacity-50" : ""}`}>
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => status !== "blocked" && toggleComplete(step.number)}
                            disabled={status === "blocked"}
                            className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                              status === "completed"
                                ? `${phase.color} border-transparent`
                                : status === "blocked"
                                ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                                : "border-gray-300 hover:border-teal cursor-pointer"
                            }`}
                          >
                            {status === "completed" && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <button onClick={() => setExpandedStep(isExpanded ? null : step.number)} className="text-left w-full">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-mono ${phase.textColor} font-bold`}>#{step.number}</span>
                                <span className={`text-sm font-medium ${status === "completed" ? "line-through text-gray-400" : "text-foreground"}`}>
                                  {step.name}
                                </span>
                              </div>
                              <p className="text-xs text-slate-brand mt-0.5">{step.owner}</p>
                            </button>
                            {isExpanded && (
                              <div className="mt-3 space-y-2 text-xs">
                                <p className="text-foreground">{step.description}</p>
                                <div><span className="font-semibold text-navy">Timing:</span> <span className="text-slate-brand">{step.timing}</span></div>
                                {step.prerequisites.length > 0 && (
                                  <div><span className="font-semibold text-navy">Requires:</span> <span className="text-slate-brand">Steps {step.prerequisites.map((p) => `#${p}`).join(", ")}</span></div>
                                )}
                                <div>
                                  <span className="font-semibold text-navy">Documents:</span>
                                  <ul className="mt-1 space-y-0.5 text-slate-brand">
                                    {step.documents.map((doc, i) => (<li key={i}>- {doc}</li>))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                          <button onClick={() => setExpandedStep(isExpanded ? null : step.number)} className="text-gray-400 hover:text-navy mt-0.5">
                            <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
