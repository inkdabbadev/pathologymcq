"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  HelpCircle,
  Layers,
  LayoutDashboard,
  LogOut,
  Microscope,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { useEdit } from "@/lib/edit/edit-context";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/practice", label: "Practice", icon: Microscope },
  { href: "/admin/mock-tests", label: "Mock tests", icon: Layers },
  { href: "/admin/shop", label: "Shop", icon: ShoppingBag },
  { href: "/admin/about", label: "About & faculty", icon: Users },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/pages", label: "Pages", icon: Package },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, loading, signOut } = useEdit();

  if (pathname === "/admin/login") {
    return children;
  }

  if (loading) {
    return (
      <Container className="py-16">
        <p className="text-slate-700">Checking admin session...</p>
      </Container>
    );
  }

  if (!admin) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-md rounded-card border border-iris-300/40 bg-white p-8 text-center shadow-soft">
          <h1 className="font-display text-2xl font-bold text-plum-900">Admin only</h1>
          <p className="mt-2 text-sm text-slate-700">
            Sign in before managing site content.
          </p>
          <Link
            href="/admin/login"
            className="mt-5 inline-flex rounded-full bg-royal-500 px-5 py-2 text-sm font-semibold text-white hover:bg-plum-900"
          >
            Open admin login
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div className="bg-mist-100/50 py-8">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-card border border-iris-300/40 bg-white p-3 shadow-soft">
            <div className="px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-royal-500">
                Admin panel
              </p>
              <p className="mt-1 text-sm text-slate-700">{admin.username}</p>
            </div>
            <nav className="mt-2 flex flex-col gap-1">
              {adminLinks.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname?.startsWith(item.href.split("#")[0]);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-panel px-3 py-2 text-sm font-semibold transition",
                      active
                        ? "bg-plum-900 text-white"
                        : "text-plum-900 hover:bg-mist-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 border-t border-iris-300/40 pt-3">
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.replace("/admin/login");
                }}
                className="flex w-full items-center gap-2 rounded-panel px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </aside>

          <section className="min-w-0 rounded-card border border-iris-300/40 bg-white shadow-soft">
            {children}
          </section>
        </div>
      </Container>
    </div>
  );
}
