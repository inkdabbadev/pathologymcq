"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/marketing/course-card";
import { cn } from "@/lib/utils";
import { MOCK_TEST_TYPES } from "@/lib/mock/mock-test-types";
import { useEdit } from "@/lib/edit/edit-context";
import { useCourses, useCreateCourse, useDeleteCourse, useSiteSettings, useUpdateSiteSettings } from "@/lib/catalog/hooks";
import { slugify } from "@/lib/blog/types";

export default function CoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exam = searchParams.get("exam") ?? undefined;
  const { editMode } = useEdit();
  const settings = useSiteSettings();

  const courses = useCourses();
  const createCourse = useCreateCourse();
  const deleteCourse = useDeleteCourse();
  const updateSettings = useUpdateSiteSettings();
  const [newCatLabel, setNewCatLabel] = React.useState("");

  const [newTitle, setNewTitle] = React.useState("");

  const pathways = settings.examPathways;
  const allFilters = [...pathways, ...MOCK_TEST_TYPES];
  const allWithChildren = [
    ...pathways.flatMap((p) => [p, ...(p.children ?? [])]),
    ...MOCK_TEST_TYPES,
  ];
  const categoryOptions = [
    ...pathways.flatMap((p) => [
      { category: p.category, label: p.label },
      ...(p.children ?? []).map((c) => ({ category: c.category, label: `${p.label} — ${c.label}` })),
    ]),
    ...MOCK_TEST_TYPES.map((m) => ({ category: m.category, label: m.label })),
  ];

  const [newCat, setNewCat] = React.useState("");
  const selectedCat = newCat || categoryOptions[0]?.category || "frcpath-part-1";

  const activePathway = allWithChildren.find((p) => p.category === exam);
  const all = courses.data ?? [];
  const filtered = activePathway ? all.filter((c) => c.category === activePathway.category) : all;

  async function handleCreate() {
    const c = await createCourse.mutateAsync({
      title: newTitle || "Untitled course",
      category: selectedCat,
    });
    setNewTitle("");
    router.push(`/courses/${c.slug}`);
  }

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">
            {activePathway ? activePathway.label : "All courses"}
          </h1>
          <p className="mt-4 text-slate-700">
            {activePathway ? activePathway.description : settings.coursesSubtitle}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/courses"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              !activePathway ? "bg-plum-900 text-white" : "bg-mist-100 text-plum-900 hover:bg-iris-300/40"
            )}
          >
            All
          </Link>
          {allFilters.map((pathway) => (
            <Link
              key={pathway.category}
              href={`/courses?exam=${pathway.category}`}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activePathway?.category === pathway.category
                  ? "bg-plum-900 text-white"
                  : "bg-mist-100 text-plum-900 hover:bg-iris-300/40"
              )}
            >
              {pathway.label}
            </Link>
          ))}
        </div>

        {editMode && (
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-end gap-3 rounded-card border border-dashed border-royal-500/50 bg-mist-100/60 p-4">
            <div className="min-w-[200px] flex-1">
              <label className="text-sm font-semibold text-plum-900">New course title</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Course title"
                className="mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
              />
            </div>
            <select
              value={selectedCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
            >
              {categoryOptions.map((o) => (
                <option key={o.category} value={o.category}>
                  {o.label}
                </option>
              ))}
            </select>
            <Button disabled={createCourse.isPending} onClick={handleCreate}>
              <Plus className="h-4 w-4" /> Create & edit
            </Button>

            <div className="flex w-full items-end gap-2 border-t border-iris-300/40 pt-3">
              <div className="flex-1">
                <label className="text-sm font-semibold text-plum-900">Add a category (tag)</label>
                <input
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  placeholder="e.g. Cytopathology"
                  className="mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
                />
              </div>
              <Button
                variant="outline"
                disabled={!newCatLabel.trim() || updateSettings.isPending}
                onClick={() => {
                  const taken = new Set(pathways.map((p) => p.category));
                  let slug = slugify(newCatLabel);
                  let i = 2;
                  while (taken.has(slug)) slug = `${slugify(newCatLabel)}-${i++}`;
                  updateSettings.mutate({
                    examPathways: [...pathways, { category: slug, label: newCatLabel.trim(), description: "" }],
                  });
                  setNewCat(slug);
                  setNewCatLabel("");
                }}
              >
                <Plus className="h-4 w-4" /> Add category
              </Button>
            </div>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <div key={course.id} className="group relative h-full">
                <CourseCard course={course} />
                {editMode && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${course.title}"?`)) deleteCourse.mutate(course.id);
                    }}
                    className="absolute right-3 top-3 z-10 rounded-full bg-white p-1.5 text-smoke-400 opacity-0 shadow-soft transition hover:text-rose-700 group-hover:opacity-100"
                    title="Delete course"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center gap-3 rounded-card border border-iris-300/30 bg-white py-16 text-center shadow-soft">
            <Badge variant="cyto">Coming soon</Badge>
            <p className="max-w-sm text-slate-700">
              No course in this pathway yet — {editMode ? "create one above." : "check back soon."}
            </p>
            <Link href="/courses" className="font-semibold text-rose-700">
              View all courses
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}
