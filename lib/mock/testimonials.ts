import type { Stat, Testimonial } from "@/lib/api/types";

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    quote:
      "The image-rich MCQs mirror the actual FRCPath exam far better than any textbook question bank I used. I passed Part 1 on my first attempt.",
    name: "Dr. Sarah Chen",
    role: "FRCPath Part 1, 2025",
    avatarUrl: "",
  },
  {
    id: "test-2",
    quote:
      "The mock tests replicate the NEET-SS pattern exactly, timing included. The performance analytics showed me precisely which subspecialties needed more work.",
    name: "Dr. Rohan Mehta",
    role: "NEET-SS Pathology, 2025",
    avatarUrl: "",
  },
  {
    id: "test-3",
    quote:
      "As a DNB resident with limited slide access, the microscopy library alone was worth the subscription. Explanations are concise and exam-focused.",
    name: "Dr. Fatima Al-Sayed",
    role: "DNB Pathology Resident",
    avatarUrl: "",
  },
];

export const MOCK_STATS: Stat[] = [
  { id: "stat-1", label: "Practice MCQs", value: 12000, suffix: "+" },
  { id: "stat-2", label: "Trainees worldwide", value: 8500, suffix: "+" },
  { id: "stat-3", label: "Exam pass rate", value: 94, suffix: "%" },
  { id: "stat-4", label: "Faculty contributors", value: 60, suffix: "+" },
];
