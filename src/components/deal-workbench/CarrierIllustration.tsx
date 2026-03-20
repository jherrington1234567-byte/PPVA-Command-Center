"use client";

import { CarrierIllustrationYear } from "@/lib/calc/types";
import { formatCurrency } from "@/lib/format";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CarrierIllustrationProps {
  years: CarrierIllustrationYear[];
  illustratedRates: [number, number, number];
}

export function CarrierIllustration({ years, illustratedRates }: CarrierIllustrationProps) {
  const chartData = years.map((y) => ({
    year: y.year,
    age: y.age,
    Low: y.fundValueLow,
    Mid: y.fundValueMid,
    High: y.fundValueHigh,
  }));

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend />
            <Line type="monotone" dataKey="Low" stroke="#4C5C68" strokeWidth={1.5} dot={false} name={`${(illustratedRates[0] * 100).toFixed(0)}% Rate`} />
            <Line type="monotone" dataKey="Mid" stroke="#0086A3" strokeWidth={2} dot={false} name={`${(illustratedRates[1] * 100).toFixed(0)}% Rate`} />
            <Line type="monotone" dataKey="High" stroke="#003661" strokeWidth={1.5} dot={false} name={`${(illustratedRates[2] * 100).toFixed(0)}% Rate`} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b-2 border-navy">
              <th className="text-left py-2 px-2 text-navy font-semibold">Year</th>
              <th className="text-left py-2 px-2 text-navy font-semibold">Age</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">Fund (Low)</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">Fund (Mid)</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">Fund (High)</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">Surrender (Mid)</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">Death Benefit</th>
              <th className="text-right py-2 px-2 text-navy font-semibold">Fees</th>
            </tr>
          </thead>
          <tbody>
            {years.map((y) => (
              <tr
                key={y.year}
                className={`border-b border-gray-100 hover:bg-gray-50 ${y.year % 5 === 0 ? "bg-blue-50/30" : ""}`}
              >
                <td className="py-1.5 px-2 font-mono">{y.year}</td>
                <td className="py-1.5 px-2 font-mono">{y.age}</td>
                <td className="py-1.5 px-2 text-right font-mono">{formatCurrency(y.fundValueLow)}</td>
                <td className="py-1.5 px-2 text-right font-mono font-semibold">{formatCurrency(y.fundValueMid)}</td>
                <td className="py-1.5 px-2 text-right font-mono">{formatCurrency(y.fundValueHigh)}</td>
                <td className="py-1.5 px-2 text-right font-mono">{formatCurrency(y.surrenderValueMid)}</td>
                <td className="py-1.5 px-2 text-right font-mono">{formatCurrency(y.deathBenefitMid)}</td>
                <td className="py-1.5 px-2 text-right font-mono text-slate-brand">{formatCurrency(y.annualFeesDeducted)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
