"use client";

import * as React from "react";

export interface AdminUser {
  username: string;
}

interface EditContextValue {
  /** The signed-in admin, or null. */
  admin: AdminUser | null;
  loading: boolean;
  /** Whether the site is currently in editing mode (admin only). */
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  /** Preview: render exactly what a normal user sees, while still signed in. */
  preview: boolean;
  setPreview: (v: boolean) => void;
  signIn: (username: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const EditContext = React.createContext<EditContextValue | null>(null);

async function fetchAdmin(): Promise<AdminUser | null> {
  try {
    const res = await fetch("/api/admin/me", { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as { admin: AdminUser | null };
    return json.admin ?? null;
  } catch {
    return null;
  }
}

export function EditProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = React.useState<AdminUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [editMode, setEditMode] = React.useState(false);
  const [preview, setPreview] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    fetchAdmin().then((a) => {
      if (!active) return;
      setAdmin(a);
      if (a) setEditMode(true);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const signIn = React.useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        admin?: AdminUser;
        message?: string;
      };
      if (!res.ok || !json.admin) {
        return { error: json.message ?? "Login failed" };
      }
      setAdmin(json.admin);
      setEditMode(true);
      setPreview(false);
      return {};
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, []);

  const signOut = React.useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setAdmin(null);
    setEditMode(false);
    setPreview(false);
  }, []);

  const value: EditContextValue = {
    admin,
    loading,
    editMode: editMode && !preview,
    setEditMode,
    preview,
    setPreview,
    signIn,
    signOut,
  };

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}

export function useEdit(): EditContextValue {
  const ctx = React.useContext(EditContext);
  if (!ctx) {
    return {
      admin: null,
      loading: false,
      editMode: false,
      setEditMode: () => {},
      preview: false,
      setPreview: () => {},
      signIn: async () => ({ error: "not ready" }),
      signOut: async () => {},
    };
  }
  return ctx;
}
