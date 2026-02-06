import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock, Send } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import EmailTable from "@/components/EmailTable";
import ComposeModal from "@/components/ComposeModal";
import { fetchScheduledEmails, fetchSentEmails } from "@/services/emailApi";
import { Email } from "@/types/email";

export default function DashboardPage() {
  const [scheduled, setScheduled] = useState<Email[]>([]);
  const [sent, setSent] = useState<Email[]>([]);
  const [loadingScheduled, setLoadingScheduled] = useState(true);
  const [loadingSent, setLoadingSent] = useState(true);

  const loadData = useCallback(async () => {
    setLoadingScheduled(true);
    setLoadingSent(true);
    const [s, t] = await Promise.all([fetchScheduledEmails(), fetchSentEmails()]);
    setScheduled(s);
    setSent(t);
    setLoadingScheduled(false);
    setLoadingSent(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader />

      <main className="flex-1 px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Email Scheduler</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Schedule, track, and manage your email campaigns
              </p>
            </div>
            <ComposeModal onScheduled={loadData} />
          </div>

          <Tabs defaultValue="scheduled" className="space-y-4">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="scheduled" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <CalendarClock className="h-4 w-4" />
                Scheduled
                {!loadingScheduled && (
                  <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary data-[state=active]:bg-primary-foreground/20 data-[state=active]:text-primary-foreground">
                    {scheduled.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Send className="h-4 w-4" />
                Sent
                {!loadingSent && (
                  <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary data-[state=active]:bg-primary-foreground/20 data-[state=active]:text-primary-foreground">
                    {sent.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scheduled" className="animate-fade-in">
              <div className="rounded-xl border border-border bg-card p-1">
                <EmailTable emails={scheduled} isLoading={loadingScheduled} type="scheduled" />
              </div>
            </TabsContent>

            <TabsContent value="sent" className="animate-fade-in">
              <div className="rounded-xl border border-border bg-card p-1">
                <EmailTable emails={sent} isLoading={loadingSent} type="sent" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
