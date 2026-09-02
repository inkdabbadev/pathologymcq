"use client";

import * as React from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Avatar } from "@/components/ui/avatar";
import { ImageCropUpload } from "@/components/ui/image-crop-upload";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/marketing/cta-band";
import type { FacultyMember } from "@/lib/api/types";
import { useEdit } from "@/lib/edit/edit-context";
import { useFaculty, useCreateFaculty, useUpdateFaculty, useDeleteFaculty, useSiteSettings, useUpdateSiteSettings } from "@/lib/catalog/hooks";

const field =
  "mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500";

function MemberEdit({ member, onDone }: { member: FacultyMember; onDone: () => void }) {
  const update = useUpdateFaculty();
  const [name, setName] = React.useState(member.name);
  const [title, setTitle] = React.useState(member.title);
  const [affiliation, setAffiliation] = React.useState(member.affiliation);
  const [avatarUrl, setAvatarUrl] = React.useState(member.avatarUrl ?? "");

  async function save() {
    await update.mutateAsync({ id: member.id, patch: { name, title, affiliation, avatarUrl } });
    onDone();
  }

  return (
    <div className="flex flex-col gap-2 rounded-card border border-royal-500/50 bg-white p-4 text-left shadow-soft">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className={field} />
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title / qualifications" className={field} />
      <input value={affiliation} onChange={(e) => setAffiliation(e.target.value)} placeholder="Affiliation" className={field} />
      <ImageCropUpload value={avatarUrl} label="Upload profile photo" aspectRatio={1} onChange={setAvatarUrl} className="mb-1" />
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
  const updateSettings = useUpdateSiteSettings();
  const faculty = useFaculty();
  const createFaculty = useCreateFaculty();
  const deleteFaculty = useDeleteFaculty();
  const [newName, setNewName] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draftHeading, setDraftHeading] = React.useState(settings.aboutHeading || "About Us");
  const [draftIntro, setDraftIntro] = React.useState(settings.aboutIntro || "");
  const [draftContent, setDraftContent] = React.useState(settings.aboutContent || "");
  const [draftTeamHeading, setDraftTeamHeading] = React.useState(settings.aboutTeamHeading || "Meet the team");

  React.useEffect(() => {
    setDraftHeading(settings.aboutHeading || "About Us");
    setDraftIntro(settings.aboutIntro || "");
    setDraftContent(settings.aboutContent || "");
    setDraftTeamHeading(settings.aboutTeamHeading || "Meet the team");
  }, [settings.aboutHeading, settings.aboutIntro, settings.aboutContent, settings.aboutTeamHeading]);

  const team = faculty.data ?? [];

  const saveAboutCopy = async () => {
    await updateSettings.mutateAsync({
      aboutHeading: draftHeading,
      aboutIntro: draftIntro,
      aboutContent: draftContent,
      aboutTeamHeading: draftTeamHeading,
    });
  };

  return (
    <>
      <div className="bg-ambient relative -mt-[var(--nav-offset)] overflow-hidden pt-[calc(var(--nav-offset)+4rem)] pb-16">
        <Container className="max-w-3xl text-center">
          {editMode ? (
            <div className="space-y-4 text-left">
              <input value={draftHeading} onChange={(e) => setDraftHeading(e.target.value)} className="w-full rounded-panel border border-iris-300/60 bg-white px-4 py-3 text-center font-display text-4xl font-bold text-plum-900 shadow-soft outline-none focus:border-royal-500 sm:text-5xl" />
              <textarea value={draftIntro} onChange={(e) => setDraftIntro(e.target.value)} className="mt-6 w-full rounded-panel border border-iris-300/60 bg-white px-4 py-3 text-lg leading-relaxed text-slate-700 outline-none focus:border-royal-500" rows={4} />
              <div className="flex justify-end">
                <Button size="sm" onClick={() => void saveAboutCopy()}>
                  <Save className="h-4 w-4" /> Save copy
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">{settings.aboutHeading}</h1>
              <p className="mt-6 text-balance text-lg leading-relaxed text-slate-700">{settings.aboutIntro}</p>
            </>
          )}
        </Container>
      </div>

      <Section>
        <Container>
          {editMode ? (
            <div className="mx-auto max-w-xl">
              <input
                value={draftTeamHeading}
                onChange={(e) => setDraftTeamHeading(e.target.value)}
                className="w-full rounded-panel border border-iris-300/60 bg-white px-4 py-3 text-center font-display text-2xl font-bold text-plum-900 shadow-soft outline-none focus:border-royal-500 sm:text-3xl"
              />
              <div className="mt-3 flex justify-end">
                <Button size="sm" onClick={() => void saveAboutCopy()}>
                  <Save className="h-4 w-4" /> Save team title
                </Button>
              </div>
            </div>
          ) : (
            <h2 className="text-center font-display text-2xl font-bold text-plum-900 sm:text-3xl">
              {settings.aboutTeamHeading}
            </h2>
          )}

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
                  <Avatar name={member.name} size={88} imageUrl={member.avatarUrl} />
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

      <Section>
        <CtaBand />
      </Section>
    </>
  );
}
