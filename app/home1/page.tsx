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
import { ExamPathwayCard } from "@/components/marketing/exam-pathway-card";
import { SlideViewer } from "@/components/marketing/slide-viewer";
import { getFeaturedCourses, getStats, getTestimonials } from "@/lib/api/content";
import { EXAM_PATHWAYS } from "@/lib/mock/exam-pathways";

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
                Find your exam pathway
              </h2>
              <p className="mt-3 text-slate-700">
                Courses and question banks organized by the exam you&apos;re actually sitting.
              </p>
            </div>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {EXAM_PATHWAYS.map((pathway) => (
              <Reveal key={pathway.category}>
                <ExamPathwayCard pathway={pathway} />
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <StatBand stats={stats} />

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
            <SlideViewer controls="finder" />
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
                  Structured, subspecialty-first curricula mapped to your target exam.
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
