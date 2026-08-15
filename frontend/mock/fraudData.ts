import { Alert, DashboardStats, EmergingPattern, Transaction } from "@/types/fraud";

export const dashboardStats: DashboardStats = {
  total_transactions: 24831,
  high_risk_transactions: 183,
  anomalies: 67,
  active_alerts: 24,
};

export const transactions: Transaction[] = [
  {
    id: "TXN1047",
    customer_id: "C1024",
    amount: 85000,
    transaction_type: "IMPS",
    timestamp: "2026-08-15T14:08:00Z",
    status: "FLAGGED",
    risk_score: 87,
    risk_level: "HIGH",
  },
  {
    id: "TXN1044",
    customer_id: "C1040",
    amount: 42000,
    transaction_type: "UPI",
    timestamp: "2026-08-15T14:02:00Z",
    status: "REVIEW",
    risk_score: 76,
    risk_level: "HIGH",
  },
  {
    id: "TXN1038",
    customer_id: "C1009",
    amount: 21500,
    transaction_type: "CARD",
    timestamp: "2026-08-15T13:55:00Z",
    status: "REVIEW",
    risk_score: 58,
    risk_level: "MEDIUM",
  },
  {
    id: "TXN1032",
    customer_id: "C1018",
    amount: 6800,
    transaction_type: "NEFT",
    timestamp: "2026-08-15T13:33:00Z",
    status: "COMPLETED",
    risk_score: 31,
    risk_level: "LOW",
  },
  {
    id: "TXN1029",
    customer_id: "C1032",
    amount: 94000,
    transaction_type: "IMPS",
    timestamp: "2026-08-15T13:12:00Z",
    status: "FLAGGED",
    risk_score: 91,
    risk_level: "HIGH",
  },
];

export const alerts: Alert[] = [
  {
    id: "ALERT-1001",
    transaction_id: "TXN1047",
    severity: "HIGH",
    message: "New device + location anomaly",
    status: "OPEN",
    created_at: "2026-08-15T14:09:00Z",
  },
  {
    id: "ALERT-1002",
    transaction_id: "TXN1044",
    severity: "MEDIUM",
    message: "Rapid transaction velocity spike",
    status: "OPEN",
    created_at: "2026-08-15T14:01:00Z",
  },
];

export const patternData: EmergingPattern[] = [
  {
    id: "PATTERN-17",
    pattern_name: "New Device",
    sequence: ["NEW_DEVICE", "LOCATION_CHANGE", "BENEFICIARY_ADDED", "HIGH_VALUE_TRANSACTION"],
    accounts_affected: 47,
    fraud_association: 0.73,
    confidence: 0.91,
  },
  {
    id: "PATTERN-21",
    pattern_name: "Fast Repeated Transfers",
    sequence: ["LOGIN", "KYC_COMPLETE", "MANY_TRANSFERS", "DEVICE_SUSPICION"],
    accounts_affected: 22,
    fraud_association: 0.58,
    confidence: 0.84,
  },
];

export const transactionDetailsMap: Record<string, any> = {
  TXN1047: {
    transaction: {
      id: "TXN1047",
      customer_id: "C1024",
      amount: 85000,
      transaction_type: "IMPS",
      timestamp: "2026-08-15T14:08:00Z",
      status: "FLAGGED",
    },
    risk_assessment: {
      fraud_probability: 0.82,
      anomaly_score: 0.91,
      risk_score: 87,
      risk_level: "HIGH",
      risk_factors: [
        { feature: "transaction_velocity", impact: 24, severity: "HIGH" },
        { feature: "new_device", impact: 19, severity: "HIGH" },
        { feature: "location_anomaly", impact: 16, severity: "HIGH" },
        { feature: "new_beneficiary", impact: 12, severity: "MEDIUM" },
        { feature: "amount_deviation", impact: 8, severity: "MEDIUM" },
      ],
    },
    behaviour_events: [
      { id: "EV-1", customer_id: "C1024", transaction_id: "TXN1047", event_type: "LOGIN", timestamp: "2026-08-15T14:01:00Z", metadata: { channel: "mobile" } },
      { id: "EV-2", customer_id: "C1024", transaction_id: "TXN1047", event_type: "KYC_COMPLETE", timestamp: "2026-08-15T14:02:00Z", metadata: { channel: "portal" } },
      { id: "EV-3", customer_id: "C1024", transaction_id: "TXN1047", event_type: "DEVICE_CHANGE", timestamp: "2026-08-15T14:05:00Z", metadata: { old_device: "iPhone 12", new_device: "Samsung A54" } },
      { id: "EV-4", customer_id: "C1024", transaction_id: "TXN1047", event_type: "LOCATION_CHANGE", timestamp: "2026-08-15T14:06:00Z", metadata: { from: "Bengaluru", to: "Delhi" } },
      { id: "EV-5", customer_id: "C1024", transaction_id: "TXN1047", event_type: "BENEFICIARY_ADDED", timestamp: "2026-08-15T14:07:00Z", metadata: { beneficiary: "Bharat Auto" } },
      { id: "EV-6", customer_id: "C1024", transaction_id: "TXN1047", event_type: "TRANSACTION", timestamp: "2026-08-15T14:08:00Z", metadata: { amount: 85000 } },
      { id: "EV-7", customer_id: "C1024", transaction_id: "TXN1047", event_type: "FRAUD_ALERT", timestamp: "2026-08-15T14:08:30Z", metadata: { status: "raised" } },
    ],
  },
};
