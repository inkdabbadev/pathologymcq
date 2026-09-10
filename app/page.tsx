import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { Hero } from "@/components/marketing/hero";
import { CourseCard } from "@/components/marketing/course-card";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { CtaBand } from "@/components/marketing/cta-band";
import { FacultyStrip } from "@/components/marketing/faculty-strip";
import { BlogTeaser } from "@/components/marketing/blog-teaser";
import { SlideViewer } from "@/components/marketing/slide-viewer";
import { getFeaturedCourses, getTestimonials } from "@/lib/api/content";

const BOARDS = ["FRCPath", "NEET-SS", "INI-SS", "MD / DNB", "DM Fellowships", "APCP"];

const TRACKS = [
  { label: "FRCPath", body: "Part 1 & Part 2 courses plus RCPath dataset discussion and macro.", exam: "frcpath-part-1" },
  { label: "NEET-SS · DM Oncopathology", body: "Subspecialty-weighted bank with dedicated NEET-SS mock tests.", exam: "neet-ss-oncopathology" },
  { label: "DM Hematopathology", body: "Flow cytometry, MRD, cytogenetics and molecular in one pathway.", exam: "hematopathology" },
  { label: "MD / DNB", body: "The approach-based course: from grossing to sign-out for routine practice.", exam: "approach-based-course" },
  { label: "INI-SS & APCP", body: "Complete INI-SS histo/hemat mocks and APCP-aligned preparation.", exam: "ini-ss-mocks" },
];

const FLAGSHIP_FEATURES = [
  "Full oncopathology question bank with virtual slides",
  "Concise notes for every subspecialty",
  "Full-length NEET-SS mocks with performance breakdowns",
  "Doubts answered same day by practising pathologists",
];

const EVERYTHING = [
  { title: "Image-Rich MCQ Bank", body: "Thousands of high-yield questions with annotated histology slides, cytology images, and consultant-level explanations. After you answer, explanations highlight the diagnostic region on the virtual slide." },
  { title: "AI-Guided Learning", body: "Adaptive practice that targets your weak areas, plus AI-powered feedback to deepen your diagnostic reasoning." },
  { title: "Mock Tests & Analytics", body: "Full-length, exam-pattern mocks for FRCPath, NEET-SS, and INI-SS — with strength/weakness analysis after every attempt so you know exactly where you stand." },
  { title: "Expert-Written Notes", body: "Concise chapterwise notes — online and hard copy — that highlight the salient points. Built for people with no time to re-read the whole textbook. Updated with WHO 5th Edition and ongoing 6th Edition changes." },
  { title: "Structured Courses", body: "Curated pathways across histopathology, hematopathology, cytopathology, neuropathology, and subspecialty exams. Questions after every section consolidate each topic before you move on." },
  { title: "Learn Anywhere", body: "Study on web or mobile with offline access, daily challenges, flashcard review, and progress synced across devices." },
];

const WHY = [
  { title: "Built by Practising Pathologists", body: "Every course, MCQ, and note is authored and reviewed by consultant pathologists. Every query goes to a practising pathologist — doubts answered the same day." },
  { title: "WHO-Aligned, Continuously Updated", body: "Always updated. Questions revised to the latest classifications and guidelines — WHO 5th Edition with ongoing 6th Edition changes, plus Ackerman, Sternberg, and standard texts." },
  { title: "Image-Rich, Exam-Authentic MCQs", body: "High-yield questions with virtual slides. Explanations highlight the diagnostic region so you learn where to look — not just what to tick — and mock tests that mirror FRCPath, NEET-SS, and INI-SS patterns." },
  { title: "Complete Exam Prep Ecosystem", body: "Read. Practise. Mock. Know where you stand. Online courses, hard-copy notes, mock papers, flashcards, and bundles — structured pathways from residency through superspeciality exams." },
];

const PLAN = [
  { step: "Step 1 · Read", title: "Concise notes", body: "Notes that highlight the salient points — built for people with no time to re-read the whole textbook." },
  { step: "Step 2 · Practise", title: "Questions after every section", body: "Image-rich MCQs and virtual slide questions consolidate each topic before you move on." },
  { step: "Step 3 · Mock", title: "Master tests", body: "Full-length, exam-pattern mocks — fifty questions, and they are not easy. On purpose." },
  { step: "Step 4 · Ask", title: "Doubts answered same day", body: "Every query goes directly to a practising pathologist." },
];

const RESOURCES = [
  { title: "Online Courses", body: "FRCPath Part 1 & 2 with RCPath dataset discussion, NEET-SS · DM Oncopathology, DM Hematopathology, MD/DNB from grossing to sign-out, and INI-SS & APCP-aligned prep.", href: "/courses", cta: "Browse courses" },
  { title: "Hard-Copy Notes", body: "Chapterwise printed notes that highlight the salient points — case clouds, review questions, and exam-oriented worksheets. Built for people with no time to re-read the whole textbook.", href: "/shop/hard-copy-books", cta: "View books" },
  { title: "Mock Tests & Q-Banks", body: "Full-length FRCPath, NEET-SS, and INI-SS histopathology/hematopathology mocks with performance breakdowns — exam-pattern papers so you know exactly where you stand.", href: "/mock-tests", cta: "Explore mocks" },
  { title: "Pathology Blog", body: "Mystery slide of the week, conceptual MCQs, WHO updates, and exam tips. Subscribe to the weekly digest from the blog — no spam, unsubscribe any time.", href: "/blog", cta: "Read articles" },
];

const card = "flex h-full flex-col gap-2 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft";

export default async function Home() {
  const [allCourses, testimonials] = await Promise.all([getFeaturedCourses(), getTestimonials()]);
  const courses = allCourses.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Five board pathways strip */}
      <Section>
        <Container>
          <Reveal>
            <p className="text-center text-sm font-semibold uppercase tracking-wide text-smoke-400">
              Trusted for exam preparation across five board pathways
            </p>
          </Reveal>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {BOARDS.map((b) => (
              <Badge key={b} variant="default" className="text-sm">{b}</Badge>
            ))}
          </div>
        </Container>
      </Section>

      {/* Zoomable slide section (kept) */}
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

      {/* The Plan */}
      <Section>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-royal-500">The plan</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                Read. Practise. Mock. Know where you stand.
              </h2>
              <p className="mt-3 text-slate-700">
                Every course follows the same loop, mapped week-by-week to your exam date.
              </p>
            </div>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLAN.map((s) => (
              <Reveal key={s.step}>
                <div className={card}>
                  <span className="text-xs font-semibold uppercase tracking-wide text-royal-500">{s.step}</span>
                  <h3 className="font-display text-lg font-semibold text-plum-900">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-700">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Exam tracks */}
      <Section ambient>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-royal-500">Exam tracks</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                One platform. Five board pathways.
              </h2>
            </div>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TRACKS.map((t) => (
              <Reveal key={t.label}>
                <div className={card}>
                  <h3 className="font-display text-lg font-semibold text-plum-900">{t.label}</h3>
                  <p className="text-sm leading-relaxed text-slate-700">{t.body}</p>
                  <Link href={`/courses?exam=${t.exam}`} className="mt-auto pt-2 text-sm font-semibold text-rose-700">
                    View track
                  </Link>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Flagship course + pricing */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-royal-500">Flagship course</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                  NEET-SS · DM Oncopathology
                </h2>
                <p className="mt-4 text-slate-700">
                  The subspecialty-weighted pathway to a DM seat — tumour pathology the way NEET-SS
                  actually tests it, with IHC and molecular built into every topic, not bolted on.
                </p>
                <ul className="mt-6 flex flex-col gap-2">
                  {FLAGSHIP_FEATURES.map((f) => (
                    <li key={f} className="text-sm text-slate-700">• {f}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-card border border-iris-300/30 bg-white p-8 shadow-soft">
                <p className="text-sm font-semibold uppercase tracking-wide text-royal-500">Choose your access</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-plum-900">₹6k–10k</span>
                  <span className="text-slate-700">/ 3 · 6 · 12 months</span>
                </div>
                <ul className="mt-6 flex flex-col gap-2 text-sm text-slate-700">
                  {FLAGSHIP_FEATURES.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
                <Button asChild size="lg" className="mt-8 w-full">
                  <Link href="/shop/neet-ss-dm-oncopathology-course">Enrol now</Link>
                </Button>
                <Link href="/pricing" className="mt-3 block text-center text-sm font-semibold text-rose-700">
                  See all pricing
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Everything you need */}
      <Section ambient>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                Everything you need to master pathology
              </h2>
              <p className="mt-3 text-slate-700">
                Read. Practise. Mock. Know where you stand. Every course follows the same loop
                &mdash; concise notes, questions after every section, full-length mocks, and
                doubts answered the same day &mdash; mapped to the latest WHO classifications.
              </p>
            </div>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EVERYTHING.map((f) => (
              <Reveal key={f.title}>
                <div className={card}>
                  <h3 className="font-display text-lg font-semibold text-plum-900">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-700">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Why + faculty */}
      <Section>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-royal-500">Why Pathology MCQ</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                Pathology education you can trust
              </h2>
              <p className="mt-3 text-slate-700">
                We are a team of practising pathologists who built the platform we wished we had
                during residency &mdash; not another question dump, a plan: rigorous, exam-authentic,
                and clinically grounded.
              </p>
            </div>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {WHY.map((f) => (
              <Reveal key={f.title}>
                <div className={card}>
                  <h3 className="font-display text-lg font-semibold text-plum-900">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-700">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>

          <div className="mt-14 text-center">
            <h3 className="font-display text-2xl font-bold text-plum-900">Meet our faculty</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-700">
              The pathologists who design and review Pathology MCQ content.
            </p>
          </div>
          <FacultyStrip />
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/about">More about Pathology MCQ</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Featured courses */}
      <Section ambient>
        <Container>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">Featured courses</h2>
                <p className="mt-3 max-w-xl text-slate-700">
                  Structured online courses with notes, videos, and mock tests &mdash; including
                  NEET-SS &middot; DM Oncopathology, FRCPath Part 1 &amp; 2, hematopathology, MD/DNB,
                  and INI-SS &amp; APCP pathways. Enrol anytime.
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

      {/* Learning resources */}
      <Section>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                Learning resources for every stage
              </h2>
              <p className="mt-3 text-slate-700">
                Whether you are revising for an upcoming exam or deepening subspecialty knowledge,
                choose the format that fits your study style &mdash; the same Read &middot; Practise
                &middot; Mock loop on every track.
              </p>
            </div>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RESOURCES.map((r) => (
              <Reveal key={r.title}>
                <div className={card}>
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

      {/* From the blog */}
      <Section>
        <Container>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">From the Blog</h2>
                <p className="mt-3 max-w-xl text-slate-700">
                  Case discussions, diagnostic tips, and a weekly digest &mdash; one slide, one
                  concept, one mock. Unsubscribe any time from the blog.
                </p>
              </div>
              <Link href="/blog" className="text-sm font-semibold text-rose-700">All articles →</Link>
            </div>
          </Reveal>
          <BlogTeaser />
        </Container>
      </Section>

      {/* What pathologists say */}
      <Section ambient id="testimonials">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-royal-500">Verified reviews</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                What pathologists say
              </h2>
            </div>
          </Reveal>
          <RevealGroup className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Reveal key={t.id}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Secure payments */}
      <Section>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">Secure Payments</h2>
              <p className="mt-3 text-slate-700">
                Checkout with confidence &mdash; protected, flexible, and confirmed in moments.
              </p>
            </div>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[
              { title: "Secure Payments", items: ["Payments are processed securely through Razorpay.", "Industry-standard encryption protects your transaction.", "We never store your card details."] },
              { title: "Multiple Payment Options", items: ["Credit & Debit Cards", "UPI", "Net Banking", "Popular Wallets", "Other payment methods supported by Razorpay"] },
              { title: "Instant Confirmation", items: ["Secure checkout", "Instant payment confirmation", "Access begins immediately after successful payment (where applicable)", "Payment receipts are available"] },
            ].map((c) => (
              <Reveal key={c.title}>
                <div className={card}>
                  <h3 className="font-display text-lg font-semibold text-plum-900">{c.title}</h3>
                  <ul className="mt-2 flex flex-col gap-2">
                    {c.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-700" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Study anywhere (mobile app) */}
      <Section>
        <Container>
          <Reveal>
            <div className="grid grid-cols-1 gap-8 overflow-hidden rounded-hero bg-gradient-to-br from-royal-500 via-hema-700 to-plum-900 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
              <div className="text-white">
                <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Mobile App
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Study Anywhere, Anytime</h2>
                <p className="mt-4 max-w-lg text-iris-300">
                  Take your pathology revision on the go. The Pathology MCQ app brings your full
                  dashboard, MCQ bank, slide viewer, and daily challenges to your pocket &mdash;
                  with offline support.
                </p>
                <ul className="mt-6 flex flex-col gap-2 text-sm">
                  {["Full MCQ bank with offline access", "Daily challenge notifications", "Flashcard review sessions", "Progress sync across all devices", "Dark mode for night studying"].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-3 rounded-panel border border-white/20 bg-white/10 px-5 py-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white" aria-hidden="true">
                      <path d="M16.365 1.43c0 1.14-.417 2.2-1.11 2.98-.75.85-1.98 1.5-3.02 1.42-.13-1.08.4-2.23 1.04-2.94.74-.82 2.03-1.44 3.09-1.46zM20.5 17.02c-.53 1.22-.78 1.76-1.46 2.84-.95 1.5-2.29 3.37-3.95 3.38-1.47.02-1.85-.96-3.85-.95-2 .01-2.41.97-3.88.94-1.66-.03-2.93-1.72-3.88-3.22C.86 16.9.62 12.42 2.28 10.02c1.02-1.5 2.62-2.38 4.12-2.38 1.53 0 2.5 1 3.77 1 1.23 0 1.98-1 3.75-1 1.34 0 2.76.73 3.77 1.99-3.31 1.81-2.77 6.54.81 7.39z"/>
                    </svg>
                    <span className="flex flex-col leading-tight text-white">
                      <span className="text-[11px] text-iris-300">Download on the</span>
                      <span className="text-base font-semibold">App Store</span>
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-3 rounded-panel border border-white/20 bg-white/10 px-5 py-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white" aria-hidden="true">
                      <path d="M3.6 2.1c-.3.2-.5.6-.5 1.1v17.6c0 .5.2.9.5 1.1l.1.1L13 12.6v-.2L3.7 2z"/>
                      <path d="M16.5 15.9 13 12.6v-.2l3.5-3.3 4.1 2.3c1.2.7 1.2 1.8 0 2.5z"/>
                      <path d="m16.5 15.9-3.5-3.4L3.6 21.9c.4.4 1 .5 1.7.1z"/>
                      <path d="M16.5 8.7 5.3 2.1c-.7-.4-1.3-.3-1.7.1L13 12.4z"/>
                    </svg>
                    <span className="flex flex-col leading-tight text-white">
                      <span className="text-[11px] text-iris-300">Get it on</span>
                      <span className="text-base font-semibold">Google Play</span>
                    </span>
                  </span>
                </div>
                <p className="mt-4 text-xs text-iris-300">Free with any plan · iOS 15+ · Android 10+</p>
              </div>
              <div className="flex justify-center">
                <div className="flex w-full max-w-[300px] flex-col rounded-[2.75rem] border-[10px] border-plum-900/50 bg-plum-900/40 p-3 shadow-lifted min-h-[580px]">
                  <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/30" />
                  <div className="flex flex-1 flex-col rounded-[1.75rem] bg-white/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">P</span>
                      Pathology MCQ
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-panel bg-white/10 p-3 text-white">
                        <p className="text-2xl font-bold">87%</p>
                        <p className="text-xs text-iris-300">Accuracy</p>
                      </div>
                      <div className="rounded-panel bg-white/10 p-3 text-white">
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-iris-300">Streak</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-col gap-3">
                      <div className="rounded-panel bg-white/10 p-3 text-white">
                        <div className="flex items-center justify-between text-xs"><span>Haematopathology</span><span>68%</span></div>
                        <div className="mt-2 h-1.5 rounded-full bg-white/20"><div className="h-1.5 w-[68%] rounded-full bg-white" /></div>
                      </div>
                      <div className="rounded-panel bg-white/10 p-3 text-white">
                        <div className="flex items-center justify-between text-xs"><span>Cytopathology</span><span>42%</span></div>
                        <div className="mt-2 h-1.5 rounded-full bg-white/20"><div className="h-1.5 w-[42%] rounded-full bg-white" /></div>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-iris-300">
                      <span>Home</span><span>MCQ</span><span>Slides</span><span>Profile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Start learning for free */}
      <Section>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-royal-500">Free, every week</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-plum-900 sm:text-4xl">
                Start learning for free.
              </h2>
            </div>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Reveal>
              <div className={card}>
                <p className="text-xs font-semibold uppercase tracking-wide text-royal-500">Live · WhatsApp group</p>
                <h3 className="font-display text-lg font-semibold text-plum-900">Free monthly resident lectures</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  One lecture a month for pathology residents &mdash; slides, cases and a chance to ask questions.
                </p>
                <Button asChild className="mt-4 w-fit">
                  <Link href="/contact">Join the WhatsApp group</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal>
              <div className={card}>
                <p className="text-xs font-semibold uppercase tracking-wide text-royal-500">Newsletter · every week</p>
                <h3 className="font-display text-lg font-semibold text-plum-900">One slide, one concept, one mock — every week.</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Mystery slide of the week, conceptual MCQs and AI mock tests. No spam, unsubscribe any time.
                </p>
                <Button asChild variant="outline" className="mt-4 w-fit">
                  <Link href="/blog">Get the newsletter</Link>
                </Button>
              </div>
            </Reveal>
          </RevealGroup>
        </Container>
      </Section>

      <Section>
        <CtaBand />
      </Section>
    </>
  );
}
