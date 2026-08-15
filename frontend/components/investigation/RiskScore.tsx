interface RiskScoreProps {
  score: number;
  label: string;
}

export function RiskScore({ score, label }: RiskScoreProps) {
  const tone = score >= 75 ? "text-red-300" : score >= 40 ? "text-amber-300" : "text-emerald-300";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Risk Score</p>
      <div className="mt-4 flex items-end gap-3">
        <span className={`text-5xl font-bold ${tone}`}>{score}</span>
        <span className="pb-1 text-lg text-slate-400">/ 100</span>
      </div>
      <div className="mt-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-300">
        {label}
      </div>
    </div>
  );
}
