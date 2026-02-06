import { forwardRef } from "react";
import { Email } from "@/types/email";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Inbox, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface EmailTableProps {
  emails: Email[];
  isLoading: boolean;
  type: "scheduled" | "sent";
}

function StatusBadge({ status }: { status: Email["status"] }) {
  const config: Record<Email["status"], { label: string; className: string }> = {
    scheduled: { label: "Scheduled", className: "bg-primary/10 text-primary border-primary/20" },
    sending: { label: "Sending", className: "bg-warning/10 text-warning border-warning/20" },
    sent: { label: "Sent", className: "bg-success/10 text-success border-success/20" },
    failed: { label: "Failed", className: "bg-destructive/10 text-destructive border-destructive/20" },
  };
  const c = config[status];
  return <Badge variant="outline" className={c.className}>{c.label}</Badge>;
}

const EmailTable = forwardRef<HTMLDivElement, EmailTableProps>(
  ({ emails, isLoading, type }, ref) => {
    if (isLoading) {
      return (
        <div ref={ref} className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Loading emails...</p>
        </div>
      );
    }

    if (emails.length === 0) {
      return (
        <div ref={ref} className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Inbox className="mb-3 h-10 w-10" />
          <p className="font-medium">No {type} emails</p>
          <p className="mt-1 text-xs">
            {type === "scheduled" ? "Schedule your first email to get started" : "Sent emails will appear here"}
          </p>
        </div>
      );
    }

    return (
      <div ref={ref} className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Recipient</TableHead>
              <TableHead className="font-semibold">Subject</TableHead>
              <TableHead className="font-semibold">
                {type === "scheduled" ? "Scheduled Time" : "Sent Time"}
              </TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emails.map((email) => (
              <TableRow key={email.id} className="animate-fade-in">
                <TableCell className="font-medium">{email.to}</TableCell>
                <TableCell className="text-muted-foreground">{email.subject}</TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {format(
                      new Date(type === "sent" && email.sentAt ? email.sentAt : email.scheduledAt),
                      "MMM d, yyyy h:mm a"
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={email.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
);

EmailTable.displayName = "EmailTable";
export default EmailTable;
