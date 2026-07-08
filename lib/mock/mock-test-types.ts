export interface MockTestType {
  category: string;
  label: string;
  description: string;
}

/** The umbrella "all mock tests" bucket — used by the Mock Tests dropdown's "browse all" link,
 * the Footer, and the practice teaser, so /courses?exam=mock-tests has a proper label. */
export const MOCK_TESTS_CATEGORY: MockTestType = {
  category: "mock-tests",
  label: "Mock Tests",
  description: "Full-length, exam-timed mock tests with detailed performance analytics.",
};

/** Backs the nav's dedicated "Mock Tests" dropdown, separate from the Courses dropdown. */
export const MOCK_TEST_TYPES: MockTestType[] = [
  {
    category: "ini-ss-mocks",
    label: "INI-SS",
    description: "Full-length INI-SS pattern mock tests.",
  },
  {
    category: "histo-hemat-mocks",
    label: "Histo/Hemat Mocks",
    description: "Combined histopathology and haematopathology mock papers.",
  },
  {
    category: "neuropathology-mocks",
    label: "Neuropathology Mock Tests",
    description: "Exam-timed neuropathology mock papers.",
  },
  {
    category: "frcpath-part1-mock",
    label: "FRCPath Part-1 Mock",
    description: "Full-length FRCPath Part 1 pattern mock exam.",
  },
  {
    category: "neet-ss-oncopathology-mocks",
    label: "NEET-SS Oncopathology",
    description: "NEET-SS oncopathology-focused mock papers.",
  },
];
