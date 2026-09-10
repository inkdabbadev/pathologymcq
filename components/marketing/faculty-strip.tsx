"use client";

import { Avatar } from "@/components/ui/avatar";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { useFaculty } from "@/lib/catalog/hooks";

/** Homepage faculty grid — mirrors the live site's faculty section. */
export function FacultyStrip() {
  const q = useFaculty();
  const members = q.data ?? [];
  if (members.length === 0) return null;

  return (
    <RevealGroup className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {members.map((m) => (
        <Reveal key={m.id}>
          <div className="flex flex-col items-center gap-2 text-center">
            {m.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.avatarUrl} alt="" className="h-[72px] w-[72px] rounded-full object-cover" />
            ) : (
              <Avatar name={m.name} size={72} />
            )}
            <p className="mt-1 font-display text-sm font-semibold text-plum-900">{m.name}</p>
            <p className="text-xs leading-snug text-slate-700">{m.title}</p>
            {m.affiliation && (
              <p className="text-xs leading-snug text-smoke-400">{m.affiliation}</p>
            )}
          </div>
        </Reveal>
      ))}
    </RevealGroup>
  );
}
