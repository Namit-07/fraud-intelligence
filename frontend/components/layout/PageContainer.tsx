import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen bg-slate-950 text-slate-100">{children}</div>;
}
