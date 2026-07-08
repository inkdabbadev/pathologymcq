import type { LucideIcon } from "lucide-react";

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex flex-col gap-4 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="flex h-12 w-12 items-center justify-center rounded-panel bg-cyto-100 text-rose-700 transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-semibold text-plum-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-700">{description}</p>
    </div>
  );
}
