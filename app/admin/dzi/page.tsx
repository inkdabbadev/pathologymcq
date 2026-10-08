"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Copy, FolderUp, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClientSlideViewer } from "@/components/marketing/client-slide-viewer";
import type { DziUpload } from "@/lib/dzi/storage";
import { uploadDziPackage } from "@/lib/blog/api";

export default function AdminDziPage() {
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [url, setUrl] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [removed, setRemoved] = React.useState(0);
  const history = useQuery<DziUpload[]>({
    queryKey: ["admin-dzi-uploads"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dzi", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Could not load uploads");
      return data.uploads;
    },
  });
  const uploads = history.data ?? [];
  const loading = history.isFetching;
  const historyError = history.error?.message;
  const refresh = history.refetch;

  async function remove(upload: DziUpload) {
    const scope = upload.id.startsWith("dzi/") ? "and all its tiles" : "descriptor (external tiles will remain)";
    if (!window.confirm(`Delete ${upload.name} ${scope}? Pages using this slide will stop displaying it. This cannot be undone.`)) return;
    setDeleting(upload.id);
    setRemoved(0);
    setError(null);
    if (url === upload.url) setUrl(null);
    try {
      let done = false;
      while (!done) {
        const response = await fetch("/api/admin/dzi", {
          method: "DELETE", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: upload.id }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Could not delete slide");
        setRemoved((count) => count + data.removed);
        done = data.done;
      }
    } catch (err) {
      setError(`${err instanceof Error ? err.message : "Deletion failed"}. Some files may already be deleted; retry to finish removing this upload.`);
    } finally {
      await refresh();
      setDeleting(null);
    }
  }

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
      await refresh();
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
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setError("Could not copy the link. Select and copy the URL manually.");
    }
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

      <div className="mt-6">
        <div className="rounded-card border border-iris-300/40 bg-white p-5 shadow-soft">
          <h2 className="font-display text-lg font-bold text-plum-900">Upload DZI folder</h2>
          <p className="mt-1 text-sm text-slate-700">
            Choose the folder that holds the <code>.dzi</code> file and its <code>*_files</code> tile
            folder, like <code>public/dzi</code> (<code>Lichen planus.dzi</code> +{" "}
            <code>Lichen planus_files</code>).
          </p>
          <label className={`${pickerClass} mt-4 ${busy || deleting ? "pointer-events-none opacity-50" : ""}`}>
            <FolderUp className="h-4 w-4" />
            Choose folder
            <input
              type="file"
              className="hidden"
              onChange={onFolder}
              disabled={busy || Boolean(deleting)}
              {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
            />
          </label>
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

      {error && <p role="alert" className="mt-6 text-sm text-rose-700">{error}</p>}

      <section className="mt-8 rounded-card border border-iris-300/40 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-plum-900">Upload history</h2>
          <Button size="sm" variant="outline" disabled={loading || busy || Boolean(deleting)} onClick={() => void refresh()}>Refresh</Button>
        </div>
        <p className="mt-2 text-sm text-slate-700">Saved uploads remain available here after you leave this page. Select a slide to preview it and copy its link.</p>
        {loading && <p role="status" className="mt-4 text-sm">Loading uploads…</p>}
        {historyError && <p role="alert" className="mt-4 text-sm text-rose-700">{historyError}</p>}
        {!loading && !historyError && uploads.length === 0 && <p className="mt-4 text-sm text-slate-700">No DZI uploads yet.</p>}
        {deleting && <p role="status" className="mt-4 text-sm">Deleting slide… {removed} files removed. Keep this page open until deletion finishes.</p>}
        <ul className="mt-4 divide-y divide-iris-300/40">
          {uploads.map((upload) => (
            <li key={upload.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="break-all font-semibold text-plum-900">{upload.name}</p>
                <p className="text-xs text-slate-600">{upload.createdAt ? new Date(upload.createdAt).toLocaleString() : "Upload date unavailable"}</p>
                <p className="break-all text-xs text-slate-600">{upload.id}</p>
                {!upload.url && <p className="mt-1 text-sm text-rose-700">Missing descriptor — this upload may be incomplete.</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" disabled={!upload.url || busy || Boolean(deleting)} onClick={() => { setUrl(upload.url); setCopied(false); }}>Preview / link</Button>
                <Button size="sm" variant="outline" className="text-rose-700" disabled={busy || Boolean(deleting)} onClick={() => void remove(upload)} aria-label={`Delete ${upload.name}`}><Trash2 className="h-4 w-4" />Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {url && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 rounded-panel border border-iris-300/40 bg-mist-100/60 p-3">
            <code className="min-w-0 flex-1 break-all text-xs text-plum-900">{url}</code>
            <Button size="sm" variant="outline" onClick={copy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
          <ClientSlideViewer tileSource={url} title="Preview" caption="Check the slide loads and zooms correctly." />
        </div>
      )}
    </div>
  );
}
