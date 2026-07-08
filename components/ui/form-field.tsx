import * as React from "react";

import { cn } from "@/lib/utils";

export function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-plum-900">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-rose-700">{error}</p>}
    </div>
  );
}

export const inputClassName = (hasError?: boolean) =>
  cn(
    "h-11 w-full rounded-panel border bg-white px-4 text-sm text-ink-900 outline-none transition-colors placeholder:text-smoke-400 focus:border-royal-500 focus:ring-2 focus:ring-royal-500/20",
    hasError ? "border-rose-700/60" : "border-iris-300/50"
  );
