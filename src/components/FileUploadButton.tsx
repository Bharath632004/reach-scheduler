import { useCallback } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface FileUploadButtonProps {
  onParsed: (emails: string[]) => void;
}

export default function FileUploadButton({ onParsed }: FileUploadButtonProps) {
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = text
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
      if (parsed.length === 0) {
        toast.error("No valid emails found in file");
      } else {
        toast.success(`Found ${parsed.length} email addresses`);
        onParsed(parsed);
      }
    };
    reader.readAsText(file);
  }, [onParsed]);

  return (
    <label className="mt-2 inline-flex items-center gap-2 cursor-pointer text-green-600 hover:text-green-700">
      <Upload className="h-4 w-4" />
      <span className="text-sm font-medium">Upload List</span>
      <input type="file" accept=".csv,.txt,.text" className="hidden" onChange={handleFileUpload} />
    </label>
  );
}
