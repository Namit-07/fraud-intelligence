"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "LOW", value: 54, color: "#22c55e" },
  { name: "MEDIUM", value: 28, color: "#f59e0b" },
  { name: "HIGH", value: 18, color: "#ef4444" },
];

export function RiskDistribution() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Risk Distribution</h3>
      </div>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${String(value ?? 0)}%`, "Share"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-between gap-3 text-sm">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name} ({item.value}%)
          </div>
        ))}
      </div>
    </div>
  );
}
