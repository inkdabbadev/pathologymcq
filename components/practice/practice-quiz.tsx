"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, RotateCcw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField, inputClassName } from "@/components/ui/form-field";
import { McqOption, type McqOptionState } from "@/components/practice/mcq-option";
import { practiceEmailSchema, type PracticeEmailValues } from "@/lib/validation/practice";
import type { PracticeQuestion } from "@/lib/api/types";

type Stage = "email" | "quiz" | "complete";

export function PracticeQuiz({
  topicLabel,
  questions,
}: {
  topicLabel: string;
  questions: PracticeQuestion[];
}) {
  const [stage, setStage] = React.useState<Stage>("email");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PracticeEmailValues>({ resolver: zodResolver(practiceEmailSchema) });

  const onSubmitEmail = () => {
    // No backend is connected yet — this simply unlocks the question set for
    // this session. Capturing the email for follow-up practice reminders
    // lands once the platform's email/CRM integration is wired up.
    setStage("quiz");
  };

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const answered = selected !== null;

  function handleSelect(index: number) {
    if (answered) return;
    setSelected(index);
    if (index === question.correctIndex) setScore((s) => s + 1);
  }

  function handleNext() {
    if (isLast) {
      setStage("complete");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelected(null);
  }

  function handleRetake() {
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setStage("quiz");
  }

  function optionState(index: number): McqOptionState {
    if (!answered) return "unselected";
    if (index === question.correctIndex) return "correct";
    if (index === selected) return "incorrect";
    return "unselected";
  }

  if (stage === "email") {
    return (
      <div className="mx-auto max-w-sm rounded-hero border border-iris-300/30 bg-white p-6 shadow-lifted sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyto-100 text-rose-700">
          <Mail className="h-5 w-5" />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-plum-900">
          Enter your email to begin
        </h2>
        <p className="mt-2 text-sm text-slate-700">
          We&apos;ll use this to send you more free {topicLabel.toLowerCase()} practice sets.
        </p>
        <form onSubmit={handleSubmit(onSubmitEmail)} className="mt-6 flex flex-col gap-4" noValidate>
          <FormField label="Email" htmlFor="practice-email" error={errors.email?.message}>
            <input
              id="practice-email"
              type="email"
              autoComplete="email"
              className={inputClassName(!!errors.email)}
              placeholder="you@example.com"
              {...register("email")}
            />
          </FormField>
          <Button type="submit" size="lg" className="w-full">
            Start practicing
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    );
  }

  if (stage === "complete") {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="mx-auto max-w-md rounded-hero border border-iris-300/30 bg-white p-6 text-center shadow-lifted sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyto-100 text-rose-700">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-plum-900">Set complete</h2>
        <p className="mt-2 text-slate-700">
          You scored{" "}
          <span className="font-semibold text-plum-900">
            {score} / {questions.length}
          </span>{" "}
          ({percent}%) on {topicLabel}.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button size="lg" onClick={handleRetake} className="w-full">
            <RotateCcw className="h-4 w-4" />
            Retake this set
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/practice">Try another topic</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="w-full">
            <Link href="/courses">Explore full courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between text-sm text-smoke-400">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span>{topicLabel}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-mist-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-eosin-500 to-rose-700 transition-all duration-300"
          style={{ width: `${((currentIndex + (answered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="mt-8 rounded-hero border border-iris-300/30 bg-white p-6 shadow-lifted sm:p-8">
        <p className="font-display text-lg font-semibold leading-snug text-plum-900">
          {question.question}
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          {question.options.map((option, index) => (
            <McqOption
              key={option}
              label={option}
              state={optionState(index)}
              disabled={answered}
              onSelect={() => handleSelect(index)}
            />
          ))}
        </div>

        {answered && (
          <div className="mt-5 rounded-panel bg-cyto-100 p-4 text-sm leading-relaxed text-slate-700">
            <span className="font-semibold text-rose-700">Explanation: </span>
            {question.explanation}
          </div>
        )}

        <Button size="lg" className="mt-6 w-full" disabled={!answered} onClick={handleNext}>
          {isLast ? "See results" : "Next question"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
