import { useAuth } from "@/hooks/useAuth";
import { Clock, Send, ChevronDown } from "lucide-react";

interface SidebarProps {
  scheduled: number;
  sent: number;
  activeTab: "scheduled" | "sent";
  onTabChange: (tab: "scheduled" | "sent") => void;
  onCompose: () => void;
}

export default function Sidebar({ scheduled, sent, activeTab, onTabChange, onCompose }: SidebarProps) {
  const { user } = useAuth();

  return (
    <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
      {/* Logo */}
      <div className="px-6 pt-5 pb-4">
        <h1 className="text-2xl font-black tracking-tight text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
          ONB
        </h1>
      </div>

      {/* User Info */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || "https://i.pravatar.cc/40?u=oliver"}
            alt={user?.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="truncate text-sm font-semibold text-gray-900">{user?.name || "Oliver Brown"}</p>
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
            <p className="truncate text-xs text-gray-500">{user?.email || "oliver.brown@domain.io"}</p>
          </div>
        </div>
      </div>

      {/* Compose Button */}
      <div className="px-6 pb-6">
        <button
          onClick={onCompose}
          className="w-full rounded-lg border border-green-600 py-2.5 text-sm font-semibold text-green-600 transition-colors hover:bg-green-50"
        >
          Compose
        </button>
      </div>

      {/* Navigation */}
      <div className="px-4">
        <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Core</p>

        <button
          onClick={() => onTabChange("scheduled")}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            activeTab === "scheduled"
              ? "bg-green-50 font-semibold text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left">Scheduled</span>
          <span className="text-sm text-gray-500">{scheduled}</span>
        </button>

        <button
          onClick={() => onTabChange("sent")}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            activeTab === "sent"
              ? "bg-green-50 font-semibold text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Send className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left">Sent</span>
          <span className="text-sm text-gray-500">{sent}</span>
        </button>
      </div>
    </div>
  );
}
