"use client";

import { useState, useCallback } from "react";
import { DealInputs, FundProduct } from "@/lib/calc/types";
import { DEFAULT_DEAL_INPUTS } from "@/lib/calc/defaults";

export function useDealInputs(initial?: Partial<DealInputs>) {
  const [inputs, setInputs] = useState<DealInputs>({
    ...DEFAULT_DEAL_INPUTS,
    ...initial,
  });

  const updateField = useCallback(
    <K extends keyof DealInputs>(field: K, value: DealInputs[K]) => {
      setInputs((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateFundAllocation = useCallback(
    (index: number, updates: Partial<FundProduct>) => {
      setInputs((prev) => ({
        ...prev,
        fundAllocations: prev.fundAllocations.map((fund, i) =>
          i === index ? { ...fund, ...updates } : fund
        ),
      }));
    },
    []
  );

  const resetToDefaults = useCallback(() => {
    setInputs({ ...DEFAULT_DEAL_INPUTS });
  }, []);

  return { inputs, updateField, updateFundAllocation, resetToDefaults, setInputs };
}
