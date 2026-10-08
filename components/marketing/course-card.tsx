import { articleUrl } from "@/lib/blog/links";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import type { Course } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";

export function CourseCard({ course, hrefBase = "/courses" }: { course: Course; hrefBase?: string }) {
  return (
    <Link
      href={hrefBase.startsWith("/admin") ? `${hrefBase}/${course.slug}` : articleUrl(course.externalUrl) ?? `${hrefBase}/${course.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-card border border-iris-300/30 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-royal-500/50 hover:shadow-glow"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={course.imageUrl || "/mock/course-thumb-1.svg"}
          alt=""
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <Badge variant="solid" className="absolute left-4 top-4 max-w-[calc(100%-2rem)] truncate">
          {course.examTargets.join(" / ")}
        </Badge>
      </div>

      <div className="flex min-h-52 flex-1 flex-col gap-3 p-5">
        <div className="min-h-6">
          <Badge variant="default" className="max-w-full truncate normal-case">
            {course.subspecialty}
          </Badge>
        </div>

        <h3 className="line-clamp-2 min-h-12 font-display text-lg font-semibold leading-snug text-plum-900">
          {course.title}
        </h3>

        <div className={`flex min-h-7 items-center gap-2 text-sm text-slate-700 ${course.faculty.name ? "" : "invisible"}`}>
          <Avatar name={course.faculty.name || "Faculty"} size={28} />
          <span className="truncate">{course.faculty.name || "Faculty"}</span>
        </div>

        <div className="mt-auto flex items-center justify-end pt-2">
          <span className="font-display text-lg font-bold text-plum-900">
            {course.priceOnRequest ? "View pricing" : formatPrice(course.priceCents, course.currency)}
          </span>
        </div>
      </div>
    </Link>
  );
}
