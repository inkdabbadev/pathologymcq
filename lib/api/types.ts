export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  affiliation: string;
  avatarUrl: string;
}

export interface CurriculumModule {
  title: string;
  lessons: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Course {
  id: string;
  slug: string;
  /** Slug used to filter/highlight the course from the nav's Courses dropdown, e.g. "frcpath-part-1". */
  category: string;
  tags?: string[];
  title: string;
  tagline: string;
  subspecialty: string;
  examTargets: string[];
  imageUrl: string;
  priceCents: number;
  currency: string;
  faculty: FacultyMember;
  lessonCount: number;
  whoFor: string[];
  whatYouGet: string[];
  curriculum: CurriculumModule[];
  faqs: FaqItem[];
  /** Optional editable sample questions shown in the "See a sample question" block. */
  sampleQuestions?: SampleQuestion[];
  /** Optional editable testimonials for the "What students say" block. */
  testimonials?: Testimonial[];
}

export interface SampleQuestion {
  question: string;
  /** Answer choices. */
  options: string[];
  /** Index of the correct option. */
  correctIndex: number;
  explanation: string;
  /** Optional image; falls back to the course cover. */
  imageUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  priceCents: number;
  currency: string;
  /** What's included — used by bundles; omitted for standalone products like hard copy books. */
  includes?: string[];
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
  category: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
}

export interface PracticeTopic {
  slug: string;
  label: string;
  iconUrl?: string;
}

export interface PracticeQuestion {
  question: string;
  /** Exactly 4 answer choices. */
  options: string[];
  correctIndex: number;
  explanation: string;
}
