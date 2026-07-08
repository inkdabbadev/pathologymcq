export interface ExamPathwayChild {
  category: string;
  label: string;
  description: string;
}

export interface ExamPathway {
  category: string;
  label: string;
  description: string;
  /** Nested sub-items shown as a flyout submenu in the nav (e.g. FRCPath Part 2). */
  children?: ExamPathwayChild[];
}

/** Backs both the nav's Courses dropdown and the homepage's exam pathway cards. */
export const EXAM_PATHWAYS: ExamPathway[] = [
  {
    category: "frcpath-part-1",
    label: "FRCPath Part 1 Course",
    description: "Core histopathology and general pathology MCQs mapped to the Part 1 syllabus.",
  },
  {
    category: "frcpath-part-2",
    label: "FRCPath Part 2 Course",
    description: "Case-based reporting and subspecialty depth for the Part 2 exam.",
    children: [
      {
        category: "frcpath-part-2-comprehensive-course",
        label: "Comprehensive Course",
        description: "Full Part 2 curriculum across every subspecialty, case reporting to macro description.",
      },
      {
        category: "frcpath-part-2-dataset-discussion-macro",
        label: "Dataset Discussion/Macro",
        description: "Focused practice on dataset discussion and macroscopic description technique.",
      },
    ],
  },
  {
    category: "neet-ss-oncopathology",
    label: "NEET-SS Oncopathology",
    description: "GI, liver and onco-pathology question banks for NEET-SS and INI-SS.",
  },
  {
    category: "approach-based-course",
    label: "Approach Based Course",
    description: "A structured, differential-diagnosis-first approach to reporting across subspecialties.",
  },
  {
    category: "hematopathology",
    label: "Hematopathology Course",
    description: "High-yield haematopathology slides and MCQs for every major exam.",
  },
];
