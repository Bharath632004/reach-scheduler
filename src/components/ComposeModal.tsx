import { useState, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2, ChevronLeft, Clock } from "lucide-react";
import { scheduleEmails } from "@/services/emailApi";
import { toast } from "sonner";

interface ComposeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduled: () => void;
}

export default function ComposeModal({ open, onOpenChange, onScheduled }: ComposeModalProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [delay, setDelay] = useState(5);
  const [hourlyLimit, setHourlyLimit] = useState(200);
  const [submitting, setSubmitting] = useState(false);
  const [sendLater, setSendLater] = useState(false);

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
        onOpenChange(false);
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
    setSendLater(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0">
        <div className="flex h-[600px]">
          <div className="flex-1 border-r border-gray-200 p-8">
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => {
                  onOpenChange(false);
                  resetForm();
                }}
                className="rounded-lg p-1 hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Compose New Email</h2>
            </div>

            <div className="space-y-4 overflow-y-auto" style={{ maxHeight: "calc(600px - 80px)" }}>
              <div>
                <Label htmlFor="from" className="text-xs font-medium text-gray-600">From</Label>
                <Input id="from" value="oliver.brown@domain.io" disabled className="mt-1 bg-gray-50" />
              </div>

              <div>
                <Label htmlFor="to" className="text-xs font-medium text-gray-600">To</Label>
                <Input id="to" placeholder="recipient@example.com" disabled className="mt-1 bg-gray-50" />
              </div>

              <div>
                <Label htmlFor="subject" className="text-xs font-medium text-gray-600">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="delay" className="text-xs font-medium text-gray-600">Delay between 2 emails</Label>
                  <Input
                    id="delay"
                    type="number"
                    min={1}
                    value={delay}
                    onChange={(e) => setDelay(Number(e.target.value))}
                    className="mt-1 border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="limit" className="text-xs font-medium text-gray-600">Hourly Limit</Label>
                  <Input
                    id="limit"
                    type="number"
                    min={1}
                    value={hourlyLimit}
                    onChange={(e) => setHourlyLimit(Number(e.target.value))}
                    className="mt-1 border-gray-300"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="body" className="text-xs font-medium text-gray-600">Message</Label>
                <Textarea
                  id="body"
                  placeholder="Type Your Reply..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="mt-1 border-gray-300"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-600">Email Leads (CSV / Text)</Label>
                <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    {fileName ? (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">{fileName}</span>
                        <span className="text-xs text-gray-500">({emails.length} emails)</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-600">Upload a CSV or text file</span>
                    )}
                  </div>
                  <input type="file" accept=".csv,.txt,.text" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          </div>

          <div className="w-80 border-l border-gray-200 bg-gray-50 p-8">
            <h3 className="text-lg font-semibold text-gray-900">Send Later</h3>

            <div className="mt-6 space-y-2">
              <button
                onClick={() => setSendLater(false)}
                className="w-full rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                Pick date & time
              </button>

              <button
                onClick={() => {
                  setSendLater(true);
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  const isoString = tomorrow.toISOString().slice(0, 16);
                  setStartTime(isoString);
                }}
                className="w-full rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-white"
              >
                Tomorrow
              </button>

              <button
                onClick={() => {
                  setSendLater(true);
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  tomorrow.setHours(10, 0, 0);
                  const isoString = tomorrow.toISOString().slice(0, 16);
                  setStartTime(isoString);
                }}
                className="w-full rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-white"
              >
                Tomorrow, 10:00 AM
              </button>

              <button
                onClick={() => {
                  setSendLater(true);
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  tomorrow.setHours(11, 0, 0);
                  const isoString = tomorrow.toISOString().slice(0, 16);
                  setStartTime(isoString);
                }}
                className="w-full rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-white"
              >
                Tomorrow, 11:00 AM
              </button>

              <button
                onClick={() => {
                  setSendLater(true);
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  tomorrow.setHours(15, 0, 0);
                  const isoString = tomorrow.toISOString().slice(0, 16);
                  setStartTime(isoString);
                }}
                className="w-full rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-white"
              >
                Tomorrow, 3:00 PM
              </button>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                onClick={() => {
                  onOpenChange(false);
                  resetForm();
                }}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 rounded-lg border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Done"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
