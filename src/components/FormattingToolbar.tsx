import { Undo2, Redo2, Type, Bold, Italic, Underline, AlignCenter, ChevronUp, List, ListOrdered, IndentIncrease, IndentDecrease, Quote, Save, Strikethrough } from "lucide-react";

const tools = [
  { icon: Undo2, label: "Undo" },
  { icon: Redo2, label: "Redo" },
  { divider: true },
  { icon: Type, label: "Font" },
  { divider: true },
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
  { divider: true },
  { icon: AlignCenter, label: "Align" },
  { icon: ChevronUp, label: "Vertical" },
  { divider: true },
  { icon: ListOrdered, label: "Ordered List" },
  { icon: List, label: "Unordered List" },
  { icon: IndentIncrease, label: "Indent" },
  { icon: IndentDecrease, label: "Outdent" },
  { divider: true },
  { icon: Quote, label: "Quote" },
  { icon: Save, label: "Save" },
  { icon: Strikethrough, label: "Strikethrough" },
];

export default function FormattingToolbar() {
  return (
    <div className="flex items-center gap-1 border-t border-gray-200 pt-3">
      {tools.map((tool, idx) =>
        "divider" in tool ? (
          <div key={idx} className="mx-1 h-5 w-px bg-gray-200" />
        ) : (
          <button
            key={idx}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title={tool.label}
          >
            {tool.icon && <tool.icon className="h-4 w-4" />}
          </button>
        )
      )}
    </div>
  );
}
