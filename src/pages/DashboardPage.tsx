import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import ComposeModal from "@/components/ComposeModal";
import EmailListItem from "@/components/EmailListItem";
import { fetchScheduledEmails, fetchSentEmails } from "@/services/emailApi";
import { Email } from "@/types/email";
import { Loader2, Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const [scheduled, setScheduled] = useState<Email[]>([]);
  const [sent, setSent] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"scheduled" | "sent">("scheduled");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, t] = await Promise.all([fetchScheduledEmails(), fetchSentEmails()]);
      setScheduled(s);
      setSent(t);
    } catch {
      // API might not be running yet
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const emails = activeTab === "scheduled" ? scheduled : sent;
  const filtered = emails.filter(
    (e) =>
      e.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        scheduled={scheduled.length}
        sent={sent.length}
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setPage(1); }}
        onCompose={() => setComposeOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Search Header */}
        <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="pl-10 border-0 bg-gray-50 rounded-lg text-sm"
            />
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
          <button onClick={loadData} className="p-2 text-gray-400 hover:text-gray-600">
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-green-600" />
              <p className="text-sm text-gray-500">Loading emails...</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="font-medium text-gray-900">No {activeTab} emails</p>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try a different search" : activeTab === "scheduled" ? "Schedule your first email" : "Sent emails will appear here"}
              </p>
            </div>
          ) : (
            <div>
              {paginated.map((email) => (
                <EmailListItem key={email.id} email={email} type={activeTab} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-3 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-white disabled:text-gray-500"
              >
                ‹
              </button>
              <span className="text-sm text-white">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-white disabled:text-gray-500"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      <ComposeModal open={composeOpen} onOpenChange={setComposeOpen} onScheduled={loadData} />
    </div>
  );
}
