import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Avatar } from "@/components/ui/avatar";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { CtaBand } from "@/components/marketing/cta-band";
import { getTeamMembers } from "@/lib/api/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the team of practicing pathologists behind Pathology MCQ — the faculty writing and reviewing every question, slide and mock test.",
};

export default async function AboutPage() {
  const team = await getTeamMembers();

  return (
    <>
      <div className="bg-ambient relative -mt-[var(--nav-offset)] overflow-hidden pt-[calc(var(--nav-offset)+4rem)] pb-16">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">
              About Us
            </h1>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-6 text-balance text-lg leading-relaxed text-slate-700">
              Our dedicated team of pathologists are committed to creating a reliable,
              comprehensive resource for pathology students, residents, and practitioners.
              Together, we aim to support your journey through the world of pathology, providing
              tools and resources designed to help you excel in your studies and practice.
              Whether you&apos;re revising for an upcoming exam or exploring specific pathology
              topics, the team is here to assist at every step.
            </p>
          </Reveal>
        </Container>
      </div>

      <Section>
        <Container>
          <Reveal>
            <h2 className="text-center font-display text-2xl font-bold text-plum-900 sm:text-3xl">
              Meet the team
            </h2>
          </Reveal>

          <RevealGroup className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Reveal key={member.id} className="flex flex-col items-center text-center">
                <Avatar name={member.name} size={88} />
                <p className="mt-4 font-display text-lg font-semibold text-plum-900">
                  {member.name}
                </p>
                <p className="mt-1 text-sm text-slate-700">{member.title}</p>
                {member.affiliation && (
                  <p className="mt-1 text-xs text-smoke-400">{member.affiliation}</p>
                )}
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section>
        <CtaBand />
      </Section>
    </>
  );
}
