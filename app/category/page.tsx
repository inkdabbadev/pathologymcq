import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  Bone,
  Bug,
  CircleDot,
  ClipboardList,
  Dna,
  Droplet,
  FlaskConical,
  Filter,
  Layers,
  Microscope,
  Salad,
  Stethoscope,
  User,
  Wind,
  Brain,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { BLOG_CATEGORIES } from "@/lib/mock/blog-categories";

export const metadata: Metadata = {
  title: "Blogs",
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  neuropathology: Brain,
  "head-and-neck-pathology": User,
  "thoracic-pathology": Wind,
  "soft-tissue-and-bone-pathology": Bone,
  "gastrointestinal-pathology": Salad,
  "urogenital-pathology": Filter,
  dermatopathology: Layers,
  "endocrine-and-breast-pathology": Activity,
  "female-genital-pathology": CircleDot,
  cytopathology: Microscope,
  hematopathology: Droplet,
  histotechniques: FlaskConical,
  "molecular-pathology": Dna,
  "general-pathology": Stethoscope,
  "clinical-pathology": ClipboardList,
  microbiology: Bug,
};

export default function CategoryPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">Blogs</h1>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {BLOG_CATEGORIES.map(({ slug, label }) => {
            const Icon = CATEGORY_ICONS[slug] ?? Stethoscope;
            return (
              <Link
                key={slug}
                href={`/category/${slug}`}
                className="group flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-card border border-iris-300/30 bg-white p-3 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-royal-500/50 hover:shadow-glow"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-hema-700 to-plum-900 text-white transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold leading-snug text-plum-900">{label}</span>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
