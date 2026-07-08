"use client";

import * as React from "react";
import type OpenSeadragonNS from "openseadragon";

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

export function SlideViewer() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const viewerRef = React.useRef<OpenSeadragonNS.Viewer | null>(null);
  const osdRef = React.useRef<typeof OpenSeadragonNS | null>(null);
  const overlayElRef = React.useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = React.useState("");
  const [ready, setReady] = React.useState(false);

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
    viewer.viewport.fitBounds(rect, true);

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
          <p className="font-display text-lg font-semibold text-plum-900">
            Lichen Planus &mdash; Thin Skin
          </p>
          <p className="text-sm text-slate-700">
            Pinch, scroll or drag to explore the slide &mdash; or jump straight to a labeled
            finding.
          </p>
        </div>
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
      </div>
      <div ref={containerRef} className="h-[420px] w-full bg-ink-900 sm:h-[520px]" />
    </div>
  );
}
