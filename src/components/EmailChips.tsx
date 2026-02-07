import { X } from "lucide-react";

interface EmailChipsProps {
  emails: string[];
  onRemove: (index: number) => void;
}

export default function EmailChips({ emails, onRemove }: EmailChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {emails.slice(0, 3).map((email, idx) => (
        <div key={idx} className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-50 px-3 py-1">
          <span className="text-sm text-green-700">{email}</span>
          <button onClick={() => onRemove(idx)} className="text-green-600 hover:text-green-800">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      {emails.length > 3 && (
        <div className="inline-flex items-center rounded-full border border-green-300 bg-green-50 px-3 py-1">
          <span className="text-sm font-medium text-green-700">+{emails.length - 3}</span>
        </div>
      )}
    </div>
  );
}
