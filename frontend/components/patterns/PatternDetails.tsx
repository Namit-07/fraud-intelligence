import { EmergingPattern } from "@/types/fraud";

export function PatternDetails({ pattern }: { pattern: EmergingPattern }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Pattern Overview</p>
      <h3 className="mt-3 text-2xl font-semibold text-white">{pattern.pattern_name ?? pattern.sequence[0].replace(/_/g, " ")}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-sm text-slate-400">Accounts affected</p>
          <p className="mt-2 text-xl font-semibold text-white">{pattern.accounts_affected}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-sm text-slate-400">Fraud association</p>
          <p className="mt-2 text-xl font-semibold text-white">{Math.round(pattern.fraud_association * 100)}%</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-sm text-slate-400">Confidence</p>
          <p className="mt-2 text-xl font-semibold text-white">{Math.round(pattern.confidence * 100)}%</p>
        </div>
      </div>
    </div>
  );
}
