"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import type { SlideViewerHandle, SlideViewerProps } from "@/components/marketing/slide-viewer";

const BrowserSlideViewer = dynamic(
  () => import("@/components/marketing/slide-viewer").then((module) => module.SlideViewer),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[32rem] animate-pulse rounded-hero border border-iris-300/30 bg-mist-100"
        aria-label="Loading slide viewer"
      />
    ),
  },
);

/** OpenSeadragon is browser-only, so exclude the entire viewer from SSR hydration. */
export const ClientSlideViewer = React.forwardRef<SlideViewerHandle, SlideViewerProps>(
  function ClientSlideViewer(props, ref) {
    return <BrowserSlideViewer {...props} ref={ref} />;
  },
);

