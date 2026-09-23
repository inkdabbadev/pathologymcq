"use client";

import * as React from "react";
import { FileImage, FileUp, FolderUp, ImageIcon, LocateFixed, Trash2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { SlideViewer, type SlideViewerHandle } from "@/components/marketing/slide-viewer";
import { createDziFromImage, uploadDziFile, uploadDziPackage, uploadImage } from "@/lib/blog/api";
import { useEdit } from "@/lib/edit/edit-context";
import { useSiteSettings, useUpdateSiteSettings } from "@/lib/catalog/hooks";

export function HomeSlideSection() {
  const s = useSiteSettings();
  const slide = s.homeSlide;
  const { editMode } = useEdit();
  const update = useUpdateSiteSettings();
  const viewerRef = React.useRef<SlideViewerHandle>(null);
  const [label, setLabel] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [tiling, setTiling] = React.useState(false);
  const [uploadingDziFile, setUploadingDziFile] = React.useState(false);
  const [uploadingDzi, setUploadingDzi] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [tilePath, setTilePath] = React.useState(slide.tileSource);
  const [syncedTilePath, setSyncedTilePath] = React.useState(slide.tileSource);
  if (syncedTilePath !== slide.tileSource) {
    setSyncedTilePath(slide.tileSource);
    setTilePath(slide.tileSource);
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (/\.dzi$/i.test(f.name) || !f.type.startsWith("image/")) {
      setMsg(
        "Upload JPG/PNG here. For deep zoom, upload a single .dzi file or a DZI folder/package with local tiles."
      );
      e.target.value = "";
      return;
    }
    setUploading(true);
    setMsg("");
    try {
      const url = await uploadImage(f);
      await update.mutateAsync({ homeSlide: { ...slide, tileSource: url, regions: [] } });
      setTilePath(url);
      setMsg("Slide image updated. Pan/zoom, then capture new findings for this slide.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onDziUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingDzi(true);
    setMsg("");
    try {
      const url = await uploadDziPackage(files);
      await update.mutateAsync({ homeSlide: { ...slide, tileSource: url, regions: [] } });
      setTilePath(url);
      setMsg("DZI package uploaded. Pan/zoom, then capture new findings for this slide.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "DZI upload failed.");
    } finally {
      setUploadingDzi(false);
      e.target.value = "";
    }
  }

  async function onTileImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setTiling(true);
    setMsg("Creating DZI tiles. Large images can take a little while...");
    try {
      const url = await createDziFromImage(f);
      await update.mutateAsync({ homeSlide: { ...slide, tileSource: url, regions: [] } });
      setTilePath(url);
      setMsg("DZI tiles created. Pan/zoom, then capture new findings for this slide.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "DZI tile creation failed.");
    } finally {
      setTiling(false);
      e.target.value = "";
    }
  }

  async function onDziFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadingDziFile(true);
    setMsg("");
    try {
      const url = await uploadDziFile(f);
      await update.mutateAsync({ homeSlide: { ...slide, tileSource: url, regions: [] } });
      setTilePath(url);
      setMsg("DZI file uploaded. It will render if the DZI Url points to reachable tiles.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "DZI file upload failed.");
    } finally {
      setUploadingDziFile(false);
      e.target.value = "";
    }
  }

  async function saveTilePath() {
    const v = tilePath.trim();
    if (!v) return;
    await update.mutateAsync({ homeSlide: { ...slide, tileSource: v, regions: [] } });
    setMsg("Tile source updated. Pan/zoom, then capture new findings for this slide.");
  }

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
            tileSource={slide.tileSource}
            regions={slide.regions}
          />
        </Reveal>

        {editMode && (
          <div className="mx-auto mt-6 max-w-3xl rounded-card border border-dashed border-royal-500/50 bg-mist-100/60 p-4">
            <p className="text-sm font-semibold text-plum-900">Slide admin</p>
            <p className="mt-1 text-xs text-slate-700">
              Upload an image, create DZI tiles from an image, or use an existing DZI source, then pan and zoom the viewer above.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-iris-300/60 bg-white px-3 py-2 text-sm text-plum-900 hover:border-royal-500">
                <ImageIcon className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload slide image"}
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
              </label>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-iris-300/60 bg-white px-3 py-2 text-sm text-plum-900 hover:border-royal-500">
                <FileImage className="h-4 w-4" />
                {tiling ? "Creating..." : "Create DZI tiles"}
                <input
                  type="file"
                  accept="image/*,.tif,.tiff"
                  className="hidden"
                  onChange={onTileImageUpload}
                />
              </label>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-iris-300/60 bg-white px-3 py-2 text-sm text-plum-900 hover:border-royal-500">
                <FileUp className="h-4 w-4" />
                {uploadingDziFile ? "Uploading..." : "Upload DZI file"}
                <input
                  type="file"
                  accept=".dzi,application/xml,text/xml"
                  className="hidden"
                  onChange={onDziFileUpload}
                />
              </label>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-iris-300/60 bg-white px-3 py-2 text-sm text-plum-900 hover:border-royal-500">
                <FolderUp className="h-4 w-4" />
                {uploadingDzi ? "Uploading..." : "Upload DZI package"}
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={onDziUpload}
                  {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>)}
                />
              </label>

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

            <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-iris-300/40 pt-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-plum-900">Tile source URL or /dzi path</label>
                <input
                  value={tilePath}
                  onChange={(e) => setTilePath(e.target.value)}
                  placeholder="/dzi/Lichen planus.dzi"
                  className="mt-1 w-full min-w-[220px] rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
                />
              </div>
              <Button variant="outline" size="sm" disabled={update.isPending} onClick={saveTilePath}>
                Use this source
              </Button>
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
