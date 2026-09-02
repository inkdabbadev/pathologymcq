"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PracticeQuiz } from "@/components/practice/practice-quiz";
import { QuestionsEditor } from "@/components/practice/questions-editor";
import { useEdit } from "@/lib/edit/edit-context";
import { usePracticeTopics, usePracticeQuestions } from "@/lib/catalog/hooks";

export default function PracticeTopicPage() {
  const params = useParams<{ topic: string }>();
  const slug = params?.topic ?? "";
  const { editMode } = useEdit();
  const topics = usePracticeTopics();
  const questions = usePracticeQuestions(slug);

  const topic = topics.data?.find((t) => t.slug === slug);

  return (
    <Section>
      <Container>
        <Link
          href="/practice"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-plum-900"
        >
          <ArrowLeft className="h-4 w-4" />
          All topics
        </Link>

        <div className="mx-auto mt-6 max-w-2xl text-center">
          <h1 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">
            {topic?.label ?? (topics.isLoading ? "…" : "Topic not found")}
          </h1>
        </div>

        <div className="mt-10">
          {editMode ? (
            <QuestionsEditor topicSlug={slug} />
          ) : questions.isLoading ? (
            <p className="text-center text-slate-700">Loading…</p>
          ) : (questions.data?.length ?? 0) > 0 ? (
            <PracticeQuiz topicLabel={topic?.label ?? "Practice"} questions={questions.data ?? []} />
          ) : (
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-card border border-iris-300/30 bg-white py-16 text-center shadow-soft">
              <p className="text-slate-700">
                This question set is still being written — check back soon.
              </p>
              <Link href="/practice" className="font-semibold text-rose-700">
                Back to all topics
              </Link>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
