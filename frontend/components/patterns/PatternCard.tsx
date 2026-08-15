import { ArrowRight } from "lucide-react";

import { EmergingPattern } from "@/types/fraud";

export function PatternCard({ pattern }: { pattern: EmergingPattern }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Pattern #{pattern.id.split("-")[1]}</p>
      <h3 className="mt-3 text-2xl font-semibold text-white">{pattern.pattern_name ?? pattern.sequence[0].replace(/_/g, " ")}</h3>
      <div className="mt-4 space-y-2 text-sm text-slate-300">
        {pattern.sequence.map((step, index) => (
          <div key={`${step}-${index}`} className="flex items-center gap-2">
            <span className="font-medium text-slate-100">{step.replace(/_/g, " ")}</span>
            {index < pattern.sequence.length - 1 ? <span className="text-slate-500">↓</span> : null}
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2 text-sm text-slate-300">
        <p>Accounts affected: {pattern.accounts_affected}</p>
        <p>Fraud association: {Math.round(pattern.fraud_association * 100)}%</p>
        <p>Confidence: {Math.round(pattern.confidence * 100)}%</p>
      </div>

      <button className="mt-6 inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-sm font-medium text-cyan-200">
        Investigate Pattern <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
