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
  title: string;
  tagline: string;
  subspecialty: string;
  examTargets: string[];
  imageUrl: string;
  priceCents: number;
  currency: string;
  rating: number;
  reviewCount: number;
  faculty: FacultyMember;
  lessonCount: number;
  whoFor: string[];
  whatYouGet: string[];
  curriculum: CurriculumModule[];
  faqs: FaqItem[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  priceCents: number;
  currency: string;
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
