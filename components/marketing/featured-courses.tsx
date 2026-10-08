"use client";

import { useCourses } from "@/lib/catalog/hooks";
import type { Course } from "@/lib/api/types";
import { CourseCard } from "@/components/marketing/course-card";
import { Reveal, RevealGroup } from "@/components/motion/reveal";

export function FeaturedCourses({ fallback }: { fallback: Course[] }) {
  const { data } = useCourses();
  return (
    <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {(data ?? fallback).slice(0, 3).map((course) => (
        <Reveal key={course.id} className="h-full"><CourseCard course={course} /></Reveal>
      ))}
    </RevealGroup>
  );
}
