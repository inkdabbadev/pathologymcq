"use client";

import Link from "next/link";
import {
  BookOpen,
  FileText,
  HelpCircle,
  Layers,
  Microscope,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

import {
  useBooks,
  useBundles,
  useCourses,
  useFaculty,
  useFaqCategories,
  useMockTests,
  usePracticeTopics,
} from "@/lib/catalog/hooks";

const cards = [
  {
    href: "/admin/settings",
    label: "Site settings",
    body: "Logo, WhatsApp, homepage slide, about text, shop cards, and global content.",
    icon: Settings,
  },
  {
    href: "/admin/courses",
    label: "Courses",
    body: "Create courses, manage categories/tags, and edit each course page.",
    icon: BookOpen,
  },
  {
    href: "/admin/practice",
    label: "Practice questions",
    body: "Manage topics, topic logos, DZI/image questions, answers, and explanations.",
    icon: Microscope,
  },
  {
    href: "/admin/mock-tests",
    label: "Mock tests",
    body: "Create mock categories and update mock-test cards.",
    icon: Layers,
  },
  {
    href: "/admin/shop",
    label: "Shop",
    body: "Manage courses, books, bundles, and mock products from the catalog.",
    icon: ShoppingBag,
  },
  {
    href: "/admin/about",
    label: "About & faculty",
    body: "Update profile pictures and faculty details.",
    icon: Users,
  },
  {
    href: "/admin/faq",
    label: "FAQ",
    body: "Edit FAQ categories and question-answer items.",
    icon: HelpCircle,
  },
  {
    href: "/admin/blog",
    label: "Blog",
    body: "Create categories, drafts, published posts, images, and content blocks.",
    icon: FileText,
  },
];

export default function AdminDashboardPage() {
  const courses = useCourses();
  const topics = usePracticeTopics();
  const mocks = useMockTests();
  const books = useBooks();
  const bundles = useBundles();
  const faculty = useFaculty();
  const faq = useFaqCategories();

  const stats = [
    { label: "Courses", value: courses.data?.length ?? 0 },
    { label: "Practice topics", value: topics.data?.length ?? 0 },
    { label: "Mock tests", value: mocks.data?.length ?? 0 },
    { label: "Shop items", value: (books.data?.length ?? 0) + (bundles.data?.length ?? 0) },
    { label: "Faculty", value: faculty.data?.length ?? 0 },
    { label: "FAQ groups", value: faq.data?.length ?? 0 },
  ];

  return (
    <div className="p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-royal-500">
          Content control
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-plum-900">
          Admin dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-700">
          Manage site content from here. Public pages stay read-only even while you are signed in.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-panel border border-iris-300/40 bg-mist-100/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-smoke-400">
              {stat.label}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-plum-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-card border border-iris-300/40 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-royal-500/50 hover:shadow-glow"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-panel bg-plum-900 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold text-plum-900">
                    {card.label}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{card.body}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
