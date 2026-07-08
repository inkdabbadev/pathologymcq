import type { Metadata } from "next";
import {
  Activity,
  Bone,
  CircleDot,
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
import { PracticeTopicCard } from "@/components/marketing/practice-topic-card";
import { PRACTICE_TOPICS } from "@/lib/mock/practice-topics";

export const metadata: Metadata = {
  title: "Practice Questions",
  description:
    "Free pathology practice questions by subspecialty — instant feedback and explanations on every question, no purchase required.",
};

const TOPIC_ICONS: Record<string, LucideIcon> = {
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
};

export default function PracticePage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">
            Practice Questions
          </h1>
          <p className="mt-4 text-slate-700">
            Free, image-rich MCQs organized by subspecialty. Pick a topic to start a 10-question
            set with instant feedback and explanations.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {PRACTICE_TOPICS.map((topic) => (
            <PracticeTopicCard
              key={topic.slug}
              topic={topic}
              icon={TOPIC_ICONS[topic.slug] ?? Stethoscope}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
