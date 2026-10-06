"use client";

import * as React from "react";
import { Check, Copy, FolderUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SlideViewer } from "@/components/marketing/slide-viewer";
import { uploadDziPackage } from "@/lib/blog/api";

export default function AdminDziPage() {
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [url, setUrl] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  async function run(task: () => Promise<string>) {
    setBusy(true);
    setError(null);
    setUrl(null);
    setCopied(false);
    try {
      setUrl(await task());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  function onFolder(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    e.target.value = "";
    void run(() => uploadDziPackage(list, (done, total) => setProgress({ done, total })));
  }

  async function copy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  const pickerClass =
    "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-iris-300/70 bg-white px-6 text-sm font-semibold text-plum-900 transition hover:border-royal-500";

  return (
    <div className="p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-royal-500">Slides</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-plum-900">DZI slides</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-700">
        Upload a deep-zoom slide folder. You get a link to use
        wherever a slide is needed.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-card border border-iris-300/40 bg-white p-5 shadow-soft">
          <h2 className="font-display text-lg font-bold text-plum-900">Upload DZI folder</h2>
          <p className="mt-1 text-sm text-slate-700">
            Choose the folder that holds the <code>.dzi</code> file and its <code>*_files</code> tile
            folder, like <code>public/dzi</code> (<code>Lichen planus.dzi</code> +{" "}
            <code>Lichen planus_files</code>).
          </p>
          <label className={`${pickerClass} mt-4 ${busy ? "pointer-events-none opacity-50" : ""}`}>
            <FolderUp className="h-4 w-4" />
            Choose folder
            <input
              type="file"
              className="hidden"
              onChange={onFolder}
              disabled={busy}
              {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
            />
          </label>
        </div>

        <div className="rounded-card border border-iris-300/40 bg-white p-5 shadow-soft">
          <h2 className="font-display text-lg font-bold text-plum-900">Prepare a single image</h2>
          <p className="mt-1 text-sm text-slate-700">
            Convert a JPG, PNG, WebP or TIFF on your computer, then upload the generated folder using “Choose folder”.
          </p>
          <code className="mt-4 block break-all rounded-panel bg-mist-100 p-3 text-xs">
            npm run dzi:generate -- /path/to/slide.tiff /path/to/output-folder
          </code>
        </div>
      </div>

      {busy && (
        <div className="mt-6">
          <p className="text-sm text-slate-700">
            {progress
              ? `Uploading ${progress.done} of ${progress.total} files...`
              : "Working... this can take a minute for large images."}
          </p>
          {progress && (
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-mist-100">
              <div
                className="h-full rounded-full bg-royal-500 transition-all"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-6 text-sm text-rose-700">{error}</p>}

      {url && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 rounded-panel border border-iris-300/40 bg-mist-100/60 p-3">
            <code className="min-w-0 flex-1 break-all text-xs text-plum-900">{url}</code>
            <Button size="sm" variant="outline" onClick={copy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
          <SlideViewer tileSource={url} title="Preview" caption="Check the slide loads and zooms correctly." />
        </div>
      )}
    </div>
  );
}
