import { Activity, AlertCircle, BadgeCheck, CircleUserRound, MapPin, Smartphone, Wallet } from "lucide-react";

interface EventItem {
  id: string;
  event_type: string;
  timestamp: string;
}

const eventStyles: Record<string, { icon: any; tone: string }> = {
  LOGIN: { icon: CircleUserRound, tone: "text-cyan-300 bg-cyan-500/10" },
  KYC_COMPLETE: { icon: BadgeCheck, tone: "text-emerald-300 bg-emerald-500/10" },
  DEVICE_CHANGE: { icon: Smartphone, tone: "text-violet-300 bg-violet-500/10" },
  LOCATION_CHANGE: { icon: MapPin, tone: "text-amber-300 bg-amber-500/10" },
  BENEFICIARY_ADDED: { icon: Wallet, tone: "text-pink-300 bg-pink-500/10" },
  TRANSACTION: { icon: Activity, tone: "text-red-300 bg-red-500/10" },
  FRAUD_ALERT: { icon: AlertCircle, tone: "text-red-400 bg-red-500/10" },
};

export function BehaviourTimeline({ events }: { events: EventItem[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="text-lg font-semibold text-white">Behaviour Timeline</h3>
      <div className="mt-6 space-y-4">
        {events.map((event) => {
          const config = eventStyles[event.event_type] ?? {
            icon: Activity,
            tone: "text-slate-300 bg-slate-800",
          };
          const Icon = config.icon;

          return (
            <div key={event.id} className="flex items-start gap-4">
              <div className={`rounded-full p-2 ${config.tone}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-100">{event.event_type}</span>
                  <span className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
