"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  Bone,
  CircleDot,
  Dna,
  Droplet,
  FlaskConical,
  Filter,
  Layers,
  Microscope,
  Salad,
  Stethoscope,
  User,
  Wind,
  Brain,
  Pencil,
  Plus,
  Trash2,
  Image as ImageIcon,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/blog/api";
import { useEdit } from "@/lib/edit/edit-context";
import {
  useSiteSettings,
  usePracticeTopics,
  useCreatePracticeTopic,
  useUpdatePracticeTopic,
  useDeletePracticeTopic,
} from "@/lib/catalog/hooks";

const TOPIC_ICONS: Record<string, LucideIcon> = {
  neuropathology: Brain,
  "head-and-neck-pathology": User,
  "thoracic-pathology": Wind,
  "soft-tissue-and-bone-pathology": Bone,
  "gastrointestinal-pathology": Salad,
  "urogenital-pathology": Filter,
  dermatopathology: Layers,
  "endocrine-and-breast-pathology": Activity,
  "female-genital-pathology": CircleDot,
  cytopathology: Microscope,
  hematopathology: Droplet,
  histotechniques: FlaskConical,
  "molecular-pathology": Dna,
  "general-pathology": Stethoscope,
};

export default function PracticePage() {
  const { editMode } = useEdit();
  const settings = useSiteSettings();
  const topics = usePracticeTopics();
  const createTopic = useCreatePracticeTopic();
  const updateTopic = useUpdatePracticeTopic();
  const deleteTopic = useDeletePracticeTopic();
  const [newLabel, setNewLabel] = React.useState("");

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">
            Practice Questions
          </h1>
          <p className="mt-4 text-slate-700">{settings.practiceSubtitle}</p>
        </div>

        {editMode && (
          <div className="mx-auto mt-8 flex max-w-xl items-end gap-2 rounded-card border border-dashed border-royal-500/50 bg-mist-100/60 p-4">
            <div className="flex-1">
              <label className="text-sm font-semibold text-plum-900">New topic</label>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Renal Pathology"
                className="mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
              />
            </div>
            <Button
              disabled={!newLabel.trim() || createTopic.isPending}
              onClick={() => createTopic.mutate({ label: newLabel }, { onSuccess: () => setNewLabel("") })}
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        )}

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {topics.isLoading && <p className="text-slate-700">Loading…</p>}
          {topics.data?.map((topic) => {
            const Icon = TOPIC_ICONS[topic.slug] ?? Stethoscope;
            return (
              <div key={topic.slug} className="group relative">
                <Link
                  href={`/practice/${topic.slug}`}
                  className="flex flex-col items-center gap-3 rounded-card border border-iris-300/30 bg-white p-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-royal-500/50 hover:shadow-glow"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-hema-700 to-plum-900 text-white transition-transform duration-300 group-hover:scale-110">
                    {topic.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={topic.iconUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </span>
                  <span className="text-sm font-semibold leading-snug text-plum-900">
                    {topic.label}
                  </span>
                </Link>
                {editMode && (
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                    <label
                      className="cursor-pointer rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-royal-500"
                      title="Upload logo"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const url = await uploadImage(f);
                          updateTopic.mutate({ slug: topic.slug, patch: { iconUrl: url } });
                        }}
                      />
                    </label>
                    <button
                      onClick={() => {
                        const label = window.prompt("Rename topic", topic.label);
                        if (label && label.trim() && label !== topic.label)
                          updateTopic.mutate({ slug: topic.slug, patch: { label } });
                      }}
                      className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-royal-500"
                      title="Rename"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${topic.label}" and its questions?`))
                          deleteTopic.mutate(topic.slug);
                      }}
                      className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-rose-700"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
