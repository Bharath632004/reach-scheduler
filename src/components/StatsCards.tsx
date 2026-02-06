import { CalendarClock, Send, CheckCircle2, AlertTriangle } from "lucide-react";
import { Email } from "@/types/email";

interface StatsCardsProps {
  scheduled: Email[];
  sent: Email[];
  isLoading: boolean;
}

export default function StatsCards({ scheduled, sent, isLoading }: StatsCardsProps) {
  const sentCount = sent.filter(e => e.status === "sent").length;
  const failedCount = sent.filter(e => e.status === "failed").length;

  const cards = [
    { label: "Scheduled", value: scheduled.length, icon: CalendarClock, color: "text-primary" },
    { label: "Total Sent", value: sent.length, icon: Send, color: "text-muted-foreground" },
    { label: "Delivered", value: sentCount, icon: CheckCircle2, color: "text-success" },
    { label: "Failed", value: failedCount, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border bg-card p-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <card.icon className={`h-4 w-4 ${card.color}`} />
            <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {isLoading ? "—" : card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
