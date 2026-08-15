import { AlertTriangle } from "lucide-react";

interface RiskFactor {
  feature: string;
  impact: number;
  severity: string;
}

export function RiskFactors({ factors }: { factors: RiskFactor[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex items-center gap-2 text-white">
        <AlertTriangle className="h-4 w-4 text-amber-300" />
        <h3 className="text-lg font-semibold">Risk Factors</h3>
      </div>

      <div className="space-y-3">
        {factors.map((factor) => (
          <div key={factor.feature} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
            <div className="flex items-center gap-3 text-left">
              <span className="text-base text-slate-200">{factor.feature.replace(/_/g, " ")}</span>
            </div>
            <span className="text-sm font-medium text-amber-300">+{factor.impact}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
