"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useEdit } from "@/lib/edit/edit-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { admin, signIn } = useEdit();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (admin) router.replace("/");
  }, [admin, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn(username, password);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.replace("/");
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-card border border-iris-300/40 bg-white p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wider text-royal-500">
          Admin
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-plum-900">
          Sign in to edit
        </h1>
        <p className="mt-2 text-sm text-slate-700">
          Signing in unlocks in-place editing across the site. Normal visitors
          never see the editing tools.
        </p>


        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-plum-900" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-500/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-plum-900" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-500/30"
            />
          </div>

          {error && <p className="text-sm text-rose-700">{error}</p>}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
