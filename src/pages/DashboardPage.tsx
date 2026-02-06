import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import ComposeModal from "@/components/ComposeModal";
import { fetchScheduledEmails, fetchSentEmails } from "@/services/emailApi";
import { Email } from "@/types/email";
import { Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const [scheduled, setScheduled] = useState<Email[]>([]);
  const [sent, setSent] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const [s, t] = await Promise.all([fetchScheduledEmails(), fetchSentEmails()]);
    setScheduled(s);
    setSent(t);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const allEmails = [...scheduled, ...sent].sort((a, b) =>
    new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  );

  const filteredEmails = allEmails.filter(email =>
    email.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        scheduled={scheduled.length}
        sent={sent.length}
        onCompose={() => setComposeOpen(true)}
      />

      <div className="flex-1">
        <div className="border-b border-gray-200 bg-white px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-green-600" />
              <p className="text-sm text-gray-500">Loading emails...</p>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="font-medium text-gray-900">No emails found</p>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try a different search" : "Schedule your first email to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className="flex cursor-pointer items-center gap-4 rounded-lg border border-gray-200 bg-white px-6 py-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">To: {email.to}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-block rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                        {scheduled.find(e => e.id === email.id) ? "Scheduled" : "Sent"}
                      </span>
                      <p className="text-sm text-gray-600">{email.subject}</p>
                    </div>
                  </div>
                  <p className="text-right text-sm text-gray-500">
                    {format(new Date(email.scheduledAt), "MMM d, h:mm a")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ComposeModal open={composeOpen} onOpenChange={setComposeOpen} onScheduled={loadData} />
    </div>
  );
}
