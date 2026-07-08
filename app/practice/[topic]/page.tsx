import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PracticeQuiz } from "@/components/practice/practice-quiz";
import { PRACTICE_TOPICS } from "@/lib/mock/practice-topics";
import { PRACTICE_QUESTIONS } from "@/lib/mock/practice-questions";

export function generateStaticParams() {
  return PRACTICE_TOPICS.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = PRACTICE_TOPICS.find((t) => t.slug === slug);
  if (!topic) return {};

  return {
    title: `${topic.label} Practice Questions`,
    description: `Free ${topic.label.toLowerCase()} MCQs with instant feedback and explanations.`,
  };
}

export default async function PracticeTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = await params;
  const topic = PRACTICE_TOPICS.find((t) => t.slug === slug);
  if (!topic) notFound();

  const questions = PRACTICE_QUESTIONS[slug] ?? [];

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
            {topic.label}
          </h1>
        </div>

        <div className="mt-10">
          {questions.length > 0 ? (
            <PracticeQuiz topicLabel={topic.label} questions={questions} />
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
