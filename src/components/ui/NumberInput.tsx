"use client";

import { useCallback } from "react";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  format?: "currency" | "percent" | "number";
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  helpText?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  format = "number",
  min,
  max,
  step,
  prefix,
  suffix,
  className = "",
  helpText,
}: NumberInputProps) {
  const displayValue = format === "percent" ? (value * 100).toFixed(2) : value;
  const computedStep = step ?? (format === "percent" ? 0.25 : format === "currency" ? 1000 : 1);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = parseFloat(e.target.value);
      if (isNaN(raw)) return;
      const adjusted = format === "percent" ? raw / 100 : raw;
      onChange(adjusted);
    },
    [format, onChange]
  );

  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-brand mb-1">
        {label}
      </label>
      <div className="relative">
        {(prefix || format === "currency") && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {prefix || "$"}
          </span>
        )}
        <input
          type="number"
          value={displayValue}
          onChange={handleChange}
          min={format === "percent" && min !== undefined ? min * 100 : min}
          max={format === "percent" && max !== undefined ? max * 100 : max}
          step={computedStep}
          className={`w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-foreground focus:border-teal focus:ring-1 focus:ring-teal outline-none transition-colors ${
            prefix || format === "currency" ? "pl-7" : ""
          } ${suffix || format === "percent" ? "pr-7" : ""}`}
        />
        {(suffix || format === "percent") && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {suffix || "%"}
          </span>
        )}
      </div>
      {helpText && (
        <p className="mt-0.5 text-xs text-gray-400">{helpText}</p>
      )}
    </div>
  );
}
