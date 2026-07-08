import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const GRADIENTS = [
  "from-hema-700 to-royal-500",
  "from-eosin-500 to-rose-700",
  "from-plum-900 to-hema-700",
  "from-royal-500 to-iris-300",
];

export function Avatar({
  name,
  className,
  size = 48,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const gradient = GRADIENTS[name.length % GRADIENTS.length];
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display font-semibold text-white",
        gradient,
        className
      )}
    >
      <span style={{ fontSize: size * 0.36 }}>{initials(name)}</span>
    </div>
  );
}
