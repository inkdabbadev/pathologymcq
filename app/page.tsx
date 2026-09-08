import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { Hero } from "@/components/marketing/hero";
import { StatBand } from "@/components/marketing/stat-band";
import { CourseCard } from "@/components/marketing/course-card";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { CtaBand } from "@/components/marketing/cta-band";
import { HomeExamPathways } from "@/components/marketing/home-exam-pathways";
import { SlideViewer } from "@/components/marketing/slide-viewer";
import { getFeaturedCourses, getStats, getTestimonials } from "@/lib/api/content";

export default async function Home() {
  const [allCourses, stats, testimonials] = await Promise.all([
    getFeaturedCourses(),
    getStats(),
    getTestimonials(),
  ]);
  const courses = allCourses.slice(0, 3);

  return (
    <>
      <Hero />

      <Section>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                One platform. Five board pathways.
              </h2>
              <p className="mt-3 text-slate-700">
                Trusted for exam preparation across FRCPath, NEET-SS, INI-SS, MD/DNB,
                DM fellowships and APCP &mdash; courses and question banks organized by
                the exam you&apos;re actually sitting.
              </p>
            </div>
          </Reveal>

          <HomeExamPathways />
        </Container>
      </Section>

      <Section ambient>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-royal-500">
                The plan
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                Read. Practise. Mock. Know where you stand.
              </h2>
              <p className="mt-3 text-slate-700">
                Every course follows the same loop, mapped week-by-week to your exam date.
              </p>
            </div>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "Step 1 · Read",
                title: "Concise notes",
                body: "Notes that highlight the salient points — built for people with no time to re-read the whole textbook.",
              },
              {
                step: "Step 2 · Practise",
                title: "Questions after every section",
                body: "Image-rich MCQs and virtual slide questions consolidate each topic before you move on.",
              },
              {
                step: "Step 3 · Mock",
                title: "Master tests",
                body: "Full-length, exam-pattern mocks — fifty questions, and they are not easy. On purpose.",
              },
              {
                step: "Step 4 · Ask",
                title: "Doubts answered same day",
                body: "Every query goes directly to a practising pathologist.",
              },
            ].map((s) => (
              <Reveal key={s.step}>
                <div className="flex h-full flex-col gap-2 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft">
                  <span className="text-xs font-semibold uppercase tracking-wide text-royal-500">
                    {s.step}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-plum-900">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-700">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <StatBand stats={stats} />

      <Section>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                Everything you need to master pathology
              </h2>
              <p className="mt-3 text-slate-700">
                Read. Practise. Mock. Know where you stand. Every course follows the same
                loop &mdash; concise notes, questions after every section, full-length mocks,
                and doubts answered the same day &mdash; mapped to the latest WHO classifications.
              </p>
            </div>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Image-Rich MCQ Bank",
                body: "Thousands of high-yield questions with annotated histology slides, cytology images, and consultant-level explanations. After you answer, explanations highlight the diagnostic region on the virtual slide.",
              },
              {
                title: "AI-Guided Learning",
                body: "Adaptive practice that targets your weak areas, plus AI-powered feedback to deepen your diagnostic reasoning.",
              },
              {
                title: "Mock Tests & Analytics",
                body: "Full-length, exam-pattern mocks for FRCPath, NEET-SS, and INI-SS — with strength/weakness analysis after every attempt so you know exactly where you stand.",
              },
              {
                title: "Expert-Written Notes",
                body: "Concise chapterwise notes — online and hard copy — that highlight the salient points. Built for people with no time to re-read the whole textbook. Updated with WHO 5th Edition and ongoing 6th Edition changes.",
              },
              {
                title: "Structured Courses",
                body: "Curated pathways across histopathology, hematopathology, cytopathology, neuropathology, and subspecialty exams. Questions after every section consolidate each topic before you move on.",
              },
              {
                title: "Learn Anywhere",
                body: "Study on web or mobile with offline access, daily challenges, flashcard review, and progress synced across devices.",
              },
            ].map((f) => (
              <Reveal key={f.title}>
                <div className="flex h-full flex-col gap-2 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft">
                  <h3 className="font-display text-lg font-semibold text-plum-900">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-700">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section ambient>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                Explore a real histology slide
              </h2>
              <p className="mt-3 text-slate-700">
                The same zoomable microscopy viewer used throughout our question bank &mdash;
                pan, zoom, and jump to labeled findings.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="mt-10 block">
            <SlideViewer />
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                  Featured courses
                </h2>
                <p className="mt-3 max-w-xl text-slate-700">
                  Structured online courses with notes, videos, and mock tests &mdash;
                  including NEET-SS &middot; DM Oncopathology, FRCPath Part 1 &amp; 2,
                  hematopathology, MD/DNB, and INI-SS &amp; APCP pathways. Enrol anytime.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/courses">View all courses</Link>
              </Button>
            </div>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Reveal key={course.id}>
                <CourseCard course={course} />
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section ambient>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-royal-500">
                Why Pathology MCQ
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                Pathology education you can trust
              </h2>
              <p className="mt-3 text-slate-700">
                We are a team of practising pathologists who built the platform we wished we
                had during residency &mdash; not another question dump, a plan: rigorous,
                exam-authentic, and clinically grounded.
              </p>
            </div>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              {
                title: "Built by Practising Pathologists",
                body: "Every course, MCQ, and note is authored and reviewed by consultant pathologists. Every query goes to a practising pathologist — doubts answered the same day.",
              },
              {
                title: "WHO-Aligned, Continuously Updated",
                body: "Always updated. Questions revised to the latest classifications and guidelines — WHO 5th Edition with ongoing 6th Edition changes, plus Ackerman, Sternberg, and standard texts.",
              },
              {
                title: "Image-Rich, Exam-Authentic MCQs",
                body: "High-yield questions with virtual slides. Explanations highlight the diagnostic region so you learn where to look — not just what to tick — and mock tests that mirror FRCPath, NEET-SS, and INI-SS patterns.",
              },
              {
                title: "Complete Exam Prep Ecosystem",
                body: "Read. Practise. Mock. Know where you stand. Online courses, hard-copy notes, mock papers, flashcards, and bundles — structured pathways from residency through superspeciality exams.",
              },
            ].map((f) => (
              <Reveal key={f.title}>
                <div className="flex h-full flex-col gap-2 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft">
                  <h3 className="font-display text-lg font-semibold text-plum-900">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-700">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                Learning resources for every stage
              </h2>
              <p className="mt-3 text-slate-700">
                Whether you are revising for an upcoming exam or deepening subspecialty
                knowledge, choose the format that fits your study style &mdash; the same
                Read &middot; Practise &middot; Mock loop on every track.
              </p>
            </div>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Online Courses",
                body: "FRCPath Part 1 & 2 with RCPath dataset discussion, NEET-SS · DM Oncopathology, DM Hematopathology, MD/DNB from grossing to sign-out, and INI-SS & APCP-aligned prep.",
                href: "/courses",
                cta: "Browse courses",
              },
              {
                title: "Hard-Copy Notes",
                body: "Chapterwise printed notes that highlight the salient points — case clouds, review questions, and exam-oriented worksheets. Built for people with no time to re-read the whole textbook.",
                href: "/shop/hard-copy-books",
                cta: "View books",
              },
              {
                title: "Mock Tests & Q-Banks",
                body: "Full-length FRCPath, NEET-SS, and INI-SS histopathology/hematopathology mocks with performance breakdowns — exam-pattern papers so you know exactly where you stand.",
                href: "/mock-tests",
                cta: "Explore mocks",
              },
              {
                title: "Pathology Blog",
                body: "Mystery slide of the week, conceptual MCQs, WHO updates, and exam tips. Subscribe to the weekly digest from the blog — no spam, unsubscribe any time.",
                href: "/blog",
                cta: "Read articles",
              },
            ].map((r) => (
              <Reveal key={r.title}>
                <div className="flex h-full flex-col gap-2 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft">
                  <h3 className="font-display text-lg font-semibold text-plum-900">{r.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-700">{r.body}</p>
                  <Link href={r.href} className="mt-auto pt-2 text-sm font-semibold text-rose-700">
                    {r.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section ambient id="testimonials">
        <Container>
          <Reveal>
            <h2 className="text-center font-display text-3xl font-bold text-plum-900 sm:text-4xl">
              Trusted by trainees who sat the real exam
            </h2>
          </Reveal>

          <RevealGroup className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Reveal key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section>
        <CtaBand />
      </Section>
    </>
  );
}
