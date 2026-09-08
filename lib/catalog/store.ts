"use client";

import type { Course, Product, FacultyMember, PracticeTopic, PracticeQuestion, FaqItem } from "@/lib/api/types";
import type { MockTestProduct } from "@/lib/mock/mock-test-products";
import type { MockTestType } from "@/lib/mock/mock-test-types";
import type { FaqCategory } from "@/lib/mock/faq-categories";
import { MOCK_FACULTY } from "@/lib/mock/faculty";
import { slugify } from "@/lib/blog/types";

export type StoredPracticeQuestion = PracticeQuestion & { id: string; topic: string };

/**
 * Catalog data layer — Supabase backed via /api/catalog (read) and
 * /api/admin/catalog (write). Kinds: courses, bundles, books, mock_tests,
 * mock_categories.
 */

type Kind =
  | "courses"
  | "bundles"
  | "books"
  | "mock_tests"
  | "mock_categories"
  | "practice_topics"
  | "practice_questions"
  | "faculty"
  | "faq_categories"
  | "pages"
  | "site_settings";

function uid(prefix: string): string {
  const r =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}-${r.slice(0, 8)}`;
}

function uniqueSlug(base: string, taken: Set<string>): string {
  let slug = base;
  let i = 2;
  while (taken.has(slug)) slug = `${base}-${i++}`;
  return slug;
}

async function apiJson<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error((json as { message?: string }).message ?? `Request failed (${res.status})`);
  return json as T;
}

async function fetchKind<T>(kind: Kind): Promise<T[]> {
  const res = await fetch(`/api/catalog?kind=${kind}`, { cache: "no-store" });
  const { items } = await apiJson<{ items: T[] }>(res);
  return items ?? [];
}

async function upsert(
  kind: Kind,
  item: { id: string; slug?: string | null; category?: string | null; position?: number; data: unknown }
): Promise<void> {
  const res = await fetch("/api/admin/catalog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, item }),
  });
  await apiJson(res);
}

async function remove(kind: Kind, id: string): Promise<void> {
  const res = await fetch("/api/admin/catalog", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, id }),
  });
  await apiJson(res);
}

// ── Courses ──────────────────────────────────────────────────────────────────
export async function listCourses(): Promise<Course[]> {
  return fetchKind<Course>("courses");
}
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const list = await listCourses();
  return list.find((c) => c.slug === slug) ?? null;
}
export async function createCourse(input: { title: string; category: string }): Promise<Course> {
  const list = await listCourses();
  const taken = new Set(list.map((c) => c.slug));
  const course: Course = {
    id: uid("course"),
    slug: uniqueSlug(slugify(input.title), taken),
    category: input.category || "frcpath-part-1",
    title: input.title.trim() || "Untitled course",
    tagline: "",
    subspecialty: "General",
    examTargets: ["FRCPath"],
    imageUrl: "/mock/course-thumb-1.svg",
    priceCents: 0,
    currency: "INR",
    faculty: MOCK_FACULTY[0],
    lessonCount: 0,
    whoFor: [],
    whatYouGet: [],
    curriculum: [],
    faqs: [],
  };
  await upsert("courses", { id: course.id, slug: course.slug, category: course.category, position: -Date.now(), data: course });
  return course;
}
export async function updateCourse(id: string, patch: Partial<Course>): Promise<Course> {
  const list = await listCourses();
  const cur = list.find((c) => c.id === id);
  if (!cur) throw new Error("Course not found");
  const next = { ...cur, ...patch } as Course;
  await upsert("courses", { id: next.id, slug: next.slug, category: next.category, data: next });
  return next;
}
export async function deleteCourse(id: string): Promise<void> {
  await remove("courses", id);
}

// ── Bundles ──────────────────────────────────────────────────────────────────
export async function listBundles(): Promise<Product[]> {
  return fetchKind<Product>("bundles");
}
export async function createBundle(input: { name: string }): Promise<Product> {
  const list = await listBundles();
  const taken = new Set(list.map((b) => b.slug));
  const bundle: Product = {
    id: uid("bundle"),
    slug: uniqueSlug(slugify(input.name), taken),
    name: input.name.trim() || "Untitled bundle",
    description: "",
    imageUrl: "/mock/course-thumb-4.svg",
    priceCents: 0,
    currency: "INR",
    includes: [],
  };
  await upsert("bundles", { id: bundle.id, slug: bundle.slug, position: -Date.now(), data: bundle });
  return bundle;
}
export async function updateBundle(id: string, patch: Partial<Product>): Promise<Product> {
  const list = await listBundles();
  const cur = list.find((b) => b.id === id);
  if (!cur) throw new Error("Bundle not found");
  const next = { ...cur, ...patch } as Product;
  await upsert("bundles", { id: next.id, slug: next.slug, data: next });
  return next;
}
export async function deleteBundle(id: string): Promise<void> {
  await remove("bundles", id);
}

// ── Hard copy books ──────────────────────────────────────────────────────────
export async function listBooks(): Promise<Product[]> {
  return fetchKind<Product>("books");
}
export async function createBook(input: { name: string }): Promise<Product> {
  const list = await listBooks();
  const taken = new Set(list.map((b) => b.slug));
  const book: Product = {
    id: uid("book"),
    slug: uniqueSlug(slugify(input.name), taken),
    name: input.name.trim() || "Untitled book",
    description: "",
    imageUrl: "/mock/course-thumb-1.svg",
    priceCents: 0,
    currency: "INR",
  };
  await upsert("books", { id: book.id, slug: book.slug, position: -Date.now(), data: book });
  return book;
}
export async function updateBook(id: string, patch: Partial<Product>): Promise<Product> {
  const list = await listBooks();
  const cur = list.find((b) => b.id === id);
  if (!cur) throw new Error("Book not found");
  const next = { ...cur, ...patch } as Product;
  await upsert("books", { id: next.id, slug: next.slug, data: next });
  return next;
}
export async function deleteBook(id: string): Promise<void> {
  await remove("books", id);
}

// ── Mock tests ────────────────────────────────────────────────────────────────
export async function listMockTests(): Promise<MockTestProduct[]> {
  return fetchKind<MockTestProduct>("mock_tests");
}
export async function createMockTest(input: { title: string; category: string }): Promise<MockTestProduct> {
  const mt: MockTestProduct = {
    id: uid("mock"),
    title: input.title.trim() || "Untitled mock test",
    shortLabel: input.title.trim() || "mock",
    category: input.category,
    examPattern: "Mock Test",
    questionCount: 0,
    imageUrl: "/mock/course-thumb-1.svg",
  };
  await upsert("mock_tests", { id: mt.id, category: mt.category, position: -Date.now(), data: mt });
  return mt;
}
export async function updateMockTest(id: string, patch: Partial<MockTestProduct>): Promise<MockTestProduct> {
  const list = await listMockTests();
  const cur = list.find((m) => m.id === id);
  if (!cur) throw new Error("Mock test not found");
  const next = { ...cur, ...patch } as MockTestProduct;
  await upsert("mock_tests", { id: next.id, category: next.category, data: next });
  return next;
}
export async function deleteMockTest(id: string): Promise<void> {
  await remove("mock_tests", id);
}

// ── Mock test categories ─────────────────────────────────────────────────────
export async function listMockCategories(): Promise<MockTestType[]> {
  return fetchKind<MockTestType>("mock_categories");
}
export async function createMockCategory(input: { label: string; description?: string }): Promise<MockTestType> {
  const list = await listMockCategories();
  const taken = new Set(list.map((c) => c.category));
  const type: MockTestType = {
    category: uniqueSlug(slugify(input.label), taken),
    label: input.label.trim() || "New category",
    description: input.description?.trim() || "",
  };
  await upsert("mock_categories", { id: type.category, slug: type.category, position: Date.now(), data: type });
  return type;
}
export async function updateMockCategory(
  slugId: string,
  patch: Partial<Pick<MockTestType, "label" | "description">>
): Promise<MockTestType> {
  const list = await listMockCategories();
  const cur = list.find((c) => c.category === slugId);
  if (!cur) throw new Error("Category not found");
  const next: MockTestType = {
    ...cur,
    label: patch.label !== undefined ? patch.label.trim() : cur.label,
    description: patch.description !== undefined ? patch.description.trim() : cur.description,
  };
  await upsert("mock_categories", { id: next.category, slug: next.category, data: next });
  return next;
}
export async function deleteMockCategory(slugId: string): Promise<void> {
  // Remove the category and any mock tests inside it.
  const tests = await listMockTests();
  await Promise.all(
    tests.filter((m) => m.category === slugId).map((m) => remove("mock_tests", m.id))
  );
  await remove("mock_categories", slugId);
}

// ── Practice topics ──────────────────────────────────────────────────────────
export async function listPracticeTopics(): Promise<PracticeTopic[]> {
  return fetchKind<PracticeTopic>("practice_topics");
}
export async function createPracticeTopic(input: { label: string }): Promise<PracticeTopic> {
  const list = await listPracticeTopics();
  const taken = new Set(list.map((t) => t.slug));
  const topic: PracticeTopic = {
    slug: uniqueSlug(slugify(input.label), taken),
    label: input.label.trim() || "New topic",
  };
  await upsert("practice_topics", { id: topic.slug, slug: topic.slug, position: Date.now(), data: topic });
  return topic;
}
export async function updatePracticeTopic(
  slug: string,
  patch: Partial<PracticeTopic>
): Promise<PracticeTopic> {
  const list = await listPracticeTopics();
  const cur = list.find((t) => t.slug === slug);
  if (!cur) throw new Error("Topic not found");
  const next = { ...cur, label: patch.label !== undefined ? patch.label.trim() : cur.label };
  await upsert("practice_topics", { id: next.slug, slug: next.slug, data: next });
  return next;
}
export async function deletePracticeTopic(slug: string): Promise<void> {
  const qs = await listPracticeQuestions(slug);
  await Promise.all(qs.map((q) => remove("practice_questions", q.id)));
  await remove("practice_topics", slug);
}

// ── Practice questions (per topic) ───────────────────────────────────────────
export async function listPracticeQuestions(topicSlug?: string): Promise<StoredPracticeQuestion[]> {
  const all = await fetchKind<StoredPracticeQuestion>("practice_questions");
  return topicSlug ? all.filter((q) => q.topic === topicSlug) : all;
}
export async function createPracticeQuestion(topicSlug: string): Promise<StoredPracticeQuestion> {
  const q: StoredPracticeQuestion = {
    id: uid("pq"),
    topic: topicSlug,
    question: "New question",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 0,
    explanation: "",
  };
  await upsert("practice_questions", { id: q.id, category: topicSlug, position: Date.now(), data: q });
  return q;
}
export async function updatePracticeQuestion(
  id: string,
  patch: Partial<StoredPracticeQuestion>
): Promise<StoredPracticeQuestion> {
  const all = await listPracticeQuestions();
  const cur = all.find((q) => q.id === id);
  if (!cur) throw new Error("Question not found");
  const next = { ...cur, ...patch } as StoredPracticeQuestion;
  await upsert("practice_questions", { id: next.id, category: next.topic, data: next });
  return next;
}
export async function deletePracticeQuestion(id: string): Promise<void> {
  await remove("practice_questions", id);
}

// ── Faculty (About page team) ────────────────────────────────────────────────
export async function listFaculty(): Promise<FacultyMember[]> {
  return fetchKind<FacultyMember>("faculty");
}
export async function createFaculty(input: { name: string }): Promise<FacultyMember> {
  const m: FacultyMember = {
    id: uid("fac"),
    name: input.name.trim() || "New member",
    title: "",
    affiliation: "",
    avatarUrl: "",
  };
  await upsert("faculty", { id: m.id, position: Date.now(), data: m });
  return m;
}
export async function updateFaculty(id: string, patch: Partial<FacultyMember>): Promise<FacultyMember> {
  const list = await listFaculty();
  const cur = list.find((m) => m.id === id);
  if (!cur) throw new Error("Member not found");
  const next = { ...cur, ...patch } as FacultyMember;
  await upsert("faculty", { id: next.id, data: next });
  return next;
}
export async function deleteFaculty(id: string): Promise<void> {
  await remove("faculty", id);
}

// ── FAQ categories (with items) ──────────────────────────────────────────────
export async function listFaqCategories(): Promise<FaqCategory[]> {
  return fetchKind<FaqCategory>("faq_categories");
}
export async function createFaqCategory(input: { title: string }): Promise<FaqCategory> {
  const list = await listFaqCategories();
  const taken = new Set(list.map((c) => c.slug));
  const cat: FaqCategory = {
    slug: uniqueSlug(slugify(input.title), taken),
    title: input.title.trim() || "New category",
    items: [],
  };
  await upsert("faq_categories", { id: cat.slug, slug: cat.slug, position: Date.now(), data: cat });
  return cat;
}
export async function updateFaqCategory(
  slug: string,
  patch: Partial<Pick<FaqCategory, "title" | "items">>
): Promise<FaqCategory> {
  const list = await listFaqCategories();
  const cur = list.find((c) => c.slug === slug);
  if (!cur) throw new Error("FAQ category not found");
  const next: FaqCategory = {
    ...cur,
    title: patch.title !== undefined ? patch.title.trim() : cur.title,
    items: patch.items !== undefined ? patch.items : cur.items,
  };
  await upsert("faq_categories", { id: next.slug, slug: next.slug, data: next });
  return next;
}
export async function deleteFaqCategory(slug: string): Promise<void> {
  await remove("faq_categories", slug);
}

export type { FaqItem, FaqCategory };

// ── Content pages (services + legal/support) ──────────────────────────────────
import type { ContentPageDoc } from "@/lib/mock/pages";

export async function listPages(): Promise<ContentPageDoc[]> {
  return fetchKind<ContentPageDoc>("pages");
}
export async function getPageBySlug(slug: string): Promise<ContentPageDoc | null> {
  const list = await listPages();
  return list.find((p) => p.slug === slug) ?? null;
}
export async function updatePage(
  slug: string,
  patch: Partial<ContentPageDoc>
): Promise<ContentPageDoc> {
  const list = await listPages();
  const cur = list.find((p) => p.slug === slug);
  if (!cur) throw new Error("Page not found");
  const next = { ...cur, ...patch, slug: cur.slug } as ContentPageDoc;
  await upsert("pages", { id: next.slug, slug: next.slug, data: next });
  return next;
}

export type { ContentPageDoc };

// ── Site settings (single doc) ───────────────────────────────────────────────
import type { SiteSettings } from "@/lib/site/defaults";
import { DEFAULT_SETTINGS } from "@/lib/site/defaults";

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await fetchKind<SiteSettings>("site_settings");
  return { ...DEFAULT_SETTINGS, ...(rows[0] ?? {}) };
}
export async function updateSiteSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const cur = await getSiteSettings();
  const next = { ...cur, ...patch };
  await upsert("site_settings", { id: "main", position: 0, data: next });
  return next;
}
