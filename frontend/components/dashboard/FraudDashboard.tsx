"use client";

import { useEffect, useMemo, useState } from "react";

import { FraudTrendChart } from "@/components/dashboard/FraudTrendChart";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { RiskDistribution } from "@/components/dashboard/RiskDistribution";
import { StatCard } from "@/components/dashboard/StatCard";
import { DemoControls } from "@/components/dashboard/DemoControls";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Alert, DashboardStats, Transaction } from "@/types/fraud";

interface FraudDashboardProps {
  initialStats: DashboardStats;
  initialTransactions: Transaction[];
  initialAlerts: Alert[];
}

export function FraudDashboard({ initialStats, initialTransactions, initialAlerts }: FraudDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastEvent, setLastEvent] = useState("Waiting for feed");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const host = window.location.hostname || "localhost";
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(`${protocol}://${host}:8000/ws/transactions`);

    socket.onopen = () => {
      setIsLive(true);
      setLastEvent("Live feed connected");
    };

    socket.onclose = () => {
      setIsLive(false);
      setLastEvent("Live feed disconnected");
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as { event?: string; payload?: { transaction?: Transaction } };
        const incoming = message.payload?.transaction;

        if (message.event === "transaction_processed" && incoming) {
          const mapped: Transaction = {
            ...incoming,
            status: "FLAGGED",
            risk_score: 87,
            risk_level: "HIGH",
          };

          setTransactions((previous) => [mapped, ...previous].slice(0, 6));
          const newAlert: Alert = {
            id: `ALERT-${Date.now()}`,
            transaction_id: incoming.id,
            severity: "HIGH",
            status: "OPEN",
            message: "Simulated suspicious drift detected",
            created_at: new Date().toISOString(),
          };

          setAlerts((previous) => [newAlert, ...previous].slice(0, 3));
          setStats((previous) => ({
            ...previous,
            high_risk_transactions: previous.high_risk_transactions + 1,
            active_alerts: previous.active_alerts + 1,
          }));
          setLastEvent(`New event: ${incoming.id} flagged for review`);
        }
      } catch {
        setLastEvent("Received unsupported feed payload");
      }
    };

    return () => socket.close();
  }, []);

  const handleSimulate = async () => {
    setIsLoading(true);
    setLastEvent("Sending suspicious transaction simulation...");

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/demo/simulate?mode=suspicious`;
      const response = await fetch(url, { method: "POST" });

      if (!response.ok) {
        throw new Error("Simulation failed");
      }

      const payload = await response.json();
      const tx = payload.data?.transaction as Transaction | undefined;

      if (tx) {
        const mapped: Transaction = {
          ...tx,
          status: "FLAGGED",
          risk_score: 87,
          risk_level: "HIGH",
        };

        setTransactions((previous) => [mapped, ...previous].slice(0, 6));
        const newAlert: Alert = {
          id: `ALERT-${Date.now()}`,
          transaction_id: tx.id,
          severity: "HIGH",
          status: "OPEN",
          message: "Simulated suspicious drift detected",
          created_at: new Date().toISOString(),
        };

        setAlerts((previous) => [newAlert, ...previous].slice(0, 3));
        setStats((previous) => ({
          ...previous,
          high_risk_transactions: previous.high_risk_transactions + 1,
          active_alerts: previous.active_alerts + 1,
        }));
      }

      setLastEvent(`Simulated: ${payload.data?.transaction?.id ?? "new suspicious event"}`);
    } catch {
      setLastEvent("Simulation endpoint unavailable; fallback mode active");
    } finally {
      setIsLoading(false);
    }
  };

  const liveTrackedCount = useMemo(() => Math.max(transactions.length, 1), [transactions.length]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Command center</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Fraud Analyst Dashboard</h1>
            </div>
            <DemoControls isLive={isLive} lastEvent={lastEvent} trackedCount={liveTrackedCount} isLoading={isLoading} onSimulate={handleSimulate} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Transactions" value={stats.total_transactions.toLocaleString()} accent="cyan" />
            <StatCard label="High Risk Transactions" value={stats.high_risk_transactions.toString()} accent="red" />
            <StatCard label="Behavioural Anomalies" value={stats.anomalies.toString()} accent="amber" />
            <StatCard label="Active Alerts" value={stats.active_alerts.toString()} accent="emerald" />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <FraudTrendChart />
            <RiskDistribution />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <RecentTransactions rows={transactions} />
            <RecentAlerts rows={alerts} />
          </div>
        </main>
      </div>
    </div>
  );
}
