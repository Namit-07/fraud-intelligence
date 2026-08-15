export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatRiskLevel(level: string): string {
  return level.toUpperCase();
}

export function getRiskTone(level?: string): string {
  switch (level?.toUpperCase()) {
    case "HIGH":
      return "bg-red-500/10 text-red-300 border-red-500/40";
    case "MEDIUM":
      return "bg-amber-500/10 text-amber-300 border-amber-500/40";
    default:
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
  }
}
