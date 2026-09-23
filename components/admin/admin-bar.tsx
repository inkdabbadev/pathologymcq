"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LayoutDashboard, LogOut } from "lucide-react";

import { useEdit } from "@/lib/edit/edit-context";
import { cn } from "@/lib/utils";

/**
 * Floating admin toolbar. Only rendered when an admin is signed in.
 * Content editing now lives in the dedicated /admin panel.
 */
export function AdminBar() {
  const pathname = usePathname();
  const { admin, loading, signOut } = useEdit();
  const isAdmin = pathname?.startsWith("/admin");
  const active =
    "bg-white text-plum-900 hover:bg-mist-100";
  const inactive =
    "text-white/80 hover:bg-white/10";

  if (loading || !admin) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-iris-300/50 bg-plum-900/95 px-2 py-1.5 text-white shadow-glow backdrop-blur-md">
        <span className="hidden px-2 text-xs font-medium text-iris-300 sm:inline">
          Admin · {admin.username}
        </span>

        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition",
            isAdmin ? active : inactive
          )}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Admin panel
        </Link>

        <Link
          href="/"
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition",
            !isAdmin ? active : inactive
          )}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Site
        </Link>

        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
          title="Sign out of admin"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
