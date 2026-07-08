import { Avatar } from "@/components/ui/avatar";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import type { FacultyMember } from "@/lib/api/types";

export function FacultyBand({ faculty }: { faculty: FacultyMember[] }) {
  return (
    <div>
      <Reveal>
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">
            Written and reviewed by practicing pathologists
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-slate-700">
            Every question and slide is authored by faculty who sit on exam boards
            and practice in academic pathology departments.
          </p>
        </div>
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {faculty.map((member) => (
          <Reveal key={member.id} className="flex flex-col items-center text-center">
            <Avatar name={member.name} size={72} />
            <p className="mt-4 font-semibold text-plum-900">{member.name}</p>
            <p className="text-sm text-smoke-400">{member.title}</p>
            <p className="text-xs text-smoke-400">{member.affiliation}</p>
          </Reveal>
        ))}
      </RevealGroup>
    </div>
  );
}
