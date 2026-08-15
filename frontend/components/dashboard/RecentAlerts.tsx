import { AlertTriangle, ArrowRight } from "lucide-react";

import { Alert } from "@/types/fraud";
import { formatCurrency } from "@/lib/utils";

export function RecentAlerts({ rows }: { rows: Alert[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
        <button className="flex items-center gap-2 text-sm text-slate-300">
          View all <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {rows.map((alert) => (
          <div key={alert.id} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-red-500/10 p-2 text-red-300">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-red-300">{alert.severity} Risk Transaction</p>
                  <p className="mt-1 text-lg font-semibold text-white">Customer {alert.transaction_id.replace("TXN", "C")}</p>
                  <p className="mt-1 text-sm text-slate-400">{formatCurrency(85000)}</p>
                  <p className="mt-2 text-sm text-slate-300">Risk Score: 87</p>
                  <p className="mt-1 text-sm text-slate-400">{alert.message}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
