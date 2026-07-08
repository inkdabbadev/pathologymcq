import type { FacultyMember } from "@/lib/api/types";

/**
 * The real Pathology MCQ team roster (from the current live site's About Us
 * page). Distinct from lib/mock/faculty.ts, which backs per-course faculty
 * assignments elsewhere with placeholder profiles.
 */
export const TEAM_MEMBERS: FacultyMember[] = [
  {
    id: "team-guru-priya",
    name: "Dr. Guru Priya",
    title: "MBBS, MD, DNB (Pathology), PDCC",
    affiliation: "",
    avatarUrl: "",
  },
  {
    id: "team-fayiqah",
    name: "Dr. Fayiqah",
    title: "MBBS, MD, DNB (Pathology)",
    affiliation:
      "Consultant surgical pathologist, Panimalar Medical College Hospital and Research Institute",
    avatarUrl: "",
  },
  {
    id: "team-santoshini",
    name: "Dr. Santoshini",
    title: "MBBS, MD, DNB (Pathology)",
    affiliation: "Consultant surgical pathologist, Lifecell Diagnostics",
    avatarUrl: "",
  },
  {
    id: "team-ammar-modiwala",
    name: "Dr. Ammar Modiwala",
    title: "MBBS, MD, Fellowship Onco-pathology and Gynaec Cytology (ICMR)",
    affiliation: "Director, Tissue Path Lab, Indore",
    avatarUrl: "",
  },
  {
    id: "team-pratyush",
    name: "Dr. Pratyush",
    title: "MBBS, MD, PDF (Hemato-pathology)",
    affiliation: "Tata Memorial Centre (TMC), Kolkata",
    avatarUrl: "",
  },
  {
    id: "team-kunal",
    name: "Dr. Kunal",
    title: "MBBS, MD Pathology",
    affiliation: "Consultant Pathologist, Madgaon, Goa",
    avatarUrl: "",
  },
  {
    id: "team-sruthi-mayura",
    name: "Dr. Sruthi Mayura",
    title: "MBBS, DNB, MSc (Molecular Pathology and Genomics), FRCPath",
    affiliation: "",
    avatarUrl: "",
  },
  {
    id: "team-pradeep",
    name: "Dr. Pradeep",
    title: "MBBS, MD Pathology",
    affiliation: "Consultant in Perinatal and Clinical Pathology, Lifecell International Pvt Ltd",
    avatarUrl: "",
  },
];
