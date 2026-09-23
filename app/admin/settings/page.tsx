"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, FileImage, FileUp, FolderUp, Plus, Save, Trash2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { createDziFromImage, uploadDziFile, uploadDziPackage } from "@/lib/blog/api";
import { useEdit } from "@/lib/edit/edit-context";
import { useSiteSettings, useUpdateSiteSettings } from "@/lib/catalog/hooks";
import type { SiteSettings, ShopCard, ExamPathwaySetting, SlideRegionSetting } from "@/lib/site/defaults";
import { slugify } from "@/lib/blog/types";

const field =
  "mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500";
const label = "text-sm font-medium text-plum-900";

export default function SiteSettingsPage() {
  const { admin, loading } = useEdit();
  const initial = useSiteSettings();
  const update = useUpdateSiteSettings();
  const [s, setS] = React.useState<SiteSettings>(initial);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);
  const [slideUploadMsg, setSlideUploadMsg] = React.useState("");
  const [tiling, setTiling] = React.useState(false);
  const [uploadingDziFile, setUploadingDziFile] = React.useState(false);
  const [uploadingDzi, setUploadingDzi] = React.useState(false);
  // Sync the form to persisted settings when they load (render-phase pattern:
  // `initial`'s identity changes once, from defaults to the fetched doc).
  const [syncedRef, setSyncedRef] = React.useState(initial);
  if (syncedRef !== initial) {
    setSyncedRef(initial);
    setS(initial);
  }

  if (loading) return null;
  if (!admin) {
    return (
      <Section>
        <Container>
          <p className="text-slate-700">
            Admin only. <Link href="/admin/login" className="text-royal-500">Sign in</Link>.
          </p>
        </Container>
      </Section>
    );
  }

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setS((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    await update.mutateAsync(s);
    setSavedAt(new Date().toLocaleTimeString());
  }

  async function uploadHomeDzi(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingDzi(true);
    setSlideUploadMsg("");
    try {
      const url = await uploadDziPackage(files);
      const next = { ...s.homeSlide, tileSource: url, regions: [] };
      set("homeSlide", next);
      await update.mutateAsync({ homeSlide: next });
      setSavedAt(new Date().toLocaleTimeString());
      setSlideUploadMsg("DZI package uploaded. Finding coordinates were cleared.");
    } catch (err) {
      setSlideUploadMsg(err instanceof Error ? err.message : "DZI package upload failed.");
    } finally {
      setUploadingDzi(false);
      e.target.value = "";
    }
  }

  async function uploadHomeDziFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDziFile(true);
    setSlideUploadMsg("");
    try {
      const url = await uploadDziFile(file);
      const next = { ...s.homeSlide, tileSource: url, regions: [] };
      set("homeSlide", next);
      await update.mutateAsync({ homeSlide: next });
      setSavedAt(new Date().toLocaleTimeString());
      setSlideUploadMsg("DZI file uploaded. It will render if its Url points to reachable tiles.");
    } catch (err) {
      setSlideUploadMsg(err instanceof Error ? err.message : "DZI file upload failed.");
    } finally {
      setUploadingDziFile(false);
      e.target.value = "";
    }
  }

  async function createHomeDziFromImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setTiling(true);
    setSlideUploadMsg("Creating DZI tiles. Large images can take a little while...");
    try {
      const url = await createDziFromImage(file);
      const next = { ...s.homeSlide, tileSource: url, regions: [] };
      set("homeSlide", next);
      await update.mutateAsync({ homeSlide: next });
      setSavedAt(new Date().toLocaleTimeString());
      setSlideUploadMsg("DZI tiles created. Finding coordinates were cleared.");
    } catch (err) {
      setSlideUploadMsg(err instanceof Error ? err.message : "DZI tile creation failed.");
    } finally {
      setTiling(false);
      e.target.value = "";
    }
  }

  return (
    <Section>
      <Container className="max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-royal-500 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Site
          </Link>
          <div className="flex items-center gap-2">
            {savedAt && <span className="text-xs text-smoke-400">Saved {savedAt}</span>}
            <Button size="sm" disabled={update.isPending} onClick={save}>
              <Save className="h-4 w-4" /> Save all
            </Button>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-plum-900">Site settings</h1>
        <p className="mt-1 text-slate-700">Global content: brand, contact, footer, shop, page copy, exam pathways.</p>

        {/* Brand & contact */}
        <h2 className="mt-8 font-display text-lg font-bold text-plum-900">Brand &amp; contact</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Site name</label>
            <input value={s.siteName} onChange={(e) => set("siteName", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>WhatsApp number (digits, incl. country code)</label>
            <input value={s.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value.replace(/[^0-9]/g, ""))} className={field} />
          </div>
        </div>

        {/* Home slide viewer */}
        <h2 className="mt-8 font-display text-lg font-bold text-plum-900">Home slide viewer</h2>
        <div className="mt-3 grid gap-4">
          <div>
            <label className={label}>Section heading</label>
            <input value={s.homeSlide.heading} onChange={(e) => set("homeSlide", { ...s.homeSlide, heading: e.target.value })} className={field} />
          </div>
          <div>
            <label className={label}>Section subtitle</label>
            <textarea value={s.homeSlide.subtitle} onChange={(e) => set("homeSlide", { ...s.homeSlide, subtitle: e.target.value })} rows={2} className={field} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Slide title</label>
              <input value={s.homeSlide.title} onChange={(e) => set("homeSlide", { ...s.homeSlide, title: e.target.value })} className={field} />
            </div>
            <div>
              <label className={label}>Tile source (.dzi path)</label>
              <input value={s.homeSlide.tileSource} onChange={(e) => set("homeSlide", { ...s.homeSlide, tileSource: e.target.value })} className={field} />
              <label className="mt-2 mr-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-iris-300/60 bg-white px-3 py-2 text-sm text-plum-900 hover:border-royal-500">
                <FileImage className="h-4 w-4" />
                {tiling ? "Creating..." : "Create DZI tiles"}
                <input
                  type="file"
                  accept="image/*,.tif,.tiff"
                  className="hidden"
                  onChange={createHomeDziFromImage}
                />
              </label>
              <label className="mt-2 mr-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-iris-300/60 bg-white px-3 py-2 text-sm text-plum-900 hover:border-royal-500">
                <FileUp className="h-4 w-4" />
                {uploadingDziFile ? "Uploading..." : "Upload DZI file"}
                <input
                  type="file"
                  accept=".dzi,application/xml,text/xml"
                  className="hidden"
                  onChange={uploadHomeDziFile}
                />
              </label>
              <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-iris-300/60 bg-white px-3 py-2 text-sm text-plum-900 hover:border-royal-500">
                <FolderUp className="h-4 w-4" />
                {uploadingDzi ? "Uploading..." : "Upload DZI package"}
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={uploadHomeDzi}
                  {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>)}
                />
              </label>
              <p className="mt-1 text-xs text-smoke-400">
                Use a single .dzi when its tile Url already points to hosted tiles. Use package upload when the local *_files tile folder should be uploaded too.
              </p>
              {slideUploadMsg && <p className="mt-1 text-xs font-medium text-royal-500">{slideUploadMsg}</p>}
            </div>
          </div>
          <div>
            <label className={label}>Slide caption</label>
            <input value={s.homeSlide.caption} onChange={(e) => set("homeSlide", { ...s.homeSlide, caption: e.target.value })} className={field} />
          </div>
        </div>
        <SectionEditor
          title="Slide findings (labeled regions)"
          items={s.homeSlide.regions}
          onChange={(regions) => set("homeSlide", { ...s.homeSlide, regions })}
          empty={{ key: "", label: "New finding", x: 0, y: 0, width: 1000, height: 1000 } as SlideRegionSetting}
          onAddFinalize={(item) => (item.key ? item : { ...item, key: `r${Date.now()}` })}
          render={(item, onEdit) => (
            <>
              <input value={item.label} onChange={(e) => onEdit({ ...item, label: e.target.value })} placeholder="Finding label" className={field} />
              <div className="grid grid-cols-4 gap-2">
                <input type="number" value={item.x} onChange={(e) => onEdit({ ...item, x: Number(e.target.value) })} placeholder="x" className={field} />
                <input type="number" value={item.y} onChange={(e) => onEdit({ ...item, y: Number(e.target.value) })} placeholder="y" className={field} />
                <input type="number" value={item.width} onChange={(e) => onEdit({ ...item, width: Number(e.target.value) })} placeholder="w" className={field} />
                <input type="number" value={item.height} onChange={(e) => onEdit({ ...item, height: Number(e.target.value) })} placeholder="h" className={field} />
              </div>
            </>
          )}
        />
        <p className="mt-2 text-xs text-smoke-400">
          The slide image is a pre-tiled deep-zoom (.dzi) in <code>public/dzi/</code>. Point &ldquo;Tile source&rdquo; at a
          different .dzi to swap slides; x/y/width/height are pixel coordinates on the source image for each finding.
        </p>

        {/* Page copy */}
        <h2 className="mt-8 font-display text-lg font-bold text-plum-900">Page copy</h2>
        <div className="mt-3 grid gap-4">
          <div>
            <label className={label}>Courses subtitle</label>
            <textarea value={s.coursesSubtitle} onChange={(e) => set("coursesSubtitle", e.target.value)} rows={2} className={field} />
          </div>
          <div>
            <label className={label}>Practice subtitle</label>
            <textarea value={s.practiceSubtitle} onChange={(e) => set("practiceSubtitle", e.target.value)} rows={2} className={field} />
          </div>
          <div>
            <label className={label}>FAQ subtitle</label>
            <textarea value={s.faqSubtitle} onChange={(e) => set("faqSubtitle", e.target.value)} rows={2} className={field} />
          </div>
          <div>
            <label className={label}>About Us heading</label>
            <input value={s.aboutHeading} onChange={(e) => set("aboutHeading", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>About intro paragraph</label>
            <textarea value={s.aboutIntro} onChange={(e) => set("aboutIntro", e.target.value)} rows={4} className={field} />
          </div>
          <div>
            <label className={label}>About “team” heading</label>
            <input value={s.aboutTeamHeading} onChange={(e) => set("aboutTeamHeading", e.target.value)} className={field} />
          </div>
        </div>

        {/* Shop hub */}
        <h2 className="mt-8 font-display text-lg font-bold text-plum-900">Shop hub</h2>
        <div className="mt-3 grid gap-4">
          <div>
            <label className={label}>Shop heading</label>
            <input value={s.shopHeading} onChange={(e) => set("shopHeading", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Shop subtitle</label>
            <textarea value={s.shopSubtitle} onChange={(e) => set("shopSubtitle", e.target.value)} rows={2} className={field} />
          </div>
        </div>
        <SectionEditor
          title="Shop cards"
          items={s.shopCards}
          onChange={(shopCards) => set("shopCards", shopCards)}
          empty={{ href: "/", title: "New card", description: "", icon: "Package" } as ShopCard}
          render={(item, onEdit) => (
            <>
              <input value={item.title} onChange={(e) => onEdit({ ...item, title: e.target.value })} placeholder="Title" className={field} />
              <input value={item.href} onChange={(e) => onEdit({ ...item, href: e.target.value })} placeholder="/path" className={field} />
              <input value={item.icon} onChange={(e) => onEdit({ ...item, icon: e.target.value })} placeholder="Icon (lucide name)" className={field} />
              <textarea value={item.description} onChange={(e) => onEdit({ ...item, description: e.target.value })} placeholder="Description" rows={2} className={field} />
            </>
          )}
        />

        {/* Footer */}
        <h2 className="mt-8 font-display text-lg font-bold text-plum-900">Footer</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>CTA heading</label>
            <input value={s.footerCta.heading} onChange={(e) => set("footerCta", { ...s.footerCta, heading: e.target.value })} className={field} />
          </div>
          <div>
            <label className={label}>CTA button label</label>
            <input value={s.footerCta.buttonLabel} onChange={(e) => set("footerCta", { ...s.footerCta, buttonLabel: e.target.value })} className={field} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>CTA subtext</label>
            <textarea value={s.footerCta.subtext} onChange={(e) => set("footerCta", { ...s.footerCta, subtext: e.target.value })} rows={2} className={field} />
          </div>
          <div>
            <label className={label}>Copyright name</label>
            <input value={s.copyright} onChange={(e) => set("copyright", e.target.value)} className={field} />
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-700">
          Footer columns are advanced — tell me if you want a full column editor here. For now, brand, CTA,
          copyright, and the WhatsApp number update live.
        </p>

        {/* Exam pathways */}
        <SectionEditor
          title="Exam pathways (course categories)"
          items={s.examPathways}
          onChange={(examPathways) => set("examPathways", examPathways)}
          empty={{ category: "", label: "New pathway", description: "" } as ExamPathwaySetting}
          onAddFinalize={(item) =>
            item.category ? item : { ...item, category: slugify(item.label || "pathway") }
          }
          render={(item, onEdit) => (
            <>
              <input value={item.label} onChange={(e) => onEdit({ ...item, label: e.target.value })} placeholder="Label" className={field} />
              <textarea value={item.description} onChange={(e) => onEdit({ ...item, description: e.target.value })} placeholder="Description" rows={2} className={field} />
              <p className="text-xs text-smoke-400">slug: {item.category || "(auto on save)"}</p>
            </>
          )}
        />
        <p className="mt-2 text-xs text-smoke-400">
          Editing a pathway&apos;s label/description is safe. Existing courses stay linked by slug; new pathways get a slug automatically.
        </p>
      </Container>
    </Section>
  );
}

// Generic list-of-objects editor.
function SectionEditor<T>({
  title,
  items,
  onChange,
  render,
  empty,
  onAddFinalize,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, onEdit: (next: T) => void) => React.ReactNode;
  empty: T;
  onAddFinalize?: (item: T) => T;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-plum-900">{title}</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onChange([...items, onAddFinalize ? onAddFinalize(empty) : empty])}
        >
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
      <div className="mt-3 flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 rounded-panel border border-iris-300/40 bg-white p-3">
            <div className="flex-1 grid gap-2">
              {render(item, (next) => onChange(items.map((x, j) => (j === i ? next : x))))}
            </div>
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="rounded-md p-1.5 text-smoke-400 hover:text-rose-700"
              title="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
