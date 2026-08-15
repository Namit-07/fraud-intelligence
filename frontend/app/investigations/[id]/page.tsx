import { BehaviourTimeline } from "@/components/investigation/BehaviourTimeline";
import { RiskFactors } from "@/components/investigation/RiskFactors";
import { RiskScore } from "@/components/investigation/RiskScore";
import { TransactionDetails } from "@/components/investigation/TransactionDetails";
import { getTransaction } from "@/lib/api";

export default async function InvestigationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const investigation = await getTransaction(resolvedParams.id);
  const transaction = investigation.transaction;
  const assessment = investigation.risk_assessment;

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Investigation</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{transaction.id}</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <TransactionDetails transaction={transaction} />
          <RiskScore score={assessment.risk_score} label={assessment.risk_level} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="text-lg font-semibold text-white">ML Results</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                <span className="text-slate-300">Fraud Probability</span>
                <span className="font-medium text-cyan-300">{Math.round(assessment.fraud_probability * 100)}%</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                <span className="text-slate-300">Anomaly Score</span>
                <span className="font-medium text-red-300">{Math.round(assessment.anomaly_score * 100)}%</span>
              </div>
            </div>
          </div>

          <RiskFactors factors={assessment.risk_factors} />
        </div>

        <div className="mt-6">
          <BehaviourTimeline events={investigation.behaviour_events} />
        </div>
      </div>
    </div>
  );
}
