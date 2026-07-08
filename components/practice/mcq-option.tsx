import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type McqOptionState = "unselected" | "selected" | "correct" | "incorrect";

export function McqOption({
  label,
  state,
  disabled,
  onSelect,
}: {
  label: string;
  state: McqOptionState;
  disabled?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex h-12 w-full items-center justify-between rounded-panel border px-4 text-left text-sm font-medium transition-colors",
        state === "unselected" && "border-smoke-400/40 bg-white text-slate-700 hover:border-royal-500/50 hover:bg-mist-100",
        state === "selected" && "border-hema-700 bg-mist-100 text-plum-900",
        state === "correct" && "border-hema-700 bg-mist-100 text-plum-900",
        state === "incorrect" && "border-rose-700/60 bg-cyto-100 text-rose-700",
        disabled && state === "unselected" && "cursor-default opacity-60 hover:border-smoke-400/40 hover:bg-white"
      )}
    >
      {label}
      {state === "correct" && <Check className="h-4 w-4 shrink-0 text-hema-700" />}
      {state === "incorrect" && <X className="h-4 w-4 shrink-0 text-rose-700" />}
    </button>
  );
}
