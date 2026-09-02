"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Avatar } from "@/components/ui/avatar";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { SamplePreview } from "@/components/marketing/sample-preview";
import { FaqSection } from "@/components/marketing/faq-section";
import { CourseHero } from "@/components/course/course-hero";
import { CourseCurriculum } from "@/components/course/course-curriculum";
import { CoursePricingCard } from "@/components/course/course-pricing-card";
import { StickyEnrollBar } from "@/components/course/sticky-enroll-bar";
import { CourseEditor } from "@/components/course/course-editor";
import { MOCK_TESTIMONIALS } from "@/lib/mock/testimonials";
import { useEdit } from "@/lib/edit/edit-context";
import { useCourse } from "@/lib/catalog/hooks";

export default function CoursePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const { editMode } = useEdit();
  const { data: course, isLoading } = useCourse(slug);

  if (isLoading) {
    return (
      <Section>
        <Container>
          <p className="text-slate-700">Loading…</p>
        </Container>
      </Section>
    );
  }

  if (!course) {
    return (
      <Section>
        <Container>
          <h1 className="font-display text-2xl font-bold text-plum-900">Course not found</h1>
          <Link href="/courses" className="mt-4 inline-block text-royal-500 hover:underline">
            Back to courses
          </Link>
        </Container>
      </Section>
    );
  }

  if (editMode) {
    return <CourseEditor course={course} />;
  }

  const testimonials =
    course.testimonials && course.testimonials.length > 0
      ? course.testimonials
      : MOCK_TESTIMONIALS.slice(0, 3);

  return (
    <>
      <CourseHero course={course} />

      <Section>
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="flex flex-col gap-16 lg:col-span-2">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              {course.whoFor.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-plum-900">
                    Who this course is for
                  </h2>
                  <ul className="mt-5 flex flex-col gap-3">
                    {course.whoFor.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm leading-relaxed text-slate-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-hema-700" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {course.whatYouGet.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-plum-900">
                    What you&apos;ll get
                  </h2>
                  <ul className="mt-5 flex flex-col gap-3">
                    {course.whatYouGet.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm leading-relaxed text-slate-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-hema-700" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {course.curriculum.length > 0 && (
              <div id="curriculum">
                <h2 className="font-display text-2xl font-bold text-plum-900">Curriculum</h2>
                <p className="mt-2 text-sm text-smoke-400">
                  {course.curriculum.length} modules &middot; {course.lessonCount} lessons
                </p>
                <div className="mt-5">
                  <CourseCurriculum modules={course.curriculum} />
                </div>
              </div>
            )}

            <div>
              <h2 className="font-display text-2xl font-bold text-plum-900">
                See a sample question
              </h2>
              <p className="mt-2 text-sm text-slate-700">
                A preview of the question style and explanation depth in this course.
              </p>
              <div className="mt-5 flex flex-col gap-6">
                {course.sampleQuestions && course.sampleQuestions.length > 0 ? (
                  course.sampleQuestions.map((q, i) => (
                    <SamplePreview
                      key={i}
                      imageUrl={q.imageUrl || course.imageUrl}
                      question={q.question}
                      options={q.options.map((label, idx) => ({
                        label,
                        state: idx === q.correctIndex ? "correct" : undefined,
                      }))}
                      explanation={q.explanation}
                    />
                  ))
                ) : (
                  <SamplePreview
                    imageUrl={course.imageUrl}
                    question={`Which finding is most characteristic of the classic presentation discussed in ${course.subspecialty}?`}
                    options={[
                      {
                        label: "The pattern emphasized in this course's core module",
                        state: "correct",
                      },
                      { label: "A commonly confused mimic", state: "incorrect" },
                      { label: "A finding seen only in advanced disease" },
                      { label: "A non-specific reactive change" },
                    ]}
                    explanation={`This is the kind of image-first, explanation-led question you'll see throughout ${course.title}.`}
                  />
                )}
              </div>
            </div>

            <div id="faculty">
              <h2 className="font-display text-2xl font-bold text-plum-900">Meet your faculty</h2>
              <div className="mt-5 flex items-center gap-4 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft">
                <Avatar name={course.faculty.name} size={64} />
                <div>
                  <p className="font-display text-lg font-semibold text-plum-900">
                    {course.faculty.name}
                  </p>
                  <p className="text-sm text-slate-700">{course.faculty.title}</p>
                  <p className="text-sm text-smoke-400">{course.faculty.affiliation}</p>
                </div>
              </div>
            </div>

            <div id="testimonials">
              <h2 className="font-display text-2xl font-bold text-plum-900">What students say</h2>
              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
            </div>

            {course.faqs.length > 0 && (
              <div id="faq">
                <h2 className="font-display text-2xl font-bold text-plum-900">
                  Frequently asked questions
                </h2>
                <div className="mt-5">
                  <FaqSection items={course.faqs} idPrefix={`course-${course.slug}`} />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <CoursePricingCard course={course} />
          </div>
        </Container>
      </Section>

      <StickyEnrollBar course={course} />
    </>
  );
}
