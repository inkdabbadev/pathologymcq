"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers, BookOpen, Tablet, Package, Sparkles, Search, Star, Users, Clock, Plus, Pencil, Trash2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { useEdit } from "@/lib/edit/edit-context";
import {
  useCourses, useBooks, useBundles, useMockTests, useSiteSettings,
  useCreateCourse, useDeleteCourse, useCreateBook, useDeleteBook,
  useCreateBundle, useDeleteBundle, useCreateMockTest, useDeleteMockTest,
} from "@/lib/catalog/hooks";

type Kind = "all" | "courses" | "books" | "ebooks" | "bundles" | "mocks";

interface Item {
  id: string;
  kind: Exclude<Kind, "all" | "ebooks">;
  title: string;
  category: string;
  priceCents: number;
  currency: string;
  by: string;
  href: string;
}

function prettify(slug: string) {
  if (!slug) return "General";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const TABS: { key: Kind; label: string; icon: typeof Layers }[] = [
  { key: "all", label: "All", icon: Layers },
  { key: "courses", label: "Courses", icon: BookOpen },
  { key: "books", label: "Books", icon: BookOpen },
  { key: "ebooks", label: "eBooks", icon: Tablet },
  { key: "bundles", label: "Bundles", icon: Package },
  { key: "mocks", label: "AI Mocks", icon: Sparkles },
];

export default function ShopPage() {
  const coursesQ = useCourses();
  const booksQ = useBooks();
  const bundlesQ = useBundles();
  const mocksQ = useMockTests();

  const { editMode } = useEdit();
  const router = useRouter();
  const settings = useSiteSettings();
  const createCourse = useCreateCourse();
  const deleteCourse = useDeleteCourse();
  const createBook = useCreateBook();
  const deleteBook = useDeleteBook();
  const createBundle = useCreateBundle();
  const deleteBundle = useDeleteBundle();
  const createMockTest = useCreateMockTest();
  const deleteMockTest = useDeleteMockTest();

  const [tab, setTab] = React.useState<Kind>("all");
  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState("all");
  const [newTitle, setNewTitle] = React.useState("");
  const [newType, setNewType] = React.useState<Item["kind"]>("courses");

  async function handleCreate() {
    const title = newTitle.trim() || "Untitled";
    const courseCat = settings.examPathways[0]?.category || "frcpath-part-1";
    if (newType === "courses") {
      const c = await createCourse.mutateAsync({ title, category: courseCat });
      setNewTitle("");
      router.push(`/courses/${c.slug}`);
    } else if (newType === "books") {
      await createBook.mutateAsync({ name: title });
      setNewTitle("");
    } else if (newType === "bundles") {
      await createBundle.mutateAsync({ name: title });
      setNewTitle("");
    } else {
      await createMockTest.mutateAsync({ title, category: "neet-ss-oncopathology-mocks" });
      setNewTitle("");
    }
  }

  function deleteItem(i: Item) {
    if (!window.confirm(`Delete "${i.title}"?`)) return;
    if (i.kind === "courses") deleteCourse.mutate(i.id);
    else if (i.kind === "books") deleteBook.mutate(i.id);
    else if (i.kind === "bundles") deleteBundle.mutate(i.id);
    else deleteMockTest.mutate(i.id);
  }

  const items: Item[] = React.useMemo(() => {
    const courses = coursesQ.data ?? [];
    const books = booksQ.data ?? [];
    const bundles = bundlesQ.data ?? [];
    const mocks = mocksQ.data ?? [];
    const c: Item[] = courses.map((x) => ({
      id: x.id, kind: "courses", title: x.title, category: prettify(x.category),
      priceCents: x.priceCents, currency: x.currency, by: x.faculty?.name || "Pathology MCQ",
      href: `/courses/${x.slug}`,
    }));
    const b: Item[] = books.map((x) => ({
      id: x.id, kind: "books", title: x.name, category: "Notes",
      priceCents: x.priceCents, currency: x.currency, by: "Pathology MCQ", href: "/shop/hard-copy-books",
    }));
    const u: Item[] = bundles.map((x) => ({
      id: x.id, kind: "bundles", title: x.name, category: "Bundle",
      priceCents: x.priceCents, currency: x.currency, by: "Pathology MCQ", href: "/shop/bundles",
    }));
    const m: Item[] = mocks.map((x) => ({
      id: x.id, kind: "mocks", title: x.title, category: prettify(x.category),
      priceCents: 0, currency: "INR", by: "Pathology MCQ", href: "/mock-tests",
    }));
    return [...c, ...b, ...u, ...m];
  }, [coursesQ.data, booksQ.data, bundlesQ.data, mocksQ.data]);

  const counts = {
    all: items.length,
    courses: items.filter((i) => i.kind === "courses").length,
    books: items.filter((i) => i.kind === "books").length,
    ebooks: 0,
    bundles: items.filter((i) => i.kind === "bundles").length,
    mocks: items.filter((i) => i.kind === "mocks").length,
  } as Record<Kind, number>;

  const byTab = items.filter((i) => (tab === "all" ? true : i.kind === tab));
  const categories = ["all", ...Array.from(new Set(byTab.map((i) => i.category)))];
  const filtered = byTab.filter(
    (i) =>
      (cat === "all" || i.category === cat) &&
      (query.trim() === "" || i.title.toLowerCase().includes(query.trim().toLowerCase()))
  );

  return (
    <Section>
      <Container>
        {/* Browse */}
        <div>
          <h2 className="font-display text-2xl font-bold text-plum-900">Browse catalog</h2>
          <p className="mt-1 text-slate-700">Sign in to purchase and access your library</p>
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center gap-2 rounded-panel border border-iris-300/60 bg-white px-4 py-3">
          <Search className="h-4 w-4 text-smoke-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search catalog..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        {/* Type tabs */}
        <div className="mt-6 flex flex-wrap gap-6 border-b border-iris-300/40">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setCat("all"); }}
                className={cn(
                  "-mb-px flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors",
                  active ? "border-royal-500 text-plum-900" : "border-transparent text-slate-700 hover:text-plum-900"
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                <span className={cn("rounded-full px-1.5 text-xs", active ? "bg-royal-500 text-white" : "bg-mist-100 text-plum-900")}>
                  {counts[t.key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                cat === c ? "bg-royal-500 text-white" : "border border-iris-300/60 text-plum-900 hover:bg-mist-100"
              )}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>

        {/* Admin: add item */}
        {editMode && (
          <div className="mt-6 flex flex-wrap items-end gap-3 rounded-card border border-dashed border-royal-500/50 bg-mist-100/60 p-4">
            <div className="min-w-[200px] flex-1">
              <label className="text-sm font-semibold text-plum-900">New item title</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title / name"
                className="mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
              />
            </div>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as Item["kind"])}
              className="rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
            >
              <option value="courses">Course</option>
              <option value="books">Book</option>
              <option value="bundles">Bundle</option>
              <option value="mocks">Mock test</option>
            </select>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4" /> Create & edit
            </Button>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((i) => (
              <div
                key={i.kind + i.id}
                className="group relative flex flex-col overflow-hidden rounded-card border border-iris-300/30 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
              >
                {editMode && (
                  <div className="absolute right-2 top-2 z-10 flex gap-1">
                    <Link
                      href={i.href}
                      className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-royal-500"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => deleteItem(i)}
                      className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-rose-700"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-royal-500 via-hema-700 to-plum-900 p-4 text-center">
                  <span className="absolute left-3 top-3 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                    {i.category}
                  </span>
                  <span className="font-display text-sm font-semibold text-white/90">{i.title}</span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-display text-base font-semibold leading-snug text-plum-900">{i.title}</h3>
                  <p className="text-xs text-smoke-400">by {i.by}</p>
                  <div className="flex items-center gap-3 text-xs text-smoke-400">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-eosin-500" /> 0 (0)</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 0</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> —</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="font-display text-lg font-bold text-plum-900">
                      {i.priceCents > 0 ? formatPrice(i.priceCents, i.currency) : "Free"}
                    </span>
                    <Link
                      href="/login"
                      className="rounded-full bg-royal-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-plum-900"
                    >
                      Sign in to buy
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-slate-700">No items match your search.</p>
        )}
      </Container>
    </Section>
  );
}
