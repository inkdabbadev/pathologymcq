"use client";

import { MapPin, Mail, MessageCircle } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { buildWaLink } from "@/components/marketing/whatsapp-button";
import { useSiteSettings } from "@/lib/catalog/hooks";

const EMAIL = "admin@pathologymcq.com";
const ADDRESS = "3/893 Thilagar Street, Ganga Nagar, Medavakkam, Chennai - 600100";

export default function ContactPage() {
  const settings = useSiteSettings();
  const wa = buildWaLink(settings.whatsappNumber, "Hi Pathology MCQ, I need help with");

  return (
    <>
      <div className="bg-ambient relative -mt-[var(--nav-offset)] overflow-hidden pt-[calc(var(--nav-offset)+4rem)] pb-16">
        <Container className="max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">Contact us</h1>
          <p className="mt-6 text-balance text-lg leading-relaxed text-slate-700">
            You can reach us using the details below. Connect via WhatsApp for support with
            courses, enrollment, or account help — every query goes to a practising pathologist.
          </p>
        </Container>
      </div>

      <Section>
        <Container className="max-w-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-rose-700" />
              <div>
                <p className="font-display text-base font-semibold text-plum-900">
                  Operational address
                </p>
                <p className="mt-1 text-slate-700">Pathology MCQs</p>
                <p className="text-slate-700">{ADDRESS}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-rose-700" />
              <div>
                <p className="font-display text-base font-semibold text-plum-900">Email</p>
                <a href={`mailto:${EMAIL}`} className="mt-1 inline-block font-semibold text-rose-700">
                  {EMAIL}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft">
              <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-rose-700" />
              <div>
                <p className="font-display text-base font-semibold text-plum-900">WhatsApp</p>
                <p className="mt-1 text-slate-700">+91 78258 90222</p>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-iris-300/70 bg-white px-5 text-sm font-semibold text-plum-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-royal-500 hover:shadow-soft"
                >
                  <MessageCircle className="h-4 w-4 text-rose-700" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
