import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Send, Plus } from "lucide-react";

interface SidebarProps {
  scheduled: number;
  sent: number;
  onCompose: () => void;
}

export default function Sidebar({ scheduled, sent, onCompose }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <div className="w-64 border-r border-gray-200 bg-white p-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <span className="text-lg font-bold text-green-700">{user?.name?.[0] || "O"}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{user?.name || "User"}</p>
          <p className="truncate text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>

      <Button
        onClick={onCompose}
        className="mb-8 w-full gap-2 rounded-full border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
        variant="outline"
      >
        <Plus className="h-4 w-4" />
        Compose
      </Button>

      <div className="space-y-0.5">
        <p className="px-3 text-xs font-semibold uppercase tracking-wide text-gray-500">CORE</p>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">
          <Clock className="h-5 w-5 flex-shrink-0 text-gray-400" />
          <span className="flex-1 text-left">Scheduled</span>
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">{scheduled}</span>
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">
          <Send className="h-5 w-5 flex-shrink-0 text-gray-400" />
          <span className="flex-1 text-left">Sent</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{sent}</span>
        </button>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-4">
        <button
          onClick={logout}
          className="w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
