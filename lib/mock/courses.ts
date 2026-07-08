import type { Course } from "@/lib/api/types";
import { MOCK_FACULTY } from "@/lib/mock/faculty";

const THUMBS = [
  "/mock/course-thumb-1.svg",
  "/mock/course-thumb-2.svg",
  "/mock/course-thumb-3.svg",
  "/mock/course-thumb-4.svg",
];

export const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    slug: "frcpath-part-1-histopathology",
    category: "frcpath-part-1",
    title: "FRCPath Part 1: Histopathology Mastery",
    tagline: "Master the Part 1 syllabus with 1,200+ image-based MCQs faculty-mapped to the exam blueprint.",
    subspecialty: "General Histopathology",
    examTargets: ["FRCPath"],
    imageUrl: THUMBS[0],
    priceCents: 24900,
    currency: "GBP",
    rating: 4.9,
    reviewCount: 312,
    faculty: MOCK_FACULTY[1],
    lessonCount: 86,
    whoFor: [
      "Trainees sitting FRCPath Part 1 within the next 12 months",
      "Pathologists who want a structured, syllabus-mapped revision path",
      "Anyone who learns best from image-first, explanation-heavy MCQs",
    ],
    whatYouGet: [
      "1,200+ single-best-answer MCQs with full explanations",
      "Zoomable histology slide library for every question",
      "86 short video walkthroughs from FRCPath examiners",
      "Progress analytics by organ system and topic",
    ],
    curriculum: [
      {
        title: "General & Cellular Pathology",
        lessons: ["Cell injury and adaptation", "Inflammation and repair", "Neoplasia fundamentals"],
      },
      {
        title: "Organ Systems I",
        lessons: ["Cardiovascular pathology", "Respiratory pathology", "Gastrointestinal pathology"],
      },
      {
        title: "Organ Systems II",
        lessons: ["Renal and urinary pathology", "Endocrine pathology", "Skin and soft tissue pathology"],
      },
      {
        title: "Exam Technique",
        lessons: ["Approaching image-based questions", "Timed mock paper walkthrough"],
      },
    ],
    faqs: [
      {
        question: "How long do I have access to the course?",
        answer: "12 months from enrollment, enough to cover two exam sittings if needed.",
      },
      {
        question: "Is this mapped to the current FRCPath Part 1 curriculum?",
        answer: "Yes — every module is cross-referenced against the Royal College of Pathologists' current syllabus.",
      },
      {
        question: "Can I access this on mobile?",
        answer: "Yes, the full question bank and slide library work on mobile, tablet and desktop.",
      },
    ],
  },
  {
    id: "course-2",
    slug: "neet-ss-gi-liver-pathology",
    category: "neet-ss-oncopathology",
    title: "NEET-SS GI & Liver Pathology Bank",
    tagline: "Exam-pattern GI and hepatobiliary MCQs built by faculty who've sat on NEET-SS panels.",
    subspecialty: "Gastrointestinal Pathology",
    examTargets: ["NEET-SS", "INI-SS"],
    imageUrl: THUMBS[1],
    priceCents: 149900,
    currency: "INR",
    rating: 4.8,
    reviewCount: 198,
    faculty: MOCK_FACULTY[0],
    lessonCount: 64,
    whoFor: [
      "DM/DrNB trainees preparing for NEET-SS or INI-SS pathology",
      "Consultants revising GI and liver pathology for board recertification",
      "Anyone wanting exam-timed practice, not just a textbook question bank",
    ],
    whatYouGet: [
      "900+ NEET-SS pattern MCQs across GI and hepatobiliary pathology",
      "Full-length timed mock sections with percentile benchmarking",
      "Case-based reporting practice with model answers",
      "Weekly live doubt-clearing sessions (recorded)",
    ],
    curriculum: [
      {
        title: "Upper GI Pathology",
        lessons: ["Oesophageal pathology", "Gastric pathology", "Barrett's and dysplasia"],
      },
      {
        title: "Lower GI & IBD",
        lessons: ["Inflammatory bowel disease", "Colorectal neoplasia", "Polyposis syndromes"],
      },
      {
        title: "Hepatobiliary Pathology",
        lessons: ["Chronic liver disease", "Liver tumours", "Biliary tract pathology"],
      },
    ],
    faqs: [
      {
        question: "Does this cover the INI-SS pattern as well as NEET-SS?",
        answer: "Yes — question style and difficulty are calibrated to both exam patterns.",
      },
      {
        question: "Are the mock sections timed like the real exam?",
        answer: "Yes, each mock section runs on the official time-per-question ratio with auto-submit.",
      },
    ],
  },
  {
    id: "course-3",
    slug: "haematopathology-high-yield",
    category: "hematopathology",
    title: "Haematopathology High-Yield Series",
    tagline: "The fastest way to cover lymphoma, leukaemia and bone marrow pathology before your exam.",
    subspecialty: "Haematopathology",
    examTargets: ["FRCPath", "MD/DNB"],
    imageUrl: THUMBS[2],
    priceCents: 19900,
    currency: "GBP",
    rating: 4.9,
    reviewCount: 271,
    faculty: MOCK_FACULTY[3],
    lessonCount: 58,
    whoFor: [
      "Trainees who find haematopathology the most time-pressured part of revision",
      "FRCPath and MD/DNB candidates wanting WHO-classification-current content",
      "Anyone who wants morphology drilled through slide-based repetition",
    ],
    whatYouGet: [
      "58 focused lessons covering the WHO classification (5th edition)",
      "Bone marrow and lymph node slide library with expert annotations",
      "Flowchart-style differential diagnosis guides",
      "Spaced-repetition question sets for long-term retention",
    ],
    curriculum: [
      {
        title: "Bone Marrow Pathology",
        lessons: ["Myelodysplastic syndromes", "Acute leukaemias", "Myeloproliferative neoplasms"],
      },
      {
        title: "Lymph Node Pathology",
        lessons: ["Reactive vs. neoplastic patterns", "B-cell lymphomas", "T-cell and Hodgkin lymphomas"],
      },
      {
        title: "Ancillary Techniques",
        lessons: ["Flow cytometry interpretation", "Immunohistochemistry panels"],
      },
    ],
    faqs: [
      {
        question: "Is the WHO 5th edition classification used throughout?",
        answer: "Yes, all content is mapped to the current WHO classification and updated as revisions are published.",
      },
      {
        question: "Do I need a haematology background to start?",
        answer: "No — the series starts from core morphology before building up to exam-level differentials.",
      },
    ],
  },
  {
    id: "course-4",
    slug: "md-dnb-cytopathology-crash-course",
    category: "frcpath-part-2-comprehensive-course",
    title: "MD/DNB Cytopathology Crash Course",
    tagline: "A focused crash course for the cytopathology component of MD/DNB and FRCPath Part 2.",
    subspecialty: "Cytopathology",
    examTargets: ["MD/DNB"],
    imageUrl: THUMBS[3],
    priceCents: 99900,
    currency: "INR",
    rating: 4.7,
    reviewCount: 142,
    faculty: MOCK_FACULTY[2],
    lessonCount: 45,
    whoFor: [
      "MD/DNB residents in their final year of training",
      "FRCPath Part 2 candidates needing a cytopathology refresher",
      "Trainees who want a compressed, high-yield revision timeline",
    ],
    whatYouGet: [
      "45 lessons covering FNAC and exfoliative cytology",
      "Reporting-style practice cases with model reports",
      "Bethesda and Milan system quick-reference guides",
      "Printable last-minute revision sheets",
    ],
    curriculum: [
      {
        title: "Exfoliative Cytology",
        lessons: ["Cervical cytology and Bethesda system", "Body fluid cytology", "Respiratory cytology"],
      },
      {
        title: "FNAC",
        lessons: ["Thyroid FNAC and the Bethesda/Milan systems", "Breast FNAC", "Lymph node FNAC"],
      },
    ],
    faqs: [
      {
        question: "How is this different from the full cytopathology course?",
        answer: "This is a compressed, exam-week revision format — high-yield content only, no filler.",
      },
    ],
  },
  {
    id: "course-5",
    slug: "apcp-molecular-diagnostics",
    category: "frcpath-part-2-dataset-discussion-macro",
    title: "APCP Molecular Diagnostics Primer",
    tagline: "Build confidence in molecular pathology reporting for the APCP diploma.",
    subspecialty: "Molecular Pathology",
    examTargets: ["APCP"],
    imageUrl: THUMBS[0],
    priceCents: 17900,
    currency: "GBP",
    rating: 4.8,
    reviewCount: 87,
    faculty: MOCK_FACULTY[1],
    lessonCount: 38,
    whoFor: [
      "APCP diploma candidates covering the molecular pathology module",
      "Biomedical scientists moving into molecular diagnostics reporting",
      "Pathologists wanting a practical, non-theoretical primer",
    ],
    whatYouGet: [
      "38 lessons on PCR, NGS and in-situ hybridisation interpretation",
      "Worked report examples for common molecular assays",
      "Quiz bank aligned to the APCP assessment format",
    ],
    curriculum: [
      {
        title: "Molecular Techniques",
        lessons: ["PCR-based assays", "Next-generation sequencing basics", "FISH and in-situ hybridisation"],
      },
      {
        title: "Applied Reporting",
        lessons: ["Solid tumour molecular reporting", "Haematological molecular reporting"],
      },
    ],
    faqs: [
      {
        question: "Do I need a molecular biology background?",
        answer: "No — the primer builds up technique fundamentals before moving to applied reporting.",
      },
    ],
  },
  {
    id: "course-6",
    slug: "renal-pathology-mock-test-series",
    category: "mock-tests",
    title: "Renal Pathology Mock Test Series",
    tagline: "Full-length, exam-timed mock tests covering renal pathology with detailed score analytics.",
    subspecialty: "Renal Pathology",
    examTargets: ["FRCPath", "NEET-SS"],
    imageUrl: THUMBS[1],
    priceCents: 21900,
    currency: "GBP",
    rating: 4.9,
    reviewCount: 165,
    faculty: MOCK_FACULTY[0],
    lessonCount: 52,
    whoFor: [
      "Trainees in the final weeks before their exam who need timed practice",
      "Anyone wanting to benchmark their renal pathology performance against peers",
      "FRCPath and NEET-SS candidates alike — question style covers both patterns",
    ],
    whatYouGet: [
      "6 full-length mock tests, exam-timed with auto-submit",
      "Slide-based questions drawn from a 500+ image renal pathology bank",
      "Percentile benchmarking against other candidates",
      "Topic-by-topic breakdown of strengths and weak areas",
    ],
    curriculum: [
      {
        title: "Glomerular Disease",
        lessons: ["Glomerulonephritis patterns", "Diabetic and hypertensive nephropathy"],
      },
      {
        title: "Tubulointerstitial & Neoplastic",
        lessons: ["Tubulointerstitial disease", "Renal tumours", "Transplant pathology"],
      },
      {
        title: "Mock Test Blocks",
        lessons: ["Mock test 1–3 (untimed review)", "Mock test 4–6 (fully timed)"],
      },
    ],
    faqs: [
      {
        question: "How are the mock tests scored?",
        answer: "Scoring happens server-side against the exam answer key, with results available immediately after submission.",
      },
      {
        question: "Can I retake a mock test?",
        answer: "Yes, each mock test can be retaken with a freshly shuffled question order.",
      },
    ],
  },
];
