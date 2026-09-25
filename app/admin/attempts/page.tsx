"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

interface Attempt {
  id: string;
  email: string;
  topic_slug: string;
  topic_label: string;
  score: number;
  total: number;
  created_at: string;
}

async function fetchAttempts(): Promise<Attempt[]> {
  const res = await fetch("/api/admin/attempts");
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message ?? "Failed to load attempts");
  return json.attempts as Attempt[];
}

const fieldClass =
  "rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm text-plum-900";

export default function AdminAttemptsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-attempts"],
    queryFn: fetchAttempts,
    staleTime: 60_000,
  });
  const [topic, setTopic] = React.useState("");
  const [search, setSearch] = React.useState("");

  const topics = React.useMemo(
    () => Array.from(new Set((data ?? []).map((a) => a.topic_label))).sort(),
    [data],
  );
  const rows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter(
      (a) => (!topic || a.topic_label === topic) && (!q || a.email.includes(q)),
    );
  }, [data, topic, search]);
  const uniqueEmails = React.useMemo(() => new Set(rows.map((r) => r.email)).size, [rows]);

  function exportCsv() {
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = [
      ["Email", "Topic", "Score", "Total", "Percent", "Date"].join(","),
      ...rows.map((r) =>
        [
          r.email,
          r.topic_label,
          r.score,
          r.total,
          Math.round((r.score / r.total) * 100),
          new Date(r.created_at).toISOString(),
        ]
          .map(esc)
          .join(","),
      ),
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "practice-attempts.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-plum-900">Practice attempts</h1>
          <p className="mt-1 text-sm text-slate-700">
            {rows.length} attempts from {uniqueEmails} people
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={rows.length === 0}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className={fieldClass}
          placeholder="Search email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={fieldClass} value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-card border border-iris-300/40 bg-white shadow-soft">
        {isLoading ? (
          <p className="p-6 text-slate-700">Loading…</p>
        ) : error ? (
          <p className="p-6 text-rose-700">{(error as Error).message}</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-slate-700">No attempts yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-iris-300/40 text-xs uppercase text-smoke-400">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-iris-300/20 last:border-0">
                  <td className="px-4 py-3 text-plum-900">{r.email}</td>
                  <td className="px-4 py-3 text-slate-700">{r.topic_label}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {r.score} / {r.total} ({Math.round((r.score / r.total) * 100)}%)
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Container>
  );
}
