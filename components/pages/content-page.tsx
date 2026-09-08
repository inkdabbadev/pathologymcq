"use client";

import * as React from "react";
import { Plus, Save, Trash2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { useEdit } from "@/lib/edit/edit-context";
import { usePage, useUpdatePage } from "@/lib/catalog/hooks";
import type { ContentPageDoc, PageSection } from "@/lib/mock/pages";

const field =
  "w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500";

/** Render a body string: blank lines separate paragraphs; consecutive lines
 * beginning with "- " become a bullet list. */
function Body({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="mt-3 flex flex-col gap-4">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => l.trim().startsWith("- "));
        if (isList) {
          return (
            <ul key={i} className="flex flex-col gap-2">
              {lines.map((l, j) => (
                <li key={j} className="flex items-start gap-2 text-slate-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-700" />
                  <span>{l.replace(/^-\s+/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="leading-relaxed text-slate-700">
            {block.split("\n").map((line, k) => (
              <React.Fragment key={k}>
                {k > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function ContentPage({ slug }: { slug: string }) {
  const { editMode } = useEdit();
  const q = usePage(slug);
  const update = useUpdatePage();
  const page = q.data;

  const [draft, setDraft] = React.useState<ContentPageDoc | null>(null);
  const [syncedRef, setSyncedRef] = React.useState<ContentPageDoc | null | undefined>(undefined);
  if (page !== undefined && syncedRef !== page) {
    setSyncedRef(page);
    setDraft(page ? JSON.parse(JSON.stringify(page)) : null);
  }

  if (q.isLoading) {
    return (
      <Section>
        <Container className="max-w-3xl">
          <p className="text-slate-700">Loading…</p>
        </Container>
      </Section>
    );
  }

  if (!page || !draft) {
    return (
      <Section>
        <Container className="max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-plum-900">Page not found</h1>
          <p className="mt-3 text-slate-700">
            This page has no content yet{editMode ? " — seed the “pages” content first." : "."}
          </p>
        </Container>
      </Section>
    );
  }

  function setSection(i: number, next: PageSection) {
    setDraft((d) => (d ? { ...d, sections: d.sections.map((s, j) => (j === i ? next : s)) } : d));
  }

  async function save() {
    if (!draft) return;
    await update.mutateAsync({ slug: draft.slug, patch: draft });
  }

  // ---- Read (public) view ----
  if (!editMode) {
    return (
      <>
        <div className="bg-ambient relative -mt-[var(--nav-offset)] overflow-hidden pt-[calc(var(--nav-offset)+4rem)] pb-12">
          <Container className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">
              {page.title}
            </h1>
            {page.intro && <p className="mt-4 text-lg leading-relaxed text-slate-700">{page.intro}</p>}
          </Container>
        </div>
        <Section>
          <Container className="max-w-3xl">
            <div className="flex flex-col gap-8">
              {page.sections.map((s, i) => (
                <div key={i}>
                  {s.heading && (
                    <h2 className="font-display text-xl font-bold text-plum-900">{s.heading}</h2>
                  )}
                  <Body text={s.body} />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </>
    );
  }

  // ---- Admin edit view ----
  return (
    <Section>
      <Container className="max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-mist-100 px-3 py-1 text-xs font-semibold text-plum-900">
            Editing: {draft.slug}
          </span>
          <Button size="sm" disabled={update.isPending} onClick={save}>
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>

        <label className="text-sm font-semibold text-plum-900">Title</label>
        <input
          className={`mt-1 ${field}`}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />

        <label className="mt-4 block text-sm font-semibold text-plum-900">Intro</label>
        <textarea
          className={`mt-1 ${field}`}
          rows={2}
          value={draft.intro ?? ""}
          onChange={(e) => setDraft({ ...draft, intro: e.target.value })}
        />

        <div className="mt-6 flex flex-col gap-4">
          {draft.sections.map((s, i) => (
            <div key={i} className="rounded-card border border-iris-300/40 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-smoke-400">
                  Section {i + 1}
                </span>
                <button
                  onClick={() =>
                    setDraft({ ...draft, sections: draft.sections.filter((_, j) => j !== i) })
                  }
                  className="rounded-md p-1.5 text-smoke-400 hover:text-rose-700"
                  title="Remove section"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <input
                className={`mt-2 ${field}`}
                placeholder="Heading (optional)"
                value={s.heading ?? ""}
                onChange={(e) => setSection(i, { ...s, heading: e.target.value })}
              />
              <textarea
                className={`mt-2 ${field}`}
                rows={6}
                placeholder="Body — blank line between paragraphs; lines starting with '- ' become bullets"
                value={s.body}
                onChange={(e) => setSection(i, { ...s, body: e.target.value })}
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => setDraft({ ...draft, sections: [...draft.sections, { heading: "", body: "" }] })}
          >
            <Plus className="h-4 w-4" /> Add section
          </Button>
        </div>
      </Container>
    </Section>
  );
}
