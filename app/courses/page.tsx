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
  const updateSettings = useUpdateSiteSettings();

  const courses = useCourses();
  const createCourse = useCreateCourse();
  const deleteCourse = useDeleteCourse();

  const [newTitle, setNewTitle] = React.useState("");
  const [newPathwayLabel, setNewPathwayLabel] = React.useState("");
  const [newChildLabel, setNewChildLabel] = React.useState("");
  const [newChildParent, setNewChildParent] = React.useState(settings.examPathways[0]?.category ?? "");

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

  async function handleAddPathway() {
    const label = newPathwayLabel.trim();
    if (!label) return;
    const next = {
      ...settings,
      examPathways: [
        ...settings.examPathways,
        { category: slugify(label), label, description: "" },
      ],
    };
    await updateSettings.mutateAsync(next);
    setNewPathwayLabel("");
    setNewChildParent(slugify(label));
  }

  async function handleAddChildCategory() {
    const label = newChildLabel.trim();
    if (!label || !newChildParent) return;
    const nextExamPathways = settings.examPathways.map((pathway) => {
      if (pathway.category !== newChildParent) return pathway;
      return {
        ...pathway,
        children: [
          ...(pathway.children ?? []),
          { category: slugify(label), label, description: "" },
        ],
      };
    });
    await updateSettings.mutateAsync({ ...settings, examPathways: nextExamPathways });
    setNewChildLabel("");
  }

  async function handleDeletePathway(pathwayCategory: string, label: string) {
    const confirmed = window.confirm(`Delete course category "${label}" and remove it from filters?`);
    if (!confirmed) return;
    const nextExamPathways = settings.examPathways.filter((pathway) => pathway.category !== pathwayCategory);
    await updateSettings.mutateAsync({ ...settings, examPathways: nextExamPathways });
  }

  async function handleDeleteChildCategory(pathwayCategory: string, childCategory: string, label: string) {
    const confirmed = window.confirm(`Delete course subcategory "${label}"?`);
    if (!confirmed) return;
    const nextExamPathways = settings.examPathways.map((pathway) => {
      if (pathway.category !== pathwayCategory) return pathway;
      return {
        ...pathway,
        children: (pathway.children ?? []).filter((child) => child.category !== childCategory),
      };
    });
    await updateSettings.mutateAsync({ ...settings, examPathways: nextExamPathways });
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
            <div key={pathway.category} className="relative">
              <Link
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
              {editMode && (
                <button
                  onClick={() => {
                    if ("children" in pathway && Array.isArray(pathway.children) && pathway.children.length > 0) {
                      handleDeletePathway(pathway.category, pathway.label);
                    } else {
                      handleDeletePathway(pathway.category, pathway.label);
                    }
                  }}
                  className="absolute -right-1 -top-1 rounded-full border border-rose-200 bg-white p-1 text-rose-700 shadow-sm hover:bg-rose-50"
                  title="Delete category"
                  aria-label={`Delete ${pathway.label}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {editMode && (
          <div className="mt-6 space-y-3">
            {pathways.map((pathway) => (
              <div key={pathway.category} className="rounded-panel border border-iris-300/40 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-plum-900">{pathway.label}</p>
                    <p className="text-xs text-smoke-400">{pathway.category}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePathway(pathway.category, pathway.label)}
                    className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
                {pathway.children && pathway.children.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pathway.children.map((child) => (
                      <div key={child.category} className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs text-plum-900">
                        <span>{child.label}</span>
                        <button
                          onClick={() => handleDeleteChildCategory(pathway.category, child.category, child.label)}
                          className="text-rose-700 hover:text-rose-800"
                          title={`Delete ${child.label}`}
                          aria-label={`Delete ${child.label}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {editMode && (
          <div className="mx-auto mt-8 max-w-3xl space-y-4 rounded-[22px] border border-dashed border-violet-300 bg-violet-50/60 p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
              <div>
                <p className="text-sm font-semibold text-plum-900">New course title</p>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Course title"
                  className="mt-2 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
                />
              </div>
              <div>
                <p className="sr-only">Category</p>
                <select
                  value={selectedCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="mt-2 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
                >
                  {categoryOptions.map((o) => (
                    <option key={o.category} value={o.category}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button className="h-[42px]" disabled={createCourse.isPending} onClick={handleCreate}>
                <Plus className="h-4 w-4" /> Create &amp; edit
              </Button>
            </div>

            <div className="h-px bg-violet-200/80" />

            <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
              <div>
                <p className="text-sm font-semibold text-plum-900">New course category</p>
                <input
                  value={newPathwayLabel}
                  onChange={(e) => setNewPathwayLabel(e.target.value)}
                  placeholder="e.g. MDS Pathology"
                  className="mt-2 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
                />
              </div>
              <div className="hidden md:block" />
              <Button className="h-[42px]" disabled={!newPathwayLabel.trim() || updateSettings.isPending} onClick={handleAddPathway}>
                <Plus className="h-4 w-4" /> Add category
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
              <div>
                <p className="text-sm font-semibold text-plum-900">New subcategory</p>
                <input
                  value={newChildLabel}
                  onChange={(e) => setNewChildLabel(e.target.value)}
                  placeholder="e.g. Renal pathology"
                  className="mt-2 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
                />
              </div>
              <div>
                <p className="sr-only">Parent category</p>
                <select
                  value={newChildParent}
                  onChange={(e) => setNewChildParent(e.target.value)}
                  className="mt-2 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
                >
                  {pathways.map((pathway) => (
                    <option key={pathway.category} value={pathway.category}>
                      {pathway.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button className="h-[42px]" disabled={!newChildLabel.trim() || !newChildParent || updateSettings.isPending} onClick={handleAddChildCategory}>
                <Plus className="h-4 w-4" /> Add subcategory
              </Button>
            </div>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <div key={course.id} className="group relative">
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
