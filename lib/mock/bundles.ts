import type { Product } from "@/lib/api/types";

const THUMBS = [
  "/mock/course-thumb-4.svg",
  "/mock/course-thumb-1.svg",
  "/mock/course-thumb-2.svg",
];

/** Discounted course + hard copy notes bundles. */
export const BUNDLES: Product[] = [
  {
    id: "bundle-frcpath-part-1",
    slug: "frcpath-part-1-complete-bundle",
    name: "FRCPath Part 1 Complete Bundle",
    description:
      "Everything you need for Part 1 in one bundle — the full online course plus the printed histopathology notes, at a discounted combined price.",
    imageUrl: THUMBS[0],
    priceCents: 599900,
    currency: "INR",
    includes: ["FRCPath Part 1: Histopathology Mastery (online course)", "Histopathology Hard Copy Notes"],
  },
  {
    id: "bundle-neet-ss-oncopathology",
    slug: "neet-ss-oncopathology-bundle",
    name: "NEET-SS Oncopathology Bundle",
    description:
      "The NEET-SS GI & Liver Pathology course paired with printed histopathology notes for offline revision.",
    imageUrl: THUMBS[1],
    priceCents: 549900,
    currency: "INR",
    includes: ["NEET-SS GI & Liver Pathology Bank (online course)", "Histopathology Hard Copy Notes"],
  },
  {
    id: "bundle-hematopathology-complete",
    slug: "hematopathology-complete-bundle",
    name: "Hematopathology Complete Bundle",
    description:
      "The Hematopathology High-Yield course plus matching printed notes — course and offline revision material together.",
    imageUrl: THUMBS[2],
    priceCents: 499900,
    currency: "INR",
    includes: ["Haematopathology High-Yield Series (online course)", "Hematopathology Hard Copy Notes"],
  },
];
