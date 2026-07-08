import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-panel bg-mist-100 ${className ?? ""}`}
    />
  );
}

export default function Loading() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col items-center gap-4">
          <SkeletonBlock className="h-6 w-48" />
          <SkeletonBlock className="h-12 w-full max-w-2xl" />
          <SkeletonBlock className="h-6 w-full max-w-xl" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-72 w-full" />
          ))}
        </div>
      </Container>
    </Section>
  );
}
