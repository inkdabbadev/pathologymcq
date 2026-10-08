"use client";

import { useEffect } from "react";
import {
  ArrowUpRight,
  GraduationCap,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { buildWaLink } from "@/components/marketing/whatsapp-button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { useSiteSettings } from "@/lib/catalog/hooks";

const EMAIL = "admin@pathologymcq.com";
const ADDRESS = "3/893 Thilagar Street, Ganga Nagar, Medavakkam, Chennai - 600100";

export default function ContactPage() {
  const settings = useSiteSettings();
  const wa = buildWaLink(
    settings.whatsappNumber,
    "Hi Pathology MCQ, I would like to join the WhatsApp group.",
  );

  useEffect(() => {
    if (window.location.hash !== "#whatsapp") return;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById("whatsapp")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <div className="bg-ambient relative -mt-[var(--nav-offset)] overflow-hidden pt-[calc(var(--nav-offset)+3.5rem)] pb-14 sm:pt-[calc(var(--nav-offset)+5rem)] sm:pb-20">
        <div className="pointer-events-none absolute -top-28 right-[-7rem] h-80 w-80 rounded-full bg-iris-300/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-9rem] left-[-6rem] h-72 w-72 rounded-full bg-rose-300/20 blur-3xl" />
        <Container className="relative max-w-4xl text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-plum-900 sm:text-6xl">
            Let&apos;s talk pathology
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-7 text-slate-700 sm:text-lg">
            Questions about a course, enrollment, or your account? Reach our team directly and
            get help from people who understand pathology education.
          </p>
        </Container>
      </div>

      <Section className="min-h-[calc(100vh-var(--nav-offset))] pt-10 sm:pt-14">
        <Container id="whatsapp" className="scroll-mt-28 max-w-6xl">
          <div className="grid items-stretch gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <article
              className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#542380] via-[#6f329b] to-[#34114f] p-7 text-white shadow-[0_24px_70px_rgba(63,25,91,0.22)] sm:p-10"
            >
              <div className="flex h-full flex-col">
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] shadow-lg shadow-black/15">
                    <WhatsAppIcon className="h-7 w-7" />
                  </div>
                </div>

                <div className="mt-9 max-w-xl">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/60">
                    Pathology MCQ community
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
                    Join our WhatsApp group
                  </h2>
                  <p className="mt-4 max-w-lg leading-7 text-white/75">
                    Stay connected for course updates, study guidance, announcements, and support
                    from the Pathology MCQ team.
                  </p>
                  <p className="mt-4 font-display text-lg font-semibold text-white">
                    +91 78258 90222
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-3 text-sm text-white/80">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2">
                    <GraduationCap className="h-4 w-4 text-rose-300" /> Course guidance
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2">
                    <ShieldCheck className="h-4 w-4 text-rose-300" /> Direct support
                  </span>
                </div>

                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-9 inline-flex h-13 w-fit items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-bold text-[#103c21] shadow-lg shadow-black/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#36df76] hover:shadow-xl"
                >
                  Join on WhatsApp
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </article>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <article className="rounded-[1.75rem] border border-iris-300/30 bg-white p-7 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="mt-5 font-display text-xl font-bold text-plum-900">Send us an email</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  For detailed questions, account support, or business enquiries.
                </p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="mt-5 inline-flex items-center gap-2 break-all text-sm font-bold text-rose-700 hover:text-rose-800"
                >
                  {EMAIL}
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                </a>
              </article>

              <article className="rounded-[1.75rem] border border-iris-300/30 bg-white p-7 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-iris-100 text-royal-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <h2 className="mt-5 font-display text-xl font-bold text-plum-900">Our office</h2>
                <p className="mt-2 text-sm font-semibold text-slate-800">Pathology MCQs</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{ADDRESS}</p>
              </article>
            </div>
          </div>

        </Container>
      </Section>
    </>
  );
}
