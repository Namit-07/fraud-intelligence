export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type AlertStatus = "OPEN" | "ACKNOWLEDGED" | "RESOLVED";

export interface RiskFactor {
  feature: string;
  impact: number;
  severity: RiskLevel | "INFO";
}

export interface RiskAssessment {
  fraud_probability: number;
  anomaly_score: number;
  risk_score: number;
  risk_level: RiskLevel;
  risk_factors: RiskFactor[];
}

export interface BehaviourEvent {
  id: string;
  customer_id: string;
  transaction_id: string;
  event_type: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Transaction {
  id: string;
  customer_id: string;
  amount: number;
  transaction_type: string;
  timestamp: string;
  status: string;
  risk_score?: number;
  risk_level?: RiskLevel;
}

export interface Alert {
  id: string;
  transaction_id: string;
  severity: RiskLevel;
  message: string;
  status: AlertStatus;
  created_at: string;
}

export interface EmergingPattern {
  id: string;
  pattern_name?: string;
  sequence: string[];
  accounts_affected: number;
  fraud_association: number;
  confidence: number;
}

export interface DashboardStats {
  total_transactions: number;
  high_risk_transactions: number;
  anomalies: number;
  active_alerts: number;
}
