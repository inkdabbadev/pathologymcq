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
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ImageCropUpload } from "@/components/ui/image-crop-upload";
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
  const [newIconUrl, setNewIconUrl] = React.useState("");
  const [editingTopicSlug, setEditingTopicSlug] = React.useState<string | null>(null);
  const [editingLabel, setEditingLabel] = React.useState("");
  const [editingIconUrl, setEditingIconUrl] = React.useState("");

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          {settings.practiceLogoUrl ? (
            <img src={settings.practiceLogoUrl} alt="Practice Questions logo" className="mx-auto mb-5 h-20 w-20 rounded-full object-cover shadow-soft" />
          ) : null}
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">
            Practice Questions
          </h1>
          <p className="mt-4 text-slate-700">{settings.practiceSubtitle}</p>
        </div>

        {editMode && (
          <div className="mx-auto mt-8 max-w-xl rounded-card border border-dashed border-royal-500/50 bg-mist-100/60 p-4">
            <div className="flex flex-col gap-3">
              <div className="flex-1">
                <label className="text-sm font-semibold text-plum-900">New topic</label>
                <input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Renal Pathology"
                  className="mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-plum-900">Custom icon image</label>
                <div className="mt-1">
                  <ImageCropUpload
                    value={newIconUrl}
                    label="Upload icon"
                    aspectRatio={1}
                    onChange={setNewIconUrl}
                  />
                </div>
              </div>
              <Button
                disabled={!newLabel.trim() || createTopic.isPending}
                onClick={() =>
                  createTopic.mutate(
                    { label: newLabel, iconUrl: newIconUrl || undefined },
                    {
                      onSuccess: () => {
                        setNewLabel("");
                        setNewIconUrl("");
                      },
                    }
                  )
                }
              >
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>
        )}

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {topics.isLoading && <p className="text-slate-700">Loading…</p>}
          {topics.data?.map((topic) => {
            const Icon = TOPIC_ICONS[topic.slug] ?? Stethoscope;
            const iconNode = topic.iconUrl ? (
              <img
                src={topic.iconUrl}
                alt={topic.label}
                className="h-12 w-12 rounded-full object-cover shadow-soft ring-2 ring-white"
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-hema-700 to-plum-900 text-white transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
            );

            return (
              <div key={topic.slug} className="group relative">
                <Link
                  href={`/practice/${topic.slug}`}
                  className="flex flex-col items-center gap-3 rounded-card border border-iris-300/30 bg-white p-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-royal-500/50 hover:shadow-glow"
                >
                  {iconNode}
                  <span className="text-sm font-semibold leading-snug text-plum-900">
                    {topic.label}
                  </span>
                </Link>
                {editMode && (
                  editingTopicSlug === topic.slug ? (
                    <div className="absolute right-2 top-2 flex w-[260px] flex-col gap-2 rounded-card border border-royal-500/50 bg-white p-2 shadow-soft">
                      <input
                        value={editingLabel}
                        onChange={(e) => setEditingLabel(e.target.value)}
                        className="w-full rounded-panel border border-iris-300/60 bg-white px-2 py-1.5 text-sm outline-none focus:border-royal-500"
                      />
                      <ImageCropUpload
                        value={editingIconUrl}
                        label="Upload icon image"
                        aspectRatio={1}
                        onChange={setEditingIconUrl}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const label = editingLabel.trim();
                            const nextIconUrl = editingIconUrl.trim() || undefined;
                            if (label && label !== topic.label) {
                              updateTopic.mutate({
                                slug: topic.slug,
                                patch: { label, iconUrl: nextIconUrl },
                              });
                            } else if (nextIconUrl !== undefined && nextIconUrl !== topic.iconUrl) {
                              updateTopic.mutate({
                                slug: topic.slug,
                                patch: { iconUrl: nextIconUrl },
                              });
                            }
                            setEditingTopicSlug(null);
                            setEditingLabel("");
                            setEditingIconUrl("");
                          }}
                          className="flex-1 rounded-full bg-plum-900 px-2 py-1 text-xs font-medium text-white"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingTopicSlug(null);
                            setEditingLabel("");
                            setEditingIconUrl("");
                          }}
                          className="flex-1 rounded-full border border-iris-300/60 px-2 py-1 text-xs font-medium text-plum-900"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setEditingTopicSlug(topic.slug);
                          setEditingLabel(topic.label);
                          setEditingIconUrl(topic.iconUrl ?? "");
                        }}
                        className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-royal-500"
                        title="Rename"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTopic.mutate(topic.slug)}
                        className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-rose-700"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
