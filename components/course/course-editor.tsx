"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, Plus, Save, Trash2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import type { Course, CurriculumModule, FaqItem, SampleQuestion, Testimonial } from "@/lib/api/types";
import { MOCK_TEST_TYPES } from "@/lib/mock/mock-test-types";
import { uploadImage } from "@/lib/blog/api";
import { useDeleteCourse, useUpdateCourse, useSiteSettings } from "@/lib/catalog/hooks";


const linesToArr = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const field =
  "mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500";
const label = "text-sm font-medium text-plum-900";

export function CourseEditor({ course }: { course: Course }) {
  const router = useRouter();
  const update = useUpdateCourse();
  const del = useDeleteCourse();
  const settings = useSiteSettings();
  const CATEGORY_OPTIONS = [
    ...settings.examPathways.flatMap((p) => [
      { category: p.category, label: p.label },
      ...(p.children ?? []).map((c) => ({ category: c.category, label: `${p.label} — ${c.label}` })),
    ]),
    ...MOCK_TEST_TYPES.map((m) => ({ category: m.category, label: m.label })),
  ];

  const [title, setTitle] = React.useState(course.title);
  const [tagline, setTagline] = React.useState(course.tagline);
  const [tags, setTags] = React.useState((course.tags ?? []).join(", "));
  const [subspecialty, setSubspecialty] = React.useState(course.subspecialty);
  const [examTargets, setExamTargets] = React.useState(course.examTargets.join(", "));
  const [category, setCategory] = React.useState(course.category);
  const [priceRupees, setPriceRupees] = React.useState(String(Math.round(course.priceCents / 100)));
  const [image, setImage] = React.useState(course.imageUrl);
  const [whoFor, setWhoFor] = React.useState(course.whoFor.join("\n"));
  const [whatYouGet, setWhatYouGet] = React.useState(course.whatYouGet.join("\n"));
  const [uploading, setUploading] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  // Faculty
  const [facName, setFacName] = React.useState(course.faculty?.name ?? "");
  const [facTitle, setFacTitle] = React.useState(course.faculty?.title ?? "");
  const [facAffil, setFacAffil] = React.useState(course.faculty?.affiliation ?? "");
  const [facAvatarUrl, setFacAvatarUrl] = React.useState(course.faculty?.avatarUrl ?? "");

  // Curriculum: modules, each with a title + lessons (edited as lines).
  const [modules, setModules] = React.useState(
    course.curriculum.map((m) => ({ title: m.title, lessons: m.lessons.join("\n") }))
  );
  // FAQs
  const [faqs, setFaqs] = React.useState<FaqItem[]>(course.faqs.map((f) => ({ ...f })));

  // Testimonials
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>(
    (course.testimonials ?? []).map((t) => ({ ...t }))
  );

  // Sample questions (options edited as lines)
  const [samples, setSamples] = React.useState(
    (course.sampleQuestions ?? []).map((s) => ({
      question: s.question,
      optionsText: s.options.join("\n"),
      correctIndex: s.correctIndex,
      explanation: s.explanation,
    }))
  );

  async function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      setImage(await uploadImage(f));
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    const curriculum: CurriculumModule[] = modules
      .map((m) => ({ title: m.title.trim(), lessons: linesToArr(m.lessons) }))
      .filter((m) => m.title || m.lessons.length);
    const lessonCount = curriculum.reduce((n, m) => n + m.lessons.length, 0);
    const cleanFaqs = faqs.filter((f) => f.question.trim() || f.answer.trim());

    const sampleQuestions: SampleQuestion[] = samples
      .map((s) => {
        const options = linesToArr(s.optionsText);
        return {
          question: s.question.trim(),
          options,
          correctIndex: Math.min(Math.max(0, s.correctIndex), Math.max(0, options.length - 1)),
          explanation: s.explanation.trim(),
        };
      })
      .filter((s) => s.question || s.options.length);

    const cleanTestimonials: Testimonial[] = testimonials
      .filter((t) => t.quote.trim() || t.name.trim())
      .map((t, i) => ({
        id: t.id || `t-${course.id}-${i}`,
        quote: t.quote.trim(),
        name: t.name.trim(),
        role: t.role.trim(),
        avatarUrl: t.avatarUrl ?? "",
      }));

    await update.mutateAsync({
      id: course.id,
      patch: {
        title,
        tagline,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        subspecialty,
        examTargets: examTargets.split(",").map((t) => t.trim()).filter(Boolean),
        category,
        priceCents: Math.max(0, Math.round(Number(priceRupees) || 0) * 100),
        imageUrl: image,
        whoFor: linesToArr(whoFor),
        whatYouGet: linesToArr(whatYouGet),
        faculty: {
          ...course.faculty,
          name: facName,
          title: facTitle,
          affiliation: facAffil,
          avatarUrl: facAvatarUrl,
        },
        curriculum,
        lessonCount,
        faqs: cleanFaqs,
        sampleQuestions,
        testimonials: cleanTestimonials,
      },
    });
    setSavedAt(new Date().toLocaleTimeString());
  }

  async function remove() {
    if (!window.confirm("Delete this course permanently?")) return;
    await del.mutateAsync(course.id);
    router.push("/courses");
  }

  return (
    <Section>
      <Container className="max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-royal-500 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Courses
          </Link>
          <div className="flex items-center gap-2">
            {savedAt && <span className="text-xs text-smoke-400">Saved {savedAt}</span>}
            <Button size="sm" variant="ghost" onClick={remove}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button size="sm" disabled={update.isPending} onClick={save}>
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-royal-500">
          Editing course
        </p>

        {/* Cover */}
        <div className="mt-3 overflow-hidden rounded-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-52 w-full object-cover" />
        </div>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-iris-300/60 bg-white px-3 py-1.5 text-sm text-plum-900 hover:border-royal-500">
          <ImageIcon className="h-4 w-4" />
          {uploading ? "Uploading…" : "Change cover image"}
          <input type="file" accept="image/*" className="hidden" onChange={onImage} />
        </label>

        {/* Basics */}
        <div className="mt-6 grid gap-4">
          <div>
            <label className={label}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Tagline</label>
            <textarea value={tagline} onChange={(e) => setTagline(e.target.value)} rows={2} className={field} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Subspecialty (badge)</label>
              <input value={subspecialty} onChange={(e) => setSubspecialty(e.target.value)} className={field} />
            </div>
            <div>
              <label className={label}>Tags (comma separated)</label>
              <input value={tags} onChange={(e) => setTags(e.target.value)} className={field} />
            </div>
          </div>
          <div>
            <label className={label}>Exam targets (comma separated)</label>
            <input value={examTargets} onChange={(e) => setExamTargets(e.target.value)} className={field} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Category / exam pathway</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.category} value={o.category}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Price (₹)</label>
              <input type="number" min={0} value={priceRupees} onChange={(e) => setPriceRupees(e.target.value)} className={field} />
            </div>
          </div>
          <div>
            <label className={label}>Who this is for (one per line)</label>
            <textarea value={whoFor} onChange={(e) => setWhoFor(e.target.value)} rows={4} className={field} />
          </div>
          <div>
            <label className={label}>What you&apos;ll get (one per line)</label>
            <textarea value={whatYouGet} onChange={(e) => setWhatYouGet(e.target.value)} rows={4} className={field} />
          </div>
        </div>

        {/* Faculty */}
        <h2 className="mt-10 font-display text-lg font-bold text-plum-900">Faculty</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label}>Name</label>
            <input value={facName} onChange={(e) => setFacName(e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Title</label>
            <input value={facTitle} onChange={(e) => setFacTitle(e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Affiliation</label>
            <input value={facAffil} onChange={(e) => setFacAffil(e.target.value)} className={field} />
          </div>
          <div className="sm:col-span-3">
            <label className={label}>Profile photo URL</label>
            <input value={facAvatarUrl} onChange={(e) => setFacAvatarUrl(e.target.value)} className={field} placeholder="https://.../photo.jpg" />
          </div>
        </div>

        {/* Curriculum */}
        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-plum-900">Curriculum</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setModules((m) => [...m, { title: "New module", lessons: "" }])}
          >
            <Plus className="h-4 w-4" /> Add module
          </Button>
        </div>
        <div className="mt-3 flex flex-col gap-4">
          {modules.length === 0 && (
            <p className="text-sm text-smoke-400">No modules yet — add one.</p>
          )}
          {modules.map((m, i) => (
            <div key={i} className="rounded-panel border border-iris-300/40 bg-white p-3">
              <div className="flex items-center gap-2">
                <input
                  value={m.title}
                  onChange={(e) =>
                    setModules((arr) => arr.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
                  }
                  placeholder="Module title"
                  className="flex-1 rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-royal-500"
                />
                <button
                  onClick={() => setModules((arr) => arr.filter((_, j) => j !== i))}
                  className="rounded-md p-1.5 text-smoke-400 hover:text-rose-700"
                  title="Remove module"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={m.lessons}
                onChange={(e) =>
                  setModules((arr) => arr.map((x, j) => (j === i ? { ...x, lessons: e.target.value } : x)))
                }
                rows={3}
                placeholder="Lessons (one per line)"
                className="mt-2 w-full rounded-panel border border-iris-300/40 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
              />
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-plum-900">FAQs</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFaqs((f) => [...f, { question: "", answer: "" }])}
          >
            <Plus className="h-4 w-4" /> Add FAQ
          </Button>
        </div>
        <div className="mt-3 flex flex-col gap-4">
          {faqs.length === 0 && <p className="text-sm text-smoke-400">No FAQs yet.</p>}
          {faqs.map((f, i) => (
            <div key={i} className="rounded-panel border border-iris-300/40 bg-white p-3">
              <div className="flex items-center gap-2">
                <input
                  value={f.question}
                  onChange={(e) =>
                    setFaqs((arr) => arr.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))
                  }
                  placeholder="Question"
                  className="flex-1 rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-royal-500"
                />
                <button
                  onClick={() => setFaqs((arr) => arr.filter((_, j) => j !== i))}
                  className="rounded-md p-1.5 text-smoke-400 hover:text-rose-700"
                  title="Remove FAQ"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={f.answer}
                onChange={(e) =>
                  setFaqs((arr) => arr.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)))
                }
                rows={2}
                placeholder="Answer"
                className="mt-2 w-full rounded-panel border border-iris-300/40 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
              />
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-plum-900">What students say</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setTestimonials((t) => [...t, { id: "", quote: "", name: "", role: "", avatarUrl: "" }])
            }
          >
            <Plus className="h-4 w-4" /> Add testimonial
          </Button>
        </div>
        <div className="mt-3 flex flex-col gap-4">
          {testimonials.length === 0 && (
            <p className="text-sm text-smoke-400">
              No testimonials — default ones show until you add your own.
            </p>
          )}
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-panel border border-iris-300/40 bg-white p-3">
              <div className="flex items-start gap-2">
                <textarea
                  value={t.quote}
                  onChange={(e) =>
                    setTestimonials((arr) => arr.map((x, j) => (j === i ? { ...x, quote: e.target.value } : x)))
                  }
                  rows={2}
                  placeholder="Quote"
                  className="flex-1 rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
                />
                <button
                  onClick={() => setTestimonials((arr) => arr.filter((_, j) => j !== i))}
                  className="rounded-md p-1.5 text-smoke-400 hover:text-rose-700"
                  title="Remove testimonial"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <input
                  value={t.name}
                  onChange={(e) =>
                    setTestimonials((arr) => arr.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                  }
                  placeholder="Name"
                  className={field}
                />
                <input
                  value={t.role}
                  onChange={(e) =>
                    setTestimonials((arr) => arr.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))
                  }
                  placeholder="Role (e.g. FRCPath trainee)"
                  className={field}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Sample questions */}
        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-plum-900">Sample questions</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setSamples((s) => [
                ...s,
                { question: "", optionsText: "", correctIndex: 0, explanation: "" },
              ])
            }
          >
            <Plus className="h-4 w-4" /> Add question
          </Button>
        </div>
        <div className="mt-3 flex flex-col gap-4">
          {samples.length === 0 && (
            <p className="text-sm text-smoke-400">
              No sample questions — a generic preview shows until you add one.
            </p>
          )}
          {samples.map((s, i) => {
            const opts = linesToArr(s.optionsText);
            return (
              <div key={i} className="rounded-panel border border-iris-300/40 bg-white p-3">
                <div className="flex items-center gap-2">
                  <input
                    value={s.question}
                    onChange={(e) =>
                      setSamples((arr) =>
                        arr.map((x, j) => (j === i ? { ...x, question: e.target.value } : x))
                      )
                    }
                    placeholder="Question"
                    className="flex-1 rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-royal-500"
                  />
                  <button
                    onClick={() => setSamples((arr) => arr.filter((_, j) => j !== i))}
                    className="rounded-md p-1.5 text-smoke-400 hover:text-rose-700"
                    title="Remove question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <label className={`${label} mt-2 block`}>Options (one per line)</label>
                <textarea
                  value={s.optionsText}
                  onChange={(e) =>
                    setSamples((arr) =>
                      arr.map((x, j) => (j === i ? { ...x, optionsText: e.target.value } : x))
                    )
                  }
                  rows={4}
                  placeholder={"Option A\nOption B\nOption C\nOption D"}
                  className={field}
                />
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <div>
                    <label className={label}>Correct answer</label>
                    <select
                      value={s.correctIndex}
                      onChange={(e) =>
                        setSamples((arr) =>
                          arr.map((x, j) =>
                            j === i ? { ...x, correctIndex: Number(e.target.value) } : x
                          )
                        )
                      }
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
                <label className={`${label} mt-2 block`}>Explanation</label>
                <textarea
                  value={s.explanation}
                  onChange={(e) =>
                    setSamples((arr) =>
                      arr.map((x, j) => (j === i ? { ...x, explanation: e.target.value } : x))
                    )
                  }
                  rows={2}
                  placeholder="Why the correct answer is correct"
                  className={field}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
