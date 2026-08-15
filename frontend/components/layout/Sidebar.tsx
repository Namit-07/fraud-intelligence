import Link from "next/link";
import { Activity, AlertTriangle, BarChart3, ShieldAlert, ShieldCheck, TrendingUp } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: BarChart3 },
  { label: "Transactions", href: "/transactions", icon: Activity },
  { label: "Investigations", href: "/investigations/TXN1047", icon: ShieldAlert },
  { label: "Patterns", href: "/patterns", icon: TrendingUp },
];

export function Sidebar() {
  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-950/80 p-5">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/40 bg-red-500/10 text-red-300">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">PS-14</p>
          <p className="font-semibold text-slate-100">Fraud Intel</p>
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex items-center gap-2 text-amber-300">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">Priority queue</span>
        </div>
        <p className="mt-2 text-sm text-slate-300">17 suspicious transactions awaiting analyst review.</p>
      </div>
    </aside>
  );
}
