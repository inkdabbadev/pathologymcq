export interface BlogCategory {
  slug: string;
  label: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: "neuropathology", label: "Neuropathology" },
  { slug: "head-and-neck-pathology", label: "Head and Neck Pathology" },
  { slug: "thoracic-pathology", label: "Thoracic Pathology" },
  { slug: "soft-tissue-and-bone-pathology", label: "Soft Tissue and Bone Pathology" },
  { slug: "gastrointestinal-pathology", label: "Gastrointestinal Pathology" },
  { slug: "urogenital-pathology", label: "Urogenital Pathology" },
  { slug: "dermatopathology", label: "Dermatopathology" },
  { slug: "endocrine-and-breast-pathology", label: "Endocrine and Breast Pathology" },
  { slug: "female-genital-pathology", label: "Female Genital Pathology" },
  { slug: "cytopathology", label: "Cytopathology" },
  { slug: "hematopathology", label: "Hematopathology" },
  { slug: "histotechniques", label: "Histotechniques" },
  { slug: "molecular-pathology", label: "Molecular Pathology" },
  { slug: "general-pathology", label: "General Pathology" },
  { slug: "clinical-pathology", label: "Clinical Pathology" },
  { slug: "microbiology", label: "Microbiology" },
];
