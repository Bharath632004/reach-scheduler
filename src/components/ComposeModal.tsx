import { useState, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Loader2, ChevronLeft, Clock, X } from "lucide-react";
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

  const removeEmail = (indexToRemove: number) => {
    setEmails(emails.filter((_, idx) => idx !== indexToRemove));
  };

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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 max-h-screen flex flex-col">
        <div className="border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
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

          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-green-600 hover:bg-green-50">
              <Upload className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-green-600 hover:bg-green-50">
              <Clock className="h-5 w-5" />
            </button>
            <Button
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setStartTime(tomorrow.toISOString().slice(0, 16));
              }}
              className="rounded-full border border-green-600 bg-white px-6 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
            >
              Send Later
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium text-gray-900">From</label>
              <div className="flex-1 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
                oliver.brown@domain.io
              </div>
            </div>

            <div className="flex items-start gap-4">
              <label className="w-20 text-sm font-medium text-gray-900 pt-3">To</label>
              <div className="flex-1">
                {emails.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {emails.slice(0, 3).map((email, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-50 px-3 py-1"
                      >
                        <span className="text-sm text-green-700">{email}</span>
                        <button
                          onClick={() => removeEmail(idx)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {emails.length > 3 && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-50 px-3 py-1">
                        <span className="text-sm font-medium text-green-700">+{emails.length - 3}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <Input
                    placeholder="recipient@example.com"
                    className="border-gray-300"
                  />
                )}
                <label className="mt-2 flex items-center justify-end gap-2 cursor-pointer">
                  <Upload className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Upload List</span>
                  <input type="file" accept=".csv,.txt,.text" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium text-gray-900">Subject</label>
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 border-gray-300"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-20 text-sm font-medium text-gray-900">Delay between 2 emails</label>
              <Input
                type="number"
                min={1}
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                className="w-24 border-gray-300"
              />
              <label className="text-sm font-medium text-gray-900 ml-6">Hourly Limit</label>
              <Input
                type="number"
                min={1}
                value={hourlyLimit}
                onChange={(e) => setHourlyLimit(Number(e.target.value))}
                className="w-24 border-gray-300"
              />
            </div>

            <div className="flex gap-4">
              <label className="w-20 pt-3 text-sm font-medium text-gray-900">Message</label>
              <Textarea
                placeholder="Type Your Reply..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="flex-1 border-gray-300 rounded-lg"
                rows={8}
              />
            </div>

            <div className="flex gap-4">
              <label className="w-20 text-sm font-medium text-gray-900">Formatting</label>
              <div className="flex flex-wrap gap-3 items-center text-gray-400">
                <button className="hover:text-gray-600">↶</button>
                <button className="hover:text-gray-600">↷</button>
                <button className="hover:text-gray-600">T</button>
                <button className="hover:text-gray-600">B</button>
                <button className="hover:text-gray-600">I</button>
                <button className="hover:text-gray-600">U</button>
                <button className="hover:text-gray-600">≡</button>
                <button className="hover:text-gray-600">◇</button>
                <button className="hover:text-gray-600">≡</button>
                <button className="hover:text-gray-600">≡</button>
                <button className="hover:text-gray-600">≡</button>
                <button className="hover:text-gray-600">❝</button>
                <button className="hover:text-gray-600">⎕</button>
                <button className="hover:text-gray-600">S</button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
