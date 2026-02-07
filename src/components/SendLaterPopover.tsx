import { useState } from "react";
import { Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface SendLaterPopoverProps {
  startTime: string;
  onTimeSelect: (time: string) => void;
}

export default function SendLaterPopover({ startTime, onTimeSelect }: SendLaterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const presets = [
    { label: "Tomorrow", time: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); return d; } },
    { label: "Tomorrow, 10:00 AM", time: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0); return d; } },
    { label: "Tomorrow, 11:00 AM", time: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(11, 0, 0, 0); return d; } },
    { label: "Tomorrow, 3:00 PM", time: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(15, 0, 0, 0); return d; } },
  ];

  const selectPreset = (preset: typeof presets[0]) => {
    const d = preset.time();
    onTimeSelect(d.toISOString().slice(0, 16));
    setDate(d);
  };

  const handleDone = () => {
    if (date) {
      onTimeSelect(date.toISOString().slice(0, 16));
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <Clock className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Send Later</h3>

          {/* Date picker trigger */}
          <div className="mb-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < new Date()}
              className={cn("p-3 pointer-events-auto")}
            />
          </div>

          {/* Presets */}
          <div className="space-y-1 border-t border-gray-100 pt-3">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => selectPreset(preset)}
                className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
            <button onClick={() => setOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </button>
            <button
              onClick={handleDone}
              className="rounded-full border border-green-600 px-5 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50"
            >
              Done
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
