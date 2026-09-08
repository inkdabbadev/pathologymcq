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

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Pathology MCQ",
  logoUrl: "",
  practiceLogoUrl: "",
  whatsappNumber: "917825890222",
  nav: [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/shop", label: "Shop" },
    { href: "/practice", label: "Practice Questions" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
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
        { href: "/shop", label: "Shop" },
      ],
    },
    {
      title: "Services",
      links: [
        { href: "/services/frcpath-exam-preparation", label: "FRCPath Exam Preparation" },
        { href: "/services/neet-ss-and-ini-ss-pathology-prep", label: "NEET-SS & INI-SS Prep" },
        { href: "/services/pathology-mcq-practice-banks", label: "MCQ Practice Banks" },
        { href: "/services/hard-copy-pathology-notes", label: "Hard-Copy Notes" },
        { href: "/services/full-length-pathology-mock-tests", label: "Mock Tests" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About" },
        { href: "/pricing", label: "Pricing" },
        { href: "/faq", label: "FAQ" },
        { href: "/contact", label: "Contact" },
        { href: "whatsapp", label: "WhatsApp" },
      ],
    },
    {
      title: "Legal & Support",
      links: [
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms-and-conditions", label: "Terms & Conditions" },
        { href: "/cancellation-refund-policy", label: "Cancellation / Refund" },
        { href: "/shipping-policy", label: "Shipping Policy" },
        { href: "/disclaimer", label: "Disclaimer" },
        { href: "/support", label: "Support" },
        { href: "/delete-account", label: "Delete account" },
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
