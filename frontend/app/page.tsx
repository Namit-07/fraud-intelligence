import { FraudDashboard } from "@/components/dashboard/FraudDashboard";
import { getAlerts, getDashboardStats, getTransactions } from "@/lib/api";

export default async function Home() {
  const stats = await getDashboardStats();
  const recentTransactions = await getTransactions();
  const alerts = await getAlerts();

  return <FraudDashboard initialStats={stats} initialTransactions={recentTransactions} initialAlerts={alerts} />;
}
