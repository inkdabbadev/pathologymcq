"use client";

import * as React from "react";
import type OpenSeadragonNS from "openseadragon";
import { LocateFixed, RotateCcw, ScanSearch } from "lucide-react";

interface SlideRegion {
  key: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// NOTE: these pixel regions were provided calibrated against a 15360x10752
// source image. The .dzi currently in public/dzi/ reports 21504x17664 (and a
// different aspect ratio) — re-check these boxes against the real tiles once
// verified; they may need recalibrating.
const REGIONS: SlideRegion[] = [
  { key: "thin", label: "Wedge shaped hypergranulosis", x: 8224, y: 11664, width: 2441, height: 1616 },
  { key: "lack", label: "Civatte body", x: 2610, y: 3586, width: 1290, height: 903 },
  { key: "noClear", label: "Superficial dermal inflammatory infiltrates", x: 11654, y: 12853, width: 1728, height: 2275 },
  { key: "a1", label: "Melanin pigment incontinence", x: 13491, y: 14148, width: 2345, height: 1768 },
  { key: "b2", label: "Sawtoothing of rete ridges", x: 6596, y: 9404, width: 3737, height: 3617 },
];

const TILE_SOURCE = encodeURI("/dzi/Lichen planus.dzi");

interface SlideViewerProps {
  controls?: "dropdown" | "finder";
}

export function SlideViewer({ controls = "dropdown" }: SlideViewerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const viewerRef = React.useRef<OpenSeadragonNS.Viewer | null>(null);
  const osdRef = React.useRef<typeof OpenSeadragonNS | null>(null);
  const overlayElRef = React.useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const activeRegion = REGIONS.find((region) => region.key === selected);

  React.useEffect(() => {
    // openseadragon touches `document` as soon as its module is evaluated, so
    // it must only ever be imported client-side — a static top-level import
    // breaks server-side prerendering of this page.
    let cancelled = false;
    let viewer: OpenSeadragonNS.Viewer | null = null;
    let onAnimation: (() => void) | null = null;

    import("openseadragon").then(({ default: OpenSeadragon }) => {
      if (cancelled || !containerRef.current) return;

      osdRef.current = OpenSeadragon;
      viewer = OpenSeadragon({
        element: containerRef.current,
        prefixUrl: "/openseadragon-images/",
        tileSources: TILE_SOURCE,
        showNavigator: true,
        animationTime: 1.2,
        springStiffness: 6,
      });
      viewerRef.current = viewer;
      setReady(true);

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
    });

    return () => {
      cancelled = true;
      if (viewer) {
        if (onAnimation) viewer.removeHandler("animation", onAnimation);
        viewer.destroy();
      }
      viewerRef.current = null;
      overlayElRef.current = null;
    };
  }, []);

  function handleSelect(key: string) {
    setSelected(key);
    const viewer = viewerRef.current;
    const OpenSeadragon = osdRef.current;
    if (!viewer || !OpenSeadragon) return;

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

    const rect = tiledImage.imageToViewportRectangle(
      new OpenSeadragon.Rect(region.x, region.y, region.width, region.height)
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
          <p className="font-display text-lg font-semibold text-plum-900">Lichen Planus &mdash; Thin Skin</p>
          <p className="text-sm text-slate-700">
            {controls === "finder"
              ? activeRegion?.label ?? "Choose a finding target, then pan and zoom freely."
              : "Pinch, scroll or drag to explore the slide - or jump straight to a labeled finding."}
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
      <div ref={containerRef} className="h-[420px] w-full bg-ink-900 sm:h-[520px]" />
    </div>
  );
}
