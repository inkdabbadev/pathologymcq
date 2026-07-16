import { FlaskConical } from "lucide-react";

/** Dev-only signal that a response came from the mock fallback, not a real WordPress call. */
export function MockModeBadge() {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
      <FlaskConical className="h-3 w-3" />
      MOCK
    </span>
  );
}
