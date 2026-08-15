"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Jan", transactions: 1000, fraud: 60 },
  { name: "Feb", transactions: 1200, fraud: 78 },
  { name: "Mar", transactions: 1460, fraud: 96 },
  { name: "Apr", transactions: 1700, fraud: 120 },
  { name: "May", transactions: 2000, fraud: 140 },
  { name: "Jun", transactions: 2300, fraud: 170 },
  { name: "Jul", transactions: 2600, fraud: 195 },
];

export function FraudTrendChart() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Fraud Trend</h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="transactionsFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fraudFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area type="monotone" dataKey="transactions" stroke="#38bdf8" fill="url(#transactionsFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="fraud" stroke="#f87171" fill="url(#fraudFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
