import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-slate-400">
        <Search className="h-4 w-4" />
        <input
          aria-label="Search"
          placeholder="Search customer or transaction"
          className="w-64 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 transition hover:border-slate-700 hover:text-white">
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-sm font-medium text-red-200">
            A
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-slate-100">Analyst</p>
            <p className="text-xs text-slate-500">Intelligence Desk</p>
          </div>
        </div>
      </div>
    </header>
  );
}
