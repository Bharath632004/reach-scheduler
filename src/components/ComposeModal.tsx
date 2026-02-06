import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Upload, FileText, Loader2 } from "lucide-react";
import { scheduleEmails } from "@/services/emailApi";
import { toast } from "sonner";

export default function ComposeModal({ onScheduled }: { onScheduled: () => void }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [delay, setDelay] = useState(5);
  const [hourlyLimit, setHourlyLimit] = useState(200);
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = text
        .split(/[\n,;]+/)
        .map(s => s.trim())
        .filter(s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
      setEmails(parsed);
      if (parsed.length === 0) {
        toast.error("No valid emails found in file");
      } else {
        toast.success(`Found ${parsed.length} email addresses`);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleSubmit = async () => {
    if (!subject || !body || emails.length === 0 || !startTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await scheduleEmails({
        subject,
        body,
        emails,
        startTime,
        delayBetweenEmails: delay,
        hourlyLimit,
      });
      if (res.success) {
        toast.success(`Scheduled ${res.count} emails successfully!`);
        setOpen(false);
        resetForm();
        onScheduled();
      }
    } catch {
      toast.error("Failed to schedule emails");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubject("");
    setBody("");
    setEmails([]);
    setFileName("");
    setStartTime("");
    setDelay(5);
    setHourlyLimit(200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Compose New Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule Email Campaign</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Email subject line" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="body">Body</Label>
            <Textarea id="body" placeholder="Write your email content..." rows={4} value={body} onChange={e => setBody(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Email Leads (CSV / Text)</Label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/60">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                {fileName ? (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{fileName}</span>
                    <span className="ml-1 text-xs text-muted-foreground">({emails.length} emails)</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Upload a CSV or text file with email addresses</span>
                )}
              </div>
              <input type="file" accept=".csv,.txt,.text" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="delay">Delay (sec)</Label>
              <Input id="delay" type="number" min={1} value={delay} onChange={e => setDelay(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="limit">Hourly Limit</Label>
              <Input id="limit" type="number" min={1} value={hourlyLimit} onChange={e => setHourlyLimit(Number(e.target.value))} />
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              `Schedule ${emails.length > 0 ? emails.length : ""} Email${emails.length !== 1 ? "s" : ""}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
