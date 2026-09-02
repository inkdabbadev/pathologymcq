import type { SupabaseClient } from "@supabase/supabase-js";

import { MOCK_COURSES } from "@/lib/mock/courses";
import { BUNDLES } from "@/lib/mock/bundles";
import { HARD_COPY_BOOKS } from "@/lib/mock/hard-copy-books";
import { MOCK_TEST_PRODUCTS } from "@/lib/mock/mock-test-products";
import { MOCK_TEST_TYPES } from "@/lib/mock/mock-test-types";
import { PRACTICE_TOPICS } from "@/lib/mock/practice-topics";
import { PRACTICE_QUESTIONS } from "@/lib/mock/practice-questions";
import { TEAM_MEMBERS } from "@/lib/mock/team";
import { FAQ_CATEGORIES } from "@/lib/mock/faq-categories";
import { DEFAULT_SETTINGS } from "@/lib/site/defaults";

export type CatalogKind =
  | "courses"
  | "bundles"
  | "books"
  | "mock_tests"
  | "mock_categories"
  | "practice_topics"
  | "practice_questions"
  | "faculty"
  | "faq_categories"
  | "site_settings";

export const CATALOG_KINDS: CatalogKind[] = [
  "courses",
  "bundles",
  "books",
  "mock_tests",
  "mock_categories",
  "practice_topics",
  "practice_questions",
  "faculty",
  "faq_categories",
  "site_settings",
];

interface Row {
  kind: CatalogKind;
  id: string;
  slug: string | null;
  category: string | null;
  position: number;
  data: unknown;
}

function seedRows(kind: CatalogKind): Row[] {
  switch (kind) {
    case "courses":
      return MOCK_COURSES.map((c, i) => ({
        kind,
        id: c.id,
        slug: c.slug,
        category: c.category,
        position: i,
        data: c,
      }));
    case "bundles":
      return BUNDLES.map((b, i) => ({ kind, id: b.id, slug: b.slug, category: null, position: i, data: b }));
    case "books":
      return HARD_COPY_BOOKS.map((b, i) => ({
        kind,
        id: b.id,
        slug: b.slug,
        category: null,
        position: i,
        data: b,
      }));
    case "mock_tests":
      return MOCK_TEST_PRODUCTS.map((m, i) => ({
        kind,
        id: m.id,
        slug: null,
        category: m.category,
        position: i,
        data: m,
      }));
    case "mock_categories":
      return MOCK_TEST_TYPES.map((t, i) => ({
        kind,
        id: t.category,
        slug: t.category,
        category: null,
        position: i,
        data: t,
      }));
    case "practice_topics":
      return PRACTICE_TOPICS.map((t, i) => ({
        kind,
        id: t.slug,
        slug: t.slug,
        category: null,
        position: i,
        data: t,
      }));
    case "practice_questions": {
      const rows: Row[] = [];
      let i = 0;
      for (const [topic, qs] of Object.entries(PRACTICE_QUESTIONS)) {
        qs.forEach((q, j) => {
          rows.push({
            kind,
            id: `${topic}-${j}`,
            slug: null,
            category: topic,
            position: i++,
            data: { id: `${topic}-${j}`, topic, ...q },
          });
        });
      }
      return rows;
    }
    case "faculty":
      return TEAM_MEMBERS.map((m, i) => ({
        kind,
        id: m.id,
        slug: null,
        category: null,
        position: i,
        data: m,
      }));
    case "faq_categories":
      return FAQ_CATEGORIES.map((c, i) => ({
        kind,
        id: c.slug,
        slug: c.slug,
        category: null,
        position: i,
        data: c,
      }));
    case "site_settings":
      return [{ kind, id: "main", slug: null, category: null, position: 0, data: DEFAULT_SETTINGS }];
    default:
      return [];
  }
}

/**
 * Ensure a kind has been seeded from the mock data. Only inserts when the DB
 * has zero rows for that kind, so admin edits/deletes are never overwritten.
 */
export async function ensureSeeded(db: SupabaseClient, kind: CatalogKind): Promise<void> {
  const { count, error } = await db
    .from("catalog_items")
    .select("id", { count: "exact", head: true })
    .eq("kind", kind);
  if (error) throw error;
  if ((count ?? 0) > 0) return;
  const rows = seedRows(kind);
  if (rows.length === 0) return;
  const { error: insErr } = await db.from("catalog_items").insert(rows);
  if (insErr) throw insErr;
}
