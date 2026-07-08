import type { Post } from "@/lib/api/types";

const THUMBS = [
  "/mock/course-thumb-2.svg",
  "/mock/course-thumb-3.svg",
  "/mock/course-thumb-4.svg",
];

export const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    slug: "5-common-mistakes-frcpath-part-1",
    title: "5 Common Mistakes Trainees Make Preparing for FRCPath Part 1",
    excerpt:
      "From over-reading textbooks to under-practicing image-based questions — what actually moves the needle in the final 8 weeks.",
    imageUrl: THUMBS[0],
    publishedAt: "2026-05-12",
    category: "Exam Prep Guides",
  },
  {
    id: "post-2",
    slug: "approaching-image-based-mcqs",
    title: "A Systematic Approach to Image-Based Pathology MCQs",
    excerpt:
      "A repeatable framework for reading a slide under exam pressure, before you even look at the answer options.",
    imageUrl: THUMBS[1],
    publishedAt: "2026-04-28",
    category: "MCQ Strategies",
  },
  {
    id: "post-3",
    slug: "who-classification-5th-edition-changes",
    title: "What Changed in the WHO 5th Edition Classification (and What to Revise)",
    excerpt:
      "A trainee-friendly summary of the haematolymphoid tumour classification updates most likely to appear in exams.",
    imageUrl: THUMBS[2],
    publishedAt: "2026-03-30",
    category: "Exam Prep Guides",
  },
];
