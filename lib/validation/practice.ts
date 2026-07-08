import { z } from "zod";

export const practiceEmailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

export type PracticeEmailValues = z.infer<typeof practiceEmailSchema>;
