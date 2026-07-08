import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Container } from "@/components/ui/container";
import type { Course } from "@/lib/api/types";

export function CourseHero({ course }: { course: Course }) {
  return (
    <div className="bg-ambient relative -mt-[var(--nav-offset)] overflow-hidden pt-[calc(var(--nav-offset)+2.5rem)] pb-16">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {course.examTargets.map((target) => (
              <Badge key={target} variant="solid">
                {target}
              </Badge>
            ))}
            <Badge variant="default" className="normal-case">
              {course.subspecialty}
            </Badge>
          </div>

          <h1 className="mt-5 text-balance font-display text-3xl font-bold leading-tight text-plum-900 sm:text-4xl md:text-5xl">
            {course.title}
          </h1>

          <p className="mt-4 max-w-xl text-balance text-lg leading-relaxed text-slate-700">
            {course.tagline}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Avatar name={course.faculty.name} size={32} />
              <div>
                <p className="font-semibold text-plum-900">{course.faculty.name}</p>
                <p className="text-xs text-smoke-400">{course.faculty.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-ink-900">
              <Star className="h-4 w-4 fill-eosin-500 text-eosin-500" />
              {course.rating.toFixed(1)}
              <span className="text-smoke-400">({course.reviewCount} reviews)</span>
            </div>
            <span className="text-sm text-smoke-400">{course.lessonCount} lessons</span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#pricing">Enroll now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#curriculum">View curriculum</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-hero shadow-lifted">
          <Image src={course.imageUrl} alt="" fill className="object-cover" />
        </div>
      </Container>
    </div>
  );
}
