import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import type { Course } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-card border border-iris-300/30 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-royal-500/50 hover:shadow-glow"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={course.imageUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <Badge variant="solid" className="absolute left-4 top-4">
          {course.examTargets.join(" / ")}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Badge variant="default" className="w-fit normal-case">
          {course.subspecialty}
        </Badge>

        <h3 className="font-display text-lg font-semibold leading-snug text-plum-900">
          {course.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Avatar name={course.faculty.name} size={28} />
          <span>{course.faculty.name}</span>
        </div>

        <div className="mt-auto flex items-center justify-end pt-2">
          <span className="font-display text-lg font-bold text-plum-900">
            {formatPrice(course.priceCents, course.currency)}
          </span>
        </div>
      </div>
    </Link>
  );
}
