"use client";

import * as React from "react";
import { LocateFixed, Trash2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import {
  DEFAULT_SLIDE_TILE_SOURCE,
  SlideViewer,
  type SlideViewerHandle,
} from "@/components/marketing/slide-viewer";
import { useEdit } from "@/lib/edit/edit-context";
import { useSiteSettings, useUpdateSiteSettings } from "@/lib/catalog/hooks";

export function HomeSlideSection() {
  const s = useSiteSettings();
  const slide = s.homeSlide;
  const { editMode } = useEdit();
  const update = useUpdateSiteSettings();
  const viewerRef = React.useRef<SlideViewerHandle>(null);
  const [label, setLabel] = React.useState("");
  const [msg, setMsg] = React.useState("");

  async function addFinding() {
    const rect = viewerRef.current?.captureViewport();
    if (!rect) {
      setMsg("Viewer is not ready yet. Wait for the slide to load, then try again.");
      return;
    }
    const region = { key: `r${Date.now()}`, label: label.trim() || "Finding", ...rect };
    await update.mutateAsync({ homeSlide: { ...slide, regions: [...slide.regions, region] } });
    setLabel("");
    setMsg(`Added "${region.label}".`);
  }

  async function removeFinding(key: string) {
    await update.mutateAsync({ homeSlide: { ...slide, regions: slide.regions.filter((r) => r.key !== key) } });
  }

  return (
    <Section ambient>
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">{slide.heading}</h2>
            <p className="mt-3 text-slate-700">{slide.subtitle}</p>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-10 block">
          <SlideViewer
            ref={viewerRef}
            title={slide.title}
            caption={slide.caption}
            tileSource={DEFAULT_SLIDE_TILE_SOURCE}
            regions={slide.regions}
          />
        </Reveal>

        {editMode && (
          <div className="mx-auto mt-6 max-w-3xl rounded-card border border-dashed border-royal-500/50 bg-mist-100/60 p-4">
            <p className="text-sm font-semibold text-plum-900">Slide admin</p>
            <p className="mt-1 text-xs text-slate-700">
              The homepage uses the bundled public DZI slide. Pan and zoom the viewer above before adding finding labels.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex flex-1 items-center gap-2">
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Finding label (e.g. Civatte body)"
                  className="min-w-[180px] flex-1 rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
                />
                <Button size="sm" disabled={update.isPending} onClick={addFinding}>
                  <LocateFixed className="h-4 w-4" /> Add finding from this view
                </Button>
              </div>
            </div>

            {slide.regions.length > 0 && (
              <ul className="mt-4 flex flex-col gap-2">
                {slide.regions.map((r) => (
                  <li key={r.key} className="flex items-center justify-between rounded-panel border border-iris-300/40 bg-white px-3 py-2 text-sm">
                    <span className="text-plum-900">{r.label}</span>
                    <button
                      onClick={() => removeFinding(r.key)}
                      className="rounded-md p-1 text-smoke-400 hover:text-rose-700"
                      title="Remove finding"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {msg && <p className="mt-3 text-xs font-medium text-royal-500">{msg}</p>}
          </div>
        )}
      </Container>
    </Section>
  );
}
