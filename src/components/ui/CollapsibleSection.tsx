import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function CollapsibleSection({
    title,
    children,
    defaultOpen = true,
    headerAdditionalClass = "bg-parchment", // new optional prop
  }: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    headerAdditionalClass?: string;
  }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
  
    return (
      <div className="border rounded-xl overflow-hidden mb-2">
        <button
          className={`w-full flex justify-between items-center p-4 ${headerAdditionalClass}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-semibold">{title}</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        <div
          className={`transition-all duration-300 ${
            isOpen ? "max-h-[500px] opacity-100 p-4" : "max-h-0 opacity-0 p-0"
          } overflow-hidden`}
        >
          {children}
        </div>
      </div>
    );
  }