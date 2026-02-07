import { useState, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Clock, ChevronLeft, X } from "lucide-react";
import { scheduleEmails } from "@/services/emailApi";
import { toast } from "sonner";
import SendLaterPopover from "@/components/SendLaterPopover";
import FileUploadButton from "@/components/FileUploadButton";
import EmailChips from "@/components/EmailChips";
import FormattingToolbar from "@/components/FormattingToolbar";

interface ComposeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduled: () => void;
}

export default function ComposeModal({ open, onOpenChange, onScheduled }: ComposeModalProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [delay, setDelay] = useState(0);
  const [hourlyLimit, setHourlyLimit] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = useCallback((parsed: string[]) => {
    setEmails(parsed);
  }, []);

  const removeEmail = (idx: number) => {
    setEmails(emails.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!subject || !body || emails.length === 0 || !startTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await scheduleEmails({
        subject, body, emails, startTime,
        delayBetweenEmails: delay, hourlyLimit,
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
    setSubject(""); setBody(""); setEmails([]);
    setStartTime(""); setDelay(0); setHourlyLimit(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { onOpenChange(false); resetForm(); }} className="p-1 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Compose New Email</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Paperclip className="h-5 w-5" />
            </button>
            <SendLaterPopover startTime={startTime} onTimeSelect={setStartTime} />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-full border border-green-600 bg-white px-6 py-2 text-sm font-medium text-green-600 hover:bg-green-50 disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-5">
            {/* From */}
            <div className="flex items-center gap-6">
              <label className="w-24 text-sm text-gray-500">From</label>
              <div className="flex-1 text-sm text-gray-700">oliver.brown@domain.io <span className="text-gray-400">▾</span></div>
            </div>

            {/* To */}
            <div className="flex items-start gap-6">
              <label className="w-24 text-sm text-gray-500 pt-2">To</label>
              <div className="flex-1">
                {emails.length > 0 ? (
                  <EmailChips emails={emails} onRemove={removeEmail} />
                ) : (
                  <Input placeholder="recipient@example.com" className="border-0 border-b border-gray-200 rounded-none px-0 focus-visible:ring-0" />
                )}
                <FileUploadButton onParsed={handleFileUpload} />
              </div>
            </div>

            {/* Subject */}
            <div className="flex items-center gap-6">
              <label className="w-24 text-sm text-gray-500">Subject</label>
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 border-0 border-b border-gray-200 rounded-none px-0 focus-visible:ring-0"
              />
            </div>

            {/* Delay & Hourly Limit */}
            <div className="flex items-center gap-6">
              <label className="w-48 text-sm text-gray-500">Delay between 2 emails</label>
              <Input
                type="number" min={0} value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                className="w-20 text-center border-gray-300"
                placeholder="00"
              />
              <label className="text-sm text-gray-500 ml-4">Hourly Limit</label>
              <Input
                type="number" min={0} value={hourlyLimit}
                onChange={(e) => setHourlyLimit(Number(e.target.value))}
                className="w-20 text-center border-gray-300"
                placeholder="00"
              />
            </div>

            {/* Message */}
            <Textarea
              placeholder="Type Your Reply..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[200px] border-gray-200 rounded-lg resize-none"
              rows={10}
            />

            <FormattingToolbar />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
