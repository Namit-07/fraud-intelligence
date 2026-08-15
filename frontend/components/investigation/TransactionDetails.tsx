import { formatCurrency } from "@/lib/utils";

interface TransactionDetailsProps {
  transaction: {
    id: string;
    customer_id: string;
    amount: number;
    transaction_type: string;
    timestamp: string;
  };
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="text-lg font-semibold text-white">Transaction Information</h3>
      <dl className="mt-4 space-y-3 text-sm text-slate-300">
        <div className="flex justify-between gap-4 border-b border-slate-800 pb-2">
          <dt>Transaction ID</dt>
          <dd className="font-medium text-slate-100">{transaction.id}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-slate-800 pb-2">
          <dt>Customer ID</dt>
          <dd className="font-medium text-slate-100">{transaction.customer_id}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-slate-800 pb-2">
          <dt>Amount</dt>
          <dd className="font-medium text-slate-100">{formatCurrency(transaction.amount)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-slate-800 pb-2">
          <dt>Transaction type</dt>
          <dd className="font-medium text-slate-100">{transaction.transaction_type}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Timestamp</dt>
          <dd className="font-medium text-slate-100">{new Date(transaction.timestamp).toLocaleString()}</dd>
        </div>
      </dl>
    </div>
  );
}
