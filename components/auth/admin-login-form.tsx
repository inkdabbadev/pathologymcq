"use client";

import * as React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField, inputClassName } from "@/components/ui/form-field";

// If we weren't given an explicit redirect target, send the admin back to
// whatever same-origin page they came from (e.g. the post they wanted to
// edit) instead of always dropping them on the homepage.
function sameOriginReferrer(): string | null {
  if (typeof document === "undefined" || !document.referrer) return null;
  try {
    const ref = new URL(document.referrer);
    if (ref.origin !== window.location.origin) return null;
    if (ref.pathname.startsWith("/admin")) return null;
    return `${ref.pathname}${ref.search}${ref.hash}`;
  } catch {
    return null;
  }
}

export function AdminLoginForm({ redirectTo }: { redirectTo?: string }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { message?: string };
        setError(json.message ?? "Login failed");
        return;
      }
      setSuccess(true);
      const target = redirectTo || sameOriginReferrer() || "/";
      // Full reload (not router.push) so every page — including one already
      // sitting in the client router cache from before login — re-checks the
      // session cookie fresh on the server instead of reusing a stale render.
      setTimeout(() => {
        window.location.href = target;
      }, 600);
    } finally {
      setPending(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-start gap-3 rounded-panel border border-hema-700/30 bg-mist-100 p-4 text-sm text-plum-900">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-hema-700" />
        <div>
          <p className="font-semibold">Signed in</p>
          <p className="mt-1 text-slate-700">Redirecting&hellip;</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <FormField label="Username" htmlFor="username">
        <input
          id="username"
          autoComplete="username"
          className={inputClassName()}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormField>

      <FormField label="Password" htmlFor="password">
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className={inputClassName()}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>

      {error && (
        <div className="flex items-start gap-2 rounded-panel border border-rose-700/30 bg-cyto-100 p-3 text-sm text-rose-700">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
