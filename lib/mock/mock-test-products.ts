export interface MockTestProduct {
  id: string;
  title: string;
  /** Full label used in the "Access {shortLabel} here" button, e.g. "Histopathology mock". */
  shortLabel: string;
  /** Matches a MockTestType.category from lib/mock/mock-test-types.ts */
  category: string;
  examPattern: "Mock Test" | "Mini-Mock Test";
  questionCount: number;
  imageUrl: string;
}

const THUMBS = [
  "/mock/course-thumb-1.svg",
  "/mock/course-thumb-2.svg",
  "/mock/course-thumb-3.svg",
  "/mock/course-thumb-4.svg",
];

/** Individual mock test products a purchaser accesses post-enrollment — distinct
 * from the sellable course bundles in lib/mock/courses.ts. */
export const MOCK_TEST_PRODUCTS: MockTestProduct[] = [
  {
    id: "mock-ini-ss-histo",
    title: "INI-SS Histopathology Mock Test",
    shortLabel: "Histopathology mock",
    category: "ini-ss-mocks",
    examPattern: "Mock Test",
    questionCount: 80,
    imageUrl: THUMBS[0],
  },
  {
    id: "mock-ini-ss-histo-mini",
    title: "INI-SS Histopathology Mini-Mock Test",
    shortLabel: "Histopathology mini-mock",
    category: "ini-ss-mocks",
    examPattern: "Mini-Mock Test",
    questionCount: 40,
    imageUrl: THUMBS[0],
  },
  {
    id: "mock-ini-ss-hemat",
    title: "INI-SS Hematopathology Mock Test",
    shortLabel: "Hematopathology mock",
    category: "ini-ss-mocks",
    examPattern: "Mock Test",
    questionCount: 80,
    imageUrl: THUMBS[1],
  },
  {
    id: "mock-ini-ss-hemat-mini",
    title: "INI-SS Hematopathology Mini-Mock Test",
    shortLabel: "Hematopathology mini-mock",
    category: "ini-ss-mocks",
    examPattern: "Mini-Mock Test",
    questionCount: 40,
    imageUrl: THUMBS[1],
  },
  {
    id: "mock-histo-hemat-combined",
    title: "Histopathology & Hematopathology Combined Mock Test",
    shortLabel: "combined mock",
    category: "histo-hemat-mocks",
    examPattern: "Mock Test",
    questionCount: 100,
    imageUrl: THUMBS[2],
  },
  {
    id: "mock-neuropathology",
    title: "Neuropathology Mock Test",
    shortLabel: "neuropathology mock",
    category: "neuropathology-mocks",
    examPattern: "Mock Test",
    questionCount: 60,
    imageUrl: THUMBS[3],
  },
  {
    id: "mock-frcpath-part1",
    title: "FRCPath Part 1 Mock Test",
    shortLabel: "FRCPath Part 1 mock",
    category: "frcpath-part1-mock",
    examPattern: "Mock Test",
    questionCount: 100,
    imageUrl: THUMBS[0],
  },
  {
    id: "mock-neet-ss-oncopathology",
    title: "NEET-SS Oncopathology Mock Test",
    shortLabel: "NEET-SS Oncopathology mock",
    category: "neet-ss-oncopathology-mocks",
    examPattern: "Mock Test",
    questionCount: 80,
    imageUrl: THUMBS[1],
  },
];
