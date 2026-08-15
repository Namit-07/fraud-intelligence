"use client";

import { Activity, Loader2, ShieldAlert } from "lucide-react";

interface DemoControlsProps {
  isLive: boolean;
  lastEvent: string;
  trackedCount: number;
  isLoading: boolean;
  onSimulate: () => Promise<void> | void;
}

export function DemoControls({ isLive, lastEvent, trackedCount, isLoading, onSimulate }: DemoControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onSimulate}
        disabled={isLoading}
        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Simulating...
          </span>
        ) : (
          "Simulate Suspicious Transaction"
        )}
      </button>

      <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300">
        <span className={`h-2 w-2 rounded-full ${isLive ? "bg-emerald-400" : "bg-slate-500"}`} />
        <span>{isLive ? "Live" : "Offline"}</span>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-1 text-xs text-cyan-200 md:inline-flex">
        <Activity className="h-3.5 w-3.5" />
        <span>{lastEvent}</span>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 text-xs text-amber-200 xl:inline-flex">
        <ShieldAlert className="h-3.5 w-3.5" />
        <span>{trackedCount} tracked</span>
      </div>
    </div>
  );
}
