"use client";

import { useMemo } from "react";
import { DealInputs, DealResult } from "@/lib/calc/types";
import { calculateDeal } from "@/lib/calc/deal-engine";

export function useDealCalculation(inputs: DealInputs): DealResult {
  return useMemo(() => calculateDeal(inputs), [inputs]);
}
