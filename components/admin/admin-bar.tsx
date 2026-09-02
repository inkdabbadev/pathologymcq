"use client";

import Link from "next/link";
import { Eye, Pencil, LogOut, PlusCircle, Settings } from "lucide-react";

import { useEdit } from "@/lib/edit/edit-context";

/**
 * Floating admin toolbar. Only rendered when an admin is signed in.
 * Lets the admin flip between editing the live site and previewing it exactly
 * as a normal user would see it.
 */
export function AdminBar() {
  const { admin, loading, preview, setPreview, signOut } = useEdit();

  if (loading || !admin) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-iris-300/50 bg-plum-900/95 px-2 py-1.5 text-white shadow-glow backdrop-blur-md">
        <span className="hidden px-2 text-xs font-medium text-iris-300 sm:inline">
          {preview ? "Preview" : "Editing"} · {admin.username}
        </span>

        <button
          type="button"
          onClick={() => setPreview(false)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            preview ? "text-white/70 hover:bg-white/10" : "bg-white text-plum-900"
          }`}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => setPreview(true)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            preview ? "bg-white text-plum-900" : "text-white/70 hover:bg-white/10"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>

        <span className="mx-1 h-5 w-px bg-white/20" />

        <Link
          href="/blog"
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Blog
        </Link>

        <Link
          href="/admin/settings"
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
        >
          <Settings className="h-3.5 w-3.5" />
          Settings
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
