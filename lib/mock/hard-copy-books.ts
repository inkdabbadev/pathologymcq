import type { Product } from "@/lib/api/types";

const THUMBS = [
  "/mock/course-thumb-1.svg",
  "/mock/course-thumb-2.svg",
  "/mock/course-thumb-3.svg",
];

/** Physical hard copy revision notes, shipped separately from online courses. */
export const HARD_COPY_BOOKS: Product[] = [
  {
    id: "book-histopathology",
    slug: "histopathology-hard-copy-notes",
    name: "Histopathology Hard Copy Notes",
    description:
      "Concise, exam-focused printed notes covering general and systemic histopathology, with high-yield diagrams.",
    imageUrl: THUMBS[0],
    priceCents: 149900,
    currency: "INR",
  },
  {
    id: "book-hematopathology",
    slug: "hematopathology-hard-copy-notes",
    name: "Hematopathology Hard Copy Notes",
    description:
      "Printed revision notes covering bone marrow, lymph node and peripheral smear morphology for exam prep.",
    imageUrl: THUMBS[1],
    priceCents: 149900,
    currency: "INR",
  },
  {
    id: "book-histotechniques",
    slug: "histotechniques-hard-copy-notes",
    name: "Histotechniques Hard Copy Notes",
    description:
      "A practical printed reference for fixation, processing, staining and immunohistochemistry technique.",
    imageUrl: THUMBS[2],
    priceCents: 129900,
    currency: "INR",
  },
];
