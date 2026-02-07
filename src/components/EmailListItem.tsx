import { Email } from "@/types/email";
import { Star, Clock } from "lucide-react";
import { format } from "date-fns";

interface EmailListItemProps {
  email: Email;
  type: "scheduled" | "sent";
}

export default function EmailListItem({ email, type }: EmailListItemProps) {
  const time = type === "sent" && email.sentAt ? email.sentAt : email.scheduledAt;
  const formattedTime = format(new Date(time), "EEE h:mm:ss a");

  // Extract display name from email address
  const displayName = email.to.includes("@")
    ? email.to.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : email.to;

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-4 transition-colors hover:bg-gray-50 cursor-pointer">
      {/* Recipient */}
      <div className="w-44 flex-shrink-0">
        <p className="text-sm text-gray-700">To: {displayName}</p>
      </div>

      {/* Status Badge */}
      {type === "scheduled" ? (
        <div className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 flex-shrink-0">
          <Clock className="h-3 w-3 text-orange-600" />
          <span className="text-xs font-medium text-orange-700">{formattedTime}</span>
        </div>
      ) : (
        <div className="rounded-full border border-green-300 bg-green-50 px-3 py-1 flex-shrink-0">
          <span className="text-xs font-medium text-green-700">Sent</span>
        </div>
      )}

      {/* Subject + Preview */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900 flex-shrink-0">{email.subject}</span>
        <span className="text-sm text-gray-400 truncate">- {email.body || "No preview available"}</span>
      </div>

      {/* Star */}
      <button className="flex-shrink-0 text-gray-300 hover:text-yellow-400 transition-colors">
        <Star className="h-5 w-5" />
      </button>
    </div>
  );
}
