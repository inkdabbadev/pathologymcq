import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/marketing/course-card";
import { cn } from "@/lib/utils";
import { getAllCourses } from "@/lib/api/content";
import { EXAM_PATHWAYS } from "@/lib/mock/exam-pathways";
import { MOCK_TESTS_CATEGORY, MOCK_TEST_TYPES } from "@/lib/mock/mock-test-types";

// Top-level pills shown as filter buttons — nested items (e.g. FRCPath Part 2's
// Comprehensive Course / Dataset Discussion-Macro) aren't shown as their own
// pill here to keep this row scannable; they're still reachable via the nav's
// Courses submenu and resolve correctly below via ALL_FILTERS_WITH_CHILDREN.
const ALL_FILTERS = [...EXAM_PATHWAYS, MOCK_TESTS_CATEGORY, ...MOCK_TEST_TYPES];
const ALL_FILTERS_WITH_CHILDREN = [
  ...EXAM_PATHWAYS.flatMap((pathway) => [pathway, ...(pathway.children ?? [])]),
  MOCK_TESTS_CATEGORY,
  ...MOCK_TEST_TYPES,
];

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Browse pathology courses for FRCPath, NEET-SS, INI-SS, MD/DNB and APCP — full curriculum, sample questions, faculty and pricing on every course page. No login required to browse.",
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string }>;
}) {
  const { exam } = await searchParams;
  const courses = await getAllCourses();
  const activePathway = ALL_FILTERS_WITH_CHILDREN.find((pathway) => pathway.category === exam);
  const filtered = activePathway
    ? courses.filter((course) => course.category === activePathway.category)
    : courses;

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">
            {activePathway ? activePathway.label : "All courses"}
          </h1>
          <p className="mt-4 text-slate-700">
            {activePathway
              ? activePathway.description
              : "Structured, subspecialty-first curricula mapped to your target exam. Every course page is fully public — curriculum, samples, faculty and pricing, no login required."}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/courses"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              !activePathway
                ? "bg-plum-900 text-white"
                : "bg-mist-100 text-plum-900 hover:bg-iris-300/40"
            )}
          >
            All
          </Link>
          {ALL_FILTERS.map((pathway) => (
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

        {filtered.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center gap-3 rounded-card border border-iris-300/30 bg-white py-16 text-center shadow-soft">
            <Badge variant="cyto">Coming soon</Badge>
            <p className="max-w-sm text-slate-700">
              We don&apos;t have a course in this pathway yet — check back soon, or explore all
              courses instead.
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
