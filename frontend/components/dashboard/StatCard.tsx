import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  accent?: "red" | "amber" | "emerald" | "cyan";
}

const tones = {
  red: "border-red-500/20 bg-red-500/5 text-red-200",
  amber: "border-amber-500/20 bg-amber-500/5 text-amber-200",
  emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-200",
  cyan: "border-cyan-500/20 bg-cyan-500/5 text-cyan-200",
};

export function StatCard({ label, value, trend, accent = "red" }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${tones[accent]}`}>
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span>
        <ArrowUpRight className="h-4 w-4" />
      </div>
      <div className="mt-4 text-3xl font-semibold text-white">{value}</div>
      {trend ? <div className="mt-2 text-xs text-slate-400">{trend}</div> : null}
    </div>
  );
}
