"use client";

import * as React from "react";
import { Plus, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { StoredPracticeQuestion } from "@/lib/catalog/store";
import {
  usePracticeQuestions,
  useCreatePracticeQuestion,
  useUpdatePracticeQuestion,
  useDeletePracticeQuestion,
} from "@/lib/catalog/hooks";

const field =
  "mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500";

function QuestionRow({ q }: { q: StoredPracticeQuestion }) {
  const update = useUpdatePracticeQuestion();
  const del = useDeletePracticeQuestion();
  const [question, setQuestion] = React.useState(q.question);
  const [optionsText, setOptionsText] = React.useState(q.options.join("\n"));
  const [correctIndex, setCorrectIndex] = React.useState(q.correctIndex);
  const [explanation, setExplanation] = React.useState(q.explanation);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  const opts = optionsText.split("\n").map((l) => l.trim()).filter(Boolean);

  async function save() {
    await update.mutateAsync({
      id: q.id,
      patch: {
        question: question.trim(),
        options: opts,
        correctIndex: Math.min(Math.max(0, correctIndex), Math.max(0, opts.length - 1)),
        explanation: explanation.trim(),
      },
    });
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div className="rounded-card border border-iris-300/40 bg-white p-4 shadow-soft">
      <div className="flex items-start gap-2">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          placeholder="Question"
          className="flex-1 rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-royal-500"
        />
        <button
          onClick={() => {
            if (window.confirm("Delete this question?")) del.mutate(q.id);
          }}
          className="rounded-md p-1.5 text-smoke-400 hover:text-rose-700"
          title="Delete question"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <label className="mt-2 block text-sm font-medium text-plum-900">Options (one per line)</label>
      <textarea
        value={optionsText}
        onChange={(e) => setOptionsText(e.target.value)}
        rows={4}
        placeholder={"Option A\nOption B\nOption C\nOption D"}
        className={field}
      />
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-plum-900">Correct answer</label>
          <select
            value={correctIndex}
            onChange={(e) => setCorrectIndex(Number(e.target.value))}
            className={field}
          >
            {opts.length === 0 && <option value={0}>Add options first</option>}
            {opts.map((o, k) => (
              <option key={k} value={k}>
                {o.slice(0, 40)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <label className="mt-2 block text-sm font-medium text-plum-900">Explanation</label>
      <textarea
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        rows={2}
        placeholder="Why the correct answer is correct"
        className={field}
      />
      <div className="mt-3 flex items-center gap-2">
        <Button size="sm" disabled={update.isPending} onClick={save}>
          <Save className="h-4 w-4" /> Save
        </Button>
        {savedAt && <span className="text-xs text-smoke-400">Saved {savedAt}</span>}
      </div>
    </div>
  );
}

export function QuestionsEditor({ topicSlug }: { topicSlug: string }) {
  const questions = usePracticeQuestions(topicSlug);
  const create = useCreatePracticeQuestion();
  const list = questions.data ?? [];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-700">
          {list.length} question{list.length === 1 ? "" : "s"} · editing
        </p>
        <Button size="sm" disabled={create.isPending} onClick={() => create.mutate(topicSlug)}>
          <Plus className="h-4 w-4" /> Add question
        </Button>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {list.length === 0 && (
          <p className="text-slate-700">No questions yet — add one above.</p>
        )}
        {list.map((q) => (
          <QuestionRow key={q.id} q={q} />
        ))}
      </div>
    </div>
  );
}
