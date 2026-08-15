"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Transaction } from "@/types/fraud";
import { getRiskTone } from "@/lib/utils";

export function RecentTransactions({ rows }: { rows: Transaction[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recent High-Risk Transactions</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3 pr-4 font-medium">Transaction ID</th>
              <th className="pb-3 pr-4 font-medium">Customer ID</th>
              <th className="pb-3 pr-4 font-medium">Amount</th>
              <th className="pb-3 pr-4 font-medium">Risk Score</th>
              <th className="pb-3 pr-4 font-medium">Risk Level</th>
              <th className="pb-3 pr-4 font-medium">Timestamp</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((transaction) => (
              <tr key={transaction.id} className="border-b border-slate-800/80 align-top">
                <td className="py-3 pr-4 text-slate-100">
                  <Link href={`/investigations/${transaction.id}`} className="inline-flex items-center gap-2 hover:text-cyan-300">
                    {transaction.id}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
                <td className="py-3 pr-4">{transaction.customer_id}</td>
                <td className="py-3 pr-4">₹{transaction.amount.toLocaleString("en-IN")}</td>
                <td className="py-3 pr-4">{transaction.risk_score ?? 0}</td>
                <td className="py-3 pr-4">
                  <span className={`inline-flex rounded-full border px-2 py-1 text-xs ${getRiskTone(transaction.risk_level)}`}>
                    {transaction.risk_level ?? "LOW"}
                  </span>
                </td>
                <td className="py-3 pr-4">{new Date(transaction.timestamp).toLocaleString()}</td>
                <td className="py-3 pr-4">{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
