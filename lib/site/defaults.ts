import { EXAM_PATHWAYS } from "@/lib/mock/exam-pathways";

export interface NavLink {
  href: string;
  label: string;
}
export interface FooterColumn {
  title: string;
  links: NavLink[];
}
export interface ShopCard {
  href: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
}
export interface ExamPathwayChild {
  category: string;
  label: string;
  description: string;
}
export interface ExamPathwaySetting {
  category: string;
  label: string;
  description: string;
  children?: ExamPathwayChild[];
}

export interface SiteSettings {
  siteName: string;
  logoUrl?: string;
  practiceLogoUrl?: string;
  whatsappNumber: string;
  nav: NavLink[];
  footerCta: { heading: string; subtext: string; buttonLabel: string; buttonHref: string };
  footerColumns: FooterColumn[];
  copyright: string;
  shopHeading: string;
  shopSubtitle: string;
  shopCards: ShopCard[];
  aboutHeading: string;
  aboutIntro: string;
  aboutTeamHeading: string;
  practiceSubtitle: string;
  faqSubtitle: string;
  coursesSubtitle: string;
  examPathways: ExamPathwaySetting[];
}

export const WHATSAPP_COUNTRY_CODE = "91";

export function normalizeWhatsAppNumber(number: string | null | undefined): string {
  const digits = (number ?? "").replace(/[^0-9]/g, "");
  if (!digits) return `${WHATSAPP_COUNTRY_CODE}0000000000`;
  return digits.startsWith(WHATSAPP_COUNTRY_CODE)
    ? digits
    : `${WHATSAPP_COUNTRY_CODE}${digits.replace(/^0+/, "")}`;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Pathology MCQ",
  logoUrl: "",
  practiceLogoUrl: "",
  whatsappNumber: "910000000000",
  nav: [
    { href: "/shop", label: "Shop" },
    { href: "/courses", label: "Courses" },
    { href: "/practice", label: "Practice Questions" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About / Faculty" },
    { href: "/faq", label: "FAQ" },
  ],
  footerCta: {
    heading: "Ready to master pathology?",
    subtext:
      "Join thousands of trainees preparing for FRCPath, NEET-SS, INI-SS and MD/DNB with image-rich MCQs and mock tests built by faculty.",
    buttonLabel: "Start practicing free",
    buttonHref: "/register",
  },
  footerColumns: [
    {
      title: "Learn",
      links: [
        { href: "/courses", label: "Courses" },
        { href: "/practice", label: "Question Bank" },
        { href: "/mock-tests", label: "Mock Tests" },
      ],
    },
    {
      title: "Account",
      links: [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/my-courses", label: "My Courses" },
        { href: "/account", label: "Account Settings" },
        { href: "/login", label: "Log in" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About / Faculty" },
        { href: "/#testimonials", label: "Testimonials" },
        { href: "/faq", label: "FAQ" },
        { href: "whatsapp", label: "Contact / WhatsApp" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "/refund-policy", label: "Refund Policy" },
      ],
    },
  ],
  copyright: "Pathology MCQ",
  shopHeading: "Shop",
  shopSubtitle:
    "Everything Pathology MCQ offers, in one place — mock tests, courses, printed notes and bundles.",
  shopCards: [
    {
      href: "/mock-tests",
      icon: "ClipboardCheck",
      title: "Mock",
      description: "Full-length and mini-mock tests across every subspecialty and exam pattern.",
    },
    {
      href: "/courses",
      icon: "BookOpenCheck",
      title: "Courses",
      description: "Structured, subspecialty-first curricula mapped to your target exam.",
    },
    {
      href: "/shop/hard-copy-books",
      icon: "Layers",
      title: "Hard Copy Books",
      description: "Printed revision notes shipped to your door for offline study.",
    },
    {
      href: "/shop/bundles",
      icon: "Package",
      title: "Bundles",
      description: "Course and hard copy notes bundled together at a discounted price.",
    },
  ],
  aboutHeading: "About Pathology MCQ",
  aboutIntro:
    "Pathology MCQ is a pathology education platform built by practising pathologists for medical students, residents, and consultants preparing for postgraduate and superspeciality exams — including MD/DNB, FRCPath, NEET-SS, INI-SS, DM fellowships, and allied certification pathways.\n\nWe create the study ecosystem we wished we had in training: image-rich MCQs with annotated slides, structured subspecialty courses, hard-copy notes, full-length mock papers, and continuously updated content aligned with WHO classifications and real exam patterns.\n\nEvery course, question bank, and note set is authored and reviewed by faculty who work day-to-day in surgical pathology, hemato-pathology, onco-pathology, molecular pathology, perinatal and clinical pathology, and gynaec cytology — across teaching hospitals, diagnostic labs, and research institutes.",
  aboutTeamHeading: "Our faculty",
  practiceSubtitle:
    "Free, image-rich MCQs organized by subspecialty. Pick a topic to start a 10-question set with instant feedback and explanations.",
  faqSubtitle:
    "Browse by topic, or message us directly if you can't find what you're looking for.",
  coursesSubtitle:
    "Structured, subspecialty-first curricula mapped to your target exam.",
  examPathways: EXAM_PATHWAYS as ExamPathwaySetting[],
};
