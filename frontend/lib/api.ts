import { Alert, DashboardStats, EmergingPattern, Transaction } from "@/types/fraud";
import { alerts, dashboardStats, patternData, transactions, transactionDetailsMap } from "@/mock/fraudData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, { cache: "no-store" });
    if (!response.ok) {
      return fallback;
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const stats = await fetchJson<DashboardStats>("/api/dashboard/stats", dashboardStats);
  return stats;
}

export async function getTransactions(): Promise<Transaction[]> {
  const payload = await fetchJson<{ items?: Transaction[] }>("/api/transactions?page=1&limit=10", { items: transactions });
  return payload.items ?? transactions;
}

export async function getTransaction(id: string): Promise<any> {
  const detail = await fetchJson<any>(`/api/transactions/${id}`, transactionDetailsMap[id] ?? transactionDetailsMap.TXN1047);
  return detail;
}

export async function getPatterns(): Promise<EmergingPattern[]> {
  return await fetchJson<EmergingPattern[]>("/api/patterns", patternData);
}

export async function getAlerts(): Promise<Alert[]> {
  return await fetchJson<Alert[]>("/api/alerts", alerts);
}
