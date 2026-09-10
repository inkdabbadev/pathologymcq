"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Pencil, Plus, Save, Trash2, X } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/marketing/cta-band";
import type { FacultyMember } from "@/lib/api/types";
import { uploadImage } from "@/lib/blog/api";
import { useEdit } from "@/lib/edit/edit-context";
import { useFaculty, useCreateFaculty, useUpdateFaculty, useDeleteFaculty, useSiteSettings } from "@/lib/catalog/hooks";

const field =
  "mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500";

function MemberEdit({ member, onDone }: { member: FacultyMember; onDone: () => void }) {
  const update = useUpdateFaculty();
  const [name, setName] = React.useState(member.name);
  const [title, setTitle] = React.useState(member.title);
  const [affiliation, setAffiliation] = React.useState(member.affiliation);
  const [avatarUrl, setAvatarUrl] = React.useState(member.avatarUrl);
  const [uploading, setUploading] = React.useState(false);

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      setAvatarUrl(await uploadImage(f));
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    await update.mutateAsync({ id: member.id, patch: { name, title, affiliation, avatarUrl } });
    onDone();
  }

  return (
    <div className="flex flex-col gap-2 rounded-card border border-royal-500/50 bg-white p-4 text-left shadow-soft">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <Avatar name={name || "?"} size={56} />
        )}
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-iris-300/60 px-3 py-1.5 text-xs text-plum-900 hover:border-royal-500">
          {uploading ? "Uploading…" : "Upload photo"}
          <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
        </label>
      </div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className={field} />
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title / qualifications" className={field} />
      <input value={affiliation} onChange={(e) => setAffiliation(e.target.value)} placeholder="Affiliation" className={field} />
      <div className="flex gap-2">
        <Button size="sm" disabled={update.isPending} onClick={save}>
          <Save className="h-4 w-4" /> Save
        </Button>
        <Button size="sm" variant="ghost" onClick={onDone}>
          <X className="h-4 w-4" /> Cancel
        </Button>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { editMode } = useEdit();
  const settings = useSiteSettings();
  const faculty = useFaculty();
  const createFaculty = useCreateFaculty();
  const deleteFaculty = useDeleteFaculty();
  const [newName, setNewName] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const team = faculty.data ?? [];

  return (
    <>
      <div className="bg-ambient relative -mt-[var(--nav-offset)] overflow-hidden pt-[calc(var(--nav-offset)+4rem)] pb-16">
        <Container className="max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">{settings.aboutHeading}</h1>
          <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed text-slate-700">
            {settings.aboutIntro.split("\n\n").map((para, i) => (
              <p key={i} className="text-balance">{para}</p>
            ))}
          </div>
        </Container>
      </div>

      <Section>
        <Container>
          <h2 className="text-center font-display text-2xl font-bold text-plum-900 sm:text-3xl">
            {settings.aboutTeamHeading}
          </h2>

          {editMode && (
            <div className="mx-auto mt-6 flex max-w-md items-end gap-2 rounded-card border border-dashed border-royal-500/50 bg-mist-100/60 p-4">
              <div className="flex-1">
                <label className="text-sm font-semibold text-plum-900">Add member</label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Dr. Name"
                  className={field}
                />
              </div>
              <Button
                disabled={!newName.trim() || createFaculty.isPending}
                onClick={() =>
                  createFaculty.mutate(
                    { name: newName },
                    { onSuccess: (m) => { setNewName(""); setEditingId(m.id); } }
                  )
                }
              >
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) =>
              editMode && editingId === member.id ? (
                <MemberEdit key={member.id} member={member} onDone={() => setEditingId(null)} />
              ) : (
                <div key={member.id} className="group relative flex flex-col items-center text-center">
                  {member.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.avatarUrl} alt="" className="h-[88px] w-[88px] rounded-full object-cover" />
                  ) : (
                    <Avatar name={member.name} size={88} />
                  )}
                  <p className="mt-4 font-display text-lg font-semibold text-plum-900">{member.name}</p>
                  <p className="mt-1 text-sm text-slate-700">{member.title}</p>
                  {member.affiliation && (
                    <p className="mt-1 text-xs text-smoke-400">{member.affiliation}</p>
                  )}
                  {editMode && (
                    <div className="absolute right-0 top-0 flex gap-1 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={() => setEditingId(member.id)}
                        className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-royal-500"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove ${member.name}?`)) deleteFaculty.mutate(member.id);
                        }}
                        className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-rose-700"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </Container>
      </Section>

      {/* Why choose us */}
      <Section ambient>
        <Container>
          <div className="rounded-hero bg-mist-100/60 p-8 sm:p-12">
            <h2 className="font-display text-2xl font-bold text-plum-900 sm:text-3xl">Why choose us</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              {[
                { title: "Built by Practising Pathologists", body: "Every course, MCQ, and note is authored and reviewed by consultant pathologists who understand real exam pressure and clinical practice." },
                { title: "WHO-Aligned, Continuously Updated", body: "Content mapped to WHO 5th Edition classifications with ongoing 6th Edition updates — plus references from Ackerman, Sternberg, and standard texts." },
                { title: "Image-Rich, Exam-Authentic MCQs", body: "High-yield questions with annotated slides, detailed explanations, and mock tests that mirror FRCPath, NEET-SS, and INI-SS patterns." },
                { title: "Complete Exam Prep Ecosystem", body: "Online courses, hard-copy notes, mock papers, flashcards, and bundles — structured pathways from residency through superspeciality exams." },
              ].map((c) => (
                <div key={c.title}>
                  <h3 className="font-display text-base font-semibold text-plum-900">{c.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{c.body}</p>
                </div>
              ))}
            </div>
            <ul className="mt-8 flex flex-col gap-2 border-t border-iris-300/40 pt-6">
              {[
                "Built by practising pathologists — every course, MCQ, and note authored and reviewed by consultants",
                "WHO-aligned content with continuous classification updates and standard textbook references",
                "Image-rich, exam-authentic MCQs with annotated slides and detailed explanations",
                "Complete exam prep ecosystem — online courses, hard-copy notes, mock papers, flashcards, and bundles",
              ].map((li) => (
                <li key={li} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-700" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="mt-8 flex items-start gap-3 text-slate-700">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-rose-700" />
            <div>
              <p>3/893 Thilagar Street, Ganga Nagar, Medavakkam</p>
              <p>Chennai, Tamil Nadu, 600100</p>
              <p className="mt-2">
                +91 7825890222 &middot;{" "}
                <a href="mailto:admin@pathologymcq.com" className="font-semibold text-rose-700">admin@pathologymcq.com</a>
              </p>
            </div>
          </div>

          {/* Our services */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-plum-900 sm:text-3xl">Our services</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
              {[
                { label: "FRCPath Exam Preparation", href: "/services/frcpath-exam-preparation" },
                { label: "NEET-SS and INI-SS Pathology Prep", href: "/services/neet-ss-and-ini-ss-pathology-prep" },
                { label: "Pathology MCQ Practice Banks", href: "/services/pathology-mcq-practice-banks" },
                { label: "Hard-Copy Pathology Notes", href: "/services/hard-copy-pathology-notes" },
                { label: "Full-Length Pathology Mock Tests", href: "/services/full-length-pathology-mock-tests" },
              ].map((svc) => (
                <Link key={svc.href} href={svc.href} className="font-semibold text-rose-700 hover:underline">
                  {svc.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <CtaBand />
      </Section>
    </>
  );
}
