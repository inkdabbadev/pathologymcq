"use client";

import * as React from "react";
import type OpenSeadragonNS from "openseadragon";
import { LocateFixed, RotateCcw, ScanSearch } from "lucide-react";

export interface SlideRegion {
  key: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const DEFAULT_SLIDE_REGIONS: SlideRegion[] = [
  { key: "thin", label: "Wedge shaped hypergranulosis", x: 8224, y: 11664, width: 2441, height: 1616 },
  { key: "lack", label: "Civatte body", x: 2610, y: 3586, width: 1290, height: 903 },
  { key: "noClear", label: "Superficial dermal inflammatory infiltrates", x: 11654, y: 12853, width: 1728, height: 2275 },
  { key: "a1", label: "Melanin pigment incontinence", x: 13491, y: 14148, width: 2345, height: 1768 },
  { key: "b2", label: "Sawtoothing of rete ridges", x: 6596, y: 9404, width: 3737, height: 3617 },
];

export const DEFAULT_SLIDE_TILE_SOURCE = "/dzi/Lichen planus.dzi";
export const DEFAULT_SLIDE_TITLE = "Lichen Planus — Thin Skin";

interface SlideViewerProps {
  controls?: "dropdown" | "finder";
  title?: string;
  caption?: string;
  tileSource?: string;
  regions?: SlideRegion[];
}

export interface SlideViewerHandle {
  /** Capture the current pan/zoom view as an image-pixel rectangle (for defining a finding). */
  captureViewport: () => Omit<SlideRegion, "key" | "label"> | null;
  isReady: () => boolean;
}

function firstDziTileUrl(dziUrl: string, xml: string): string | null {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const image = Array.from(doc.getElementsByTagName("*")).find((node) => node.localName === "Image");
  const size = Array.from(doc.getElementsByTagName("*")).find((node) => node.localName === "Size");
  if (!image || !size) return null;

  const width = Number(size.getAttribute("Width"));
  const height = Number(size.getAttribute("Height"));
  const format = image.getAttribute("Format") || "jpeg";
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;

  const absoluteDzi = new URL(dziUrl, window.location.href);
  const fileName = decodeURIComponent(absoluteDzi.pathname.split("/").pop() || "").replace(/\.dzi$/i, "");
  const derivedTileFolder = `${fileName}_files/`;
  const tileFolder = image.getAttribute("Url") || derivedTileFolder;
  const tileRoot = new URL(tileFolder.endsWith("/") ? tileFolder : `${tileFolder}/`, absoluteDzi);
  const level = Math.ceil(Math.log2(Math.max(width, height)));
  return new URL(`${level}/0_0.${format}`, tileRoot).toString();
}

function canLoadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

function installOpenSeadragonConsoleFilter(OpenSeadragon: typeof OpenSeadragonNS) {
  const noisyAssertions = [
    "TileSource.getTileAtPoint",
    "TileCache.cacheTile",
    "CacheRecord.revive",
    "CacheRecord.addTile",
    "getConversionPath",
    "TileSource::downloadTileStart",
    "World.getItemAt",
    "Drawer._drawTile",
    "TileCache.clearTilesFor",
    "TileCache._unloadTile",
    "Viewport._setContentBounds",
    "OpenSeadragon.Spring.resetTo",
  ];
  const consoleTarget = window.console;
  (OpenSeadragon as typeof OpenSeadragonNS & { console: Console }).console = {
    ...consoleTarget,
    assert(condition?: boolean, ...data: unknown[]) {
      if (condition) return;
      const message = data.map((item) => String(item)).join(" ");
      if (noisyAssertions.some((pattern) => message.includes(pattern))) return;
      consoleTarget.assert(condition, ...data);
    },
  };
}

export const SlideViewer = React.forwardRef<SlideViewerHandle, SlideViewerProps>(function SlideViewer(
  {
    controls = "dropdown",
    title = DEFAULT_SLIDE_TITLE,
    caption,
    tileSource = DEFAULT_SLIDE_TILE_SOURCE,
    regions,
  }: SlideViewerProps,
  ref
) {
  const REGIONS = regions ?? DEFAULT_SLIDE_REGIONS;
  const rawTile = tileSource || DEFAULT_SLIDE_TILE_SOURCE;
  const isDzi = /\.dzi(\?|$)/i.test(rawTile) || rawTile.includes("/dzi/");
  const TILE_SOURCE = encodeURI(rawTile);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const viewerRef = React.useRef<OpenSeadragonNS.Viewer | null>(null);
  const osdRef = React.useRef<typeof OpenSeadragonNS | null>(null);
  const overlayElRef = React.useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const [containerReady, setContainerReady] = React.useState(false);
  const [loadError, setLoadError] = React.useState("");
  const activeRegion = REGIONS.find((region) => region.key === selected);

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const element = el;

    function syncSize() {
      setContainerReady(element.clientWidth > 0 && element.clientHeight > 0);
    }

    syncSize();
    const resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  React.useEffect(() => {
    if (!containerReady) return;

    // openseadragon touches `document` as soon as its module is evaluated, so
    // it must only ever be imported client-side — a static top-level import
    // breaks server-side prerendering of this page.
    let cancelled = false;
    let viewer: OpenSeadragonNS.Viewer | null = null;
    let onAnimation: (() => void) | null = null;
    let onOpen: (() => void) | null = null;
    let onOpenFailed: (() => void) | null = null;

    setReady(false);
    setSelected("");
    setLoadError("");

    async function start() {
      if (isDzi) {
        const response = await fetch(TILE_SOURCE, { cache: "no-store" }).catch(() => null);
        if (!response?.ok) {
          if (!cancelled) setLoadError("DZI file could not be loaded.");
          return;
        }

        const firstTile = firstDziTileUrl(TILE_SOURCE, await response.text());
        if (!firstTile || !(await canLoadImage(firstTile))) {
          if (!cancelled) {
            setLoadError("DZI tiles were not found. Upload the DZI package with its *_files folder.");
          }
          return;
        }
      }

      const { default: OpenSeadragon } = await import("openseadragon");
      if (cancelled || !containerRef.current) return;
      installOpenSeadragonConsoleFilter(OpenSeadragon);

      osdRef.current = OpenSeadragon;
      viewer = OpenSeadragon({
        element: containerRef.current,
        prefixUrl: "/openseadragon-images/",
        tileSources: isDzi ? TILE_SOURCE : { type: "image", url: TILE_SOURCE },
        drawer: "canvas",
        showNavigator: true,
        animationTime: 1.2,
        springStiffness: 6,
      });
      viewerRef.current = viewer;

      onOpen = () => {
        if (!cancelled) setReady(true);
      };
      onOpenFailed = () => {
        if (!cancelled) setReady(false);
      };
      viewer.addHandler("open", onOpen);
      viewer.addHandler("open-failed", onOpenFailed);

      onAnimation = () => {
        const zoom = viewer!.viewport.getZoom(true);
        const minZoom = viewer!.viewport.getMinZoom();
        if (zoom <= minZoom + 0.0001) {
          if (overlayElRef.current) {
            try {
              viewer!.removeOverlay(overlayElRef.current);
            } catch {
              // overlay already gone
            }
            overlayElRef.current = null;
          }
          setSelected("");
        }
      };
      viewer.addHandler("animation", onAnimation);
    }

    start();

    return () => {
      cancelled = true;
      if (viewer) {
        if (onAnimation) viewer.removeHandler("animation", onAnimation);
        if (onOpen) viewer.removeHandler("open", onOpen);
        if (onOpenFailed) viewer.removeHandler("open-failed", onOpenFailed);
        viewer.destroy();
      }
      viewerRef.current = null;
      overlayElRef.current = null;
    };
  }, [TILE_SOURCE, isDzi, containerReady]);

  function handleSelect(key: string) {
    setSelected(key);
    const viewer = viewerRef.current;
    const OpenSeadragon = osdRef.current;
    if (!viewer || !OpenSeadragon || !ready || viewer.world.getItemCount() === 0) return;

    if (overlayElRef.current) {
      try {
        viewer.removeOverlay(overlayElRef.current);
      } catch {
        // overlay already gone
      }
      overlayElRef.current = null;
    }

    const region = REGIONS.find((r) => r.key === key);
    if (!region) {
      viewer.viewport.goHome();
      return;
    }

    const tiledImage = viewer.world.getItemAt(0);
    if (!tiledImage) return;
    const size = tiledImage.getContentSize();
    const x = Math.max(0, Math.min(region.x, Math.max(0, size.x - 1)));
    const y = Math.max(0, Math.min(region.y, Math.max(0, size.y - 1)));
    const width = Math.min(Math.max(1, region.width), size.x - x);
    const height = Math.min(Math.max(1, region.height), size.y - y);
    if (!Number.isFinite(x + y + width + height) || width <= 0 || height <= 0) {
      setSelected("");
      return;
    }

    const rect = tiledImage.imageToViewportRectangle(
      new OpenSeadragon.Rect(x, y, width, height)
    );
    viewer.viewport.fitBounds(rect, false);

    const box = document.createElement("div");
    box.className = "pointer-events-none rounded-sm border-4 border-rose-700";
    viewer.addOverlay({
      element: box,
      location: rect,
      placement: OpenSeadragon.Placement.TOP_LEFT,
    });
    overlayElRef.current = box;
  }

  React.useImperativeHandle(
    ref,
    () => ({
      isReady: () => ready,
      captureViewport: () => {
        const viewer = viewerRef.current;
        const OpenSeadragon = osdRef.current;
        if (!viewer || !OpenSeadragon || !ready || viewer.world.getItemCount() === 0) return null;
        const item = viewer.world.getItemAt(0);
        if (!item) return null;
        const bounds = viewer.viewport.getBounds(true);
        const rect = item.viewportToImageRectangle(bounds);
        const size = item.getContentSize();
        const clamp = (v: number, max: number) => Math.max(0, Math.min(Math.round(v), max));
        const x = clamp(rect.x, size.x);
        const y = clamp(rect.y, size.y);
        return {
          x,
          y,
          width: clamp(rect.width, size.x - x),
          height: clamp(rect.height, size.y - y),
        };
      },
    }),
    [ready]
  );

  return (
    <div className="overflow-hidden rounded-hero border border-iris-300/30 bg-white shadow-lifted">
      <div className="flex flex-col gap-3 border-b border-iris-300/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          {controls === "finder" && (
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-cyto-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
              <ScanSearch className="h-3.5 w-3.5" aria-hidden />
              Slide scout
            </p>
          )}
          <p className="font-display text-lg font-semibold text-plum-900">{title}</p>
          <p className="text-sm text-slate-700">
            {controls === "finder"
              ? activeRegion?.label ?? "Choose a finding target, then pan and zoom freely."
              : caption || "Pinch, scroll or drag to explore the slide - or jump straight to a labeled finding."}
          </p>
        </div>
        {controls === "finder" ? (
          <button
            type="button"
            disabled={!ready}
            onClick={() => handleSelect("")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-iris-300/70 bg-white px-4 text-sm font-semibold text-plum-900 transition-all hover:-translate-y-0.5 hover:border-royal-500 hover:shadow-soft disabled:pointer-events-none disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Reset view
          </button>
        ) : (
          <select
            value={selected}
            disabled={!ready}
            onChange={(event) => handleSelect(event.target.value)}
            className="h-11 rounded-panel border border-iris-300/50 bg-white px-4 text-sm text-ink-900 outline-none transition-colors focus:border-royal-500 focus:ring-2 focus:ring-royal-500/20 disabled:opacity-50"
          >
            <option value="">Jump to a finding&hellip;</option>
            {REGIONS.map((region) => (
              <option key={region.key} value={region.key}>
                {region.label}
              </option>
            ))}
          </select>
        )}
      </div>
      {controls === "finder" && (
        <div className="grid gap-2 border-b border-iris-300/30 bg-mist-100/70 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-5">
          {REGIONS.map((region, index) => {
            const active = selected === region.key;

            return (
              <button
                type="button"
                key={region.key}
                disabled={!ready}
                aria-pressed={active}
                onClick={() => handleSelect(region.key)}
                className={[
                  "group flex min-h-24 flex-col justify-between rounded-panel border bg-white p-4 text-left transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
                  active
                    ? "border-rose-700 shadow-soft"
                    : "border-iris-300/40 hover:-translate-y-0.5 hover:border-royal-500/60 hover:shadow-soft",
                ].join(" ")}
              >
                <span className="flex items-center justify-between gap-3">
                  <span
                    className={[
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      active ? "bg-rose-700 text-white" : "bg-cyto-100 text-rose-700",
                    ].join(" ")}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <LocateFixed
                    className={[
                      "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                      active ? "text-rose-700" : "text-royal-500",
                    ].join(" ")}
                    aria-hidden
                  />
                </span>
                <span className="mt-4 text-sm font-semibold leading-snug text-plum-900">{region.label}</span>
              </button>
            );
          })}
        </div>
      )}
      <div
        ref={containerRef}
        className={[
          "h-[420px] w-full bg-ink-900 sm:h-[520px]",
          loadError ? "flex items-center justify-center p-6 text-center text-sm font-medium text-white" : "",
        ].join(" ")}
      >
        {loadError}
      </div>
    </div>
  );
});
