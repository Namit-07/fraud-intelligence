import { transactions } from "@/mock/fraudData";

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-white">Transactions</h1>
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/60">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Customer ID</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-slate-800">
                  <td className="px-4 py-3 text-slate-100">{transaction.id}</td>
                  <td className="px-4 py-3">{transaction.customer_id}</td>
                  <td className="px-4 py-3">₹{transaction.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">{transaction.transaction_type}</td>
                  <td className="px-4 py-3">{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
